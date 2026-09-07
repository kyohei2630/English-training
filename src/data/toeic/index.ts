import type { ToeicPart, ToeicQuestion } from '../../types';
import { toeicPart1Questions } from './part1';
import { toeicPart2Questions } from './part2';
import { toeicPart3Questions } from './part3';
import { toeicPart4Questions } from './part4';
import { toeicPart5Questions } from './part5';
import { toeicPart6Questions } from './part6';
import { toeicPart7Questions } from './part7';

export const ALL_TOEIC_QUESTIONS: ToeicQuestion[] = [
  ...toeicPart1Questions,
  ...toeicPart2Questions,
  ...toeicPart3Questions,
  ...toeicPart4Questions,
  ...toeicPart5Questions,
  ...toeicPart6Questions,
  ...toeicPart7Questions,
];

export const TOEIC_BY_PART: Record<ToeicPart, ToeicQuestion[]> = {
  1: toeicPart1Questions,
  2: toeicPart2Questions,
  3: toeicPart3Questions,
  4: toeicPart4Questions,
  5: toeicPart5Questions,
  6: toeicPart6Questions,
  7: toeicPart7Questions,
};

export { TOEIC_PART_LABELS } from './labels';

export {
  toeicPart1Questions,
  toeicPart2Questions,
  toeicPart3Questions,
  toeicPart4Questions,
  toeicPart5Questions,
  toeicPart6Questions,
  toeicPart7Questions,
};
