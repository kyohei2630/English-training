import type {
  AssessmentDraft,
  AssessmentDraftAnswer,
  AssessmentItem,
  AssessmentItemMeta,
  AssessmentResult,
  AssessmentSection,
  ChoiceAssessmentItem,
  FreeAssessmentItem,
  GrammarPoint,
  GrammarQuestion,
  Level,
  ReviewItem,
  SectionComposition,
  UnderstandingQuestion,
} from '../types';
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_MODEL_VERSION,
  drillStepLoad,
  grammarLoad,
  readingLoad,
  readingSkill,
  subjectQuestionLoad,
  vocabularyLoad,
  withDifficulty,
  type Difficulty,
  type QuestionMeta,
} from './questionMetadata';
import { canonicalQuestionId, isRetiredQuestion } from '../data/grammar/duplicates';
import { loadGrammarLevel } from '../data/grammar/loader';
import { loadVocabularyLevel } from '../data/vocabulary/loader';
import { loadReadingLevel } from '../data/reading/loader';
import { loadWritingLevel } from '../data/writing/loader';
import { loadSentenceBuildDrills } from '../data/sentenceBuilding/loader';
import { generateVocabQuiz } from './vocabularyQuiz';
import { drillStepTask } from './sentenceBuildingService';
import { recordAnswer } from './reviewService';
import { markForSelfCheck } from './selfCheckService';
import {
  deleteAssessmentDraft,
  getAllAssessments,
  getAssessmentDraft,
  saveAssessment,
  saveAssessmentDraft,
} from '../db/repositories/assessmentRepository';
import { addDaysISO, toLocalISODate } from '../utils/date';
import { generateId } from '../utils/id';

export type { AssessmentItem, ChoiceAssessmentItem, FreeAssessmentItem, SentenceAssessmentItem } from '../types';

/** A fresh ability check every 4 weeks. */
export const ASSESSMENT_INTERVAL_DAYS = 28;

/** Free writing is self-graded and has no difficulty band; one per assessment. */
const COUNTS = { writingSelf: 1 } as const;

export function assessmentStatus(results: AssessmentResult[], today: string): { due: boolean; nextDate?: string; last?: AssessmentResult } {
  const last = results[results.length - 1];
  if (!last) return { due: true };
  const nextDate = addDaysISO(last.date, ASSESSMENT_INTERVAL_DAYS);
  return { due: today >= nextDate, nextDate, last };
}

/** Deterministic PRNG so a given day's test is reproducible (and testable). */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Target composition of every assessment, by estimated difficulty band. Keeping the same mix
 * each time is what makes two assessments at the same Level comparable; when a pool can't
 * supply it, the deviation is recorded (selectionNotes) and comparisons are marked limited.
 */
export const ASSESSMENT_BLUEPRINT_VERSION = 'blueprint-2026-10';
const BLUEPRINT: Record<Exclude<AssessmentSection, 'writingSelf'>, Record<Difficulty, number>> = {
  grammar: { basic: 2, standard: 2, advanced: 2 },
  vocabulary: { basic: 2, standard: 2, advanced: 2 },
  reading: { basic: 1, standard: 2, advanced: 1 },
  structure: { basic: 1, standard: 1, advanced: 1 },
  writingAuto: { basic: 0, standard: 1, advanced: 1 },
};
const SECTION_LABELS: Record<AssessmentSection, string> = {
  grammar: '文法',
  vocabulary: '語彙',
  reading: '読解',
  structure: '構文理解',
  writingAuto: '英作文',
  writingSelf: '自由英作文',
};
const BANDS: Difficulty[] = ['basic', 'standard', 'advanced'];
/** Where to borrow from when a band is short: the nearest band first. */
const FALLBACK: Record<Difficulty, Difficulty[]> = {
  basic: ['standard', 'advanced'],
  standard: ['basic', 'advanced'],
  advanced: ['standard', 'basic'],
};

interface Candidate<T> {
  value: T;
  id: string;
  meta: QuestionMeta;
  /** last answered (ISO), when answered before */
  seenAt?: string;
}

/**
 * Picks questions to match a target band composition: unseen questions first; within a band,
 * spread over tags and formats; already-answered questions (least recent first) only when a
 * band has too few unseen ones; a band that is still short borrows from the nearest band.
 * Every such deviation is reported.
 */
function pickByBlueprint<T>(
  candidates: Candidate<T>[],
  target: Record<Difficulty, number>,
  rand: () => number,
  label: string
): { picked: Candidate<T>[]; notes: string[] } {
  const order = new Map(seededShuffle(candidates, rand).map((c, i) => [c, i]));
  const picked: Candidate<T>[] = [];
  const notes: string[] = [];
  const tagUsed = new Map<string, number>();
  const formatUsed = new Map<string, number>();
  const take = (band: Difficulty, n: number, allowSeen: boolean): number => {
    let taken = 0;
    while (taken < n) {
      const pool = candidates.filter((c) => c.meta.difficulty === band && !picked.includes(c) && (allowSeen || !c.seenAt));
      if (pool.length === 0) break;
      const cost = (c: Candidate<T>) =>
        (c.seenAt ? 1000 + Date.parse(c.seenAt) / 1e13 : 0) +
        (tagUsed.get(c.meta.tag ?? '') ?? 0) * 2 +
        (formatUsed.get(c.meta.format) ?? 0) +
        order.get(c)! / 1e6;
      const best = pool.reduce((a, b) => (cost(b) < cost(a) ? b : a));
      picked.push(best);
      tagUsed.set(best.meta.tag ?? '', (tagUsed.get(best.meta.tag ?? '') ?? 0) + 1);
      formatUsed.set(best.meta.format, (formatUsed.get(best.meta.format) ?? 0) + 1);
      taken++;
    }
    return taken;
  };

  const short: Partial<Record<Difficulty, number>> = {};
  for (const band of BANDS) {
    const need = target[band];
    if (need === 0) continue;
    const unseen = take(band, need, false);
    if (unseen < need) {
      const seen = take(band, need - unseen, true);
      if (seen > 0) notes.push(`${label}: ${DIFFICULTY_LABELS[band]}の初見問題が不足し、既習の問題を${seen}問含みます`);
      if (unseen + seen < need) short[band] = need - unseen - seen;
    }
  }
  for (const band of BANDS) {
    let missing = short[band] ?? 0;
    for (const other of FALLBACK[band]) {
      if (missing === 0) break;
      const got = take(other, missing, false);
      const gotSeen = got < missing ? take(other, missing - got, true) : 0;
      if (got + gotSeen > 0) notes.push(`${label}: ${DIFFICULTY_LABELS[band]}の問題が不足し、${DIFFICULTY_LABELS[other]}の問題${got + gotSeen}問で代替しました`);
      missing -= got + gotSeen;
    }
    if (missing > 0) notes.push(`${label}: 問題が${missing}問不足しています`);
  }
  return { picked, notes };
}

const hasChoices = (q: GrammarQuestion) => !!q.choices && q.choices.includes(q.correctAnswer);

const itemMeta = (m: QuestionMeta): AssessmentItemMeta => ({
  tag: m.tag,
  format: m.format,
  difficulty: m.difficulty,
  load: m.load,
  reasons: m.reasons,
});

/**
 * Builds the 4-weekly check at the learner's level (Level 6 = TOEIC is measured separately, so
 * the check stays at Level 5 there): grammar, vocabulary, reading, sentence structure and short
 * writing. Each section follows the same target composition of estimated difficulty (BLUEPRINT),
 * with unseen questions first and tags / formats spread; deviations are returned as notes.
 */
export async function buildAssessment(
  currentLevel: Level,
  items: ReviewItem[],
  seed: string
): Promise<{ items: AssessmentItem[]; notes: string[] }> {
  const level = Math.min(currentLevel, 5) as Level;
  const rand = seededRandom(seed);
  // Answering one of two duplicate questions counts as having seen both.
  const seen = new Map<string, string>();
  for (const i of items) {
    if (i.correctCount + i.incorrectCount === 0) continue;
    const id = canonicalQuestionId(i.refId);
    if (!seen.has(id) || seen.get(id)! < i.updatedAt) seen.set(id, i.updatedAt);
  }
  const seenAt = (id: string) => seen.get(canonicalQuestionId(id));
  const out: AssessmentItem[] = [];
  const notes: string[] = [];

  const [{ questions: grammarPool }, vocabPool, reading, writingPool, drills] = await Promise.all([
    loadGrammarLevel(level),
    loadVocabularyLevel(level),
    loadReadingLevel(level),
    loadWritingLevel(level),
    loadSentenceBuildDrills(),
  ]);
  const current = grammarPool.filter((q) => !isRetiredQuestion(q.id));

  const grammarChoice = (q: GrammarQuestion, section: AssessmentSection, meta: QuestionMeta): ChoiceAssessmentItem => ({
    kind: 'choice',
    section,
    refId: q.id,
    unseen: !seenAt(q.id),
    meta: itemMeta(meta),
    category: 'grammar',
    tag: q.tag,
    level: q.level,
    skill: q.format === 'structure' ? 'structure' : undefined,
    prompt: q.question,
    choices: q.choices!,
    correctIndex: q.choices!.indexOf(q.correctAnswer),
    explanation: q.explanation,
  });

  // Grammar
  const grammarMeta = withDifficulty(current.filter((q) => hasChoices(q) && q.format !== 'structure'), grammarLoad);
  const grammar = pickByBlueprint(
    [...grammarMeta].map(([q, meta]) => ({ value: q, id: q.id, meta, seenAt: seenAt(q.id) })),
    BLUEPRINT.grammar,
    rand,
    SECTION_LABELS.grammar
  );
  notes.push(...grammar.notes);
  for (const c of grammar.picked) out.push(grammarChoice(c.value, 'grammar', c.meta));

  // Vocabulary — always meaning recognition (English -> Japanese), so tests stay comparable.
  const vocabMeta = withDifficulty(vocabPool, vocabularyLoad);
  const vocab = pickByBlueprint(
    [...vocabMeta].map(([e, meta]) => ({ value: e, id: e.id, meta, seenAt: seenAt(e.id) })),
    BLUEPRINT.vocabulary,
    rand,
    SECTION_LABELS.vocabulary
  );
  notes.push(...vocab.notes);
  for (const { value: entry, meta } of vocab.picked) {
    const quiz = generateVocabQuiz(entry, vocabPool, 'en-to-ja');
    out.push({
      kind: 'choice',
      section: 'vocabulary',
      refId: entry.id,
      unseen: !seenAt(entry.id),
      meta: itemMeta(meta),
      category: 'vocabulary',
      tag: entry.category,
      level: entry.level,
      prompt: quiz.prompt,
      choices: quiz.choices,
      correctIndex: quiz.correctIndex,
      explanation: quiz.explanation,
    });
  }

  // Reading: one passage, the one whose questions best fit the target composition (unseen
  // passages first).
  const readingMeta = withDifficulty(reading.questions, (q) => readingLoad(q, reading.materials.find((m) => m.id === q.materialId)));
  let bestPassage: { material: (typeof reading.materials)[number]; picked: Candidate<UnderstandingQuestion>[]; notes: string[]; cost: number } | undefined;
  for (const material of seededShuffle(reading.materials, rand)) {
    const qs = reading.questions.filter((q) => q.materialId === material.id && readingSkill(q) !== 'structure');
    if (qs.length === 0) continue;
    const result = pickByBlueprint(
      qs.map((q) => ({ value: q, id: q.id, meta: readingMeta.get(q)!, seenAt: seenAt(q.id) })),
      BLUEPRINT.reading,
      rand,
      SECTION_LABELS.reading
    );
    const cost = result.notes.length * 10 + result.picked.filter((c) => c.seenAt).length;
    if (!bestPassage || cost < bestPassage.cost) bestPassage = { material, ...result, cost };
    if (cost === 0) break;
  }
  if (bestPassage) {
    notes.push(...bestPassage.notes);
    for (const { value: q, meta } of bestPassage.picked) {
      out.push({
        kind: 'choice',
        section: 'reading',
        refId: q.id,
        unseen: !seenAt(q.id),
        meta: itemMeta(meta),
        category: 'reading',
        tag: readingSkill(q),
        level,
        contextTitle: bestPassage.material.title,
        contextLines: bestPassage.material.content,
        prompt: q.question,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    }
  }

  // Structure: grammar "structure" questions, reading structure questions and subject questions
  // generated from passages' analysed key sentences, in one pool.
  type StructureSource =
    | { kind: 'grammar'; q: GrammarQuestion }
    | { kind: 'reading'; q: UnderstandingQuestion }
    | { kind: 'subject'; material: (typeof reading.materials)[number]; point: GrammarPoint };
  const structurePool: StructureSource[] = [
    ...current.filter((q) => q.format === 'structure' && hasChoices(q)).map((q) => ({ kind: 'grammar' as const, q })),
    ...reading.questions.filter((q) => readingSkill(q) === 'structure').map((q) => ({ kind: 'reading' as const, q })),
    ...reading.materials.flatMap((material) => {
      const point = material.grammarPoints.find((g) => g.object || g.modifiers?.length);
      return point ? [{ kind: 'subject' as const, material, point }] : [];
    }),
  ];
  const structureId = (s: StructureSource) => (s.kind === 'subject' ? `assess-structure-${s.material.id}` : s.q.id);
  const structureMeta = withDifficulty(structurePool, (s) =>
    s.kind === 'grammar' ? grammarLoad(s.q) : s.kind === 'reading' ? readingLoad(s.q, reading.materials.find((m) => m.id === s.q.materialId)) : subjectQuestionLoad(s.point)
  );
  const structure = pickByBlueprint(
    structurePool.map((s) => ({ value: s, id: structureId(s), meta: structureMeta.get(s)!, seenAt: seenAt(structureId(s)) })),
    BLUEPRINT.structure,
    rand,
    SECTION_LABELS.structure
  );
  notes.push(...structure.notes);
  for (const { value: s, meta } of structure.picked) {
    if (s.kind === 'grammar') {
      out.push(grammarChoice(s.q, 'structure', meta));
    } else if (s.kind === 'reading') {
      const m = reading.materials.find((x) => x.id === s.q.materialId);
      out.push({
        kind: 'choice',
        section: 'structure',
        refId: s.q.id,
        unseen: !seenAt(s.q.id),
        meta: itemMeta(meta),
        category: 'reading',
        tag: 'structure',
        level,
        skill: 'structure',
        contextTitle: m?.title,
        contextLines: m?.content,
        prompt: s.q.question,
        choices: s.q.choices,
        correctIndex: s.q.correctIndex,
        explanation: s.q.explanation,
      });
    } else {
      const p = s.point;
      const options = [...new Set([p.subject, p.verb, p.object, p.modifiers?.[0]].filter((x): x is string => !!x))];
      const choices = seededShuffle(options, rand);
      const refId = structureId(s);
      out.push({
        kind: 'choice',
        section: 'structure',
        refId,
        unseen: !seenAt(refId),
        meta: itemMeta(meta),
        category: 'grammar',
        tag: '構文理解',
        level,
        skill: 'structure',
        contextTitle: '次の文の主語（S）はどれですか',
        contextLines: [p.sentence],
        prompt: `"${p.sentence}" の主語（S）`,
        choices,
        correctIndex: choices.indexOf(p.subject),
        explanation: `主語: ${p.subject}／動詞: ${p.verb}${p.object ? `／目的語・補語: ${p.object}` : ''}\n${p.translationJa}`,
      });
    }
  }

  // Short writing the app can grade: drill steps of this Level (or below when it has none).
  const levelDrills = drills.some((d) => d.level === level) ? drills.filter((d) => d.level === level) : drills.filter((d) => d.level <= level);
  const steps = levelDrills.flatMap((d) => d.steps.map((_, idx) => ({ d, idx })));
  const stepMeta = withDifficulty(steps, (s) => drillStepLoad(s.d, s.idx));
  const writing = pickByBlueprint(
    steps.map((s) => ({ value: s, id: `${s.d.id}-${s.idx}`, meta: stepMeta.get(s)!, seenAt: seenAt(`${s.d.id}-${s.idx}`) })),
    BLUEPRINT.writingAuto,
    rand,
    SECTION_LABELS.writingAuto
  );
  notes.push(...writing.notes);
  for (const { value, meta } of writing.picked) {
    const task = drillStepTask(value.d, value.idx);
    out.push({ kind: 'sentence', section: 'writingAuto', refId: task.refId, unseen: !seenAt(task.refId), meta: itemMeta(meta), task });
  }

  // Free writing: graded by the learner, reported separately as a reference value (no band).
  const freePool = seededShuffle(
    writingPool.filter((w): w is FreeAssessmentItem['exercise'] => w.type === 'free' || w.type === 'translate'),
    rand
  ).sort((a, b) => Number(!!seenAt(a.id)) - Number(!!seenAt(b.id)));
  for (const ex of freePool.slice(0, COUNTS.writingSelf)) {
    out.push({ kind: 'free', section: 'writingSelf', refId: ex.id, unseen: !seenAt(ex.id), exercise: ex });
  }

  return { items: out, notes };
}

/** Starts an assessment: questions (and whether each is unseen) are fixed now and saved, so the
 * same test resumes after the app is closed. */
export async function startAssessment(currentLevel: Level, items: ReviewItem[], seed: string): Promise<AssessmentDraft> {
  const now = new Date().toISOString();
  const built = await buildAssessment(currentLevel, items, seed);
  const draft: AssessmentDraft = {
    id: 'current',
    resultId: generateId('assessment'),
    startedAt: now,
    updatedAt: now,
    level: Math.min(currentLevel, 5) as Level,
    items: built.items,
    answers: {},
    appliedRefIds: [],
    selectionNotes: built.notes,
  };
  await saveAssessmentDraft(draft);
  return draft;
}

/** Index of the first question without a final answer, or -1 when all are answered. */
export function nextItemIndex(draft: AssessmentDraft): number {
  return draft.items.findIndex((i) => !draft.answers[i.refId]?.status);
}

/** Saves (part of) one answer. A final answer can't be changed afterwards — resuming never lets
 * a question be answered again after its explanation was shown. */
export async function saveDraftAnswer(draft: AssessmentDraft, refId: string, patch: AssessmentDraftAnswer): Promise<AssessmentDraft> {
  const current = draft.answers[refId] ?? {};
  if (current.status) return draft;
  const next: AssessmentDraft = {
    ...draft,
    answers: { ...draft.answers, [refId]: { ...current, ...patch } },
    updatedAt: new Date().toISOString(),
  };
  await saveAssessmentDraft(next);
  return next;
}

/** Scores a draft. Typed answers matching a registered answer count in writingAuto; the rest
 * are scored by the learner's own judgement in writingSelf (a reference value); "判断できない"
 * counts in neither. */
export function summarizeDraft(draft: AssessmentDraft, completedAt: string): AssessmentResult {
  const sections: AssessmentResult['sections'] = {};
  const add = (section: AssessmentSection, ok: boolean) => {
    const s = (sections[section] ??= { correct: 0, total: 0 });
    s.total++;
    if (ok) s.correct++;
  };
  let unresolved = 0;
  let answered = 0;
  let unseen = 0;
  const composition: Partial<Record<AssessmentSection, SectionComposition>> = {};
  for (const item of draft.items) {
    const a = draft.answers[item.refId];
    if (!a?.status) continue;
    answered++;
    if (item.unseen) unseen++;
    if (item.meta) {
      const c = (composition[item.section] ??= { basic: 0, standard: 0, advanced: 0, unseen: 0, total: 0, formats: {} });
      c[item.meta.difficulty]++;
      c.total++;
      if (item.unseen) c.unseen++;
      c.formats[item.meta.format] = (c.formats[item.meta.format] ?? 0) + 1;
    }
    if (item.kind === 'choice') add(item.section, a.status === 'correct');
    else if (item.kind === 'sentence') {
      add('writingAuto', !!a.exact);
      if (!a.exact) {
        if (a.status === 'unsure') unresolved++;
        else add('writingSelf', a.status === 'correct');
      }
    } else if (a.status === 'unsure') unresolved++;
    else add('writingSelf', a.status === 'correct');
  }
  return {
    id: draft.resultId,
    date: toLocalISODate(new Date(completedAt)),
    completedAt,
    level: draft.level,
    sections,
    unseenRatio: answered ? unseen / answered : 0,
    selfCheckUnresolved: unresolved,
    blueprintVersion: ASSESSMENT_BLUEPRINT_VERSION,
    difficultyModel: DIFFICULTY_MODEL_VERSION,
    composition,
    selectionNotes: draft.selectionNotes ?? [],
  };
}

/**
 * Finishes an assessment: applies every answer to the review deck and answer log (wrong ones
 * go to review, "判断できない" is queued for re-checking), then saves the result and removes the
 * draft. Works from the stored draft, not the caller's copy: answers already applied in an
 * interrupted finish are skipped, and once finished, finishing again (a double tap, a stale
 * screen) just returns the saved result.
 */
export async function finishAssessment(draft: AssessmentDraft): Promise<AssessmentResult> {
  const stored = await getAssessmentDraft();
  if (!stored || stored.resultId !== draft.resultId) {
    const done = (await getAllAssessments()).find((r) => r.id === draft.resultId);
    if (done) return done;
    throw new Error('assessment draft not found');
  }
  if (nextItemIndex(stored) !== -1) throw new Error('assessment has unanswered questions');
  let current = stored;
  for (const item of stored.items) {
    if (current.appliedRefIds.includes(item.refId)) continue;
    const a = stored.answers[item.refId];
    await applyAnswer(item, a);
    current = { ...current, appliedRefIds: [...current.appliedRefIds, item.refId], updatedAt: new Date().toISOString() };
    await saveAssessmentDraft(current);
  }
  const result = summarizeDraft(current, new Date().toISOString());
  await saveAssessment(result);
  await deleteAssessmentDraft();
  return result;
}

async function applyAnswer(item: AssessmentItem, a: AssessmentDraftAnswer): Promise<void> {
  const ok = a.status === 'correct';
  if (item.kind === 'choice') {
    await recordAnswer({
      category: item.category,
      refId: item.refId,
      promptText: [item.contextLines?.join(' '), item.prompt].filter(Boolean).join('\n'),
      answerText: item.choices[item.correctIndex],
      explanation: item.explanation,
      tag: item.tag,
      level: item.level,
      wasCorrect: ok,
      source: 'assessment',
      skill: item.skill,
    });
    return;
  }
  const common =
    item.kind === 'sentence'
      ? { refId: item.task.refId, promptText: item.task.promptJa, answerText: item.task.answers[0], tag: item.task.tag, level: item.task.level }
      : { refId: item.exercise.id, promptText: item.exercise.instructionJa, answerText: item.exercise.sampleAnswers[0], tag: item.exercise.tag, level: item.exercise.level };
  if (a.status === 'unsure') {
    await markForSelfCheck({ category: 'writing', ...common, userAnswer: a.userAnswer ?? '' });
    return;
  }
  await recordAnswer({
    category: 'writing',
    ...common,
    wasCorrect: ok,
    source: 'assessment',
    grading: item.kind === 'sentence' && a.exact ? 'auto' : 'self',
    skill: item.kind === 'sentence' && item.task.research ? 'research' : undefined,
  });
}
