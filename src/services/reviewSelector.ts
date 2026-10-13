import type { ReviewCategory, ReviewItem } from '../types';
import { computeProficiency } from './masteryService';
import { isReviewCandidate, THIRTY_DAY_INDEX } from './reviewScheduler';
import { diffInCalendarDays, toLocalISODate } from '../utils/date';
import { canonicalTag } from '../data/grammar/tagLabels';
import { canonicalQuestionId } from '../data/grammar/duplicates';

/** A normal day's review: 5 questions in about 5-7 minutes (TARGET_MINUTES.review). */
export const DAILY_REVIEW_STANDARD = 5;
/** Hard ceiling, reached only when the backlog is large. */
export const DAILY_REVIEW_MAX = 10;
const STANDARD_BUDGET_SECONDS = 7 * 60;
const EXTRA_SECONDS_PER_QUESTION = 60;

/** Backlog sizes that start raising the daily count (one extra question per BACKLOG_STEP). */
const BACKLOG_COMFORT = 15;
const BACKLOG_STEP = 15;

/** Diversity caps within one batch. */
const MAX_PER_KNOWLEDGE_KEY = 1;
const MAX_PER_TAG = 2;
const MAX_LEECHES = 2;

/** Rough time to answer one review question, including reading its context. A reading question
 * needs its passage read first; later questions on the same passage reuse it (see selectReviewBatch). */
export function estimateReviewSeconds(item: ReviewItem): number {
  switch (item.category) {
    case 'vocabulary':
      return 20;
    case 'grammar':
      return item.refId.startsWith('grammar-') ? 60 : 45;
    case 'writing':
      return 90;
    case 'reading':
      return 150;
    case 'toeic': {
      const part = Number(/^toeic_p(\d)_/.exec(item.refId)?.[1]);
      if (part === 3 || part === 4 || part === 7) return 90;
      if (part === 6) return 60;
      return 30;
    }
  }
}

/** The reading passage a reading question belongs to ("q-l1-001-2" -> "l1-001"). */
function passageKey(item: ReviewItem): string | null {
  if (item.category !== 'reading') return null;
  return /^q-(l\d-\d+)-/.exec(item.refId)?.[1] ?? null;
}

/** Identifies "the same piece of knowledge": the same word saved from different places
 * (word bank, a passage, the dictionary) counts once. */
export function knowledgeKey(item: ReviewItem): string {
  if (item.category === 'vocabulary') {
    return `vocabulary:${(item.word?.headword ?? item.promptText).trim().toLowerCase()}`;
  }
  // Duplicate questions (see data/grammar/duplicates) are the same knowledge.
  return `${item.category}:${canonicalQuestionId(item.refId)}`;
}

function tagKey(item: ReviewItem): string | null {
  return item.tag ? `${item.category}:${canonicalTag(item.tag)}` : null;
}

function isLastAnswerWrong(item: ReviewItem): boolean {
  return item.incorrectCount > 0 && (item.consecutiveCorrect ?? 0) === 0;
}

/** Missed again and again: worth seeing, but a batch shouldn't be made of nothing else. */
function isLeech(item: ReviewItem): boolean {
  return item.incorrectCount >= 4 && computeProficiency(item) < 50;
}

/** Higher = more urgent. Wrong last time and low accuracy weigh most; time since the item was
 * last seen grows steadily so nothing waits in the queue forever. */
export function reviewPriority(item: ReviewItem, today: string): number {
  const attempts = item.correctCount + item.incorrectCount;
  const proficiency = attempts === 0 ? 50 : computeProficiency(item);
  const overdueDays = Math.max(0, diffInCalendarDays(item.nextReviewDate, today));
  const daysSinceSeen = Math.max(0, diffInCalendarDays(toLocalISODate(new Date(item.updatedAt)), today));
  return (
    (isLastAnswerWrong(item) ? 40 : 0) +
    (100 - proficiency) * 0.3 +
    Math.min(30, overdueDays) +
    Math.min(25, daysSinceSeen * 0.5)
  );
}

/** Small deterministic per-day jitter so items with equal priority rotate instead of the same
 * ones always winning the tie. */
function dailyJitter(id: string, today: string): number {
  let h = 2166136261;
  for (const ch of id + today) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

/** Due items in the review queue — the backlog. */
export function dueCandidates(items: ReviewItem[], today: string): ReviewItem[] {
  return items.filter((i) => isReviewCandidate(i) && i.nextReviewDate <= today);
}

/** How many questions to ask today: 5 normally, rising by one per BACKLOG_STEP of backlog
 * (or straight to 8 under sustained high load), never more than 10. */
export function dailyTargetCount(backlog: number, loadHigh = false): number {
  const byBacklog = DAILY_REVIEW_STANDARD + Math.ceil(Math.max(0, backlog - BACKLOG_COMFORT) / BACKLOG_STEP);
  return Math.min(DAILY_REVIEW_MAX, Math.max(byBacklog, loadHigh ? 8 : 0), Math.max(backlog, 0));
}

export function budgetSecondsFor(targetCount: number): number {
  return STANDARD_BUDGET_SECONDS + Math.max(0, targetCount - DAILY_REVIEW_STANDARD) * EXTRA_SECONDS_PER_QUESTION;
}

/** Sustained-load check: the backlog is big, and not going down compared with about a week ago. */
export function isLoadHigh(backlogToday: number, backlogAWeekAgo: number | undefined): boolean {
  if (backlogToday >= 60) return true;
  return backlogToday >= 30 && backlogAWeekAgo !== undefined && backlogToday >= backlogAWeekAgo;
}

/** A retained item due after a long gap is checked with an unseen similar question rather than
 * the one it has answered several times (resolver falls back to the original when there's none). */
export function isRetentionCheck(item: ReviewItem): boolean {
  return (
    item.category === 'grammar' &&
    item.refId.startsWith('grammar_l') &&
    item.interval >= THIRTY_DAY_INDEX &&
    (item.consecutiveCorrect ?? 0) >= 3
  );
}

export interface SelectOptions {
  today: string;
  targetCount: number;
  budgetSeconds: number;
  /** item ids not to pick (e.g. already answered today) */
  excludeIds?: ReadonlySet<string>;
  category?: ReviewCategory;
}

/**
 * Picks the day's review questions from the due backlog: most urgent first, within a question
 * count and a time budget, with caps so one word / grammar point / weak spot can't fill the whole
 * batch, and categories mixed when more than one has items. Items not picked are untouched —
 * they stay due and compete again tomorrow (their priority rises as they wait).
 */
export function selectReviewBatch(items: ReviewItem[], options: SelectOptions): ReviewItem[] {
  const { today, targetCount, budgetSeconds, excludeIds, category } = options;
  const pool = dueCandidates(items, today)
    .filter((i) => !excludeIds?.has(i.id) && (!category || i.category === category))
    .map((item) => ({ item, score: reviewPriority(item, today) + dailyJitter(item.id, today) }))
    .sort((a, b) => b.score - a.score)
    .map((e) => e.item);

  // While mixing, no category may take more than its share of the questions or half the time
  // (otherwise a few reading passages would use up the whole budget).
  const categoriesPresent = new Set(pool.map((i) => i.category)).size;
  const perCategoryCap = categoriesPresent > 1 ? Math.max(2, Math.ceil(targetCount / Math.min(categoriesPresent, 3))) : targetCount;
  const perCategorySeconds = categoriesPresent > 1 ? budgetSeconds / 2 : budgetSeconds;

  const picked: ReviewItem[] = [];
  const knowledgeCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  const categoryCounts = new Map<ReviewCategory, number>();
  const categorySeconds = new Map<ReviewCategory, number>();
  const passagesRead = new Set<string>();
  let leeches = 0;
  let seconds = 0;

  const tryPick = (item: ReviewItem, enforceCategoryCap: boolean, tagCap: number): boolean => {
    const kKey = knowledgeKey(item);
    const tKey = tagKey(item);
    if ((knowledgeCounts.get(kKey) ?? 0) >= MAX_PER_KNOWLEDGE_KEY) return false;
    if (tKey && (tagCounts.get(tKey) ?? 0) >= tagCap) return false;
    if (isLeech(item) && leeches >= MAX_LEECHES) return false;
    const passage = passageKey(item);
    const cost = passage && passagesRead.has(passage) ? 45 : estimateReviewSeconds(item);
    if (picked.length > 0 && seconds + cost > budgetSeconds) return false;
    if (
      enforceCategoryCap &&
      ((categoryCounts.get(item.category) ?? 0) >= perCategoryCap ||
        (picked.length > 0 && (categorySeconds.get(item.category) ?? 0) + cost > perCategorySeconds))
    ) {
      return false;
    }

    picked.push(item);
    seconds += cost;
    knowledgeCounts.set(kKey, (knowledgeCounts.get(kKey) ?? 0) + 1);
    if (tKey) tagCounts.set(tKey, (tagCounts.get(tKey) ?? 0) + 1);
    categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
    categorySeconds.set(item.category, (categorySeconds.get(item.category) ?? 0) + cost);
    if (passage) passagesRead.add(passage);
    if (isLeech(item)) leeches++;
    return true;
  };

  // First pass keeps categories mixed; the second fills remaining room without that cap (e.g.
  // when only vocabulary is short enough to fit the time left); the last lets a backlog made of
  // a single grammar point still drain, at a slightly higher share per batch.
  const passes: Array<[boolean, number]> = [
    [true, MAX_PER_TAG],
    [false, MAX_PER_TAG],
    [false, MAX_PER_TAG * 2],
  ];
  for (const [enforceCategoryCap, tagCap] of passes) {
    for (const item of pool) {
      if (picked.length >= targetCount) break;
      if (picked.includes(item)) continue;
      tryPick(item, enforceCategoryCap, tagCap);
    }
  }
  return picked;
}
