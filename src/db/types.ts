import type { DBSchema } from 'idb';
import type {
  AnswerLogEntry,
  AppSettings,
  AssessmentDraft,
  AssessmentResult,
  LearningSession,
  ReviewItem,
  TheoryProgress,
  ToeicResult,
  UserProgress,
} from '../types';

export const DB_NAME = 'english-training-db';
/**
 * v1: sessions / reviewItems / progress / settings
 * v2: adds `toeicResults` store and `by-tag` / `by-level` indexes on `reviewItems`.
 *     No existing stored values are rewritten — new ReviewItem fields (tag, level,
 *     consecutiveCorrect) are optional and default at read time.
 * v3: adds `theoryProgress` store (Grammar Theory learning state: unlearned/learning/
 *     mastered per theory id). Purely additive — no existing store or field changes.
 * v4: adds `answerLog` (one record per answer, for first-attempt / delayed / weekly measures)
 *     and `assessments` (4-weekly ability checks). Purely additive.
 * v5: adds `assessmentDrafts` (an assessment in progress, resumable) and rewrites old spellings
 *     of grammar tags on reviewItems / answerLog to their internal ID (data/grammar/tagLabels.ts).
 *     No record is removed.
 */
export const DB_VERSION = 5;

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
  theoryProgress: {
    key: string;
    value: TheoryProgress;
  };
  answerLog: {
    key: string;
    value: AnswerLogEntry;
    indexes: { 'by-date': string };
  };
  assessments: {
    key: string;
    value: AssessmentResult;
    indexes: { 'by-date': string };
  };
  assessmentDrafts: {
    key: string;
    value: AssessmentDraft;
  };
}
