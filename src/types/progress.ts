export type ReviewCategory = 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'toeic';

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
  /** topic tag (grammar point / reading skill / toeic part / vocabulary category) used for weakness analysis */
  tag?: string;
  /** curriculum level this item belongs to */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** current streak of consecutive correct answers, reset to 0 on a wrong answer */
  consecutiveCorrect?: number;
}

export type SectionKey = 'reading' | 'grammar' | 'writing' | 'review';

export interface SessionMinutes {
  reading: number;
  grammar: number;
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
  grammarCorrect: number;
  grammarTotal: number;
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
  /** number of distinct vocabulary words with mastery >= 80 ("習得") */
  vocabularyMastered: number;
  grammarAttempted: number;
  grammarCorrect: number;
  toeicMockTestsTaken: number;
}

export interface ToeicPartResult {
  attempted: number;
  correct: number;
}

export interface ToeicResult {
  id: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
  totalQuestions: number;
  correct: number;
  byPart: Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, ToeicPartResult>>;
  durationSeconds: number;
  /** learning-guide score band label, e.g. "600レベル目安" — not an official TOEIC score */
  estimatedScoreBand: string;
}

export interface AppSettings {
  fontSize: 'sm' | 'md' | 'lg';
  darkMode: boolean;
  dailyGoalMinutes: number;
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6;
  /** whether the first-launch onboarding explainer has been dismissed */
  hasSeenOnboarding?: boolean;
  /** when true, all levels are freely selectable instead of following the recommended order */
  freeStudyMode?: boolean;
}

export type TheoryStatus = 'unlearned' | 'learning' | 'mastered';

export interface TheoryProgress {
  /** GrammarTheory.id */
  id: string;
  status: TheoryStatus;
  viewedAt?: string; // ISO timestamp, set the first time the theory content is opened
  miniCheckCorrect: number;
  miniCheckTotal: number;
  updatedAt: string; // ISO timestamp
}

export interface ExportBundle {
  exportedAt: string;
  version: number;
  sessions: LearningSession[];
  reviewItems: ReviewItem[];
  progress: UserProgress;
  settings: AppSettings;
  toeicResults?: ToeicResult[];
  theoryProgress?: TheoryProgress[];
}
