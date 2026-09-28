import type { GrammarPoint, GrammarQuestion, Level, ReadingMaterial, ReviewItem, ToeicPart, WritingExercise } from '../types';
import { loadGrammarLevel } from '../data/grammar/loader';
import { loadReadingLevel } from '../data/reading/loader';
import { loadToeicPart } from '../data/toeic/loader';
import { loadVocabularyLevel } from '../data/vocabulary/loader';
import { loadWritingById } from '../data/writing/loader';
import { flattenToeicQuestions } from './toeicService';
import { generateVocabQuiz } from './vocabularyQuiz';
import { pickRandom, shuffle } from '../utils/random';

export interface ReviewChoiceQuestion {
  contextTitle?: string;
  contextLines?: string[];
  /** reading passages are shown as paragraphs in their own card above the question, like the Reading step */
  contextIsPassage?: boolean;
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

/** Finds the reading material a bookmark refId ("vocab-l3-001-word" / "grammar-l3-001-sentence")
 * belongs to, and returns it with the part of the refId after the material id. */
async function findBookmarkSource(
  prefix: 'vocab' | 'grammar',
  refId: string
): Promise<{ material: ReadingMaterial; rest: string } | null> {
  const level = levelFromId(new RegExp(`^${prefix}-l(\\d)-`), refId);
  if (!level) return null;
  const { materials } = await loadReadingLevel(level);
  const material = materials.find((m) => refId.startsWith(`${prefix}-${m.id}-`));
  return material ? { material, rest: refId.slice(`${prefix}-${material.id}-`.length) } : null;
}

const MAX_REORDER_TOKENS = 8;

/** Turns a bookmarked key sentence into a Writing-style reorder exercise. Long sentences are
 * split into at most MAX_REORDER_TOKENS chunks so the puzzle stays manageable on a phone. */
function grammarPointToReorder(point: GrammarPoint, refId: string, level: Level): WritingExercise {
  const words = point.sentence.trim().replace(/[.!?]$/, '').split(/\s+/);
  const chunkSize = Math.ceil(words.length / MAX_REORDER_TOKENS);
  const correctOrder: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    correctOrder.push(words.slice(i, i + chunkSize).join(' '));
  }
  return {
    id: refId,
    type: 'reorder',
    level,
    instructionJa: '日本語に合うように並び替えて、英文を完成させましょう。',
    tokens: correctOrder,
    correctOrder,
    translationJa: point.translationJa,
  };
}

/** Looks up the source question for a review item via its refId. Returns null only when the
 * source content no longer exists, which the review screen shows as a flip card instead. */
export async function resolveReviewQuestion(item: ReviewItem): Promise<ResolvedReviewQuestion | null> {
  const id = item.refId;
  switch (item.category) {
    case 'grammar': {
      if (id.startsWith('grammar-')) {
        const source = await findBookmarkSource('grammar', id);
        const point = source?.material.grammarPoints.find((p) => p.sentence === source.rest);
        return source && point
          ? { kind: 'writing', exercise: grammarPointToReorder(point, id, source.material.level) }
          : null;
      }
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
      if (id.startsWith('vocab-')) {
        const source = await findBookmarkSource('vocab', id);
        const word = source?.material.vocabulary.find((v) => v.word === source.rest);
        if (!source || !word) return null;
        // Distractors come from the same passage's word list, topped up from the level's word bank.
        let distractors = source.material.vocabulary.filter((v) => v.word !== word.word).map((v) => v.meaningJa);
        if (distractors.length < 3) {
          const bank = await loadVocabularyLevel(source.material.level);
          distractors = [...distractors, ...bank.filter((e) => e.word !== word.word).map((e) => e.meaningJa)];
        }
        const uniqueDistractors = [...new Set(distractors)].filter((m) => m !== word.meaningJa);
        const choices = shuffle([word.meaningJa, ...pickRandom(uniqueDistractors, 3)]);
        return {
          kind: 'choice',
          question: {
            prompt: word.word,
            choices,
            correctIndex: choices.indexOf(word.meaningJa),
            explanation: `${word.word}（${word.partOfSpeech}）: ${word.meaningJa}\n${word.example}`,
          },
        };
      }
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
          contextIsPassage: true,
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
