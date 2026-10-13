import type { Level, ReviewItem, SentenceBuildDrill, SentenceBuildStepKind, SentenceTask, TheoryProgress } from '../types';
import { THEORY_TAG_ALIASES } from '../data/grammar/theory/tagAliases';
import { loadGrammarTheoryLevel } from '../data/grammar/theory/loader';
import { canonicalTag } from '../data/grammar/tagLabels';

export const STEP_KIND_LABELS: Record<SentenceBuildStepKind, string> = {
  base: '基本文',
  expand: '情報の追加',
  transform: '構文の変更',
  apply: '別の文脈で応用',
};

export type { SentenceTask } from '../types';

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bi'm\b/g, 'i am'],
  [/\b(you|we|they)'re\b/g, '$1 are'],
  [/\b(it|that|there)'s\b/g, '$1 is'],
  [/\bcan't\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\b(do|does|did|is|are|was|were|have|has|had|should|would|could|must)n't\b/g, '$1 not'],
  [/\b(i|you|we|they)'ve\b/g, '$1 have'],
  [/\b(i|you|we|they|he|she|it)'ll\b/g, '$1 will'],
];

const NUMBER_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
  eleven: '11', twelve: '12', fifteen: '15', twenty: '20', thirty: '30', sixty: '60',
};

/** Case, punctuation, contractions (don't = do not), hyphens and spelled-out numbers
 * (five = 5) don't decide whether a sentence is right. */
export function normalizeSentence(text: string): string {
  let s = text.toLowerCase().replace(/[’‘]/g, "'").replace(/[–—]/g, '-');
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  s = s
    .replace(/cannot/g, 'can not')
    .replace(/[.,!?;:"()[\]]/g, ' ')
    .replace(/'/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s
    .split(' ')
    .map((w) => NUMBER_WORDS[w] ?? w)
    .join(' ');
}

export function isSentenceCorrect(userAnswer: string, answers: string[]): boolean {
  const user = normalizeSentence(userAnswer);
  return user !== '' && answers.some((a) => normalizeSentence(a) === user);
}

/** The model answer split into shuffled word chunks — the hint shown on request. */
export function hintChunks(model: string, seed: string): string[] {
  const words = model.replace(/[.?!]$/, '').split(/\s+/);
  const chunkSize = words.length > 10 ? 2 : 1;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) chunks.push(words.slice(i, i + chunkSize).join(' '));
  // Deterministic shuffle so the hint doesn't change on re-render.
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return chunks
    .map((c, i) => ({ c, k: (h ^ Math.imul(i + 1, 2654435761)) >>> 0 }))
    .sort((a, b) => a.k - b.k)
    .map((e) => e.c);
}

export function stepRefId(drill: SentenceBuildDrill, stepIndex: number): string {
  return `${drill.id}-${stepIndex}`;
}

export function drillStepTask(drill: SentenceBuildDrill, stepIndex: number): SentenceTask {
  const step = drill.steps[stepIndex];
  return {
    refId: stepRefId(drill, stepIndex),
    promptJa: step.promptJa,
    answers: step.answers,
    hintJa: step.hintJa,
    tag: drill.grammarTag,
    level: drill.level,
    research: drill.level === 5,
  };
}

/** "sb-l1-01-2" -> drill "sb-l1-01", step 2 */
export function parseStepRefId(refId: string): { drillId: string; stepIndex: number } | null {
  const m = /^(sb-l\d-\d+)-(\d)$/.exec(refId);
  return m ? { drillId: m[1], stepIndex: Number(m[2]) } : null;
}

/** Compares tags by their internal ID (old spellings mapped, see tagLabels), ignoring case and
 * separators. */
export function tagKey(tag: string): string {
  return canonicalTag(tag).toLowerCase().replace(/[\s/\-_・]/g, '');
}

/**
 * Grammar points the learner has already met: any grammar question answered on that tag, or the
 * Grammar Theory for it opened. Drills for these tags are the ones recommended — the sentence is
 * built with grammar that has been explained and practised first.
 */
export async function learnedGrammarTags(items: ReviewItem[], theoryProgress: TheoryProgress[]): Promise<Set<string>> {
  const learned = new Set<string>();
  for (const i of items) {
    if (i.category === 'grammar' && i.tag && i.correctCount + i.incorrectCount > 0) learned.add(tagKey(i.tag));
  }
  const viewed = new Set(theoryProgress.filter((p) => p.viewedAt).map((p) => p.id));
  if (viewed.size > 0) {
    for (const level of [1, 2, 3, 4, 5] as Level[]) {
      const theories = await loadGrammarTheoryLevel(level);
      const reverse = Object.entries(THEORY_TAG_ALIASES[level] ?? {});
      for (const t of theories) {
        if (!viewed.has(t.id)) continue;
        learned.add(tagKey(t.tag));
        for (const [questionTag, theoryTag] of reverse) if (theoryTag === t.tag) learned.add(tagKey(questionTag));
      }
    }
  }
  return learned;
}

export interface DrillProgress {
  /** steps answered at least once */
  attempted: number;
  /** steps whose latest answer was right */
  solved: number;
  lastAt?: string;
}

export function drillProgress(drill: SentenceBuildDrill, items: ReviewItem[]): DrillProgress {
  const byRef = new Map(items.map((i) => [i.refId, i]));
  let attempted = 0;
  let solved = 0;
  let lastAt: string | undefined;
  drill.steps.forEach((_, idx) => {
    const item = byRef.get(stepRefId(drill, idx));
    if (!item || item.correctCount + item.incorrectCount === 0) return;
    attempted++;
    if ((item.consecutiveCorrect ?? 0) > 0) solved++;
    if (!lastAt || item.updatedAt > lastAt) lastAt = item.updatedAt;
  });
  return { attempted, solved, lastAt };
}

/**
 * The drill for today's Writing step: one on a grammar point taught today (understand -> practise
 * -> use it yourself), otherwise one on an already-learned point, least recently practised.
 * Drills already solved completely are skipped while others remain.
 */
export function pickDrill(
  drills: SentenceBuildDrill[],
  options: { todayTags: string[]; level: Level; learned: Set<string>; items: ReviewItem[] }
): SentenceBuildDrill | null {
  const { todayTags, level, learned, items } = options;
  const usable = drills.filter((d) => d.level <= level);
  const unfinished = (d: SentenceBuildDrill) => drillProgress(d, items).solved < d.steps.length;
  const todayKeys = todayTags.map(tagKey);

  const forToday = usable
    .filter((d) => todayKeys.includes(tagKey(d.grammarTag)))
    .sort((a, b) => Math.abs(level - a.level) - Math.abs(level - b.level));
  const today = forToday.find(unfinished);
  if (today) return today;

  const byLeastRecent = (a: SentenceBuildDrill, b: SentenceBuildDrill) =>
    (drillProgress(a, items).lastAt ?? '').localeCompare(drillProgress(b, items).lastAt ?? '');
  const learnedDrills = usable.filter((d) => learned.has(tagKey(d.grammarTag)));
  return learnedDrills.filter(unfinished).sort(byLeastRecent)[0] ?? forToday[0] ?? null;
}
