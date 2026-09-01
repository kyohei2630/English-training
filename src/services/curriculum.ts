import type { Level, ReadingMaterial, WritingExercise } from '../types';
import { LEVELS } from '../data/levels';
import { MATERIALS_BY_LEVEL } from '../data/materials';
import { WRITING_BY_LEVEL } from '../data/writing';
import { getQuestionsForMaterial } from '../data/questions';

interface LevelRange {
  level: Level;
  startDay: number; // inclusive, 1-based
  endDay: number; // inclusive
}

function buildLevelRanges(): LevelRange[] {
  let cursor = 1;
  return LEVELS.map((l) => {
    const startDay = cursor;
    const endDay = cursor + l.totalDays - 1;
    cursor = endDay + 1;
    return { level: l.level, startDay, endDay };
  });
}

const LEVEL_RANGES = buildLevelRanges();
export const TOTAL_CURRICULUM_DAYS = LEVEL_RANGES[LEVEL_RANGES.length - 1].endDay;

/** Determines which level a given curriculum day belongs to. Days beyond the
 * authored curriculum stay on the final level and keep cycling its material pool. */
export function getLevelForDay(day: number): Level {
  const safeDay = Math.max(1, day);
  const range = LEVEL_RANGES.find((r) => safeDay >= r.startDay && safeDay <= r.endDay);
  if (range) return range.level;
  return LEVEL_RANGES[LEVEL_RANGES.length - 1].level;
}

function getLevelStartDay(level: Level): number {
  return LEVEL_RANGES.find((r) => r.level === level)?.startDay ?? 1;
}

export interface DailyPlan {
  day: number;
  level: Level;
  reading: ReadingMaterial;
  writing: WritingExercise[];
}

export function getDailyPlan(day: number): DailyPlan {
  const level = getLevelForDay(day);
  const startDay = getLevelStartDay(level);
  const indexInLevel = Math.max(0, day - startDay);

  const materials = MATERIALS_BY_LEVEL[level];
  const reading = materials[indexInLevel % materials.length];

  const writingPool = WRITING_BY_LEVEL[level];
  const writingPerDay = 2;
  const writing: WritingExercise[] = [];
  for (let i = 0; i < writingPerDay; i++) {
    const idx = (indexInLevel * writingPerDay + i) % writingPool.length;
    writing.push(writingPool[idx]);
  }

  return { day, level, reading, writing };
}

export function getUnderstandingQuestionsForDay(day: number) {
  const plan = getDailyPlan(day);
  return getQuestionsForMaterial(plan.reading.id);
}
