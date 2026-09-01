import type { UnderstandingQuestion } from '../../types';
import { level1Questions } from './level1';
import { level2Questions } from './level2';
import { level3Questions } from './level3';
import { level4Questions } from './level4';
import { level5Questions } from './level5';
import { level6Questions } from './level6';

export const ALL_QUESTIONS: UnderstandingQuestion[] = [
  ...level1Questions,
  ...level2Questions,
  ...level3Questions,
  ...level4Questions,
  ...level5Questions,
  ...level6Questions,
];

export function getQuestionsForMaterial(materialId: string): UnderstandingQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.materialId === materialId);
}
