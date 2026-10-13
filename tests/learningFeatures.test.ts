import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AnswerLogEntry, LearningSession, ReviewItem } from '../src/types';
import { SENTENCE_BUILD_DRILLS } from '../src/data/sentenceBuilding/drills';
import { RESEARCH_UNITS } from '../src/data/research/units';
import { loadGrammarLevel } from '../src/data/grammar/loader';
import {
  drillStepTask,
  isSentenceCorrect,
  learnedGrammarTags,
  normalizeSentence,
  parseStepRefId,
  pickDrill,
  tagKey,
} from '../src/services/sentenceBuildingService';
import { buildNoteTasks, evaluateNoteTask, getOrCreateTodayNoteTasks } from '../src/services/noteTaskService';
import { getDailyPlan, getUnderstandingQuestionsForDay } from '../src/services/curriculum';
import { getOrCreateTodaySession } from '../src/services/sessionService';
import { getAllReviewItems, getReviewItemByRef, replaceAllReviewItems, upsertReviewItem } from '../src/db/repositories/reviewRepository';
import { getAllAnswerLog } from '../src/db/repositories/answerLogRepository';
import { getSessionByDate } from '../src/db/repositories/sessionRepository';
import { recordAnswer } from '../src/services/reviewService';
import { computeMasteryTier } from '../src/services/masteryService';
import { computeAbilityProfile, formatRate } from '../src/services/abilityService';
import { computeWeeklyMissions, weekStart } from '../src/services/missionService';
import { assessmentStatus, buildAssessment, summarizeDraft } from '../src/services/assessmentService';
import type { AssessmentDraft } from '../src/types';
import { resolveReviewQuestion } from '../src/services/reviewQuestionResolver';
import { isReviewCandidate } from '../src/services/reviewScheduler';
import { addDaysISO, todayLocalISODate } from '../src/utils/date';

const today = todayLocalISODate();

// --- 英文組み立て ---------------------------------------------------------------

test('offline sentence check ignores case, punctuation, contractions and spelled numbers', () => {
  assert.equal(normalizeSentence("I don't check the data."), normalizeSentence('i do not check the data'));
  assert.ok(isSentenceCorrect('we collected data from twenty patients', ['We collected data from 20 patients.']));
  assert.ok(isSentenceCorrect('about one third of the patients experienced complications', ['About one-third of the patients experienced complications.']));
  assert.ok(isSentenceCorrect('I cannot go.', ["I can't go."]));
  assert.ok(!isSentenceCorrect('We collect data from 20 patients.', ['We collected data from 20 patients.']), 'tense matters');
  assert.ok(!isSentenceCorrect('', ['I am a nurse.']));
});

test('every drill grows base -> expand -> transform -> apply and is tied to an existing grammar tag', async () => {
  const ids = new Set<string>();
  for (const d of SENTENCE_BUILD_DRILLS) {
    assert.ok(!ids.has(d.id), `duplicate ${d.id}`);
    ids.add(d.id);
    assert.deepEqual(
      d.steps.map((s) => s.kind),
      ['base', 'expand', 'transform', 'apply'],
      d.id
    );
    const { questions } = await loadGrammarLevel(d.level);
    const tags = new Set(questions.map((q) => tagKey(q.tag)));
    assert.ok(tags.has(tagKey(d.grammarTag)), `${d.id}: no L${d.level} grammar questions tagged ${d.grammarTag}`);
    d.steps.forEach((s, i) => {
      assert.ok(s.answers.length > 0 && s.answers.every((a) => normalizeSentence(a).length > 0), `${d.id} step ${i}`);
      const task = drillStepTask(d, i);
      assert.deepEqual(parseStepRefId(task.refId), { drillId: d.id, stepIndex: i });
      assert.ok(isSentenceCorrect(s.answers[0], s.answers), 'model answer passes its own check');
    });
  }
  assert.ok(SENTENCE_BUILD_DRILLS.length >= 25);
});

test("the day's drill follows today's grammar, then grammar already learned", () => {
  const items: ReviewItem[] = [];
  const todays = pickDrill(SENTENCE_BUILD_DRILLS, { todayTags: ['過去形'], level: 1, learned: new Set(), items });
  assert.equal(todays?.grammarTag, '過去形');
  const learned = pickDrill(SENTENCE_BUILD_DRILLS, { todayTags: ['命令文'], level: 1, learned: new Set([tagKey('be動詞')]), items });
  assert.equal(learned?.grammarTag, 'be動詞', 'no 命令文 drill -> a learned point');
  assert.equal(pickDrill(SENTENCE_BUILD_DRILLS, { todayTags: [], level: 1, learned: new Set(), items }), null);
  // Never above the learner's level.
  const l1 = pickDrill(SENTENCE_BUILD_DRILLS, { todayTags: ['受動態'], level: 1, learned: new Set([tagKey('受動態')]), items });
  assert.equal(l1, null);
});

test('learned tags come from answered grammar questions; "There is/are" matches the there-is-are drill', async () => {
  const learned = await learnedGrammarTags(
    [{ id: 'x', category: 'grammar', refId: 'grammar_l1_999', tag: 'There is/are', correctCount: 1, incorrectCount: 0 } as ReviewItem],
    []
  );
  assert.ok(learned.has(tagKey('there-is-are')));
});

test('drill steps come back in review as real compose-a-sentence questions', async () => {
  const resolved = await resolveReviewQuestion({ category: 'writing', refId: 'sb-l2-06-3' } as ReviewItem);
  assert.equal(resolved?.kind, 'build');
  const research = await resolveReviewQuestion({ category: 'reading', refId: 'rs-l1-01-q' } as ReviewItem);
  assert.equal(research?.kind, 'choice');
});

// --- 研究英語 -----------------------------------------------------------------------

test('research units cover purpose -> abstract from Level 1 and are well-formed', () => {
  const sections = new Set(RESEARCH_UNITS.map((u) => u.section));
  assert.deepEqual([...sections].sort(), ['abstract', 'discussion', 'methods', 'purpose', 'results']);
  assert.ok(RESEARCH_UNITS.some((u) => u.level === 1));
  assert.equal(new Set(RESEARCH_UNITS.map((u) => u.id)).size, RESEARCH_UNITS.length);
  for (const u of RESEARCH_UNITS) {
    assert.ok(u.question.choices[u.question.correctIndex], u.id);
    assert.ok(u.structure.segments.length >= 2 && u.logic.length > 0 && u.expressions.length > 0, u.id);
    assert.ok(isSentenceCorrect(u.writing.answers[0], u.writing.answers), u.id);
  }
});

// --- ノート課題 ---------------------------------------------------------------------

test("note tasks are made from the day's content: composition, structure, explanation", async () => {
  const plan = await getDailyPlan(3);
  const tasks = buildNoteTasks(plan, await getUnderstandingQuestionsForDay(3), '2026-10-13');
  assert.deepEqual(tasks.map((t) => t.kind).sort(), ['composition', 'explanation', 'structure']);
  assert.equal(tasks.filter((t) => t.main).length, 1);
  assert.ok(tasks[0].main, 'main task first');
  const total = tasks.reduce((n, t) => n + t.estimatedMinutes, 0);
  assert.ok(tasks[0].estimatedMinutes <= 10 && total <= 15);
  const structure = tasks.find((t) => t.kind === 'structure')!;
  assert.ok(plan.reading.content.join(' ').includes(structure.material!.slice(0, 20)), 'sentence is from the passage');
});

test('note self-evaluation is saved and feeds review: できなかった/ヒント -> queued, 自力 -> not', async () => {
  await replaceAllReviewItems([]);
  const session = await getOrCreateTodaySession();
  const tasks = await getOrCreateTodayNoteTasks(session, await getDailyPlan(session.day), await getUnderstandingQuestionsForDay(session.day));
  const [a, b, c] = tasks;
  await evaluateNoteTask(today, a.id, 'failed');
  await evaluateNoteTask(today, b.id, 'hinted');
  await evaluateNoteTask(today, c.id, 'independent');

  const failed = (await getReviewItemByRef(a.id))!;
  assert.ok(isReviewCandidate(failed));
  assert.equal(failed.nextReviewDate, addDaysISO(today, 1));
  const hinted = (await getReviewItemByRef(b.id))!;
  assert.ok(isReviewCandidate(hinted));
  assert.equal(hinted.nextReviewDate, addDaysISO(today, 3));
  assert.equal(isReviewCandidate((await getReviewItemByRef(c.id))!), false);

  const stored = await getSessionByDate(today);
  assert.deepEqual(
    stored!.noteTasks!.map((t) => t.selfEval),
    ['failed', 'hinted', 'independent']
  );
  const log = (await getAllAnswerLog()).filter((e) => e.source === 'note');
  assert.equal(log.length, 3);
  assert.ok(log.every((e) => e.grading === 'self'));
});

// --- 習熟度 -------------------------------------------------------------------------

test('answers are logged as first / repeat / delayed, and only delayed answers prove retention', async () => {
  await replaceAllReviewItems([]);
  const base = { category: 'grammar' as const, refId: 'grammar_l1_001', promptText: 'q', answerText: 'a', tag: 'be動詞' };
  await recordAnswer({ ...base, wasCorrect: true });
  for (let n = 0; n < 5; n++) await recordAnswer({ ...base, wasCorrect: true });
  let item = (await getReviewItemByRef('grammar_l1_001'))!;
  assert.equal(item.firstAnswerCorrect, true);
  assert.notEqual(computeMasteryTier(item), 'retained', 'six right answers in one sitting are not 定着');
  assert.notEqual(computeMasteryTier(item), 'acquired', '...nor 習得');

  // Seen again 10 days later.
  await upsertReviewItem({ ...item, updatedAt: new Date(Date.now() - 10 * 86_400_000).toISOString() });
  await recordAnswer({ ...base, wasCorrect: true });
  item = (await getReviewItemByRef('grammar_l1_001'))!;
  assert.equal(item.delayedAttempts, 1);
  assert.equal(item.delayedCorrect, 1);
  assert.equal(computeMasteryTier(item), 'retained');

  const entries = (await getAllAnswerLog()).filter((e) => e.refId === 'grammar_l1_001');
  assert.deepEqual(entries.map((e) => e.kind).sort(), ['delayed', 'first', 'repeat', 'repeat', 'repeat', 'repeat', 'repeat']);
  const at = (k: string) => entries.find((e) => e.kind === k)!.at;
  assert.ok(entries.every((e) => e.at >= at('first') && e.at <= at('delayed')));
});

test('legacy records keep a sensible tier without the new fields', () => {
  const legacy = { correctCount: 9, incorrectCount: 1, consecutiveCorrect: 5, interval: 4 };
  assert.equal(computeMasteryTier(legacy), 'retained');
  assert.equal(computeMasteryTier({ correctCount: 9, incorrectCount: 1, consecutiveCorrect: 5, interval: 1 }), 'learning');
});

test('ability profile separates practiced / unseen / delayed, shows 未確認, and leaves TOEIC out', () => {
  const mk = (over: Partial<ReviewItem>): ReviewItem =>
    ({ id: Math.random().toString(), category: 'grammar', refId: 'g', promptText: '', answerText: '', nextReviewDate: today, interval: 0, correctCount: 0, incorrectCount: 0, createdAt: '', updatedAt: '', ...over }) as ReviewItem;
  const items = [
    // practiced a lot (same questions), always right
    ...Array.from({ length: 4 }, () => mk({ correctCount: 5, incorrectCount: 0, firstAnswerCorrect: true })),
    // unseen: 2 of 4 right first time
    mk({ correctCount: 1, incorrectCount: 0, firstAnswerCorrect: true }),
    mk({ correctCount: 0, incorrectCount: 1, firstAnswerCorrect: false }),
    mk({ correctCount: 0, incorrectCount: 1, firstAnswerCorrect: false }),
    mk({ category: 'toeic', refId: 'toeic_p5_1', correctCount: 50, incorrectCount: 0, firstAnswerCorrect: true }),
  ];
  const rows = computeAbilityProfile(items, [], today);
  const grammar = rows.find((r) => r.area === 'grammar')!;
  assert.equal(formatRate(grammar.practiced), '100%');
  assert.equal(grammar.unseen.total, 7);
  assert.equal(formatRate(grammar.unseen), '71%', 'first answers only (5 of 7)');
  assert.equal(formatRate(grammar.delayed), '未確認');
  assert.equal(formatRate(rows.find((r) => r.area === 'reading')!.unseen), '未確認');
  assert.ok(rows.every((r) => r.area !== ('toeic' as never)));
});

// --- 週間ミッション・4週間ごとの実力確認 ---------------------------------------------------

test('weekly missions count learned skills in the current Monday-Sunday week', () => {
  assert.equal(weekStart('2026-10-13'), '2026-10-12'); // Tuesday -> Monday
  assert.equal(weekStart('2026-10-18'), '2026-10-12'); // Sunday -> Monday
  const log: AnswerLogEntry[] = [
    ...Array.from({ length: 8 }, (_, i) => ({ refId: `sb-l1-0${(i % 4) + 1}-${i % 4}x${i}`, category: 'writing' }) as const),
    ...Array.from({ length: 16 }, (_, i) => ({ refId: `grammar_l1_${i}`, category: 'grammar', kind: 'first', wasCorrect: i < 13 }) as const),
    { refId: 'rs-l1-01-q', category: 'reading' } as const,
    { refId: 'old', category: 'grammar', date: '2026-10-05' } as const,
  ].map((e, i) => ({ id: String(i), date: '2026-10-13', at: '', kind: 'repeat', source: 'practice', grading: 'auto', wasCorrect: true, ...e }) as AnswerLogEntry);
  const session = (date: string, reviewDone: boolean): LearningSession =>
    ({ date, sectionsDone: { reading: false, grammar: false, writing: false, review: reviewDone }, noteTasks: [] }) as unknown as LearningSession;
  const missions = computeWeeklyMissions({
    today: '2026-10-13',
    sessions: [session('2026-10-12', true), session('2026-10-13', true), session('2026-10-05', true)],
    log,
    items: [],
  });
  const byId = Object.fromEntries(missions.map((m) => [m.id, m]));
  assert.equal(byId['review-days'].current, 2, 'last week not counted');
  assert.equal(byId.build.done, true);
  assert.equal(byId.unseen.done, true, '16 unseen, 81%');
  assert.equal(byId.research.done, true);
  assert.equal(byId.retention, undefined, 'nothing old enough to check yet');
});

test('4-weekly assessment: due every 28 days, unseen questions in every section, deterministic', async () => {
  assert.equal(assessmentStatus([], today).due, true);
  const last = { id: 'a', date: '2026-10-01', completedAt: '', level: 1 as const, sections: {}, unseenRatio: 1 };
  assert.deepEqual(assessmentStatus([last], '2026-10-28'), { due: false, nextDate: '2026-10-29', last });
  assert.equal(assessmentStatus([last], '2026-10-29').due, true);

  const a = (await buildAssessment(2, [], 'seed-1')).items;
  const b = (await buildAssessment(2, [], 'seed-1')).items;
  assert.deepEqual(a.map((i) => i.refId), b.map((i) => i.refId));
  const sections = new Set(a.map((i) => i.section));
  for (const s of ['grammar', 'vocabulary', 'reading', 'structure', 'writingAuto', 'writingSelf']) assert.ok(sections.has(s as never), s);
  assert.ok(a.every((i) => i.unseen));
  for (const i of a) if (i.kind === 'choice') assert.ok(i.correctIndex >= 0 && i.choices[i.correctIndex], i.refId);

  // Questions already answered are avoided while unseen ones remain.
  const seenItems = a.slice(0, 5).map((i) => ({ refId: i.refId, correctCount: 1, incorrectCount: 0, updatedAt: '2026-01-01' }) as ReviewItem);
  const c = (await buildAssessment(2, seenItems, 'seed-1')).items;
  assert.ok(c.every((i) => !seenItems.some((s) => s.refId === i.refId)));

  // Level 6 (TOEIC) is measured separately: the core check stays at Level 5.
  const l6 = (await buildAssessment(6, [], 'x')).items;
  assert.ok(l6.filter((i) => i.kind === 'choice').every((i) => (i as { level: number }).level <= 5));

  const draft: AssessmentDraft = {
    id: 'current',
    resultId: 'r',
    startedAt: '',
    updatedAt: '',
    level: 2,
    items: a,
    answers: Object.fromEntries(
      a.map((i, n) => [i.refId, { status: n % 2 === 0 ? 'correct' : 'incorrect', exact: i.kind === 'sentence' && n % 2 === 0 }] as const)
    ),
    appliedRefIds: [],
  };
  const result = summarizeDraft(draft, new Date().toISOString());
  const sentenceCount = a.filter((i) => i.kind === 'sentence' && !draft.answers[i.refId].exact).length;
  const total = Object.values(result.sections).reduce((n, s) => n + (s?.total ?? 0), 0) - sentenceCount;
  assert.equal(total, a.length);
  assert.ok(result.sections.writingSelf && result.sections.writingAuto, 'self-graded writing kept apart from auto-graded');
});

test('assessment answers go to review when wrong and count as unseen in the log', async () => {
  await replaceAllReviewItems([]);
  await recordAnswer({ category: 'grammar', refId: 'grammar_l2_050', promptText: 'q', answerText: 'a', wasCorrect: false, source: 'assessment' });
  const item = (await getAllReviewItems()).find((i) => i.refId === 'grammar_l2_050')!;
  assert.ok(isReviewCandidate(item));
  const entry = (await getAllAnswerLog()).find((e) => e.refId === 'grammar_l2_050')!;
  assert.equal(entry.kind, 'assessment');
});
