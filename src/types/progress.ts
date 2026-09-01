export type ReviewCategory = 'vocabulary' | 'grammar' | 'reading' | 'writing';

export interface ReviewItem {
  id: string;
  category: ReviewCategory;
  /** id of the source material/question/exercise */
  refId: string;
  /** short human-readable snapshot so the review screen doesn't need to re-fetch the source */
  promptText: string;
  answerText: string;
  explanation?: string;
  nextReviewDate: string; // YYYY-MM-DD
  interval: number; // index into REVIEW_INTERVALS_DAYS
  correctCount: number;
  incorrectCount: number;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type SectionKey = 'reading' | 'understanding' | 'writing' | 'review';

export interface SessionMinutes {
  reading: number;
  understanding: number;
  writing: number;
  review: number;
}

export interface LearningSession {
  id: string;
  date: string; // YYYY-MM-DD (local time)
  day: number; // curriculum day number
  startedAt: string; // ISO timestamp
  completedAt: string | null; // ISO timestamp
  sectionsDone: Record<SectionKey, boolean>;
  minutesSpent: SessionMinutes;
  materialsCompleted: string[];
  readingCorrect: number;
  readingTotal: number;
  reviewCorrect: number;
  reviewTotal: number;
  writingCompleted: number;
}

export interface UserProgress {
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6;
  currentDay: number;
  totalStudyDays: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  readingAttempted: number;
  readingCorrect: number;
  writingCompleted: number;
  reviewAttempted: number;
  reviewCorrect: number;
  weakWords: string[];
  weakGrammar: string[];
}

export interface AppSettings {
  fontSize: 'sm' | 'md' | 'lg';
  darkMode: boolean;
  dailyGoalMinutes: number;
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ExportBundle {
  exportedAt: string;
  version: number;
  sessions: LearningSession[];
  reviewItems: ReviewItem[];
  progress: UserProgress;
  settings: AppSettings;
}
