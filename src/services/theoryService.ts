import type { TheoryProgress, TheoryStatus } from '../types';
import { getTheoryProgress, upsertTheoryProgress } from '../db/repositories/theoryProgressRepository';

export const THEORY_STATUS_LABELS_JA: Record<TheoryStatus, string> = {
  unlearned: '未学習',
  learning: '学習中',
  mastered: 'Mastered',
};

/** unlearned: never opened. learning: opened but the mini check hasn't been passed
 * yet (or hasn't been attempted). mastered: mini check passed at 80%+ accuracy. */
function computeStatus(progress: Pick<TheoryProgress, 'viewedAt' | 'miniCheckCorrect' | 'miniCheckTotal'>): TheoryStatus {
  if (!progress.viewedAt) return 'unlearned';
  if (progress.miniCheckTotal === 0) return 'learning';
  const accuracy = progress.miniCheckCorrect / progress.miniCheckTotal;
  return accuracy >= 0.8 ? 'mastered' : 'learning';
}

/** Marks a theory as opened/read. Safe to call every time the theory detail is
 * shown — it only sets `viewedAt` once and never downgrades an existing status. */
export async function markTheoryViewed(theoryId: string): Promise<TheoryProgress> {
  const existing = await getTheoryProgress(theoryId);
  if (existing?.viewedAt) return existing;

  const now = new Date().toISOString();
  const next: TheoryProgress = {
    id: theoryId,
    status: 'learning',
    viewedAt: existing?.viewedAt ?? now,
    miniCheckCorrect: existing?.miniCheckCorrect ?? 0,
    miniCheckTotal: existing?.miniCheckTotal ?? 0,
    updatedAt: now,
  };
  await upsertTheoryProgress(next);
  return next;
}

/** Records the result of one Mini Check attempt (all questions in that theory's
 * miniCheck array), recomputing the status from the new totals. */
export async function recordMiniCheckResult(theoryId: string, correct: number, total: number): Promise<TheoryProgress> {
  const existing = await getTheoryProgress(theoryId);
  const now = new Date().toISOString();
  const miniCheckCorrect = correct;
  const miniCheckTotal = total;
  const next: TheoryProgress = {
    id: theoryId,
    status: computeStatus({ viewedAt: existing?.viewedAt ?? now, miniCheckCorrect, miniCheckTotal }),
    viewedAt: existing?.viewedAt ?? now,
    miniCheckCorrect,
    miniCheckTotal,
    updatedAt: now,
  };
  await upsertTheoryProgress(next);
  return next;
}

export function statusOf(progress: TheoryProgress | undefined): TheoryStatus {
  if (!progress) return 'unlearned';
  return computeStatus(progress);
}
