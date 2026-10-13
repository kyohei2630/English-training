import type { AnswerKind, ReviewCategory, ReviewItem } from '../types';
import { addDaysISO, diffInCalendarDays, toLocalISODate, todayLocalISODate } from '../utils/date';
import { generateId } from '../utils/id';

/** Spaced-repetition ladder: index 0 = review again after 1 day, ... Indexes 0-4 keep their
 * original meaning so stored `interval` values stay valid; the steps past 30 days are only
 * reached by well-retained items (see canExtendBeyond30Days). */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60, 120, 180] as const;

/** Index of the 30-day step — the old ceiling of the ladder. */
export const THIRTY_DAY_INDEX = 4;

/** An answer this many days after the item was last seen counts as a delayed-retention check. */
export const DELAYED_GAP_DAYS = 7;

/** first = never answered before (an unseen question); delayed = seen again after a long gap. */
export function answerKind(item: ReviewItem | undefined, today = todayLocalISODate()): Exclude<AnswerKind, 'assessment'> {
  if (!item || item.correctCount + item.incorrectCount === 0) return 'first';
  const gap = diffInCalendarDays(toLocalISODate(new Date(item.updatedAt)), today);
  return gap >= DELAYED_GAP_DAYS ? 'delayed' : 'repeat';
}

/** Evidence fields that separate "solved it once before" from "unseen" and "still knows it later". */
function evidenceAfter(item: ReviewItem, wasCorrect: boolean, today: string): Partial<ReviewItem> {
  const kind = answerKind(item, today);
  if (kind === 'first') return { firstAnswerCorrect: wasCorrect };
  if (kind === 'delayed') {
    return {
      delayedAttempts: (item.delayedAttempts ?? 0) + 1,
      delayedCorrect: (item.delayedCorrect ?? 0) + (wasCorrect ? 1 : 0),
      lastDelayedCorrect: wasCorrect,
    };
  }
  return {};
}

/** Correct-streak and accuracy needed before an item may be spaced more than 30 days apart. */
const EXTEND_MIN_STREAK = 3;
const EXTEND_MIN_ACCURACY = 0.8;

/**
 * Whether an item belongs in the review queue. Records created after `inReview` existed say so
 * explicitly. Older records are derived from their history: anything ever missed, anything saved
 * by the learner (bookmarked words/sentences, which may not have been answered yet), stays
 * queued; a question that was only ever answered correctly in normal practice does not.
 */
export function isReviewCandidate(item: ReviewItem): boolean {
  if (item.inReview !== undefined) return item.inReview;
  return (
    item.incorrectCount > 0 ||
    item.correctCount === 0 ||
    item.word !== undefined ||
    item.refId.startsWith('grammar-') ||
    item.refId.startsWith('vocab-')
  );
}

export function createReviewItem(params: {
  category: ReviewCategory;
  refId: string;
  promptText: string;
  answerText: string;
  explanation?: string;
  tag?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** defaults to true: items created outside of recordAnswer are things the learner saved */
  inReview?: boolean;
}): ReviewItem {
  const now = new Date().toISOString();
  return {
    id: generateId('review'),
    category: params.category,
    refId: params.refId,
    promptText: params.promptText,
    answerText: params.answerText,
    explanation: params.explanation,
    tag: params.tag,
    level: params.level,
    nextReviewDate: addDaysISO(todayLocalISODate(), REVIEW_INTERVALS_DAYS[0]),
    interval: 0,
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    inReview: params.inReview ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

function canExtendBeyond30Days(correctCount: number, incorrectCount: number, consecutiveCorrect: number): boolean {
  const attempts = correctCount + incorrectCount;
  return consecutiveCorrect >= EXTEND_MIN_STREAK && attempts > 0 && correctCount / attempts >= EXTEND_MIN_ACCURACY;
}

/** Returns an updated copy of the item after the user answers it during a review session,
 * or the first time it's ever answered (see recordAnswer in reviewService). A wrong answer
 * always (re)queues the item; a right answer never removes it from the queue. */
export function applyReviewAnswer(item: ReviewItem, wasCorrect: boolean, today = todayLocalISODate()): ReviewItem {
  const now = new Date().toISOString();
  const inReview = isReviewCandidate(item) || !wasCorrect;
  const evidence = { ...evidenceAfter(item, wasCorrect, today), pendingSelfCheck: undefined, pendingAnswer: undefined };
  if (wasCorrect) {
    const correctCount = item.correctCount + 1;
    const consecutiveCorrect = (item.consecutiveCorrect ?? 0) + 1;
    const ceiling = canExtendBeyond30Days(correctCount, item.incorrectCount, consecutiveCorrect)
      ? REVIEW_INTERVALS_DAYS.length - 1
      : THIRTY_DAY_INDEX;
    // Never shorten an interval the item has already earned (e.g. a 60-day item stays >= 60).
    const nextIntervalIdx = Math.max(Math.min(item.interval + 1, ceiling), Math.min(item.interval, REVIEW_INTERVALS_DAYS.length - 1));
    return {
      ...item,
      interval: nextIntervalIdx,
      correctCount,
      consecutiveCorrect,
      inReview,
      ...evidence,
      nextReviewDate: addDaysISO(today, REVIEW_INTERVALS_DAYS[nextIntervalIdx]),
      updatedAt: now,
    };
  }
  return {
    ...item,
    interval: 0,
    incorrectCount: item.incorrectCount + 1,
    consecutiveCorrect: 0,
    inReview,
    ...evidence,
    nextReviewDate: addDaysISO(today, REVIEW_INTERVALS_DAYS[0]),
    updatedAt: now,
  };
}
