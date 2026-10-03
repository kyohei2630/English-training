import type { GrammarPoint, Level, ReviewCategory, UnderstandingQuestion, VocabularyItem, WritingExercise } from '../types';
import { applyReviewAnswer, createReviewItem } from './reviewScheduler';
import { getReviewItemByRef, upsertReviewItem } from '../db/repositories/reviewRepository';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';
import type { ReviewItem } from '../types';
import { CUSTOM_WORD_REF_PREFIX, reviewRefIdFor, type WordLookupResult } from './wordLookup';

/**
 * Records one answer to any question in the app (correct or incorrect) as a review-deck
 * entry, creating it on first answer and re-scheduling it every time after via the
 * spaced-repetition ladder. This is the single source of truth behind SRS scheduling,
 * mastery tiers, and weakness-by-tag analysis (see masteryService / weaknessAnalysis).
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
    });
  const updated = applyReviewAnswer({ ...base, tag: base.tag ?? params.tag, level: base.level ?? params.level }, params.wasCorrect);
  await upsertReviewItem(updated);
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
  });
}

export async function recordWritingAnswer(exercise: WritingExercise, wasCorrect: boolean, userAnswer?: string): Promise<void> {
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
  });
}

export async function addWordToReview(word: VocabularyItem, materialId: string): Promise<void> {
  const refId = `vocab-${materialId}-${word.word}`;
  const existing = await getReviewItemByRef(refId);
  if (existing) return; // already in review deck

  const item = createReviewItem({
    category: 'vocabulary',
    refId,
    promptText: word.word,
    answerText: `${word.meaningJa}（${word.partOfSpeech}）`,
    explanation: word.example,
  });
  await upsertReviewItem(item);
  await addWeakWord(word.word);
}

async function addWeakWord(word: string): Promise<void> {
  const progress = await getProgress();
  if (!progress.weakWords.includes(word)) {
    await saveProgress({ ...progress, weakWords: [...progress.weakWords, word] });
  }
}

/** Adds a word looked up from any English text (WordInteractiveText) to the review deck and
 * the weak-words list, using the refId format that lets review quiz it as a real question. */
export async function addLookedUpWordToReview(result: WordLookupResult, materialId?: string): Promise<void> {
  if (result.materialItem && materialId) {
    await addWordToReview(result.materialItem, materialId);
    return;
  }
  const refId = reviewRefIdFor(result, materialId);
  if (await getReviewItemByRef(refId)) return;

  const entry = result.bankEntry;
  const pos = result.partOfSpeech ? `（${result.partOfSpeech}）` : '';
  await upsertReviewItem(
    createReviewItem({
      category: 'vocabulary',
      refId,
      promptText: result.headword,
      answerText: `${result.meaningJa ?? ''}${pos}`,
      explanation: [result.exampleEn, result.exampleJa].filter(Boolean).join('\n') || undefined,
      tag: entry?.category,
      level: entry?.level,
    })
  );
  await addWeakWord(result.headword);
}

/** Registers a word that is in no dictionary, with the meaning the learner typed in. It is
 * stored as a review-deck entry, which is also where later lookups find it (see wordLookup). */
export async function registerCustomWord(params: { word: string; meaningJa: string; partOfSpeech?: string }): Promise<void> {
  const word = params.word.trim().toLowerCase();
  const refId = `${CUSTOM_WORD_REF_PREFIX}${word}`;
  const pos = params.partOfSpeech ? `（${params.partOfSpeech}）` : '';
  const existing = await getReviewItemByRef(refId);
  const answerText = `${params.meaningJa.trim()}${pos}`;
  await upsertReviewItem(
    existing
      ? { ...existing, answerText, updatedAt: new Date().toISOString() }
      : createReviewItem({ category: 'vocabulary', refId, promptText: word, answerText })
  );
  await addWeakWord(word);
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
