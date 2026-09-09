import type { GrammarLesson, GrammarQuestion, Level, ReadingMaterial, UnderstandingQuestion, WritingExercise } from '../types';
import { LEVELS } from '../data/levels';
import { loadReadingLevel } from '../data/reading/loader';
import { loadWritingLevel } from '../data/writing/loader';
import { loadGrammarLevel } from '../data/grammar/loader';

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
  grammarQuestions: GrammarQuestion[];
  /** the distinct lessons behind today's grammarQuestions, in first-appearance order,
   * shown before the quiz so the flow is Lesson -> explanation -> examples -> practice */
  grammarLessons: GrammarLesson[];
}

const GRAMMAR_PER_DAY = 6;

/** Loads only the current day's level content (one dynamic import per content
 * type), so studying Day 5 never pulls Level 4-6 data into memory. */
export async function getDailyPlan(day: number): Promise<DailyPlan> {
  const level = getLevelForDay(day);
  const startDay = getLevelStartDay(level);
  const indexInLevel = Math.max(0, day - startDay);

  const [{ materials }, writingPool, { questions: grammarPool, lessons: grammarLessonPool }] = await Promise.all([
    loadReadingLevel(level),
    loadWritingLevel(level),
    loadGrammarLevel(level),
  ]);

  const reading = materials[indexInLevel % materials.length];

  const writingPerDay = 2;
  const writing: WritingExercise[] = [];
  for (let i = 0; i < writingPerDay; i++) {
    const idx = (indexInLevel * writingPerDay + i) % writingPool.length;
    writing.push(writingPool[idx]);
  }

  const grammarQuestions: GrammarQuestion[] = [];
  if (grammarPool.length > 0) {
    for (let i = 0; i < GRAMMAR_PER_DAY; i++) {
      const idx = (indexInLevel * GRAMMAR_PER_DAY + i) % grammarPool.length;
      grammarQuestions.push(grammarPool[idx]);
    }
  }

  const lessonById = new Map(grammarLessonPool.map((l) => [l.id, l]));
  const grammarLessons: GrammarLesson[] = [];
  const seenLessonIds = new Set<string>();
  for (const q of grammarQuestions) {
    if (seenLessonIds.has(q.lessonId)) continue;
    seenLessonIds.add(q.lessonId);
    const lesson = lessonById.get(q.lessonId);
    if (lesson) grammarLessons.push(lesson);
  }

  return { day, level, reading, writing, grammarQuestions, grammarLessons };
}

export async function getUnderstandingQuestionsForDay(day: number): Promise<UnderstandingQuestion[]> {
  const plan = await getDailyPlan(day);
  const { questions } = await loadReadingLevel(plan.level);
  return questions.filter((q) => q.materialId === plan.reading.id);
}
