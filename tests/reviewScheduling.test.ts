import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { ReviewItem } from '../src/types';
import { applyReviewAnswer, createReviewItem, isReviewCandidate, REVIEW_INTERVALS_DAYS } from '../src/services/reviewScheduler';
import {
  dailyTargetCount,
  dueCandidates,
  estimateReviewSeconds,
  isLoadHigh,
  selectReviewBatch,
  budgetSecondsFor,
} from '../src/services/reviewSelector';
import { buildReviewPlan, summarizeReviewPlan } from '../src/services/reviewPlanService';
import { addDaysISO } from '../src/utils/date';

const TODAY = '2026-10-13';
const CATEGORIES = ['vocabulary', 'grammar', 'reading', 'writing', 'toeic'] as const;

function item(over: Partial<ReviewItem> & { id: string }): ReviewItem {
  return {
    category: 'grammar',
    refId: `grammar_l1_${over.id}`,
    promptText: over.id,
    answerText: 'a',
    nextReviewDate: addDaysISO(TODAY, -1),
    interval: 0,
    correctCount: 0,
    incorrectCount: 1,
    consecutiveCorrect: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-10-12T00:00:00.000Z',
    tag: `tag-${over.id}`,
    inReview: true,
    ...over,
  };
}

/** A realistic large backlog: n items spread over all categories, tags and overdue ages. */
function bigBacklog(n: number): ReviewItem[] {
  return Array.from({ length: n }, (_, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    const refId =
      category === 'vocabulary'
        ? `vocabulary_l1_${i}`
        : category === 'reading'
          ? `q-l1-${String(i % 20).padStart(3, '0')}-${i}`
          : category === 'toeic'
            ? `toeic_p${(i % 7) + 1}_${i}`
            : `${category}_l1_${i}`;
    return item({
      id: `it${i}`,
      category,
      refId,
      promptText: `word${i}`,
      tag: `tag${i % 12}`,
      nextReviewDate: addDaysISO(TODAY, -(i % 40)),
      correctCount: i % 4,
      incorrectCount: 1 + (i % 3),
      consecutiveCorrect: i % 2,
    });
  });
}

// --- registration ---------------------------------------------------------------

test('a question answered correctly the first time is recorded but not queued', () => {
  const fresh = createReviewItem({ category: 'grammar', refId: 'grammar_l1_001', promptText: 'q', answerText: 'a', inReview: false });
  const answered = applyReviewAnswer(fresh, true, TODAY);
  assert.equal(answered.correctCount, 1);
  assert.equal(isReviewCandidate(answered), false);
  assert.equal(dueCandidates([{ ...answered, nextReviewDate: TODAY }], TODAY).length, 0);
});

test('a wrong answer queues the item, and a later correct answer keeps it queued', () => {
  const fresh = createReviewItem({ category: 'grammar', refId: 'grammar_l1_001', promptText: 'q', answerText: 'a', inReview: false });
  const wrong = applyReviewAnswer(fresh, false, TODAY);
  assert.equal(isReviewCandidate(wrong), true);
  assert.equal(wrong.nextReviewDate, addDaysISO(TODAY, 1));
  assert.equal(isReviewCandidate(applyReviewAnswer(wrong, true, TODAY)), true);
  // A previously correct-only item that is later missed in normal practice joins the queue.
  const correctOnly = applyReviewAnswer(fresh, true, TODAY);
  assert.equal(isReviewCandidate(applyReviewAnswer(correctOnly, false, TODAY)), true);
});

test('records saved before inReview existed are classified from their history (no migration)', () => {
  const legacy = (over: Partial<ReviewItem>) => {
    const i = item({ id: 'x', ...over });
    delete i.inReview;
    return i;
  };
  assert.equal(isReviewCandidate(legacy({ correctCount: 3, incorrectCount: 0 })), false, 'only ever correct');
  assert.equal(isReviewCandidate(legacy({ correctCount: 3, incorrectCount: 1 })), true, 'missed once');
  assert.equal(isReviewCandidate(legacy({ correctCount: 0, incorrectCount: 0 })), true, 'saved, not answered yet');
  assert.equal(
    isReviewCandidate(legacy({ correctCount: 2, incorrectCount: 0, refId: 'vocab-l1-001-apple', category: 'vocabulary' })),
    true,
    'bookmarked word'
  );
  assert.equal(isReviewCandidate(legacy({ correctCount: 2, incorrectCount: 0, refId: 'grammar-l1-001-I am.' })), true, 'bookmarked sentence');
});

// --- intervals ------------------------------------------------------------------

test('intervals go past 30 days only for well-retained items, and never shrink on a correct answer', () => {
  let it = item({ id: 'a', incorrectCount: 0, correctCount: 0, consecutiveCorrect: 0 });
  const seen: number[] = [];
  for (let n = 0; n < 9; n++) {
    it = applyReviewAnswer(it, true, TODAY);
    seen.push(REVIEW_INTERVALS_DAYS[it.interval]);
  }
  assert.deepEqual(seen, [3, 7, 14, 30, 60, 120, 180, 180, 180]);

  // Poor accuracy (2 of 6 correct) keeps the ceiling at 30 days despite a streak.
  const shaky = item({ id: 'b', interval: 4, correctCount: 2, incorrectCount: 4, consecutiveCorrect: 2 });
  assert.equal(REVIEW_INTERVALS_DAYS[applyReviewAnswer(shaky, true, TODAY).interval], 30);

  // A legacy item already at 30 days with a long streak moves on to 60.
  const legacy30 = item({ id: 'c', interval: 4, correctCount: 6, incorrectCount: 1, consecutiveCorrect: 4 });
  assert.equal(applyReviewAnswer(legacy30, true, TODAY).nextReviewDate, addDaysISO(TODAY, 60));

  // A lapse goes back to 1 day.
  assert.equal(applyReviewAnswer(legacy30, false, TODAY).nextReviewDate, addDaysISO(TODAY, 1));
});

// --- daily selection --------------------------------------------------------------

test('hundreds of due items: the day asks at most 10, and 5 when the backlog is small', () => {
  assert.equal(dailyTargetCount(3), 3);
  assert.equal(dailyTargetCount(12), 5);
  assert.equal(dailyTargetCount(30), 6);
  assert.equal(dailyTargetCount(500), 10);
  assert.equal(dailyTargetCount(20, true), 8);

  const backlog = bigBacklog(500);
  const plan = buildReviewPlan(backlog, TODAY, undefined, '2026-10-13T08:00:00.000Z');
  assert.ok(plan.itemIds.length >= 5 && plan.itemIds.length <= 10, `got ${plan.itemIds.length}`);
  assert.equal(plan.backlogAtStart, 500);
  assert.equal(plan.loadHigh, true);
});

test('long questions are limited by the time budget', () => {
  const readings = Array.from({ length: 30 }, (_, i) =>
    item({ id: `r${i}`, category: 'reading', refId: `q-l1-${String(i).padStart(3, '0')}-1`, tag: `t${i}` })
  );
  const picked = selectReviewBatch(readings, { today: TODAY, targetCount: 5, budgetSeconds: budgetSecondsFor(5) });
  const seconds = picked.reduce((s, i) => s + estimateReviewSeconds(i), 0);
  assert.ok(picked.length < 5, `reading passages should not all fit: ${picked.length}`);
  assert.ok(seconds <= budgetSecondsFor(5));
  // A single over-long item is still asked rather than skipping the day.
  const one = selectReviewBatch([readings[0]], { today: TODAY, targetCount: 5, budgetSeconds: 60 });
  assert.equal(one.length, 1);
});

test('wrong, weak and long-unseen items come first', () => {
  const items = [
    item({ id: 'mastered', correctCount: 9, incorrectCount: 1, consecutiveCorrect: 5, nextReviewDate: TODAY }),
    item({ id: 'wrong', correctCount: 1, incorrectCount: 2, consecutiveCorrect: 0, nextReviewDate: TODAY }),
    item({
      id: 'stale',
      correctCount: 3,
      incorrectCount: 1,
      consecutiveCorrect: 2,
      nextReviewDate: addDaysISO(TODAY, -40),
      updatedAt: '2026-07-01T00:00:00.000Z',
    }),
  ];
  const picked = selectReviewBatch(items, { today: TODAY, targetCount: 2, budgetSeconds: 600 });
  assert.deepEqual(picked.map((i) => i.id).sort(), ['stale', 'wrong']);
});

test('the same knowledge is not asked repeatedly within one batch', () => {
  const sameWord = ['vocabulary_l1_001', 'vocab-l1-002-apple', 'dict:apple'].map((refId, n) =>
    item({ id: `w${n}`, category: 'vocabulary', refId, promptText: 'apple', tag: undefined })
  );
  const sameTag = Array.from({ length: 8 }, (_, n) => item({ id: `g${n}`, tag: 'present-perfect' }));
  const others = Array.from({ length: 8 }, (_, n) => item({ id: `o${n}`, tag: `other${n}` }));
  const picked = selectReviewBatch([...sameWord, ...sameTag, ...others], { today: TODAY, targetCount: 8, budgetSeconds: 900 });
  assert.equal(picked.filter((i) => i.promptText === 'apple').length, 1);
  assert.ok(picked.filter((i) => i.tag === 'present-perfect').length <= 2);

  // ...but a backlog made of one grammar point still drains, a few per day.
  const onlyOneTag = selectReviewBatch(sameTag, { today: TODAY, targetCount: 5, budgetSeconds: 900 });
  assert.equal(onlyOneTag.length, 4);
});

test('several categories are mixed in one batch', () => {
  const picked = selectReviewBatch(bigBacklog(200), { today: TODAY, targetCount: 10, budgetSeconds: budgetSecondsFor(10) });
  const categories = new Set(picked.map((i) => i.category));
  assert.ok(categories.size >= 3, `only ${[...categories].join(',')}`);
  const counts = [...categories].map((c) => picked.filter((i) => i.category === c).length);
  assert.ok(Math.max(...counts) <= 6);
});

test('items not picked stay due and are picked up on later days', () => {
  let items = bigBacklog(60);
  const asked = new Set<string>();
  for (let day = 0; day < 30; day++) {
    const date = addDaysISO(TODAY, day);
    const before = dueCandidates(items, date).length;
    const plan = buildReviewPlan(items, date, undefined, `${date}T08:00:00.000Z`);
    assert.ok(plan.itemIds.length <= 10);
    // Everything not asked today is still in the backlog.
    const answered = new Set(plan.itemIds);
    items = items.map((i) => (answered.has(i.id) ? applyReviewAnswer(i, true, date) : i));
    plan.itemIds.forEach((id) => asked.add(id));
    assert.equal(dueCandidates(items, date).length, before - plan.itemIds.length);
  }
  assert.equal(items.length, 60, 'nothing deleted');
  assert.ok(asked.size >= 55, `most of the backlog was eventually asked (${asked.size}/60)`);
});

test('review is complete when the assignment is answered, whatever the backlog', () => {
  const backlog = bigBacklog(300);
  const created = '2026-10-13T08:00:00.000Z';
  const plan = buildReviewPlan(backlog, TODAY, undefined, created);
  const answeredLater = '2026-10-13T08:05:00.000Z';
  const items = backlog.map((i) =>
    plan.itemIds.includes(i.id) ? { ...applyReviewAnswer(i, true, TODAY), updatedAt: answeredLater } : i
  );
  const summary = summarizeReviewPlan(plan, items, TODAY);
  assert.equal(summary.complete, true);
  assert.equal(summary.remaining.length, 0);
  assert.ok(summary.backlog > 250, 'the rest is carried over, not deleted');
});

test('load control: high when the backlog is big and not shrinking', () => {
  assert.equal(isLoadHigh(20, 5), false);
  assert.equal(isLoadHigh(35, 30), true);
  assert.equal(isLoadHigh(35, 50), false, 'shrinking');
  assert.equal(isLoadHigh(35, undefined), false, 'no history yet');
  assert.equal(isLoadHigh(80, 100), true, 'very large');
});
