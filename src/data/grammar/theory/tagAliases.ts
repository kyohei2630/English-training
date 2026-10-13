import type { Level } from '../../../types';

/**
 * Levels 4-5 name their Theory entries differently from their question tags (e.g. questions are
 * tagged 受動態, the theory 受動態（医学）), so daily training at those levels never found a theory
 * to show. Only unambiguous pairs are listed; broad tags such as 論文表現 stay unmapped.
 * question tag -> theory tag, per level.
 */
export const THEORY_TAG_ALIASES: Partial<Record<Level, Record<string, string>>> = {
  4: {
    受動態: '受動態（医学）',
    比較: '数値比較',
    数値表現: '数値比較',
    関係代名詞: '症状の関係詞修飾',
    因果関係: '医学的因果表現',
  },
  5: {
    統計表現: '統計比較表現',
  },
};

export function theoryTagFor(level: Level, questionTag: string): string {
  return THEORY_TAG_ALIASES[level]?.[questionTag] ?? questionTag;
}
