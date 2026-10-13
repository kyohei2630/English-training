import type { AssessmentDraft } from './assessment';

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
  /** vocabulary saved from the tap-to-lookup word popover: the word with its context sentence */
  word?: SavedWordInfo;
  /** whether the item is in the spaced-repetition queue. Every answered question keeps a record
   * (it feeds mastery and weakness analysis), but only items that were missed, saved by the
   * learner, or already being reviewed are queued. Undefined on records saved before this field
   * existed; isReviewCandidate() derives it from the answer history. */
  inReview?: boolean;
  /** result of the very first answer (= an unseen question). Undefined on older records. */
  firstAnswerCorrect?: boolean;
  /** answers given 7+ days after the item was last seen (long-term retention evidence) */
  delayedAttempts?: number;
  delayedCorrect?: number;
  lastDelayedCorrect?: boolean;
  /** extra ability bucket besides the category: sentence-structure analysis or research English */
  skill?: AbilitySkill;
  /** a typed answer that matched no registered answer and the learner couldn't judge
   * ("判断できない"): queued for re-checking, not counted as wrong. Cleared by the next answer. */
  pendingSelfCheck?: boolean;
  /** the learner's answer waiting for that check */
  pendingAnswer?: string;
  /** the part of the counters above that came from the learner's own judgement (free writing,
   * self-checked typed answers, flip cards, notes). Objective accuracy leaves these out. */
  selfGraded?: SelfGradedCounts;
}

export interface SelfGradedCounts {
  correct: number;
  incorrect: number;
  /** the first answer was self-graded */
  first?: boolean;
  delayedAttempts: number;
  delayedCorrect: number;
}

export type AbilitySkill = 'structure' | 'research';

/** How an answer relates to the learner's history with that question. */
export type AnswerKind = 'first' | 'repeat' | 'delayed' | 'assessment';
export type AnswerSource = 'practice' | 'review' | 'assessment' | 'note' | 'sentence-building';

/** One answer, as an event. Added in DB v4; history before that exists only as the per-item
 * counters on ReviewItem. Used for weekly missions and ability trends. */
export interface AnswerLogEntry {
  id: string;
  date: string; // YYYY-MM-DD (local)
  at: string; // ISO timestamp
  category: ReviewCategory;
  refId: string;
  tag?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  wasCorrect: boolean;
  kind: AnswerKind;
  source: AnswerSource;
  /** 'auto' = checked by the app; 'self' = the learner's own judgement (free writing, notes) */
  grading: 'auto' | 'self';
  skill?: AbilitySkill;
}

export type NoteTaskKind = 'composition' | 'structure' | 'explanation';
/** 自力でできた / ヒントが必要だった / できなかった */
export type NoteSelfEval = 'independent' | 'hinted' | 'failed';

/** A 5-10 minute paper-notebook task made from the day's study content. */
export interface NoteTask {
  id: string;
  kind: NoteTaskKind;
  titleJa: string;
  promptJa: string;
  /** English (or Japanese) text the learner works on, e.g. the sentence to analyse */
  material?: string;
  /** model answer / checkpoints shown after the learner has tried */
  modelAnswer: string[];
  estimatedMinutes: number;
  tag?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** the day's main task; the others are optional */
  main: boolean;
  selfEval?: NoteSelfEval;
  evaluatedAt?: string;
}

export type AssessmentSection = 'grammar' | 'vocabulary' | 'reading' | 'structure' | 'writingAuto' | 'writingSelf';

export interface AssessmentResult {
  id: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  sections: Partial<Record<AssessmentSection, { correct: number; total: number }>>;
  /** share of questions the learner had never answered before (1 = all unseen) */
  unseenRatio: number;
  /** typed answers the learner left as "判断できない" — in no score, kept for re-checking */
  selfCheckUnresolved?: number;
  /** target composition and difficulty estimator used (results before these existed lack them) */
  blueprintVersion?: string;
  difficultyModel?: string;
  /** what was actually asked, per section: estimated difficulty bands, unseen count, formats */
  composition?: Partial<Record<AssessmentSection, SectionComposition>>;
  /** where the questions could not follow the target composition */
  selectionNotes?: string[];
}

export interface SectionComposition {
  basic: number;
  standard: number;
  advanced: number;
  unseen: number;
  total: number;
  formats: Record<string, number>;
}

export interface SavedWordInfo {
  /** the form that appeared in the text (e.g. "running") */
  surface: string;
  /** base form (e.g. "run") */
  headword: string;
  meaningJa: string;
  partOfSpeech?: string;
  /** the word's own basic example sentence and its translation (not taken from the passage) */
  standardExampleEn?: string;
  standardExampleJa?: string;
  /** phrases the word is commonly used in */
  collocations?: string[];
  /** the sentence of the passage the word was tapped in (kept for reference only) */
  contextSentence?: string;
}

/** Today's fixed review assignment, stored on the day's LearningSession so it survives
 * interruptions and app restarts. Review is "done" when these items are answered — the size of
 * the remaining backlog is never a completion condition. */
export interface DailyReviewPlan {
  createdAt: string; // ISO timestamp
  /** ReviewItem ids assigned for today, in the order they are asked */
  itemIds: string[];
  /** answers given to plan items today (itemId -> wasCorrect) */
  results: Record<string, boolean>;
  /** plan items whose answer the learner judged themselves (left out of the objective score) */
  selfGraded?: string[];
  /** due review items (backlog) when the plan was made; the history of this drives load control */
  backlogAtStart: number;
  /** true when the backlog is large and not shrinking: more review per day, less new grammar */
  loadHigh: boolean;
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
  reviewPlan?: DailyReviewPlan;
  /** the day's notebook tasks, made once from the day's content (see noteTaskService) */
  noteTasks?: NoteTask[];
  /** minutes spent in the 5-minute busy-day mode */
  quickMinutes?: number;
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
  answerLog?: AnswerLogEntry[];
  assessments?: AssessmentResult[];
  /** an assessment in progress (v5) */
  assessmentDraft?: AssessmentDraft | null;
}
