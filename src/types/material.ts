export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type MaterialCategory =
  | 'daily'
  | 'grammar'
  | 'general'
  | 'anatomy'
  | 'physiology'
  | 'cardiovascular'
  | 'respiratory'
  | 'medical-device'
  | 'hemodynamics'
  | 'abstract'
  | 'introduction'
  | 'methods'
  | 'results'
  | 'discussion'
  | 'academic-writing';

export interface VocabularyItem {
  word: string;
  partOfSpeech: string;
  meaningJa: string;
  example: string;
}

export interface GrammarPoint {
  sentence: string;
  translationJa: string;
  subject: string;
  verb: string;
  object?: string;
  modifiers?: string[];
  notes: string[];
}

export interface ReadingMaterial {
  id: string;
  level: Level;
  category: MaterialCategory;
  title: string;
  topic: string;
  estimatedMinutes: number;
  /** paragraphs of English text */
  content: string[];
  vocabulary: VocabularyItem[];
  grammarPoints: GrammarPoint[];
}

export interface UnderstandingQuestion {
  id: string;
  materialId: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

interface WritingExerciseBase {
  id: string;
  level: Level;
  instructionJa: string;
}

export interface ReorderExercise extends WritingExerciseBase {
  type: 'reorder';
  tokens: string[];
  correctOrder: string[];
  translationJa: string;
}

export interface FillBlankExercise extends WritingExerciseBase {
  type: 'fillblank';
  /** sentence with ___ marking the blank(s) */
  sentence: string;
  answers: string[];
  translationJa: string;
  hint?: string;
}

export interface TranslateExercise extends WritingExerciseBase {
  type: 'translate';
  promptJa: string;
  sampleAnswers: string[];
  keyPoints: string[];
}

export interface FreeWritingExercise extends WritingExerciseBase {
  type: 'free';
  promptJa: string;
  sampleAnswers: string[];
  keyExpressions: string[];
  grammarPoints: string[];
}

export type WritingExercise =
  | ReorderExercise
  | FillBlankExercise
  | TranslateExercise
  | FreeWritingExercise;

export interface LevelInfo {
  level: Level;
  name: string;
  descriptionJa: string;
  topics: string[];
  totalDays: number;
}
