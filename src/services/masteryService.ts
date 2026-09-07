import type { ReviewItem } from '../types';

export type MasteryTier = 'unlearned' | 'learning' | 'acquired' | 'retained';

export const MASTERY_LABELS_JA: Record<MasteryTier, string> = {
  unlearned: '未習得',
  learning: '学習中',
  acquired: '習得',
  retained: '定着',
};

type MasteryInput = Pick<ReviewItem, 'correctCount' | 'incorrectCount' | 'consecutiveCorrect'>;

/** 0-100 raw accuracy. Not the same as the mastery tier, which also requires a minimum attempt count. */
export function computeProficiency(item: MasteryInput): number {
  const attempts = item.correctCount + item.incorrectCount;
  if (attempts === 0) return 0;
  return Math.round((item.correctCount / attempts) * 100);
}

/**
 * Mastery tiers: 0-59 未習得 / 60-79 学習中 / 80-89 習得 / 90+ 定着.
 * A handful of lucky answers should never look like mastery, so higher tiers
 * require a minimum number of attempts (and a short correct streak for 定着).
 */
export function computeMasteryTier(item: MasteryInput): MasteryTier {
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

export function isMastered(item: MasteryInput): boolean {
  const tier = computeMasteryTier(item);
  return tier === 'acquired' || tier === 'retained';
}
