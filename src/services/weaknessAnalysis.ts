import type { Level, ReviewCategory, ReviewItem } from '../types';
import { canonicalTag } from '../data/grammar/tagLabels';
import { objectiveCounts, type ObjectiveContext } from './objectiveCounts';

export interface WeaknessArea {
  tag: string;
  category: ReviewCategory;
  /** most common level among the grouped items, used to jump straight into a
   * level-scoped, tag-filtered Extra Training session for this weak area */
  level: Level;
  attempts: number;
  correct: number;
  accuracy: number; // 0-100, lower = weaker
}

/** Groups all answered items by (category, tag) and returns the weakest areas first.
 * Areas with too few attempts are excluded so a single unlucky answer doesn't brand a
 * whole topic as a weak point. */
export function analyzeWeaknesses(items: ReviewItem[], minAttempts = 3, ctx: ObjectiveContext = {}): WeaknessArea[] {
  const groups = new Map<
    string,
    { category: ReviewCategory; tag: string; correct: number; attempts: number; levelCounts: Map<Level, number> }
  >();

  for (const item of items) {
    if (!item.tag) continue;
    // Old spellings of a tag are grouped with its current ID.
    const tag = canonicalTag(item.tag);
    // Accuracy from app-checked answers only; self-evaluations don't count toward it.
    const oc = objectiveCounts(item, ctx);
    const attempts = oc.correct + oc.incorrect;
    if (attempts === 0) continue;
    const key = `${item.category}::${tag}`;
    const g = groups.get(key) ?? { category: item.category, tag, correct: 0, attempts: 0, levelCounts: new Map() };
    g.correct += oc.correct;
    g.attempts += attempts;
    if (item.level) {
      g.levelCounts.set(item.level, (g.levelCounts.get(item.level) ?? 0) + 1);
    }
    groups.set(key, g);
  }

  const result: WeaknessArea[] = [];
  for (const g of groups.values()) {
    if (g.attempts < minAttempts) continue;
    let level: Level = 1;
    let bestCount = 0;
    for (const [candidateLevel, count] of g.levelCounts) {
      if (count > bestCount) {
        level = candidateLevel;
        bestCount = count;
      }
    }
    result.push({
      tag: g.tag,
      category: g.category,
      level,
      attempts: g.attempts,
      correct: g.correct,
      accuracy: Math.round((g.correct / g.attempts) * 100),
    });
  }
  return result.sort((a, b) => a.accuracy - b.accuracy);
}

export function topWeaknesses(items: ReviewItem[], limit = 5, minAttempts = 3, ctx: ObjectiveContext = {}): WeaknessArea[] {
  return analyzeWeaknesses(items, minAttempts, ctx).slice(0, limit);
}
