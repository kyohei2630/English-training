import type { DBSchema } from 'idb';
import type { LearningSession, ReviewItem, UserProgress, AppSettings } from '../types';

export const DB_NAME = 'english-training-db';
export const DB_VERSION = 1;

export interface AppDBSchema extends DBSchema {
  sessions: {
    key: string;
    value: LearningSession;
    indexes: { 'by-date': string; 'by-day': number };
  };
  reviewItems: {
    key: string;
    value: ReviewItem;
    indexes: { 'by-nextReviewDate': string; 'by-category': string };
  };
  progress: {
    key: string;
    value: UserProgress;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}
