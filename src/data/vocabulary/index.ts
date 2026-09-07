import type { Level, VocabularyEntry } from '../../types';
import { level1Vocabulary } from './level1';
import { level2Vocabulary } from './level2';
import { level3Vocabulary } from './level3';
import { level4Vocabulary } from './level4';
import { level5Vocabulary } from './level5';
import { level6Vocabulary } from './level6';

export const ALL_VOCABULARY: VocabularyEntry[] = [
  ...level1Vocabulary,
  ...level2Vocabulary,
  ...level3Vocabulary,
  ...level4Vocabulary,
  ...level5Vocabulary,
  ...level6Vocabulary,
];

export const VOCABULARY_BY_LEVEL: Record<Level, VocabularyEntry[]> = {
  1: level1Vocabulary,
  2: level2Vocabulary,
  3: level3Vocabulary,
  4: level4Vocabulary,
  5: level5Vocabulary,
  6: level6Vocabulary,
};

export function getVocabularyById(id: string): VocabularyEntry | undefined {
  return ALL_VOCABULARY.find((v) => v.id === id);
}

export function getVocabularyUpToLevel(level: Level): VocabularyEntry[] {
  return ALL_VOCABULARY.filter((v) => v.level <= level);
}
