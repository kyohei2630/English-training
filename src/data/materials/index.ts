import type { Level, ReadingMaterial } from '../../types';
import { level1Materials } from './level1';
import { level2Materials } from './level2';
import { level3Materials } from './level3';
import { level4Materials } from './level4';
import { level5Materials } from './level5';
import { level6Materials } from './level6';

export const ALL_MATERIALS: ReadingMaterial[] = [
  ...level1Materials,
  ...level2Materials,
  ...level3Materials,
  ...level4Materials,
  ...level5Materials,
  ...level6Materials,
];

export const MATERIALS_BY_LEVEL: Record<Level, ReadingMaterial[]> = {
  1: level1Materials,
  2: level2Materials,
  3: level3Materials,
  4: level4Materials,
  5: level5Materials,
  6: level6Materials,
};

export function getMaterialById(id: string): ReadingMaterial | undefined {
  return ALL_MATERIALS.find((m) => m.id === id);
}
