import { TARGET_MINUTES } from './sessionService';

export interface DynamicMinutePlan {
  reading: number;
  grammar: number;
  writing: number;
  review: number;
  totalMinutes: number;
}

/**
 * The standard ~25 minute day: review 5 / new knowledge + practice (Grammar) 10 / applied
 * practice (Reading 5 + Writing 5) 10. When the review backlog is high and not shrinking, review
 * gets more time (up to 10 questions) and new grammar a little less (6 -> 4 questions) — new
 * learning continues, the total stays the same.
 */
export function computeDailyMinutes(loadHigh: boolean): DynamicMinutePlan {
  if (!loadHigh) {
    const total = TARGET_MINUTES.reading + TARGET_MINUTES.grammar + TARGET_MINUTES.writing + TARGET_MINUTES.review;
    return { ...TARGET_MINUTES, totalMinutes: total };
  }
  const plan = { reading: 5, grammar: 8, writing: 4, review: 8 };
  return { ...plan, totalMinutes: plan.reading + plan.grammar + plan.writing + plan.review };
}

/** Minutes of the busy-day mode: a few review questions and one sentence of your own. */
export const QUICK_MODE_MINUTES = 5;
