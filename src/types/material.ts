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
  | 'academic-writing'
  | 'toeic-email'
  | 'toeic-notice'
  | 'toeic-advertisement'
  | 'toeic-schedule'
  | 'toeic-memo'
  | 'toeic-article'
  | 'toeic-report'
  | 'toeic-announcement';

export interface VocabularyItem {
  word: string;
  partOfSpeech: string;
  meaningJa: string;
  example: string;
}

/** Sentence structure breakdown for visualizing English syntax (subject / clause / verb / object etc.) */
export interface SentenceStructureSegment {
  text: string;
  role: string;
}

export interface SentenceStructure {
  sentence: string;
  translationJa: string;
  segments: SentenceStructureSegment[];
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
  /** ids into the independent vocabulary bank (src/data/vocabulary) that appear in this material */
  vocabularyRefs?: string[];
  /** optional visual sentence-structure breakdowns for key sentences in this material */
  structureBreakdowns?: SentenceStructure[];
}

export type ReadingSkillTag =
  | 'detail'
  | 'inference'
  | 'main-idea'
  | 'title'
  | 'vocabulary-in-context'
  | 'reference'
  | 'structure'
  | 'cause-effect';

export interface UnderstandingQuestion {
  id: string;
  materialId: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  /** what kind of reading skill this question exercises, used for weakness analysis */
  skillTag?: ReadingSkillTag;
}

interface WritingExerciseBase {
  id: string;
  level: Level;
  instructionJa: string;
  /** topic tag for weakness analysis, e.g. 'passive-voice', 'toeic-business' */
  tag?: string;
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
  /** phrases that must appear for the answer to count as acceptable, used by the graded evaluator */
  keyPhrases?: string[];
  /** additional full sentences that should also be accepted as correct */
  acceptableAnswers?: string[];
}

export interface FreeWritingExercise extends WritingExerciseBase {
  type: 'free';
  promptJa: string;
  sampleAnswers: string[];
  keyExpressions: string[];
  grammarPoints: string[];
  keyPhrases?: string[];
  acceptableAnswers?: string[];
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

// ---------------------------------------------------------------------------
// Vocabulary (independent word bank)
// ---------------------------------------------------------------------------

export type VocabularyCategory =
  | 'daily'
  | 'academic'
  | 'business'
  | 'medical-noun'
  | 'medical-verb'
  | 'medical-adjective'
  | 'medical-device'
  | 'science'
  | 'research'
  | 'toeic-business'
  | 'toeic-office'
  | 'toeic-travel'
  | 'grammar-function';

export interface VocabularyEntry {
  id: string;
  word: string;
  meaningJa: string;
  partOfSpeech: string;
  pronunciation: string;
  exampleEn: string;
  exampleJa: string;
  level: Level;
  category: VocabularyCategory;
  relatedExpressions?: string[];
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

// ---------------------------------------------------------------------------
// Grammar (independent lesson + question bank)
// ---------------------------------------------------------------------------

export interface GrammarExampleSentence {
  en: string;
  ja: string;
}

export interface GrammarLesson {
  id: string;
  level: Level;
  title: string;
  /** why the rule works this way, explained in Japanese */
  explanationJa: string;
  examples: GrammarExampleSentence[];
  tag: string;
}

export type GrammarQuestionFormat =
  | 'choice4'
  | 'truefalse'
  | 'reorder'
  | 'fillblank'
  | 'correct-sentence'
  | 'error-correction'
  | 'ja-to-en'
  | 'structure';

export interface GrammarQuestion {
  id: string;
  lessonId: string;
  level: Level;
  format: GrammarQuestionFormat;
  tag: string;
  /** the question prompt (English sentence with blank, or instruction) */
  question: string;
  /** used by choice4 / truefalse / correct-sentence / error-correction */
  choices?: string[];
  /** used by reorder: shuffled tokens to reassemble */
  tokens?: string[];
  correctAnswer: string;
  explanation: string;
  /** why each wrong choice is wrong, in Japanese, keyed by choice text */
  whyOthersWrong?: string[];
  translationJa?: string;
}

// ---------------------------------------------------------------------------
// Grammar Theory (independent from GrammarLesson — a much richer "learn the
// concept before practicing" explanation, browsable on its own and shown in
// Daily Training before the quiz. Linked to GrammarQuestion/GrammarLesson by
// `tag`, the same tag taxonomy already used for weakness analysis, so no new
// cross-reference id scheme is needed.)
// ---------------------------------------------------------------------------

export interface GrammarTheoryRule {
  title: string;
  explanation: string;
  formula?: string;
}

export interface GrammarTheoryExample {
  english: string;
  japanese: string;
  explanation?: string;
  /** reuses the same structure-visualization the Reading feature uses, so a
   * theory example can show "S / V / O" style role breakdowns when useful */
  structureBreakdown?: SentenceStructure;
}

export interface GrammarTheoryMiniCheckItem {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarTheory {
  id: string;
  level: Level;
  /** links this theory to GrammarQuestion.tag / GrammarLesson.tag so Theory <-> Practice
   * navigation works off the existing tag taxonomy instead of a new id scheme */
  tag: string;
  title: string;
  shortDescription: string;
  /** "この文法は何？" — what the grammar point is for, in plain Japanese */
  concept: string;
  /** "基本の形" — e.g. "主語 + be動詞 + 動詞ing" */
  basicForm?: string;
  rules: GrammarTheoryRule[];
  examples: GrammarTheoryExample[];
  keyPoints: string[];
  commonMistakes?: string[];
  relatedTermIds?: string[];
  relatedTheoryIds?: string[];
  miniCheck: GrammarTheoryMiniCheckItem[];
}

// ---------------------------------------------------------------------------
// Grammar term dictionary (用語 -> 一言でいうと -> 詳しい説明 -> 例文 -> 該当箇所 -> 関連用語)
// ---------------------------------------------------------------------------

export type GrammarTermCategory = 'basic' | 'sentence-structure' | 'grammar-point';

export interface GrammarTermExample {
  english: string;
  japanese: string;
  /** which words/phrases in the example the term applies to, e.g. "a book = 目的語" */
  breakdown: string[];
}

export interface GrammarTerm {
  id: string;
  term: string;
  category: GrammarTermCategory;
  oneLiner: string;
  explanation: string;
  example: GrammarTermExample;
  relatedTermIds?: string[];
}

// ---------------------------------------------------------------------------
// TOEIC
// ---------------------------------------------------------------------------

export type ToeicPart = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ToeicQuestionBase {
  id: string;
  part: ToeicPart;
  tag: string;
  explanation: string;
}

export interface ToeicPart1Question extends ToeicQuestionBase {
  part: 1;
  /** textual description standing in for a photograph, since no image assets are used */
  sceneDescriptionJa: string;
  sceneDescriptionEn: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface ToeicPart2Question extends ToeicQuestionBase {
  part: 2;
  question: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

export interface ToeicConversationQuestion {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface ToeicPart3Question extends ToeicQuestionBase {
  part: 3;
  conversation: string[];
  questions: ToeicConversationQuestion[];
}

export interface ToeicPart4Question extends ToeicQuestionBase {
  part: 4;
  talk: string[];
  questions: ToeicConversationQuestion[];
}

export interface ToeicPart5Question extends ToeicQuestionBase {
  part: 5;
  sentence: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  translationJa: string;
}

export interface ToeicPart6Question extends ToeicQuestionBase {
  part: 6;
  passageTitle: string;
  passage: string[];
  blanks: {
    choices: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
  }[];
}

export interface ToeicPart7Question extends ToeicQuestionBase {
  part: 7;
  passageTitle: string;
  passageType: MaterialCategory;
  passage: string[];
  questions: ToeicConversationQuestion[];
}

export type ToeicQuestion =
  | ToeicPart1Question
  | ToeicPart2Question
  | ToeicPart3Question
  | ToeicPart4Question
  | ToeicPart5Question
  | ToeicPart6Question
  | ToeicPart7Question;
