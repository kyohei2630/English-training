import type { GrammarPoint, UnderstandingQuestion, VocabularyItem, WritingExercise } from '../types';
import { createReviewItem } from './reviewScheduler';
import { getReviewItemByRef, upsertReviewItem } from '../db/repositories/reviewRepository';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';

export async function recordWrongQuestion(question: UnderstandingQuestion): Promise<void> {
  const existing = await getReviewItemByRef(question.id);
  const item = existing
    ? { ...existing }
    : createReviewItem({
        category: 'reading',
        refId: question.id,
        promptText: question.question,
        answerText: question.choices[question.correctIndex],
        explanation: question.explanation,
      });
  await upsertReviewItem(item);
}

export async function recordIncompleteWriting(exercise: WritingExercise, userAnswer: string): Promise<void> {
  const answerText =
    exercise.type === 'reorder'
      ? exercise.correctOrder.join(' ')
      : exercise.type === 'fillblank'
        ? exercise.answers[0]
        : exercise.sampleAnswers[0];

  const existing = await getReviewItemByRef(exercise.id);
  const item = existing
    ? { ...existing }
    : createReviewItem({
        category: 'writing',
        refId: exercise.id,
        promptText: exercise.instructionJa,
        answerText,
        explanation: userAnswer ? `あなたの回答: ${userAnswer}` : undefined,
      });
  await upsertReviewItem(item);
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

  const progress = await getProgress();
  if (!progress.weakWords.includes(word.word)) {
    await saveProgress({ ...progress, weakWords: [...progress.weakWords, word.word] });
  }
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
