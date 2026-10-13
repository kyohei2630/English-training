import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AssessmentDraft, ReviewItem } from '../src/types';
import { loadGrammarLevel } from '../src/data/grammar/loader';
import { loadGrammarTheoryLevel } from '../src/data/grammar/theory/loader';
import { canonicalTag, tagLabel } from '../src/data/grammar/tagLabels';
import { EXPLANATION_PATCHES } from '../scripts/explanationPatches';
import { analyzeWeaknesses } from '../src/services/weaknessAnalysis';
import { getDailyPlan } from '../src/services/curriculum';
import { buildSelfCheck, markForSelfCheck } from '../src/services/selfCheckService';
import { recordAnswer } from '../src/services/reviewService';
import { isReviewCandidate } from '../src/services/reviewScheduler';
import { studyStatus } from '../src/services/masteryService';
import { getAllReviewItems, getReviewItemByRef, replaceAllReviewItems, upsertReviewItem } from '../src/db/repositories/reviewRepository';
import { getAllAnswerLog, replaceAllAnswerLog } from '../src/db/repositories/answerLogRepository';
import { getAllAssessments, getAssessmentDraft, replaceAllAssessments, saveAssessmentDraft } from '../src/db/repositories/assessmentRepository';
import { finishAssessment, nextItemIndex, saveDraftAnswer, startAssessment } from '../src/services/assessmentService';
import { buildExportBundle, importExportBundle } from '../src/services/exportImport';
import { addDaysISO, todayLocalISODate } from '../src/utils/date';

const today = todayLocalISODate();

// --- A1: typed answers that match no registered answer ---------------------------------

test('self-check material: grammar points for the tag and a word comparison with the closest answer', () => {
  const info = buildSelfCheck('He go to school every day', ['He goes to school every day.'], { tag: '三単現' });
  assert.ok(info.checkpoints[0].includes('-s'), 'tag-specific point first');
  assert.deepEqual(info.missingWords, ['goes']);
  assert.deepEqual(info.extraWords, ['go']);
  // A legacy tag spelling still finds its checkpoints.
  assert.ok(buildSelfCheck('x', ['y'], { tag: 'There is/are' }).checkpoints[0].includes('There'));
});

test('"判断できない" keeps the answer for re-checking without counting it right or wrong', async () => {
  await replaceAllReviewItems([]);
  await replaceAllAnswerLog([]);
  await recordAnswer({ category: 'writing', refId: 'w-l1-100', promptText: 'p', answerText: 'a', wasCorrect: true });
  await markForSelfCheck({ category: 'writing', refId: 'w-l1-100', promptText: 'p', answerText: 'a', userAnswer: 'my answer' });
  let item = (await getReviewItemByRef('w-l1-100'))!;
  assert.equal(item.correctCount, 1);
  assert.equal(item.incorrectCount, 0, 'not counted as wrong');
  assert.equal(item.pendingSelfCheck, true);
  assert.equal(item.pendingAnswer, 'my answer');
  assert.ok(isReviewCandidate(item));
  assert.equal(item.nextReviewDate, addDaysISO(today, 1));
  assert.equal(studyStatus(item), 'recheck');
  assert.equal((await getAllAnswerLog()).length, 1, 'no answer logged for an undecided check');

  // The next real answer clears it.
  await recordAnswer({ category: 'writing', refId: 'w-l1-100', promptText: 'p', answerText: 'a', wasCorrect: true, grading: 'self' });
  item = (await getReviewItemByRef('w-l1-100'))!;
  assert.equal(item.pendingSelfCheck, undefined);
  assert.equal(studyStatus(item), 'studied');
});

// --- A2: tag IDs and labels --------------------------------------------------------------

test('Level 1 uses one internal tag ID for There is/are, shown with a readable label', async () => {
  const { questions, lessons } = await loadGrammarLevel(1);
  const theory = await loadGrammarTheoryLevel(1);
  const all = [...questions.map((q) => q.tag), ...lessons.map((l) => l.tag), ...theory.map((t) => t.tag)];
  assert.ok(!all.includes('There is/are'));
  assert.equal(questions.filter((q) => q.tag === 'there-is-are').length, 13);
  assert.equal(canonicalTag('There is/are'), 'there-is-are');
  assert.equal(tagLabel('there-is-are'), 'There is / There are');
  assert.equal(tagLabel('There is/are'), 'There is / There are');
  assert.equal(tagLabel('be動詞'), 'be動詞', 'other tags are shown as they are');
});

test('daily training now shows the There is/are Theory for its questions', async () => {
  for (let day = 1; day <= 30; day++) {
    const plan = await getDailyPlan(day);
    if (!plan.grammarQuestions.some((q) => q.tag === 'there-is-are')) continue;
    assert.ok(plan.grammarTheory.some((t) => t.tag === 'there-is-are'), `day ${day}`);
    return;
  }
  assert.fail('no day with there-is-are questions');
});

test('weakness analysis groups old and new spellings of a tag together', () => {
  const mk = (tag: string, correct: number, incorrect: number) =>
    ({ id: tag + correct, category: 'grammar', refId: 'g', tag, level: 1, correctCount: correct, incorrectCount: incorrect }) as ReviewItem;
  const areas = analyzeWeaknesses([mk('There is/are', 1, 2), mk('there-is-are', 0, 2)], 3);
  assert.equal(areas.length, 1);
  assert.equal(areas[0].tag, 'there-is-are');
  assert.equal(areas[0].attempts, 5);
});

test('importing an old backup maps old tag spellings and keeps everything else', async () => {
  await importExportBundle(
    JSON.stringify({
      exportedAt: '',
      version: 4,
      sessions: [],
      reviewItems: [{ id: 'x', category: 'grammar', refId: 'grammar_l1_194', tag: 'There is/are', promptText: '', answerText: '', nextReviewDate: today, interval: 0, correctCount: 2, incorrectCount: 1, createdAt: '', updatedAt: '' }],
      progress: {},
      settings: {},
      answerLog: [{ id: 'l', date: today, at: '', category: 'grammar', refId: 'grammar_l1_194', tag: 'There is/are', wasCorrect: true, kind: 'first', source: 'practice', grading: 'auto' }],
    })
  );
  const [item] = await getAllReviewItems();
  assert.equal(item.tag, 'there-is-are');
  assert.equal(item.correctCount, 2);
  assert.equal((await getAllAnswerLog())[0].tag, 'there-is-are');
});

// --- A3: explanations ----------------------------------------------------------------------

test('every grammar explanation has substance and every wrong-answer list matches its choices', async () => {
  for (const level of [1, 2, 3, 4, 5, 6] as const) {
    for (const q of (await loadGrammarLevel(level)).questions) {
      assert.ok(q.explanation.length >= 25, `${q.id}: explanation too short`);
      if (q.whyOthersWrong && q.choices) {
        assert.equal(q.whyOthersWrong.length, q.choices.length, q.id);
        assert.equal(q.choices[q.whyOthersWrong.indexOf('(正解)')], q.correctAnswer, q.id);
      }
      if (q.choices) assert.ok(q.choices.includes(q.correctAnswer), q.id);
    }
  }
});

test('reinforced explanations keep the original sentence and add to it', async () => {
  const byId = new Map<string, string>();
  for (const level of [1, 2, 3, 4, 5, 6] as const) for (const q of (await loadGrammarLevel(level)).questions) byId.set(q.id, q.explanation);
  for (const [id, patch] of Object.entries(EXPLANATION_PATCHES)) {
    const expl = byId.get(id)!;
    assert.ok(expl.endsWith(patch.add), id);
    assert.ok(expl.length > patch.add.length, `${id}: original sentence kept`);
  }
  assert.equal(Object.keys(EXPLANATION_PATCHES).length, 146);
});

// --- B4/B5: resumable assessment ------------------------------------------------------------

async function freshDraft(): Promise<AssessmentDraft> {
  await replaceAllReviewItems([]);
  await replaceAllAnswerLog([]);
  await replaceAllAssessments([]);
  return startAssessment(1, [], 'resume-test');
}

test('an assessment survives closing the app: same questions, same answers, resumes at the next question', async () => {
  let draft = await freshDraft();
  const ids = draft.items.map((i) => i.refId);
  const choices = draft.items.filter((i) => i.kind === 'choice');
  for (const item of choices.slice(0, 3)) {
    draft = await saveDraftAnswer(draft, item.refId, { choiceIndex: item.correctIndex, status: 'correct', grading: 'auto' });
  }

  // "Close the app": everything is read back from IndexedDB.
  const resumed = (await getAssessmentDraft())!;
  assert.deepEqual(resumed.items.map((i) => i.refId), ids, 'same questions');
  assert.equal(nextItemIndex(resumed), 3);
  assert.equal(Object.keys(resumed.answers).length, 3);
});

test('a final answer cannot be changed after resuming, and an unfinished assessment counts for nothing', async () => {
  let draft = await freshDraft();
  const first = draft.items[0];
  assert.equal(first.kind, 'choice');
  if (first.kind !== 'choice') return;
  const wrong = (first.correctIndex + 1) % first.choices.length;
  draft = await saveDraftAnswer(draft, first.refId, { choiceIndex: wrong, status: 'incorrect', grading: 'auto' });
  draft = await saveDraftAnswer(draft, first.refId, { choiceIndex: first.correctIndex, status: 'correct', grading: 'auto' });
  assert.equal(draft.answers[first.refId].status, 'incorrect', 'cannot re-answer after seeing the explanation');

  // Nothing reaches the review deck, the answer log or the results until it's finished.
  assert.deepEqual(await getAllReviewItems(), []);
  assert.deepEqual(await getAllAnswerLog(), []);
  assert.deepEqual(await getAllAssessments(), []);
  await assert.rejects(() => finishAssessment(draft), /unanswered/);
});

test('unseen flags are fixed at the start, even if a question is practised elsewhere meanwhile', async () => {
  const draft = await freshDraft();
  const target = draft.items.find((i) => i.kind === 'choice')!;
  assert.equal(target.unseen, true);
  // Practised in another menu while the assessment was paused.
  await recordAnswer({ category: 'grammar', refId: target.refId, promptText: '', answerText: '', wasCorrect: true });
  const resumed = (await getAssessmentDraft())!;
  assert.equal(resumed.items.find((i) => i.refId === target.refId)!.unseen, true);
});

test('finishing applies every answer exactly once, even if it is interrupted and retried', async () => {
  let draft = await freshDraft();
  for (const item of draft.items) {
    if (item.kind === 'choice') draft = await saveDraftAnswer(draft, item.refId, { choiceIndex: item.correctIndex, status: 'correct', grading: 'auto' });
    else if (item.kind === 'sentence') draft = await saveDraftAnswer(draft, item.refId, { userAnswer: 'something else', exact: false, status: 'unsure', grading: 'self' });
    else draft = await saveDraftAnswer(draft, item.refId, { userAnswer: 'my essay', status: 'incorrect', grading: 'self' });
  }
  assert.equal(nextItemIndex(draft), -1);

  // Simulate an interrupted finish: the first two answers were applied, then the app closed.
  const partial = { ...draft, appliedRefIds: draft.items.slice(0, 2).map((i) => i.refId) };
  for (const item of draft.items.slice(0, 2)) {
    if (item.kind === 'choice') {
      await recordAnswer({ category: item.category, refId: item.refId, promptText: '', answerText: '', wasCorrect: true, source: 'assessment' });
    }
  }
  await saveAssessmentDraft(partial);

  const result = await finishAssessment((await getAssessmentDraft())!);
  assert.equal(await getAssessmentDraft(), undefined, 'draft removed');
  const results = await getAllAssessments();
  assert.equal(results.length, 1);
  assert.equal(results[0].id, draft.resultId);

  const log = await getAllAnswerLog();
  const perRef = new Map<string, number>();
  for (const e of log) perRef.set(e.refId, (perRef.get(e.refId) ?? 0) + 1);
  assert.ok([...perRef.values()].every((n) => n === 1), 'each answer applied once');

  const sentence = draft.items.filter((i) => i.kind === 'sentence');
  assert.equal(result.selfCheckUnresolved, sentence.length, '"判断できない" is in no score');
  assert.equal(result.sections.writingAuto?.correct, 0);
  for (const s of sentence) {
    const item = (await getReviewItemByRef(s.refId))!;
    assert.equal(item.pendingSelfCheck, true, 'queued for re-checking');
  }
  // Finishing again with a stale copy (e.g. a double tap) returns the same result, applies nothing.
  const again = await finishAssessment(draft);
  assert.equal(again.id, result.id);
  assert.equal((await getAllAnswerLog()).length, log.length);
  assert.equal((await getAllAssessments()).length, 1);
});

test('a backup carries an assessment in progress', async () => {
  const draft = await freshDraft();
  const bundle = await buildExportBundle();
  assert.equal(bundle.assessmentDraft?.resultId, draft.resultId);
  await importExportBundle(JSON.stringify({ ...bundle, assessmentDraft: null }));
  assert.equal(await getAssessmentDraft(), undefined);
  await importExportBundle(JSON.stringify(bundle));
  assert.equal((await getAssessmentDraft())?.resultId, draft.resultId);
});

// --- B6: study status and its consistency with Review -----------------------------------------

test('study status: past study stays "studied"; verified needs a delayed correct answer; recheck = in review', async () => {
  const legacy = { correctCount: 9, incorrectCount: 1, consecutiveCorrect: 5, interval: 4 };
  assert.equal(studyStatus(legacy), 'studied', 'old records are never shown as lost');
  assert.equal(studyStatus({ ...legacy, delayedAttempts: 1, delayedCorrect: 1, lastDelayedCorrect: true }), 'verified');
  assert.equal(studyStatus({ ...legacy, consecutiveCorrect: 0 }), 'recheck');
  assert.equal(studyStatus({ ...legacy, delayedAttempts: 2, delayedCorrect: 1, lastDelayedCorrect: false }), 'recheck');
  assert.equal(studyStatus(undefined), 'unlearned');

  // Everything shown as 再確認が必要 is in the review queue and due within 3 days.
  await replaceAllReviewItems([]);
  await recordAnswer({ category: 'grammar', refId: 'g1', promptText: '', answerText: '', wasCorrect: false });
  await recordAnswer({ category: 'vocabulary', refId: 'v1', promptText: 'w', answerText: 'm', wasCorrect: true });
  await markForSelfCheck({ category: 'writing', refId: 'w1', promptText: '', answerText: '', userAnswer: 'x' });
  const old = (await getReviewItemByRef('v1'))!;
  await upsertReviewItem({ ...old, updatedAt: new Date(Date.now() - 9 * 86_400_000).toISOString() });
  await recordAnswer({ category: 'vocabulary', refId: 'v1', promptText: 'w', answerText: 'm', wasCorrect: false });
  for (const item of await getAllReviewItems()) {
    if (studyStatus(item) !== 'recheck') continue;
    assert.ok(isReviewCandidate(item), item.refId);
    assert.ok(item.nextReviewDate <= addDaysISO(today, 3), item.refId);
  }
  assert.equal((await getAllReviewItems()).filter((i) => studyStatus(i) === 'recheck').length, 3);
});
