import { getDB } from '../indexedDB';
import type { UserProgress } from '../../types';

const KEY = 'main';

export const DEFAULT_PROGRESS: UserProgress = {
  currentLevel: 1,
  currentDay: 1,
  totalStudyDays: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalStudyMinutes: 0,
  lastStudyDate: null,
  readingAttempted: 0,
  readingCorrect: 0,
  writingCompleted: 0,
  reviewAttempted: 0,
  reviewCorrect: 0,
  weakWords: [],
  weakGrammar: [],
  vocabularyMastered: 0,
  grammarAttempted: 0,
  grammarCorrect: 0,
  toeicMockTestsTaken: 0,
};

export async function getProgress(): Promise<UserProgress> {
  try {
    const db = await getDB();
    const value = await db.get('progress', KEY);
    // spread defaults first so progress records saved before this update
    // (missing vocabularyMastered / grammarAttempted / etc.) still load safely
    return value ? { ...DEFAULT_PROGRESS, ...value } : DEFAULT_PROGRESS;
  } catch (err) {
    console.error('Failed to read progress from IndexedDB', err);
    return DEFAULT_PROGRESS;
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    const db = await getDB();
    await db.put('progress', progress, KEY);
  } catch (err) {
    console.error('Failed to save progress to IndexedDB', err);
  }
}

export async function resetProgress(): Promise<void> {
  try {
    const db = await getDB();
    await db.put('progress', DEFAULT_PROGRESS, KEY);
  } catch (err) {
    console.error('Failed to reset progress in IndexedDB', err);
  }
}
