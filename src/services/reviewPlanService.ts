import type { DailyReviewPlan, LearningSession, ReviewCategory, ReviewItem } from '../types';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { getAllSessions, getSessionByDate, saveSession } from '../db/repositories/sessionRepository';
import { getOrCreateTodaySession } from './sessionService';
import {
  budgetSecondsFor,
  DAILY_REVIEW_STANDARD,
  dailyTargetCount,
  dueCandidates,
  isLoadHigh,
  selectReviewBatch,
} from './reviewSelector';
import { diffInCalendarDays, todayLocalISODate } from '../utils/date';

export interface TodayReview {
  plan: DailyReviewPlan;
  /** today's assigned items, in order (items deleted since the plan was made are dropped) */
  items: ReviewItem[];
  /** assigned items not answered yet */
  remaining: ReviewItem[];
  doneCount: number;
  /** app-checked answers only */
  correctCount: number;
  /** answered items checked by the app (the denominator for correctCount) */
  objectiveTotal: number;
  /** answered items the learner judged themselves */
  selfGradedCount: number;
  /** review is complete for today once every assigned item is answered */
  complete: boolean;
  /** items currently due (not just today's assignment); carried over, never deleted */
  backlog: number;
}

/** The backlog recorded on the session closest to a week before `today` (5-10 days back). */
function backlogAboutAWeekAgo(sessions: LearningSession[], today: string): number | undefined {
  let best: { gap: number; backlog: number } | undefined;
  for (const s of sessions) {
    if (!s.reviewPlan) continue;
    const daysAgo = diffInCalendarDays(s.date, today);
    if (daysAgo < 5 || daysAgo > 10) continue;
    const gap = Math.abs(daysAgo - 7);
    if (!best || gap < best.gap) best = { gap, backlog: s.reviewPlan.backlogAtStart };
  }
  return best?.backlog;
}

export function buildReviewPlan(
  allItems: ReviewItem[],
  today: string,
  backlogWeekAgo: number | undefined,
  now = new Date().toISOString()
): DailyReviewPlan {
  const backlog = dueCandidates(allItems, today).length;
  const loadHigh = isLoadHigh(backlog, backlogWeekAgo);
  const targetCount = dailyTargetCount(backlog, loadHigh);
  const picked = selectReviewBatch(allItems, { today, targetCount, budgetSeconds: budgetSecondsFor(targetCount) });
  return { createdAt: now, itemIds: picked.map((i) => i.id), results: {}, backlogAtStart: backlog, loadHigh };
}

/** An assigned item counts as done once it's been answered after the plan was made — also when
 * the app was closed right after answering, before the result was written to the plan. */
function isDone(plan: DailyReviewPlan, item: ReviewItem): boolean {
  return Object.hasOwn(plan.results, item.id) || item.updatedAt >= plan.createdAt;
}

export function summarizeReviewPlan(plan: DailyReviewPlan, allItems: ReviewItem[], today: string): TodayReview {
  const byId = new Map(allItems.map((i) => [i.id, i]));
  const items = plan.itemIds.map((id) => byId.get(id)).filter((i): i is ReviewItem => i !== undefined);
  const done = items.filter((i) => isDone(plan, i));
  const self = new Set(plan.selfGraded ?? []);
  const objective = done.filter((i) => !self.has(i.id));
  const correctCount = objective.filter((i) => plan.results[i.id] ?? (i.consecutiveCorrect ?? 0) > 0).length;
  return {
    plan,
    items,
    remaining: items.filter((i) => !isDone(plan, i)),
    doneCount: done.length,
    correctCount,
    objectiveTotal: objective.length,
    selfGradedCount: done.length - objective.length,
    complete: done.length === items.length,
    backlog: dueCandidates(allItems, today).length,
  };
}

/** Today's review assignment: made once per day from the due backlog and stored on today's
 * session, so leaving mid-way or restarting the app resumes the same questions. */
export async function getTodayReview(): Promise<TodayReview> {
  const today = todayLocalISODate();
  const [session, allItems] = await Promise.all([getOrCreateTodaySession(), getAllReviewItems()]);
  let plan = session.reviewPlan;
  if (!plan) {
    const built = buildReviewPlan(allItems, today, backlogAboutAWeekAgo(await getAllSessions(), today));
    // Re-read right before saving: if another screen made today's plan meanwhile, keep theirs.
    const latest = (await getSessionByDate(today)) ?? session;
    plan = latest.reviewPlan ?? built;
    if (!latest.reviewPlan) await saveSession({ ...latest, reviewPlan: plan });
  }
  return summarizeReviewPlan(plan, allItems, today);
}

/** Records an answer against today's assignment (ignored for items that aren't part of it). */
export async function markReviewPlanAnswer(itemId: string, wasCorrect: boolean, grading: 'auto' | 'self' = 'auto'): Promise<void> {
  const session = await getSessionByDate(todayLocalISODate());
  const plan = session?.reviewPlan;
  if (!session || !plan || !plan.itemIds.includes(itemId)) return;
  const selfGraded = (plan.selfGraded ?? []).filter((id) => id !== itemId);
  if (grading === 'self') selfGraded.push(itemId);
  await saveSession({ ...session, reviewPlan: { ...plan, results: { ...plan.results, [itemId]: wasCorrect }, selfGraded } });
}

/** Optional extra practice beyond today's assignment (or one category of the backlog). Not
 * stored: it never affects whether today's review counts as complete. */
export async function selectExtraReview(category?: ReviewCategory): Promise<ReviewItem[]> {
  const today = todayLocalISODate();
  const allItems = await getAllReviewItems();
  return selectReviewBatch(allItems, {
    today,
    targetCount: DAILY_REVIEW_STANDARD,
    budgetSeconds: budgetSecondsFor(DAILY_REVIEW_STANDARD),
    category,
  });
}
