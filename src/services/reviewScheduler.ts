import type { ReviewCategory, ReviewItem } from '../types';
import { addDaysISO, todayLocalISODate } from '../utils/date';
import { generateId } from '../utils/id';

/** Spaced-repetition ladder: index 0 = review again after 1 day, ... */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;

export function createReviewItem(params: {
  category: ReviewCategory;
  refId: string;
  promptText: string;
  answerText: string;
  explanation?: string;
  tag?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
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
    createdAt: now,
    updatedAt: now,
  };
}

/** Returns an updated copy of the item after the user answers it during a review session,
 * or the first time it's ever answered (see recordAnswer in reviewService). */
export function applyReviewAnswer(item: ReviewItem, wasCorrect: boolean): ReviewItem {
  const now = new Date().toISOString();
  if (wasCorrect) {
    const nextIntervalIdx = Math.min(item.interval + 1, REVIEW_INTERVALS_DAYS.length - 1);
    return {
      ...item,
      interval: nextIntervalIdx,
      correctCount: item.correctCount + 1,
      consecutiveCorrect: (item.consecutiveCorrect ?? 0) + 1,
      nextReviewDate: addDaysISO(todayLocalISODate(), REVIEW_INTERVALS_DAYS[nextIntervalIdx]),
      updatedAt: now,
    };
  }
  return {
    ...item,
    interval: 0,
    incorrectCount: item.incorrectCount + 1,
    consecutiveCorrect: 0,
    nextReviewDate: addDaysISO(todayLocalISODate(), REVIEW_INTERVALS_DAYS[0]),
    updatedAt: now,
  };
}
