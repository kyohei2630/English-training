import type { DBSchema } from 'idb';
import type { LearningSession, ReviewItem, UserProgress, AppSettings, ToeicResult } from '../types';

export const DB_NAME = 'english-training-db';
/**
 * v1: sessions / reviewItems / progress / settings
 * v2: adds `toeicResults` store and `by-tag` / `by-level` indexes on `reviewItems`.
 *     No existing stored values are rewritten — new ReviewItem fields (tag, level,
 *     consecutiveCorrect) are optional and default at read time.
 */
export const DB_VERSION = 2;

export interface AppDBSchema extends DBSchema {
  sessions: {
    key: string;
    value: LearningSession;
    indexes: { 'by-date': string; 'by-day': number };
  };
  reviewItems: {
    key: string;
    value: ReviewItem;
    indexes: { 'by-nextReviewDate': string; 'by-category': string; 'by-tag': string; 'by-level': number };
  };
  progress: {
    key: string;
    value: UserProgress;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  toeicResults: {
    key: string;
    value: ToeicResult;
    indexes: { 'by-date': string };
  };
}
