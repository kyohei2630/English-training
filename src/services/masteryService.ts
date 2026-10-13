import type { ReviewItem } from '../types';
import { diffInCalendarDays, toLocalISODate } from '../utils/date';

export type MasteryTier = 'unlearned' | 'learning' | 'acquired' | 'retained';

export const MASTERY_LABELS_JA: Record<MasteryTier, string> = {
  unlearned: '未習得',
  learning: '学習中',
  acquired: '習得',
  retained: '定着',
};

type MasteryInput = Pick<ReviewItem, 'correctCount' | 'incorrectCount' | 'consecutiveCorrect'> &
  Partial<Pick<ReviewItem, 'interval' | 'delayedAttempts' | 'lastDelayedCorrect' | 'firstAnswerCorrect' | 'createdAt' | 'updatedAt'>>;

/** Records saved before first-answer / delayed-answer tracking existed (DB v4). */
function isLegacy(item: MasteryInput): boolean {
  return item.firstAnswerCorrect === undefined && item.delayedAttempts === undefined;
}

/** 0-100 raw accuracy. Not the same as the mastery tier, which also requires a minimum attempt count. */
export function computeProficiency(item: MasteryInput): number {
  const attempts = item.correctCount + item.incorrectCount;
  if (attempts === 0) return 0;
  return Math.round((item.correctCount / attempts) * 100);
}

/** Answered correctly a week or more after last seeing it (most recent such check). Records from
 * before delayed checks were tracked fall back to the ladder (the 7-day step plus a 3-answer
 * streak) — the best evidence they carry. */
export function hasDelayedEvidence(item: MasteryInput): boolean {
  if ((item.delayedAttempts ?? 0) > 0) return item.lastDelayedCorrect === true;
  return isLegacy(item) && (item.interval ?? 0) >= 3 && (item.consecutiveCorrect ?? 0) >= 3;
}

/** Correct again on a later day, not just several times in one sitting: at least 3 days between
 * the first answer and the latest correct one (older records: a spacing step on the ladder). */
function hasSpacedEvidence(item: MasteryInput): boolean {
  if (hasDelayedEvidence(item)) return true;
  if ((item.interval ?? 0) < 2) return false;
  if (isLegacy(item) || !item.createdAt || !item.updatedAt) return isLegacy(item);
  return diffInCalendarDays(toLocalISODate(new Date(item.createdAt)), toLocalISODate(new Date(item.updatedAt))) >= 3;
}

function accuracyTier(item: MasteryInput): MasteryTier {
  const attempts = item.correctCount + item.incorrectCount;
  const score = computeProficiency(item);

  if (attempts < 2) {
    return score >= 60 ? 'learning' : 'unlearned';
  }
  if (attempts < 5 || (item.consecutiveCorrect ?? 0) < 2) {
    if (score >= 80) return 'acquired';
    if (score >= 60) return 'learning';
    return 'unlearned';
  }
  if (score >= 90) return 'retained';
  if (score >= 80) return 'acquired';
  if (score >= 60) return 'learning';
  return 'unlearned';
}

/**
 * Mastery tiers: 0-59 未習得 / 60-79 学習中 / 80-89 習得 / 90+ 定着, by accuracy and attempt
 * count — and, because answering the same question right several times in a row shows neither
 * application nor long-term retention:
 * - 習得 also needs a correct answer after a spacing step,
 * - 定着 also needs a correct answer a week or more after the item was last seen.
 * Whether the knowledge transfers to unseen sentences is measured separately (abilityService).
 */
export function computeMasteryTier(item: MasteryInput): MasteryTier {
  const tier = accuracyTier(item);
  if (tier === 'retained' && !hasDelayedEvidence(item)) return hasSpacedEvidence(item) ? 'acquired' : 'learning';
  if (tier === 'acquired' && !hasSpacedEvidence(item)) return 'learning';
  return tier;
}

export function isMastered(item: MasteryInput): boolean {
  const tier = computeMasteryTier(item);
  return tier === 'acquired' || tier === 'retained';
}

/**
 * What the learner sees per item:
 * - 学習済み: answered at least once and not currently wrong. Every answer recorded before the
 *   current criteria existed counts here, so no past study disappears.
 * - 現行基準で定着確認済み: answered right a week or more after last seeing it, and right since.
 * - 再確認が必要: the latest answer was wrong, a delayed check failed, or a typed answer is
 *   waiting for self-check. These are exactly the items the review queue brings back.
 * - 未学習: saved (e.g. a bookmarked word) but never answered.
 */
export type StudyStatus = 'unlearned' | 'studied' | 'verified' | 'recheck';

export const STUDY_STATUS_LABELS: Record<StudyStatus, string> = {
  unlearned: '未学習',
  studied: '学習済み',
  verified: '現行基準で定着確認済み',
  recheck: '再確認が必要',
};

type StatusInput = MasteryInput & Partial<Pick<ReviewItem, 'delayedCorrect' | 'pendingSelfCheck'>>;

export function studyStatus(item: StatusInput | undefined): StudyStatus {
  if (!item) return 'unlearned';
  if (item.pendingSelfCheck) return 'recheck';
  if (item.correctCount + item.incorrectCount === 0) return 'unlearned';
  const lastWrong = item.incorrectCount > 0 && (item.consecutiveCorrect ?? 0) === 0;
  if (lastWrong || item.lastDelayedCorrect === false) return 'recheck';
  if ((item.delayedCorrect ?? 0) > 0 && item.lastDelayedCorrect === true) return 'verified';
  return 'studied';
}
