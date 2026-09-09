/**
 * Content validation for the learning content bundled in src/data.
 * Run with `npm run validate-content`.
 *
 * Checks (fatal — exit code 1):
 *   - duplicate IDs within and across content types
 *   - missing required fields (question text, choices, answers, explanations, level, etc.)
 *   - invalid level / lessonId / TOEIC part references
 *   - duplicate vocabulary words
 *
 * Reports (non-fatal, printed as a status table):
 *   - actual content counts vs. the target minimums from the spec
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ALL_MATERIALS } from '../src/data/materials';
import { ALL_QUESTIONS } from '../src/data/questions';
import { ALL_WRITING } from '../src/data/writing';
import { ALL_GRAMMAR_LESSONS, ALL_GRAMMAR_QUESTIONS } from '../src/data/grammar';
import { ALL_VOCABULARY } from '../src/data/vocabulary';
import { ALL_TOEIC_QUESTIONS, TOEIC_BY_PART } from '../src/data/toeic';
import { LEVELS } from '../src/data/levels';

function countByLevel<T extends { level: number }>(items: T[]): Record<1 | 2 | 3 | 4 | 5 | 6, number> {
  const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const item of items) {
    if (item.level >= 1 && item.level <= 6) result[item.level as 1 | 2 | 3 | 4 | 5 | 6] += 1;
  }
  return result;
}

const VALID_LEVELS = new Set(LEVELS.map((l) => l.level));
const errors: string[] = [];
const warnings: string[] = [];

function checkDuplicates(ids: string[], label: string) {
  const seen = new Map<string, number>();
  for (const id of ids) {
    seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) errors.push(`[重複ID] ${label}: "${id}" が ${count} 回使用されています`);
  }
}

// ---------------------------------------------------------------------------
// Materials / Reading questions / Writing
// ---------------------------------------------------------------------------
checkDuplicates(ALL_MATERIALS.map((m) => m.id), 'materials');
for (const m of ALL_MATERIALS) {
  if (!VALID_LEVELS.has(m.level)) errors.push(`[不正なlevel] material ${m.id}: level=${m.level}`);
  if (!m.title || !m.content || m.content.length === 0) errors.push(`[教材データ欠落] material ${m.id}: title/content が不足しています`);
}

checkDuplicates(ALL_QUESTIONS.map((q) => q.id), 'questions');
const materialIds = new Set(ALL_MATERIALS.map((m) => m.id));
for (const q of ALL_QUESTIONS) {
  if (!materialIds.has(q.materialId)) errors.push(`[参照エラー] question ${q.id}: materialId "${q.materialId}" が存在しません`);
  if (!q.question || !q.choices || q.choices.length !== 4 || !q.explanation) {
    errors.push(`[問題データ欠落] question ${q.id}: question/choices(4)/explanation が不足しています`);
  }
}

checkDuplicates(ALL_WRITING.map((w) => w.id), 'writing');
for (const w of ALL_WRITING) {
  if (!VALID_LEVELS.has(w.level)) errors.push(`[不正なlevel] writing ${w.id}: level=${w.level}`);
  if (w.type === 'reorder' && (!w.tokens?.length || !w.correctOrder?.length)) {
    errors.push(`[Writing answer欠落] ${w.id}: tokens/correctOrder が不足しています`);
  }
  if (w.type === 'fillblank' && (!w.sentence || !w.answers?.length)) {
    errors.push(`[Writing answer欠落] ${w.id}: sentence/answers が不足しています`);
  }
  if ((w.type === 'translate' || w.type === 'free') && (!w.promptJa || !w.sampleAnswers?.length)) {
    errors.push(`[Writing answer欠落] ${w.id}: promptJa/sampleAnswers が不足しています`);
  }
}

// ---------------------------------------------------------------------------
// Grammar
// ---------------------------------------------------------------------------
checkDuplicates(ALL_GRAMMAR_LESSONS.map((l) => l.id), 'grammar lessons');
checkDuplicates(ALL_GRAMMAR_QUESTIONS.map((q) => q.id), 'grammar questions');
const lessonIds = new Set(ALL_GRAMMAR_LESSONS.map((l) => l.id));
for (const l of ALL_GRAMMAR_LESSONS) {
  if (!VALID_LEVELS.has(l.level)) errors.push(`[不正なlevel] grammar lesson ${l.id}: level=${l.level}`);
  if (!l.explanationJa || l.examples.length === 0) errors.push(`[Lesson欠落] ${l.id}: explanationJa/examples が不足しています`);
}
for (const q of ALL_GRAMMAR_QUESTIONS) {
  if (!lessonIds.has(q.lessonId)) errors.push(`[不正なlessonID] grammar question ${q.id}: lessonId "${q.lessonId}" が存在しません`);
  if (!VALID_LEVELS.has(q.level)) errors.push(`[不正なlevel] grammar question ${q.id}: level=${q.level}`);
  if (!q.question || !q.correctAnswer || !q.explanation) {
    errors.push(`[問題データ欠落] grammar question ${q.id}: question/correctAnswer/explanation が不足しています`);
  }
  if ((q.format === 'reorder') && (!q.tokens || q.tokens.length === 0)) {
    errors.push(`[問題データ欠落] grammar question ${q.id}: reorder形式なのにtokensがありません`);
  }
  if (q.choices && !q.choices.includes(q.correctAnswer)) {
    errors.push(`[矛盾] grammar question ${q.id}: correctAnswer "${q.correctAnswer}" が choices に含まれていません`);
  }
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------
checkDuplicates(ALL_VOCABULARY.map((v) => v.id), 'vocabulary ids');
checkDuplicates(ALL_VOCABULARY.map((v) => v.word.toLowerCase()), 'vocabulary words');
for (const v of ALL_VOCABULARY) {
  if (!VALID_LEVELS.has(v.level)) errors.push(`[不正なlevel] vocabulary ${v.id}: level=${v.level}`);
  if (!v.word || !v.meaningJa || !v.partOfSpeech || !v.pronunciation || !v.exampleEn || !v.exampleJa) {
    errors.push(`[Vocabulary必須項目欠落] ${v.id}: word/meaningJa/partOfSpeech/pronunciation/exampleEn/exampleJa のいずれかが不足しています`);
  }
}

// ---------------------------------------------------------------------------
// TOEIC
// ---------------------------------------------------------------------------
checkDuplicates(ALL_TOEIC_QUESTIONS.map((q) => q.id), 'toeic questions');
for (const q of ALL_TOEIC_QUESTIONS) {
  if (![1, 2, 3, 4, 5, 6, 7].includes(q.part)) errors.push(`[TOEIC Part欠落] ${q.id}: part=${q.part} は不正です`);
  if (!q.explanation) errors.push(`[問題データ欠落] toeic ${q.id}: explanation が不足しています`);
}

// ---------------------------------------------------------------------------
// Global ID uniqueness (across every content type combined)
// ---------------------------------------------------------------------------
const allIds = [
  ...ALL_MATERIALS.map((m) => m.id),
  ...ALL_QUESTIONS.map((q) => q.id),
  ...ALL_WRITING.map((w) => w.id),
  ...ALL_GRAMMAR_LESSONS.map((l) => l.id),
  ...ALL_GRAMMAR_QUESTIONS.map((q) => q.id),
  ...ALL_VOCABULARY.map((v) => v.id),
  ...ALL_TOEIC_QUESTIONS.map((q) => q.id),
];
checkDuplicates(allIds, 'all content (global)');

// ---------------------------------------------------------------------------
// Count report vs. spec minimums
// ---------------------------------------------------------------------------
const TARGETS: { label: string; actual: number; target: number }[] = [
  { label: 'Grammar', actual: ALL_GRAMMAR_QUESTIONS.length, target: 800 },
  { label: 'Reading (understanding questions)', actual: ALL_QUESTIONS.length, target: 960 },
  { label: 'Reading (passages)', actual: ALL_MATERIALS.length, target: 160 },
  { label: 'Writing', actual: ALL_WRITING.length, target: 200 },
  { label: 'Vocabulary', actual: ALL_VOCABULARY.length, target: 2500 },
  { label: 'TOEIC (all parts)', actual: ALL_TOEIC_QUESTIONS.length, target: 300 },
];

for (const t of TARGETS) {
  if (t.actual < t.target) {
    warnings.push(`[目標未達] ${t.label}: ${t.actual} / 目標 ${t.target}`);
  }
}

console.log('=== Content counts ===');
for (const t of TARGETS) {
  const status = t.actual >= t.target ? 'OK ' : 'LOW';
  console.log(`[${status}] ${t.label}: ${t.actual} (target: ${t.target})`);
}
console.log('--- TOEIC by part ---');
for (const part of [1, 2, 3, 4, 5, 6, 7] as const) {
  console.log(`  Part ${part}: ${TOEIC_BY_PART[part].length}`);
}

if (warnings.length > 0) {
  console.log('\n=== Warnings (below target, non-fatal) ===');
  for (const w of warnings) console.log(w);
}

// ---------------------------------------------------------------------------
// Write the small auto-generated stats module the app imports eagerly
// (Settings / Progress / level-select tiles) so it never has to lazy-load
// full content banks just to show a count.
// ---------------------------------------------------------------------------
const stats = {
  generatedAt: new Date().toISOString(),
  grammar: { total: ALL_GRAMMAR_QUESTIONS.length, byLevel: countByLevel(ALL_GRAMMAR_QUESTIONS) },
  vocabulary: { total: ALL_VOCABULARY.length, byLevel: countByLevel(ALL_VOCABULARY) },
  readingMaterials: { total: ALL_MATERIALS.length, byLevel: countByLevel(ALL_MATERIALS) },
  readingQuestions: {
    total: ALL_QUESTIONS.length,
    byLevel: countByLevel(
      ALL_QUESTIONS.map((q) => ({ level: ALL_MATERIALS.find((m) => m.id === q.materialId)?.level ?? 0 }))
    ),
  },
  writing: { total: ALL_WRITING.length, byLevel: countByLevel(ALL_WRITING) },
  toeic: {
    total: ALL_TOEIC_QUESTIONS.length,
    byPart: {
      1: TOEIC_BY_PART[1].length,
      2: TOEIC_BY_PART[2].length,
      3: TOEIC_BY_PART[3].length,
      4: TOEIC_BY_PART[4].length,
      5: TOEIC_BY_PART[5].length,
      6: TOEIC_BY_PART[6].length,
      7: TOEIC_BY_PART[7].length,
    },
  },
};

const statsFileContent = `/**
 * AUTO-GENERATED by \`npm run validate-content\`. Do not edit by hand.
 * Small numeric summary of content volume, kept eager (tiny) so Settings/Progress/
 * level-select tiles can show real counts without lazy-loading full content banks.
 */
export interface ContentStats {
  generatedAt: string;
  grammar: { total: number; byLevel: Record<1 | 2 | 3 | 4 | 5 | 6, number> };
  vocabulary: { total: number; byLevel: Record<1 | 2 | 3 | 4 | 5 | 6, number> };
  readingMaterials: { total: number; byLevel: Record<1 | 2 | 3 | 4 | 5 | 6, number> };
  readingQuestions: { total: number; byLevel: Record<1 | 2 | 3 | 4 | 5 | 6, number> };
  writing: { total: number; byLevel: Record<1 | 2 | 3 | 4 | 5 | 6, number> };
  toeic: { total: number; byPart: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number> };
}

export const CONTENT_STATS: ContentStats = ${JSON.stringify(stats, null, 2)};
`;

const statsPath = fileURLToPath(new URL('../src/data/contentStats.generated.ts', import.meta.url));
writeFileSync(statsPath, statsFileContent, 'utf-8');
console.log(`\nWrote ${statsPath}`);

if (errors.length > 0) {
  console.log('\n=== Errors ===');
  for (const e of errors) console.log(e);
  console.log(`\n${errors.length} error(s) found.`);
  process.exit(1);
}

console.log('\nNo structural errors found (ID uniqueness, required fields, references all valid).');
