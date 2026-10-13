import type { AnswerLogEntry, ReviewItem, SelfGradedCounts } from '../types';

/**
 * Objective accuracy counts only answers the app checked itself. Answers the learner judged
 * (free writing, typed answers that went to self-check, flip cards, notebook tasks) are kept in
 * the history but left out here, so self-evaluation never inflates or deflates a rate.
 */
export interface ObjectiveCounts {
  correct: number;
  incorrect: number;
  /** result of the first answer, when it was checked by the app */
  firstCorrect?: boolean;
  delayedAttempts: number;
  delayedCorrect: number;
}

export interface ObjectiveContext {
  /** self-graded answers per refId, rebuilt from the answer log (complete since DB v4) */
  selfFromLog?: Map<string, SelfGradedCounts>;
  /** exercises that can only ever be self-graded (和文英訳・自由英作文), including answers
   * recorded before grading was tracked */
  alwaysSelfGraded?: (refId: string) => boolean;
}

/** Rebuilds per-item self-graded counts from the answer log. */
export function selfGradedFromLog(log: AnswerLogEntry[]): Map<string, SelfGradedCounts> {
  const out = new Map<string, SelfGradedCounts>();
  for (const e of log) {
    if (e.grading !== 'self') continue;
    const s = out.get(e.refId) ?? { correct: 0, incorrect: 0, delayedAttempts: 0, delayedCorrect: 0 };
    if (e.wasCorrect) s.correct++;
    else s.incorrect++;
    if (e.kind === 'first') s.first = true;
    if (e.kind === 'delayed') {
      s.delayedAttempts++;
      if (e.wasCorrect) s.delayedCorrect++;
    }
    out.set(e.refId, s);
  }
  return out;
}

const NONE: ObjectiveCounts = { correct: 0, incorrect: 0, delayedAttempts: 0, delayedCorrect: 0 };

export function objectiveCounts(item: ReviewItem, ctx: ObjectiveContext = {}): ObjectiveCounts {
  if (item.refId.startsWith('note-') || ctx.alwaysSelfGraded?.(item.refId)) return NONE;
  const self = ctx.selfFromLog?.get(item.refId) ?? item.selfGraded;
  if (!self) {
    return {
      correct: item.correctCount,
      incorrect: item.incorrectCount,
      firstCorrect: item.firstAnswerCorrect,
      delayedAttempts: item.delayedAttempts ?? 0,
      delayedCorrect: item.delayedCorrect ?? 0,
    };
  }
  return {
    correct: Math.max(0, item.correctCount - self.correct),
    incorrect: Math.max(0, item.incorrectCount - self.incorrect),
    firstCorrect: self.first ? undefined : item.firstAnswerCorrect,
    delayedAttempts: Math.max(0, (item.delayedAttempts ?? 0) - self.delayedAttempts),
    delayedCorrect: Math.max(0, (item.delayedCorrect ?? 0) - self.delayedCorrect),
  };
}
