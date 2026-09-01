import type { Level, WritingExercise } from '../../types';
import { level1Writing } from './level1';
import { level2Writing } from './level2';
import { level3Writing } from './level3';
import { level4Writing } from './level4';
import { level5Writing } from './level5';
import { level6Writing } from './level6';

export const WRITING_BY_LEVEL: Record<Level, WritingExercise[]> = {
  1: level1Writing,
  2: level2Writing,
  3: level3Writing,
  4: level4Writing,
  5: level5Writing,
  6: level6Writing,
};

export const ALL_WRITING: WritingExercise[] = [
  ...level1Writing,
  ...level2Writing,
  ...level3Writing,
  ...level4Writing,
  ...level5Writing,
  ...level6Writing,
];

export function getWritingById(id: string): WritingExercise | undefined {
  return ALL_WRITING.find((w) => w.id === id);
}
