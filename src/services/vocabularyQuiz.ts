import type { VocabularyEntry } from '../types';
import { pickRandom, shuffle } from '../utils/random';

export type VocabQuizFormat =
  | 'en-to-ja'
  | 'ja-to-en'
  | 'context'
  | 'synonym'
  | 'antonym'
  | 'collocation';

export interface VocabQuizItem {
  format: VocabQuizFormat;
  entry: VocabularyEntry;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

function blank(sentence: string, word: string): string {
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return sentence.replace(re, '___');
}

/** Picks up to `count` other entries from the pool (excluding `entry`) to serve as
 * plausible wrong answers, preferring entries of the same part of speech. */
function distractorPool(entry: VocabularyEntry, pool: VocabularyEntry[], count: number): VocabularyEntry[] {
  const others = pool.filter((e) => e.id !== entry.id);
  const samePos = others.filter((e) => e.partOfSpeech === entry.partOfSpeech);
  const source = samePos.length >= count ? samePos : others;
  return pickRandom(source, count);
}

function buildChoice4(entry: VocabularyEntry, pool: VocabularyEntry[], format: 'en-to-ja' | 'ja-to-en'): VocabQuizItem {
  const distractors = distractorPool(entry, pool, 3);
  const correctText = format === 'en-to-ja' ? entry.meaningJa : entry.word;
  const choiceTexts = shuffle([
    correctText,
    ...distractors.map((d) => (format === 'en-to-ja' ? d.meaningJa : d.word)),
  ]);
  return {
    format,
    entry,
    prompt: format === 'en-to-ja' ? entry.word : entry.meaningJa,
    choices: choiceTexts,
    correctIndex: choiceTexts.indexOf(correctText),
    explanation: `${entry.word}（${entry.partOfSpeech}）: ${entry.meaningJa}\n${entry.exampleEn}\n${entry.exampleJa}`,
  };
}

function buildContext(entry: VocabularyEntry, pool: VocabularyEntry[]): VocabQuizItem {
  const distractors = distractorPool(entry, pool, 3);
  const choiceTexts = shuffle([entry.word, ...distractors.map((d) => d.word)]);
  return {
    format: 'context',
    entry,
    prompt: blank(entry.exampleEn, entry.word),
    choices: choiceTexts,
    correctIndex: choiceTexts.indexOf(entry.word),
    explanation: `正解: ${entry.word}（${entry.meaningJa}）\n${entry.exampleEn}\n${entry.exampleJa}`,
  };
}

function buildSynonym(entry: VocabularyEntry, pool: VocabularyEntry[]): VocabQuizItem | null {
  if (!entry.synonyms || entry.synonyms.length === 0) return null;
  const correct = entry.synonyms[0];
  const distractors = distractorPool(entry, pool, 3).map((d) => d.word);
  const choiceTexts = shuffle([correct, ...distractors]);
  return {
    format: 'synonym',
    entry,
    prompt: `${entry.word} の類義語はどれ？`,
    choices: choiceTexts,
    correctIndex: choiceTexts.indexOf(correct),
    explanation: `${entry.word} ≒ ${correct}\n${entry.exampleEn}`,
  };
}

function buildAntonym(entry: VocabularyEntry, pool: VocabularyEntry[]): VocabQuizItem | null {
  if (!entry.antonyms || entry.antonyms.length === 0) return null;
  const correct = entry.antonyms[0];
  const distractors = distractorPool(entry, pool, 3).map((d) => d.word);
  const choiceTexts = shuffle([correct, ...distractors]);
  return {
    format: 'antonym',
    entry,
    prompt: `${entry.word} の反意語はどれ？`,
    choices: choiceTexts,
    correctIndex: choiceTexts.indexOf(correct),
    explanation: `${entry.word} ⇔ ${correct}`,
  };
}

function buildCollocation(entry: VocabularyEntry, pool: VocabularyEntry[]): VocabQuizItem | null {
  if (!entry.collocations || entry.collocations.length === 0) return null;
  const correct = entry.collocations[0];
  const distractorEntries = distractorPool(entry, pool, 3).filter((d) => d.collocations && d.collocations.length > 0);
  const distractors = distractorEntries.length >= 3
    ? distractorEntries.map((d) => d.collocations![0])
    : pickRandom(pool.flatMap((d) => d.collocations ?? []), 3);
  const choiceTexts = shuffle([correct, ...distractors.slice(0, 3)]);
  return {
    format: 'collocation',
    entry,
    prompt: `「${entry.meaningJa}」の意味で自然な組み合わせはどれ？`,
    choices: choiceTexts,
    correctIndex: choiceTexts.indexOf(correct),
    explanation: `${correct}（${entry.word} を使った自然な表現）`,
  };
}

/** Generates one practice question for `entry` from the given level pool. If a specific
 * format isn't requested (or isn't available for this entry), a random available format
 * is chosen so repeated practice of the same word still feels varied. */
export function generateVocabQuiz(
  entry: VocabularyEntry,
  pool: VocabularyEntry[],
  preferredFormat?: VocabQuizFormat
): VocabQuizItem {
  const builders: Record<VocabQuizFormat, () => VocabQuizItem | null> = {
    'en-to-ja': () => buildChoice4(entry, pool, 'en-to-ja'),
    'ja-to-en': () => buildChoice4(entry, pool, 'ja-to-en'),
    context: () => buildContext(entry, pool),
    synonym: () => buildSynonym(entry, pool),
    antonym: () => buildAntonym(entry, pool),
    collocation: () => buildCollocation(entry, pool),
  };

  if (preferredFormat) {
    const built = builders[preferredFormat]();
    if (built) return built;
  }

  const available: VocabQuizFormat[] = ['en-to-ja', 'ja-to-en', 'context'];
  if (entry.synonyms?.length) available.push('synonym');
  if (entry.antonyms?.length) available.push('antonym');
  if (entry.collocations?.length) available.push('collocation');

  for (const format of shuffle(available)) {
    const built = builders[format]();
    if (built) return built;
  }
  return buildChoice4(entry, pool, 'en-to-ja');
}

export function generateVocabQuizSet(entries: VocabularyEntry[], pool: VocabularyEntry[], count: number): VocabQuizItem[] {
  const chosen = pickRandom(entries, Math.min(count, entries.length));
  return chosen.map((entry) => generateVocabQuiz(entry, pool));
}
