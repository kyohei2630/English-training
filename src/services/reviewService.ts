import type {
  AbilitySkill,
  AnswerSource,
  GrammarPoint,
  Level,
  ReviewCategory,
  UnderstandingQuestion,
  WritingExercise,
} from '../types';
import { answerKind, applyReviewAnswer, createReviewItem } from './reviewScheduler';
import { getReviewItemByRef, upsertReviewItem } from '../db/repositories/reviewRepository';
import { addAnswerLog } from '../db/repositories/answerLogRepository';
import { generateId } from '../utils/id';
import { todayLocalISODate } from '../utils/date';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';
import type { ReviewItem, SavedWordInfo } from '../types';
import {
  CUSTOM_WORD_REF_PREFIX,
  formatStandardExample,
  PART_OF_SPEECH_JA,
  reviewRefIdFor,
  type WordLookupResult,
} from './wordLookup';

/**
 * Records one answer to any question in the app (correct or incorrect) as a review-deck
 * entry, creating it on first answer and re-scheduling it every time after via the
 * spaced-repetition ladder. This is the single source of truth behind SRS scheduling,
 * mastery tiers, and weakness-by-tag analysis (see masteryService / weaknessAnalysis).
 * A question answered correctly the first time keeps its record but is not queued for
 * review; a wrong answer (now or later) queues it.
 */
export async function recordAnswer(params: {
  category: ReviewCategory;
  refId: string;
  promptText: string;
  answerText: string;
  explanation?: string;
  tag?: string;
  level?: Level;
  wasCorrect: boolean;
  /** where the answer was given (default: normal practice) */
  source?: AnswerSource;
  /** 'self' when the learner judged the answer themselves (default: 'auto') */
  grading?: 'auto' | 'self';
  skill?: AbilitySkill;
}): Promise<ReviewItem> {
  const existing = await getReviewItemByRef(params.refId);
  const base: ReviewItem =
    existing ??
    createReviewItem({
      category: params.category,
      refId: params.refId,
      promptText: params.promptText,
      answerText: params.answerText,
      explanation: params.explanation,
      tag: params.tag,
      level: params.level,
      inReview: !params.wasCorrect,
    });
  return saveAnswer(
    { ...base, tag: base.tag ?? params.tag, level: base.level ?? params.level, skill: base.skill ?? params.skill },
    params.wasCorrect,
    { source: params.source ?? 'practice', grading: params.grading ?? 'auto' }
  );
}

/** Tallies a self-graded answer separately, so objective accuracy can leave it out. */
function addSelfGraded(prev: ReviewItem['selfGraded'], wasCorrect: boolean, kind: 'first' | 'repeat' | 'delayed'): NonNullable<ReviewItem['selfGraded']> {
  const s = prev ?? { correct: 0, incorrect: 0, delayedAttempts: 0, delayedCorrect: 0 };
  return {
    correct: s.correct + (wasCorrect ? 1 : 0),
    incorrect: s.incorrect + (wasCorrect ? 0 : 1),
    first: s.first || kind === 'first',
    delayedAttempts: s.delayedAttempts + (kind === 'delayed' ? 1 : 0),
    delayedCorrect: s.delayedCorrect + (kind === 'delayed' && wasCorrect ? 1 : 0),
  };
}

/** Applies one answer to an item (scheduling + evidence counters) and appends it to the answer
 * log. Every answer in the app goes through here, directly or via recordAnswer. */
export async function saveAnswer(
  item: ReviewItem,
  wasCorrect: boolean,
  options: { source: AnswerSource; grading?: 'auto' | 'self' }
): Promise<ReviewItem> {
  const today = todayLocalISODate();
  const naturalKind = answerKind(item, today);
  const kind = options.source === 'assessment' ? 'assessment' : naturalKind;
  const applied = applyReviewAnswer(item, wasCorrect, today);
  const updated: ReviewItem =
    options.grading === 'self'
      ? { ...applied, selfGraded: addSelfGraded(item.selfGraded, wasCorrect, naturalKind) }
      : applied;
  await upsertReviewItem(updated);
  await addAnswerLog({
    id: generateId('ans'),
    date: today,
    at: updated.updatedAt,
    category: item.category,
    refId: item.refId,
    tag: item.tag,
    level: item.level,
    wasCorrect,
    kind,
    source: options.source,
    grading: options.grading ?? 'auto',
    skill: item.skill,
  });
  return updated;
}

export async function recordUnderstandingAnswer(
  question: UnderstandingQuestion,
  wasCorrect: boolean,
  level?: Level
): Promise<void> {
  await recordAnswer({
    category: 'reading',
    refId: question.id,
    promptText: question.question,
    answerText: question.choices[question.correctIndex],
    explanation: question.explanation,
    tag: question.skillTag,
    level,
    wasCorrect,
    skill: question.skillTag === 'structure' ? 'structure' : level === 5 ? 'research' : undefined,
  });
}

export async function recordWritingAnswer(
  exercise: WritingExercise,
  wasCorrect: boolean,
  userAnswer?: string,
  grading?: 'auto' | 'self'
): Promise<void> {
  const answerText =
    exercise.type === 'reorder'
      ? exercise.correctOrder.join(' ')
      : exercise.type === 'fillblank'
        ? exercise.answers[0]
        : exercise.sampleAnswers[0];

  await recordAnswer({
    category: 'writing',
    refId: exercise.id,
    promptText: exercise.instructionJa,
    answerText,
    explanation: userAnswer ? `あなたの回答: ${userAnswer}` : undefined,
    tag: exercise.tag,
    level: exercise.level,
    wasCorrect,
    // Free-form answers, and answers matching no registered one, are judged by the learner.
    grading: grading ?? (exercise.type === 'translate' || exercise.type === 'free' ? 'self' : 'auto'),
    skill: exercise.id.startsWith('rs-') || exercise.level === 5 ? 'research' : undefined,
  });
}

async function addWeakWord(word: string): Promise<void> {
  const progress = await getProgress();
  if (!progress.weakWords.includes(word)) {
    await saveProgress({ ...progress, weakWords: [...progress.weakWords, word] });
  }
}

function wordAnswerText(meaningJa: string, partOfSpeech?: string): string {
  return partOfSpeech ? `${meaningJa}（${PART_OF_SPEECH_JA[partOfSpeech] ?? partOfSpeech}）` : meaningJa;
}

/** Adds a word looked up from any English text (WordInteractiveText) to the review deck and the
 * weak-words list in one tap: the word, its base form, meaning, part of speech, its standard
 * example + translation + collocations, and (for reference) the sentence it was tapped in. The
 * explanation is the standard example, so review practises the word independently of the passage.
 * The refId format lets review quiz it as a real question. */
export async function addLookedUpWordToReview(
  result: WordLookupResult,
  options: { materialId?: string; contextSentence?: string } = {}
): Promise<void> {
  const refId = reviewRefIdFor(result, options.materialId);
  if (await getReviewItemByRef(refId)) return; // already in review deck

  const meaningJa = result.meaningJa ?? '';
  const word: SavedWordInfo = {
    surface: result.surface,
    headword: result.headword,
    meaningJa,
    partOfSpeech: result.partOfSpeech,
    standardExampleEn: result.standardExampleEn,
    standardExampleJa: result.standardExampleJa,
    collocations: result.collocations && [...result.collocations],
    contextSentence: options.contextSentence,
  };
  await upsertReviewItem({
    ...createReviewItem({
      category: 'vocabulary',
      refId,
      promptText: result.headword,
      answerText: wordAnswerText(meaningJa, result.partOfSpeech),
      explanation: formatStandardExample(result) || undefined,
      tag: result.bankEntry?.category,
      level: result.bankEntry?.level,
    }),
    word,
  });
  await addWeakWord(result.headword);
}

/** Registers a word that is in no dictionary, with the meaning the learner typed in. It is
 * stored as a review-deck entry, which is also where later lookups find it (see wordLookup). */
export async function registerCustomWord(params: {
  word: string;
  surface: string;
  meaningJa: string;
  partOfSpeech?: string;
  contextSentence?: string;
}): Promise<void> {
  const headword = params.word.trim().toLowerCase();
  const refId = `${CUSTOM_WORD_REF_PREFIX}${headword}`;
  const meaningJa = params.meaningJa.trim();
  const word: SavedWordInfo = {
    surface: params.surface,
    headword,
    meaningJa,
    partOfSpeech: params.partOfSpeech,
    contextSentence: params.contextSentence,
  };
  const answerText = wordAnswerText(meaningJa, params.partOfSpeech);
  const existing = await getReviewItemByRef(refId);
  await upsertReviewItem(
    existing
      ? { ...existing, answerText, word, updatedAt: new Date().toISOString() }
      : {
          ...createReviewItem({
            category: 'vocabulary',
            refId,
            promptText: headword,
            answerText,
            explanation: params.contextSentence,
          }),
          word,
        }
  );
  await addWeakWord(headword);
}

export async function addGrammarToReview(point: GrammarPoint, materialId: string): Promise<void> {
  const refId = `grammar-${materialId}-${point.sentence}`;
  const existing = await getReviewItemByRef(refId);
  if (existing) return;

  const item = createReviewItem({
    category: 'grammar',
    refId,
    promptText: point.sentence,
    answerText: point.translationJa,
    explanation: point.notes.join(' / '),
  });
  await upsertReviewItem(item);

  const progress = await getProgress();
  const label = point.sentence.slice(0, 30);
  if (!progress.weakGrammar.includes(label)) {
    await saveProgress({ ...progress, weakGrammar: [...progress.weakGrammar, label] });
  }
}
