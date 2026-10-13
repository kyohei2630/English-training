import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AnswerLogEntry, AssessmentResult, Level, ReviewItem } from '../src/types';
import { loadGrammarLevel } from '../src/data/grammar/loader';
import { loadVocabularyLevel } from '../src/data/vocabulary/loader';
import { loadReadingLevel } from '../src/data/reading/loader';
import { loadAllToeicParts } from '../src/data/toeic/loader';
import { TOEIC_QUESTION_EXPLANATIONS } from '../src/data/toeic/questionExplanations';
import { DUPLICATE_QUESTION_IDS, canonicalQuestionId, isRetiredQuestion } from '../src/data/grammar/duplicates';
import { GRAMMAR_AUDIT_PATCHES, READING_AUDIT_PATCHES } from '../scripts/auditPatches';
import {
  classifyByLoad,
  DIFFICULTY_MODEL_VERSION,
  grammarLoad,
  readingLoad,
  vocabularyLoad,
  withDifficulty,
} from '../src/services/questionMetadata';
import { ASSESSMENT_BLUEPRINT_VERSION, buildAssessment, summarizeDraft } from '../src/services/assessmentService';
import { compareAssessments, computeAbilityProfile, formatRate } from '../src/services/abilityService';
import { getDailyPlan, TOTAL_CURRICULUM_DAYS } from '../src/services/curriculum';
import { knowledgeKey } from '../src/services/reviewSelector';
import { resolveReviewQuestion } from '../src/services/reviewQuestionResolver';
import { flattenToeicQuestions } from '../src/services/toeicService';
import { objectiveCounts, selfGradedFromLog } from '../src/services/objectiveCounts';
import { analyzeWeaknesses } from '../src/services/weaknessAnalysis';
import { computeWeeklyMissions } from '../src/services/missionService';
import { recordAnswer } from '../src/services/reviewService';
import { getReviewItemByRef, replaceAllReviewItems } from '../src/db/repositories/reviewRepository';
import { summarizeReviewPlan } from '../src/services/reviewPlanService';

const today = '2026-10-13';
const LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

// --- 1. estimated difficulty --------------------------------------------------------------

test('difficulty bands keep equal loads together and come as close to thirds as the pool allows', () => {
  const pool = [0, 0, 0, 1, 1, 2, 2, 3, 3];
  const labels = classifyByLoad(pool.map((load, i) => ({ i, load })), (x) => x.load);
  const byLoad = new Map<number, Set<string>>();
  for (const [x, d] of labels) byLoad.set(x.load, (byLoad.get(x.load) ?? new Set()).add(d));
  assert.ok([...byLoad.values()].every((s) => s.size === 1), 'ties never split');
  const counts = [...labels.values()].reduce((m, d) => ((m[d] = (m[d] ?? 0) + 1), m), {} as Record<string, number>);
  assert.deepEqual(counts, { basic: 3, standard: 4, advanced: 2 });
  // A pool with a single value cannot be split: it stays in one band instead of being faked.
  const flat = classifyByLoad([1, 1, 1, 1], (x) => x);
  assert.equal(new Set(flat.values()).size, 1);
});

test('every assessable pool has all three bands, and the band is not just the Level', async () => {
  const grammarBandsByLevel: Record<number, Set<string>> = {};
  for (const level of LEVELS) {
    const { questions } = await loadGrammarLevel(level);
    const grammar = withDifficulty(questions.filter((q) => q.choices?.includes(q.correctAnswer) && q.format !== 'structure'), grammarLoad);
    const vocab = withDifficulty(await loadVocabularyLevel(level), vocabularyLoad);
    const { questions: rq, materials } = await loadReadingLevel(level);
    const reading = withDifficulty(rq, (q) => readingLoad(q, materials.find((m) => m.id === q.materialId)));
    for (const [name, pool] of [['grammar', grammar], ['vocabulary', vocab], ['reading', reading]] as const) {
      const bands = new Set([...pool.values()].map((m) => m.difficulty));
      assert.equal(bands.size, 3, `L${level} ${name}: ${[...bands].join(',')}`);
    }
    grammarBandsByLevel[level] = new Set([...grammar.values()].map((m) => m.difficulty));
    // Each estimate carries its reasons (problem text, choices, knowledge, process).
    for (const m of grammar.values()) assert.ok(m.reasons.length >= 2);
  }
  // Same grammar point and format, different estimated load: decided by the question, not its Level.
  const l1 = (await loadGrammarLevel(1)).questions;
  const loads = new Set(l1.filter((q) => q.tag === 'be動詞' && q.format === 'choice4').map((q) => grammarLoad(q).load));
  assert.ok(loads.size > 1, 'questions of one point and format differ in load');
});

test('the assessment follows the same difficulty composition every time and records it', async () => {
  const { items, notes } = await buildAssessment(2, [], 'blueprint-a');
  const bands = (section: string) =>
    items.filter((i) => i.section === section).reduce((m, i) => ((m[i.meta!.difficulty] = (m[i.meta!.difficulty] ?? 0) + 1), m), {} as Record<string, number>);
  assert.deepEqual(bands('grammar'), { basic: 2, standard: 2, advanced: 2 });
  assert.deepEqual(bands('vocabulary'), { basic: 2, standard: 2, advanced: 2 });
  assert.deepEqual(bands('structure'), { basic: 1, standard: 1, advanced: 1 });
  assert.deepEqual(bands('writingAuto'), { standard: 1, advanced: 1 });
  assert.ok(items.filter((i) => i.section !== 'writingSelf').every((i) => i.meta && i.meta.reasons.length > 0));
  // Grammar formats and tags are spread, not one point six times.
  const grammarTags = new Set(items.filter((i) => i.section === 'grammar').map((i) => i.meta!.tag));
  assert.ok(grammarTags.size >= 4);
  // Vocabulary is always asked the same way (meaning recognition).
  assert.ok(items.filter((i) => i.section === 'vocabulary').every((i) => i.meta!.format === 'en-to-ja'));
  // Any deviation from the target composition is reported, never hidden.
  const other = await buildAssessment(2, [], 'blueprint-b');
  assert.deepEqual(bands('grammar'), (() => {
    const b = other.items.filter((i) => i.section === 'grammar').reduce((m, i) => ((m[i.meta!.difficulty] = (m[i.meta!.difficulty] ?? 0) + 1), m), {} as Record<string, number>);
    return b;
  })());
  assert.ok(Array.isArray(notes));
});

test('when a band runs out of unseen questions, the shortage is noted', async () => {
  const { items: first } = await buildAssessment(4, [], 'shortage');
  // Mark every Level 4 grammar question as already answered.
  const { questions } = await loadGrammarLevel(4);
  const seen = questions.map((q) => ({ refId: q.id, correctCount: 1, incorrectCount: 0, updatedAt: '2026-01-01T00:00:00.000Z' }) as ReviewItem);
  const { notes } = await buildAssessment(4, seen, 'shortage');
  assert.ok(first.length > 0);
  assert.ok(notes.some((n) => n.startsWith('文法: ') && n.includes('既習')), notes.join(' / '));
});

function result(over: Partial<AssessmentResult>): AssessmentResult {
  return {
    id: Math.random().toString(),
    date: today,
    completedAt: today,
    level: 2,
    sections: { grammar: { correct: 3, total: 6 }, writingSelf: { correct: 1, total: 1 } },
    unseenRatio: 1,
    blueprintVersion: ASSESSMENT_BLUEPRINT_VERSION,
    difficultyModel: DIFFICULTY_MODEL_VERSION,
    composition: { grammar: { basic: 2, standard: 2, advanced: 2, unseen: 6, total: 6, formats: {} } },
    ...over,
  };
}

test('comparisons are only called comparable under the same conditions', () => {
  const prev = result({});
  const same = result({ sections: { grammar: { correct: 5, total: 6 }, writingSelf: { correct: 0, total: 1 } } });
  let c = compareAssessments([prev, same])!;
  assert.equal(c.sections.grammar?.comparable, true);
  assert.equal(c.sections.grammar?.change, 33);
  assert.equal(c.sections.writingSelf, undefined, 'self-graded writing is never compared');

  const harder = result({ composition: { grammar: { basic: 0, standard: 2, advanced: 4, unseen: 6, total: 6, formats: {} } } });
  c = compareAssessments([prev, harder])!;
  assert.equal(c.sections.grammar?.comparable, false);
  assert.match(c.sections.grammar!.reasons[0], /推定難易度の構成が異なります/);

  c = compareAssessments([prev, result({ level: 3 })])!;
  assert.equal(c.sections.grammar?.comparable, false);
  assert.match(c.overall[0], /Level/);

  const legacy = result({ composition: undefined, blueprintVersion: undefined, difficultyModel: undefined });
  c = compareAssessments([legacy, same])!;
  assert.equal(c.sections.grammar?.comparable, false, 'results from before composition was recorded');

  const fewerUnseen = result({ composition: { grammar: { basic: 2, standard: 2, advanced: 2, unseen: 2, total: 6, formats: {} } } });
  assert.equal(compareAssessments([prev, fewerUnseen])!.sections.grammar?.comparable, false);
});

test('a finished assessment records its composition, estimator and selection notes', async () => {
  const { items, notes } = await buildAssessment(1, [], 'compose');
  const answers = Object.fromEntries(items.map((i) => [i.refId, { status: 'correct' as const, exact: true, grading: 'auto' as const }]));
  const r = summarizeDraft({ id: 'current', resultId: 'r', startedAt: '', updatedAt: '', level: 1, items, answers, appliedRefIds: [], selectionNotes: notes }, `${today}T10:00:00.000Z`);
  assert.equal(r.difficultyModel, DIFFICULTY_MODEL_VERSION);
  assert.equal(r.blueprintVersion, ASSESSMENT_BLUEPRINT_VERSION);
  assert.equal(r.composition?.grammar?.total, r.sections.grammar?.total);
  assert.deepEqual(r.selectionNotes, notes);
});

// --- 2. explanation audit ------------------------------------------------------------------

test('audited questions: fixed stems and keys are consistent, and every patch states its reason', async () => {
  const all = new Map<string, Awaited<ReturnType<typeof loadGrammarLevel>>['questions'][number]>();
  for (const level of LEVELS) for (const q of (await loadGrammarLevel(level)).questions) all.set(q.id, q);
  for (const [id, patch] of Object.entries(GRAMMAR_AUDIT_PATCHES)) {
    const q = all.get(id)!;
    assert.ok(patch.reason.length > 0, id);
    if (patch.question) assert.equal(q.question, patch.question, id);
    if (patch.choices) assert.deepEqual(q.choices, patch.choices, id);
    if (patch.correctAnswer) assert.equal(q.correctAnswer, patch.correctAnswer, id);
    if (q.choices) assert.ok(q.choices.includes(q.correctAnswer), id);
  }
  // Broken stems are gone.
  assert.equal(all.get('grammar_l2_035')!.question.includes('moved'), false);
  assert.ok(!all.get('grammar_l3_022')!.question.includes('time permitting'));
  assert.equal(all.get('grammar_l1_176')!.correctAnswer, '第3文型 (SVO)');
  for (const id of Object.keys(READING_AUDIT_PATCHES)) assert.ok(READING_AUDIT_PATCHES[id].reason, id);
});

test('reading explanations quote the passage as written', async () => {
  const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  for (const level of LEVELS) {
    const { questions, materials } = await loadReadingLevel(level);
    for (const q of questions) {
      const passage = norm(materials.find((m) => m.id === q.materialId)!.content.join(' '));
      for (const quoted of q.explanation.match(/"([^"]+)"/g) ?? []) {
        // Quotes containing quoted words ('was/were') are compared on their outer text.
        const parts = quoted.slice(1, -1).split(/\.\.\.|…|'/).map(norm).filter((p) => p.length > 8);
        for (const p of parts) assert.ok(passage.includes(p), `${q.id}: ${p}`);
      }
    }
  }
});

test('every TOEIC Part 3/4/6/7 question has its own explanation, shown before the set summary', async () => {
  const flat = flattenToeicQuestions(Object.values(await loadAllToeicParts()).flat());
  const sets = flat.filter((i) => [3, 4, 6, 7].includes(i.part));
  assert.ok(sets.length >= 170);
  for (const i of sets) {
    assert.ok(TOEIC_QUESTION_EXPLANATIONS[i.id], i.id);
    assert.ok(i.explanation.startsWith(TOEIC_QUESTION_EXPLANATIONS[i.id]), i.id);
  }
  assert.equal(Object.keys(TOEIC_QUESTION_EXPLANATIONS).length, sets.length, 'no explanation for a missing question');
  // The corrected Part 6 key: "the training ___ place" needs a singular verb.
  const training = flat.find((i) => i.id === 'toeic_p6_010_blank1')!;
  assert.equal(training.choices[training.correctIndex], 'takes');
});

// --- 3. duplicates --------------------------------------------------------------------------

test('duplicate questions are kept for history but no longer chosen, and count as one piece of knowledge', async () => {
  assert.equal(Object.keys(DUPLICATE_QUESTION_IDS).length, 5);
  for (const [dup, kept] of Object.entries(DUPLICATE_QUESTION_IDS)) {
    const level = Number(dup.split('_')[1].slice(1)) as Level;
    const { questions } = await loadGrammarLevel(level);
    const a = questions.find((q) => q.id === dup)!;
    const b = questions.find((q) => q.id === kept)!;
    assert.equal(a.question, b.question, `${dup} duplicates ${kept}`);
    assert.equal(a.correctAnswer, b.correctAnswer);
    assert.equal(a.tag, b.tag);
    // Existing review items of the retired question still open as real questions.
    const resolved = await resolveReviewQuestion({ category: 'grammar', refId: dup } as ReviewItem);
    assert.equal(resolved?.kind === 'grammar' && resolved.question.id, dup);
  }
  assert.equal(
    knowledgeKey({ category: 'grammar', refId: 'grammar_l2_155' } as ReviewItem),
    knowledgeKey({ category: 'grammar', refId: 'grammar_l2_043' } as ReviewItem)
  );
  assert.equal(canonicalQuestionId('grammar_l2_155'), 'grammar_l2_043');

  for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) {
    const plan = await getDailyPlan(day);
    assert.ok(plan.grammarQuestions.every((q) => !isRetiredQuestion(q.id)), `day ${day}`);
  }
  for (const level of [2, 3, 5] as Level[]) {
    const { items } = await buildAssessment(level, [], `dup-${level}`);
    assert.ok(items.every((i) => !isRetiredQuestion(i.refId)));
  }
  // Having answered the retired twin makes the kept question "seen".
  const seenTwin = [{ refId: 'grammar_l2_155', correctCount: 1, incorrectCount: 0, updatedAt: '2026-09-01T00:00:00.000Z' } as ReviewItem];
  const { items } = await buildAssessment(2, seenTwin, 'twin');
  const kept = items.find((i) => i.refId === 'grammar_l2_043');
  if (kept) assert.equal(kept.unseen, false);
});

// --- 4. self-evaluation kept out of objective accuracy ----------------------------------------

test('self-graded answers are counted separately and stay out of objective rates', async () => {
  await replaceAllReviewItems([]);
  const base = { category: 'writing' as const, refId: 'sb-l1-01-0', promptText: '', answerText: '', tag: 'be動詞' };
  await recordAnswer({ ...base, wasCorrect: true, grading: 'self' });
  await recordAnswer({ ...base, wasCorrect: false, grading: 'auto' });
  const item = (await getReviewItemByRef('sb-l1-01-0'))!;
  assert.deepEqual(item.selfGraded, { correct: 1, incorrect: 0, first: true, delayedAttempts: 0, delayedCorrect: 0 });
  assert.deepEqual(objectiveCounts(item), { correct: 0, incorrect: 1, firstCorrect: undefined, delayedAttempts: 0, delayedCorrect: 0 });

  // Ability profile: the self-graded first answer is not an objective "unseen" result.
  const rows = computeAbilityProfile([item], [], today);
  const writing = rows.find((r) => r.area === 'writing')!;
  assert.equal(writing.unseen.total, 0);
  // Always-self-graded exercises (free writing) are left out entirely, including old records.
  const free = { id: 'f', category: 'writing', refId: 'w-l1-044', correctCount: 5, incorrectCount: 0, createdAt: '', updatedAt: '' } as unknown as ReviewItem;
  const withFree = computeAbilityProfile([free], [], today, { alwaysSelfGraded: (id) => id === 'w-l1-044' });
  assert.equal(formatRate(withFree.find((r) => r.area === 'writing')!.practiced), '未確認');

  // Weakness analysis uses objective counts.
  const mk = (selfCorrect: number) =>
    ({ id: 'x', category: 'grammar', refId: 'g', tag: 't', level: 1, correctCount: 3, incorrectCount: 3, selfGraded: { correct: selfCorrect, incorrect: 0, delayedAttempts: 0, delayedCorrect: 0 } }) as ReviewItem;
  assert.equal(analyzeWeaknesses([mk(3)], 3)[0].accuracy, 0, '3 self-judged "correct" answers are not counted');

  // Answers recorded before per-item tallies existed are separated using the answer log.
  const log = [{ refId: 'old', grading: 'self', wasCorrect: true, kind: 'first' } as AnswerLogEntry];
  const legacy = { refId: 'old', correctCount: 2, incorrectCount: 0, firstAnswerCorrect: true } as ReviewItem;
  assert.equal(objectiveCounts(legacy, { selfFromLog: selfGradedFromLog(log) }).correct, 1);
});

test("today's review score and the weekly unseen-accuracy mission count app-checked answers only", () => {
  const items = ['a', 'b', 'c'].map(
    (id) =>
      ({ id, refId: id, category: 'grammar', updatedAt: '2026-10-13T09:00:00.000Z', nextReviewDate: '2026-10-20', correctCount: 1, incorrectCount: 1, consecutiveCorrect: 1, inReview: true }) as ReviewItem
  );
  const plan = { createdAt: '2026-10-13T08:00:00.000Z', itemIds: ['a', 'b', 'c'], results: { a: true, b: true, c: false }, selfGraded: ['b'], backlogAtStart: 3, loadHigh: false };
  const s = summarizeReviewPlan(plan, items, today);
  assert.equal(s.correctCount, 1);
  assert.equal(s.objectiveTotal, 2);
  assert.equal(s.selfGradedCount, 1);

  const entry = (grading: 'auto' | 'self', ok: boolean, i: number): AnswerLogEntry =>
    ({ id: String(i), date: today, at: '', category: 'grammar', refId: `g${i}`, wasCorrect: ok, kind: 'first', source: 'practice', grading }) as AnswerLogEntry;
  const log = [...Array.from({ length: 15 }, (_, i) => entry('self', true, i)), ...Array.from({ length: 5 }, (_, i) => entry('auto', false, 100 + i))];
  const unseen = computeWeeklyMissions({ today, sessions: [], log, items: [] }).find((m) => m.id === 'unseen')!;
  assert.equal(unseen.current, 5, 'self-graded answers are not unseen-accuracy evidence');
  assert.equal(unseen.done, false);
});
