import type { AbilitySkill, AssessmentSection, ReviewCategory } from './progress';
import type { Level, WritingExercise } from './material';

/** A sentence to compose, checked offline against a list of accepted answers. Used by drill
 * steps, research-unit writing and the short-writing part of assessments. */
export interface SentenceTask {
  refId: string;
  promptJa: string;
  /** accepted answers; the first is the model */
  answers: string[];
  hintJa?: string;
  /** phrases a good answer contains (feedback only) */
  keyPhrases?: string[];
  tag?: string;
  level: Level;
  research?: boolean;
}

/**
 * The outcome of a typed answer. An answer that matches a registered answer is 'correct' and
 * auto-graded. Anything else is never marked wrong automatically: the learner compares it with
 * the model ("要自己確認") and decides — or says they can't tell ('unsure'), which keeps it for
 * re-checking without counting it as wrong.
 */
export type SelfCheckStatus = 'correct' | 'incorrect' | 'unsure';

export interface TypedAnswerResult {
  status: SelfCheckStatus;
  grading: 'auto' | 'self';
  /** matched a registered answer exactly (after normalisation) */
  exact: boolean;
  hintUsed: boolean;
  userAnswer: string;
}

/** Provisional, rule-based estimate (services/questionMetadata.ts) — not a measured difficulty. */
export type EstimatedDifficulty = 'basic' | 'standard' | 'advanced';

/** What an assessment question is, for keeping assessments comparable. Tag and format are the
 * question's existing ones; only the difficulty is estimated. */
export interface AssessmentItemMeta {
  tag?: string;
  format: string;
  difficulty: EstimatedDifficulty;
  /** estimated load the difficulty band was derived from */
  load: number;
  reasons: string[];
}

interface AssessmentItemBase {
  section: AssessmentSection;
  refId: string;
  /** never answered before this assessment — fixed when the assessment starts */
  unseen: boolean;
  meta?: AssessmentItemMeta;
}

export interface ChoiceAssessmentItem extends AssessmentItemBase {
  kind: 'choice';
  category: ReviewCategory;
  tag?: string;
  level: Level;
  skill?: AbilitySkill;
  contextTitle?: string;
  contextLines?: string[];
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

/** Short composition the app can grade offline when it matches a registered answer. */
export interface SentenceAssessmentItem extends AssessmentItemBase {
  kind: 'sentence';
  task: SentenceTask;
}

/** Free writing the app cannot grade: the learner compares with samples (reported as 参考値). */
export interface FreeAssessmentItem extends AssessmentItemBase {
  kind: 'free';
  exercise: Extract<WritingExercise, { type: 'free' | 'translate' }>;
}

export type AssessmentItem = ChoiceAssessmentItem | SentenceAssessmentItem | FreeAssessmentItem;

/** What has been answered for one assessment item. `status` is set once the answer is final;
 * before that (typed answer submitted, self-check not decided yet) the submission is kept so
 * a resumed assessment shows the same state instead of letting the question be answered again. */
export interface AssessmentDraftAnswer {
  choiceIndex?: number;
  userAnswer?: string;
  exact?: boolean;
  status?: SelfCheckStatus;
  grading?: 'auto' | 'self';
}

/**
 * An assessment in progress, saved after every answer so it survives closing the app. Its
 * questions (and whether each was unseen) are fixed at the start. Answers are applied to the
 * review deck, answer log and results only when it is finished; an unfinished draft counts
 * for nothing.
 */
export interface AssessmentDraft {
  id: 'current';
  /** id the finished AssessmentResult will get (finishing twice can't create two results) */
  resultId: string;
  startedAt: string;
  updatedAt: string;
  /** level the questions were chosen for */
  level: Level;
  items: AssessmentItem[];
  answers: Record<string, AssessmentDraftAnswer>;
  /** refIds already applied to the review deck while finishing (so a retry doesn't apply twice) */
  appliedRefIds: string[];
  /** where the questions could not follow the target composition (e.g. too few unseen 応用) */
  selectionNotes?: string[];
}
