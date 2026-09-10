import type { GrammarLesson, GrammarQuestion, GrammarTheory, Level, ReadingMaterial, UnderstandingQuestion, WritingExercise } from '../types';
import { LEVELS } from '../data/levels';
import { loadReadingLevel } from '../data/reading/loader';
import { loadWritingLevel } from '../data/writing/loader';
import { loadGrammarLevel } from '../data/grammar/loader';
import { loadGrammarTheoryLevel } from '../data/grammar/theory/loader';

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
  /** richer Theory entries covering today's grammarQuestions' tags, shown before the
   * quiz as Theory -> Mini Check -> Practice. Takes priority over grammarLessons for
   * any tag it covers. */
  grammarTheory: GrammarTheory[];
  /** fallback explanations (lighter than Theory) for any of today's tags that don't
   * have a matching GrammarTheory entry yet, so every tag still gets *some* explanation
   * before the quiz. In first-appearance order. */
  grammarLessons: GrammarLesson[];
}

const GRAMMAR_PER_DAY = 6;

/** Loads only the current day's level content (one dynamic import per content
 * type), so studying Day 5 never pulls Level 4-6 data into memory. */
export async function getDailyPlan(day: number): Promise<DailyPlan> {
  const level = getLevelForDay(day);
  const startDay = getLevelStartDay(level);
  const indexInLevel = Math.max(0, day - startDay);

  const [{ materials }, writingPool, { questions: grammarPool, lessons: grammarLessonPool }, grammarTheoryPool] = await Promise.all([
    loadReadingLevel(level),
    loadWritingLevel(level),
    loadGrammarLevel(level),
    loadGrammarTheoryLevel(level),
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

  // Today's distinct tags, in first-appearance order across the day's questions.
  const todaysTags: string[] = [];
  const seenTags = new Set<string>();
  for (const q of grammarQuestions) {
    if (seenTags.has(q.tag)) continue;
    seenTags.add(q.tag);
    todaysTags.push(q.tag);
  }

  const theoryByTag = new Map(grammarTheoryPool.map((t) => [t.tag, t]));
  const grammarTheory: GrammarTheory[] = [];
  const tagsCoveredByTheory = new Set<string>();
  for (const tag of todaysTags) {
    const theory = theoryByTag.get(tag);
    if (theory) {
      grammarTheory.push(theory);
      tagsCoveredByTheory.add(tag);
    }
  }

  // Fallback Lesson explanations only for tags Theory doesn't cover yet, so the
  // same grammar point is never explained twice in one day.
  const lessonById = new Map(grammarLessonPool.map((l) => [l.id, l]));
  const grammarLessons: GrammarLesson[] = [];
  const seenLessonIds = new Set<string>();
  for (const q of grammarQuestions) {
    if (tagsCoveredByTheory.has(q.tag)) continue;
    if (seenLessonIds.has(q.lessonId)) continue;
    seenLessonIds.add(q.lessonId);
    const lesson = lessonById.get(q.lessonId);
    if (lesson) grammarLessons.push(lesson);
  }

  return { day, level, reading, writing, grammarQuestions, grammarTheory, grammarLessons };
}

export async function getUnderstandingQuestionsForDay(day: number): Promise<UnderstandingQuestion[]> {
  const plan = await getDailyPlan(day);
  const { questions } = await loadReadingLevel(plan.level);
  return questions.filter((q) => q.materialId === plan.reading.id);
}
