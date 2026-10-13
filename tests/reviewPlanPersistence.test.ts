import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { ReviewItem } from '../src/types';
import { getAllReviewItems, replaceAllReviewItems, upsertReviewItem } from '../src/db/repositories/reviewRepository';
import { getSessionByDate } from '../src/db/repositories/sessionRepository';
import { getTodayReview, markReviewPlanAnswer, selectExtraReview } from '../src/services/reviewPlanService';
import { recordAnswer } from '../src/services/reviewService';
import { applyReviewAnswer } from '../src/services/reviewScheduler';
import { resolveReviewQuestion } from '../src/services/reviewQuestionResolver';
import { buildExportBundle, importExportBundle } from '../src/services/exportImport';
import { addDaysISO, todayLocalISODate } from '../src/utils/date';

const today = todayLocalISODate();
const CATEGORIES = ['vocabulary', 'grammar', 'reading', 'writing', 'toeic'] as const;

function seed(n: number): ReviewItem[] {
  return Array.from({ length: n }, (_, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    return {
      id: `seed-${i}`,
      category,
      refId: `${category}_l1_seed${i}`,
      promptText: `p${i}`,
      answerText: 'a',
      nextReviewDate: addDaysISO(today, -(i % 30)),
      interval: i % 5,
      correctCount: 2,
      incorrectCount: 1,
      consecutiveCorrect: 0,
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
      tag: `tag${i % 9}`,
      // Saved before `inReview` existed — must still count as queued (they were missed once).
    };
  });
}

async function answer(id: string, ok: boolean, recordToPlan = true) {
  const all = await getAllReviewItems();
  const it = all.find((i) => i.id === id)!;
  await upsertReviewItem(applyReviewAnswer(it, ok));
  if (recordToPlan) await markReviewPlanAnswer(id, ok);
}

test('hundreds due, interrupted half-way, app restarted: same assignment resumes, then completes', async () => {
  await replaceAllReviewItems(seed(400));

  const first = await getTodayReview();
  assert.ok(first.items.length >= 5 && first.items.length <= 10, `assigned ${first.items.length}`);
  assert.equal(first.backlog, 400);
  assert.equal(first.complete, false);

  // Answer two, then "close the app".
  await answer(first.items[0].id, true);
  await answer(first.items[1].id, false);
  // A third was answered but the app closed before the plan was updated.
  await answer(first.items[2].id, true, false);

  // "Restart": everything is re-read from IndexedDB.
  const resumed = await getTodayReview();
  assert.deepEqual(resumed.plan.itemIds, first.plan.itemIds, 'same questions, not a new draw');
  assert.equal(resumed.doneCount, 3);
  assert.equal(resumed.correctCount, 2);
  assert.deepEqual(
    resumed.remaining.map((i) => i.id),
    first.items.slice(3).map((i) => i.id)
  );

  for (const it of resumed.remaining) await answer(it.id, true);
  const done = await getTodayReview();
  assert.equal(done.complete, true);
  assert.equal(done.doneCount, first.items.length);
  assert.ok(done.backlog >= 400 - first.items.length - 1, 'unanswered items carried over');
  assert.equal((await getAllReviewItems()).length, 400, 'nothing deleted');

  // Optional extra practice is available but doesn't change today's assignment.
  const extra = await selectExtraReview('vocabulary');
  assert.ok(extra.length > 0 && extra.every((i) => i.category === 'vocabulary'));
  assert.deepEqual((await getTodayReview()).plan.itemIds, first.plan.itemIds);

  const session = await getSessionByDate(today);
  assert.ok(session?.reviewPlan, 'plan is stored on today\'s session');
});

test('normal practice: correct answers are recorded but not queued; wrong ones are', async () => {
  await replaceAllReviewItems([]);
  await recordAnswer({ category: 'grammar', refId: 'grammar_l1_x1', promptText: 'q', answerText: 'a', wasCorrect: true });
  await recordAnswer({ category: 'grammar', refId: 'grammar_l1_x2', promptText: 'q', answerText: 'a', wasCorrect: false });
  const all = await getAllReviewItems();
  assert.equal(all.length, 2, 'both answers keep their history');
  assert.equal(all.find((i) => i.refId === 'grammar_l1_x1')?.inReview, false);
  assert.equal(all.find((i) => i.refId === 'grammar_l1_x2')?.inReview, true);
});

test('backup export/import keeps review history and the day\'s plan', async () => {
  await replaceAllReviewItems(seed(20));
  await getTodayReview();
  const bundle = await buildExportBundle();
  await replaceAllReviewItems([]);
  await importExportBundle(JSON.stringify(bundle));
  const restored = await getAllReviewItems();
  assert.equal(restored.length, 20);
  assert.deepEqual((await getTodayReview()).plan.itemIds, bundle.sessions.find((s) => s.date === today)?.reviewPlan?.itemIds);
});

test('a long-retained grammar item is checked with an unseen question on the same point', async () => {
  await replaceAllReviewItems([]);
  const retained: ReviewItem = {
    id: 'ret',
    category: 'grammar',
    refId: 'grammar_l1_001',
    promptText: 'q',
    answerText: 'a',
    nextReviewDate: today,
    interval: 4,
    correctCount: 6,
    incorrectCount: 1,
    consecutiveCorrect: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    inReview: true,
  };
  await upsertReviewItem(retained);
  const resolved = await resolveReviewQuestion(retained);
  assert.ok(resolved && resolved.kind === 'grammar');
  const { loadGrammarLevel } = await import('../src/data/grammar/loader');
  const original = (await loadGrammarLevel(1)).questions.find((q) => q.id === 'grammar_l1_001')!;
  if (resolved.variantOf) {
    assert.equal(resolved.variantOf, 'grammar_l1_001');
    assert.notEqual(resolved.question.id, 'grammar_l1_001');
    assert.equal(resolved.question.tag, original.tag);
  } else {
    // No other question on this point exists: falls back to the original.
    assert.equal(resolved.question.id, 'grammar_l1_001');
  }

  // A recently-learned item is asked as itself.
  const recent = { ...retained, interval: 1, consecutiveCorrect: 1 };
  const r2 = await resolveReviewQuestion(recent);
  assert.ok(r2 && r2.kind === 'grammar' && !r2.variantOf && r2.question.id === 'grammar_l1_001');
});
