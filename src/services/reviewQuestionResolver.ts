import type { GrammarQuestion, Level, ReviewItem, ToeicPart, WritingExercise } from '../types';
import { loadGrammarLevel } from '../data/grammar/loader';
import { loadReadingLevel } from '../data/reading/loader';
import { loadToeicPart } from '../data/toeic/loader';
import { loadVocabularyLevel } from '../data/vocabulary/loader';
import { loadWritingById } from '../data/writing/loader';
import { flattenToeicQuestions } from './toeicService';
import { generateVocabQuiz } from './vocabularyQuiz';

export interface ReviewChoiceQuestion {
  contextTitle?: string;
  contextLines?: string[];
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

/** The original, answerable question behind a review-deck entry. `grammar` / `writing`
 * reuse the practice views as-is (they record the answer themselves); `choice` is a
 * plain multiple-choice question that the review screen records. */
export type ResolvedReviewQuestion =
  | { kind: 'grammar'; question: GrammarQuestion }
  | { kind: 'writing'; exercise: WritingExercise }
  | { kind: 'choice'; question: ReviewChoiceQuestion };

function levelFromId(pattern: RegExp, id: string): Level | null {
  const match = pattern.exec(id);
  if (!match) return null;
  const level = Number(match[1]);
  return level >= 1 && level <= 6 ? (level as Level) : null;
}

/** Looks up the source question for a review item via its refId. Returns null for
 * entries without an answerable source (e.g. words/sentences bookmarked while reading),
 * which the review screen shows as a flip card instead. */
export async function resolveReviewQuestion(item: ReviewItem): Promise<ResolvedReviewQuestion | null> {
  const id = item.refId;
  switch (item.category) {
    case 'grammar': {
      const level = levelFromId(/^grammar_l(\d)_/, id);
      if (!level) return null;
      const { questions } = await loadGrammarLevel(level);
      const question = questions.find((q) => q.id === id);
      return question ? { kind: 'grammar', question } : null;
    }
    case 'writing': {
      const exercise = await loadWritingById(id);
      return exercise ? { kind: 'writing', exercise } : null;
    }
    case 'vocabulary': {
      const level = levelFromId(/^vocabulary_l(\d)_/, id);
      if (!level) return null;
      const pool = await loadVocabularyLevel(level);
      const entry = pool.find((e) => e.id === id);
      if (!entry) return null;
      const quiz = generateVocabQuiz(entry, pool);
      return {
        kind: 'choice',
        question: { prompt: quiz.prompt, choices: quiz.choices, correctIndex: quiz.correctIndex, explanation: quiz.explanation },
      };
    }
    case 'reading': {
      const level = levelFromId(/^q-l(\d)-/, id);
      if (!level) return null;
      const { materials, questions } = await loadReadingLevel(level);
      const question = questions.find((q) => q.id === id);
      if (!question) return null;
      const material = materials.find((m) => m.id === question.materialId);
      return {
        kind: 'choice',
        question: {
          contextTitle: material?.title,
          contextLines: material?.content,
          prompt: question.question,
          choices: question.choices,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
        },
      };
    }
    case 'toeic': {
      const match = /^toeic_p(\d)_/.exec(id);
      const part = match ? Number(match[1]) : NaN;
      if (!(part >= 1 && part <= 7)) return null;
      const flat = flattenToeicQuestions(await loadToeicPart(part as ToeicPart));
      const found = flat.find((q) => q.id === id);
      if (!found) return null;
      return {
        kind: 'choice',
        question: {
          contextTitle: found.passageTitle,
          contextLines: found.contextLines,
          prompt: found.prompt,
          choices: found.choices,
          correctIndex: found.correctIndex,
          explanation: found.explanation,
        },
      };
    }
  }
}
