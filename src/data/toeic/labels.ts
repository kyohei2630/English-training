import type { ToeicPart } from '../../types';

/** Tiny, content-free labels — safe to import eagerly from any page without
 * pulling the (lazy-loaded) TOEIC question banks into the main bundle. */
export const TOEIC_PART_LABELS: Record<ToeicPart, string> = {
  1: 'Part 1: 写真描写',
  2: 'Part 2: 応答問題',
  3: 'Part 3: 会話問題',
  4: 'Part 4: 説明文問題',
  5: 'Part 5: 短文穴埋め',
  6: 'Part 6: 長文穴埋め',
  7: 'Part 7: 長文読解',
};
