import type { ReviewCategory, ReviewItem } from '../types';

export interface WeaknessArea {
  tag: string;
  category: ReviewCategory;
  attempts: number;
  correct: number;
  accuracy: number; // 0-100, lower = weaker
}

/** Groups all answered items by (category, tag) and returns the weakest areas first.
 * Areas with too few attempts are excluded so a single unlucky answer doesn't brand a
 * whole topic as a weak point. */
export function analyzeWeaknesses(items: ReviewItem[], minAttempts = 3): WeaknessArea[] {
  const groups = new Map<string, { category: ReviewCategory; tag: string; correct: number; attempts: number }>();

  for (const item of items) {
    if (!item.tag) continue;
    const attempts = item.correctCount + item.incorrectCount;
    if (attempts === 0) continue;
    const key = `${item.category}::${item.tag}`;
    const g = groups.get(key) ?? { category: item.category, tag: item.tag, correct: 0, attempts: 0 };
    g.correct += item.correctCount;
    g.attempts += attempts;
    groups.set(key, g);
  }

  const result: WeaknessArea[] = [];
  for (const g of groups.values()) {
    if (g.attempts < minAttempts) continue;
    result.push({
      tag: g.tag,
      category: g.category,
      attempts: g.attempts,
      correct: g.correct,
      accuracy: Math.round((g.correct / g.attempts) * 100),
    });
  }
  return result.sort((a, b) => a.accuracy - b.accuracy);
}

export function topWeaknesses(items: ReviewItem[], limit = 5, minAttempts = 3): WeaknessArea[] {
  return analyzeWeaknesses(items, minAttempts).slice(0, limit);
}
