/**
 * Prints the estimated-difficulty distribution of every assessable pool, per Level, with sample
 * questions per band — for reviewing the provisional estimator.
 * Usage: npx tsx scripts/report-difficulty.ts [--samples]
 */
import type { Level } from '../src/types';
import { loadGrammarLevel } from '../src/data/grammar/loader';
import { loadVocabularyLevel } from '../src/data/vocabulary/loader';
import { loadReadingLevel } from '../src/data/reading/loader';
import { loadSentenceBuildDrills } from '../src/data/sentenceBuilding/loader';
import {
  drillStepLoad,
  grammarLoad,
  readingLoad,
  vocabularyLoad,
  withDifficulty,
  type Difficulty,
  type QuestionMeta,
} from '../src/services/questionMetadata';

const showSamples = process.argv.includes('--samples');
const levels: Level[] = [1, 2, 3, 4, 5, 6];
const fmt = <T,>(m: Map<T, QuestionMeta>) => {
  const c = { basic: 0, standard: 0, advanced: 0 } as Record<Difficulty, number>;
  for (const v of m.values()) c[v.difficulty]++;
  return `基礎 ${c.basic} / 標準 ${c.standard} / 応用 ${c.advanced}`;
};
const samples = <T,>(m: Map<T, QuestionMeta>, label: (t: T) => string) => {
  if (!showSamples) return;
  for (const d of ['basic', 'standard', 'advanced'] as Difficulty[]) {
    [...m].filter(([, v]) => v.difficulty === d).slice(0, 2).forEach(([t, v]) => console.log(`    ${d} ${v.load}: ${label(t)} → ${v.reasons.join('、')}`));
  }
};

for (const level of levels) {
  const { questions } = await loadGrammarLevel(level);
  const grammar = withDifficulty(questions.filter((q) => q.choices?.includes(q.correctAnswer) && q.format !== 'structure'), grammarLoad);
  const vocab = withDifficulty(await loadVocabularyLevel(level), vocabularyLoad);
  const { questions: rq, materials } = await loadReadingLevel(level);
  const reading = withDifficulty(rq, (q) => readingLoad(q, materials.find((m) => m.id === q.materialId)));
  console.log(`\nLevel ${level}`);
  console.log(`  文法(実力確認の対象) ${fmt(grammar)}`);
  samples(grammar, (q) => `${q.id} [${q.format}] ${q.question.slice(0, 60)}`);
  console.log(`  語彙                 ${fmt(vocab)}`);
  samples(vocab, (v) => `${v.word} (${v.category})`);
  console.log(`  読解                 ${fmt(reading)}`);
  samples(reading, (q) => q.question.slice(0, 60));
}

const drills = await loadSentenceBuildDrills();
for (const level of levels) {
  const steps = drills.filter((d) => d.level === level).flatMap((d) => d.steps.map((_, i) => ({ d, i })));
  if (steps.length) console.log(`英文組み立て L${level} ${fmt(withDifficulty(steps, (s) => drillStepLoad(s.d, s.i)))}`);
}
