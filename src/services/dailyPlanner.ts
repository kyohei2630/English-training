import { TARGET_MINUTES } from './sessionService';

export interface DynamicMinutePlan {
  reading: number;
  grammar: number;
  writing: number;
  review: number;
  totalMinutes: number;
}

const TOTAL_MINUTES = 30;
const FLOOR_MINUTES = 4;
const REVIEW_HEAVY_THRESHOLD = 10;

/**
 * Rebalances the day's ~30 minute budget when there are a lot of overdue review items.
 * Priority order for "what to study today" is: overdue review > previously-wrong items
 * (both surface naturally through the spaced-repetition queue, which resurfaces wrong
 * answers sooner) > today's new material. This function only handles the time-budget
 * side of that priority: Review gets more minutes, Reading/Grammar/Writing get
 * proportionally less (never below a readable floor).
 */
export function computeDynamicMinutes(dueReviewCount: number): DynamicMinutePlan {
  if (dueReviewCount <= REVIEW_HEAVY_THRESHOLD) {
    return { ...TARGET_MINUTES, totalMinutes: TOTAL_MINUTES };
  }

  const extraDue = dueReviewCount - REVIEW_HEAVY_THRESHOLD;
  const reviewBoost = Math.min(12, Math.floor(extraDue / 5) * 2);
  const maxReviewMinutes = TOTAL_MINUTES - FLOOR_MINUTES * 3;
  const review = Math.min(maxReviewMinutes, TARGET_MINUTES.review + reviewBoost);

  const remaining = TOTAL_MINUTES - review;
  const otherBaseTotal = TARGET_MINUTES.reading + TARGET_MINUTES.grammar + TARGET_MINUTES.writing;
  const scale = remaining / otherBaseTotal;

  const reading = Math.max(FLOOR_MINUTES, Math.round(TARGET_MINUTES.reading * scale));
  const grammar = Math.max(FLOOR_MINUTES, Math.round(TARGET_MINUTES.grammar * scale));
  const writing = Math.max(FLOOR_MINUTES, Math.round(TARGET_MINUTES.writing * scale));

  return { reading, grammar, writing, review, totalMinutes: reading + grammar + writing + review };
}
