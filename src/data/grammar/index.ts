import type { GrammarLesson, GrammarQuestion, Level } from '../../types';
import { level1GrammarLessons, level1GrammarQuestions } from './level1';
import { level2GrammarLessons, level2GrammarQuestions } from './level2';
import { level3GrammarLessons, level3GrammarQuestions } from './level3';
import { level4GrammarLessons, level4GrammarQuestions } from './level4';
import { level5GrammarLessons, level5GrammarQuestions } from './level5';
import { level6GrammarLessons, level6GrammarQuestions } from './level6';

export const ALL_GRAMMAR_LESSONS: GrammarLesson[] = [
  ...level1GrammarLessons,
  ...level2GrammarLessons,
  ...level3GrammarLessons,
  ...level4GrammarLessons,
  ...level5GrammarLessons,
  ...level6GrammarLessons,
];

export const ALL_GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  ...level1GrammarQuestions,
  ...level2GrammarQuestions,
  ...level3GrammarQuestions,
  ...level4GrammarQuestions,
  ...level5GrammarQuestions,
  ...level6GrammarQuestions,
];

export const GRAMMAR_LESSONS_BY_LEVEL: Record<Level, GrammarLesson[]> = {
  1: level1GrammarLessons,
  2: level2GrammarLessons,
  3: level3GrammarLessons,
  4: level4GrammarLessons,
  5: level5GrammarLessons,
  6: level6GrammarLessons,
};

export const GRAMMAR_QUESTIONS_BY_LEVEL: Record<Level, GrammarQuestion[]> = {
  1: level1GrammarQuestions,
  2: level2GrammarQuestions,
  3: level3GrammarQuestions,
  4: level4GrammarQuestions,
  5: level5GrammarQuestions,
  6: level6GrammarQuestions,
};

export function getQuestionsForLesson(lessonId: string): GrammarQuestion[] {
  return ALL_GRAMMAR_QUESTIONS.filter((q) => q.lessonId === lessonId);
}

export function getLessonById(lessonId: string): GrammarLesson | undefined {
  return ALL_GRAMMAR_LESSONS.find((l) => l.id === lessonId);
}
