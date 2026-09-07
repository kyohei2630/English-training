import type { LearningSession, SectionKey, UserProgress } from '../types';
import { addDaysISO, diffInCalendarDays, todayLocalISODate } from '../utils/date';
import { getSessionByDate, saveSession } from '../db/repositories/sessionRepository';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';
import { getDueReviewItems } from '../db/repositories/reviewRepository';

/** Base target minutes for a 30-minute day. Actual minutes shown to the user are
 * rebalanced by dailyPlanner.ts when the review queue is unusually large. */
export const TARGET_MINUTES = { reading: 8, grammar: 8, writing: 7, review: 7 } as const;

function emptySession(date: string, day: number): LearningSession {
  return {
    // Deterministic per date (rather than a random id) so that concurrent callers
    // (e.g. Home and Training mounting at nearly the same time) can never create
    // two separate session records for the same day.
    id: `session-${date}`,
    date,
    day,
    startedAt: new Date().toISOString(),
    completedAt: null,
    sectionsDone: { reading: false, grammar: false, writing: false, review: false },
    minutesSpent: { reading: 0, grammar: 0, writing: 0, review: 0 },
    materialsCompleted: [],
    readingCorrect: 0,
    readingTotal: 0,
    grammarCorrect: 0,
    grammarTotal: 0,
    reviewCorrect: 0,
    reviewTotal: 0,
    writingCompleted: 0,
  };
}

/** Returns today's session, creating one (using the current progress.currentDay) if it doesn't exist yet. */
export async function getOrCreateTodaySession(): Promise<LearningSession> {
  const today = todayLocalISODate();
  const existing = await getSessionByDate(today);
  if (existing) return existing;

  const progress = await getProgress();
  const day = computeTodayDayNumber(progress, today);
  const session = emptySession(today, day);
  await saveSession(session);
  return session;
}

/** The curriculum day for "today": continues from currentDay if the user already studied,
 * or advances by exactly the number of missed calendar days otherwise. */
function computeTodayDayNumber(progress: UserProgress, today: string): number {
  if (!progress.lastStudyDate) return progress.currentDay || 1;
  const gap = diffInCalendarDays(progress.lastStudyDate, today);
  if (gap <= 0) return progress.currentDay || 1;
  return (progress.currentDay || 1) + gap;
}

export async function markSectionProgress(
  section: SectionKey,
  patch: Partial<LearningSession>
): Promise<LearningSession> {
  const session = await getOrCreateTodaySession();
  const updated: LearningSession = {
    ...session,
    ...patch,
    sectionsDone: { ...session.sectionsDone, ...(patch.sectionsDone ?? {}) },
    minutesSpent: { ...session.minutesSpent, ...(patch.minutesSpent ?? {}) },
  };
  if (!updated.sectionsDone[section]) {
    updated.sectionsDone = { ...updated.sectionsDone, [section]: true };
  }
  await saveSession(updated);
  return updated;
}

export async function addMinutes(section: SectionKey, minutes: number): Promise<void> {
  const session = await getOrCreateTodaySession();
  session.minutesSpent[section] += minutes;
  await saveSession(session);
}

export function isSessionComplete(session: LearningSession): boolean {
  return (
    session.sectionsDone.reading &&
    session.sectionsDone.grammar &&
    session.sectionsDone.writing &&
    session.sectionsDone.review
  );
}

/** How many of today's due review items are outstanding — used to decide whether Review
 * should be given more of the 30-minute budget today (see dailyPlanner.ts). */
export async function countDueReviewItems(): Promise<number> {
  const items = await getDueReviewItems(todayLocalISODate());
  return items.length;
}

/** Call once when all four sections are done for the day. Updates streak, totals, and advances the curriculum day. */
export async function completeTodaySession(): Promise<{ session: LearningSession; progress: UserProgress }> {
  const session = await getOrCreateTodaySession();
  const today = todayLocalISODate();

  if (!session.completedAt) {
    session.completedAt = new Date().toISOString();
    await saveSession(session);
  }

  const progress = await getProgress();
  const totalMinutesToday =
    session.minutesSpent.reading +
    session.minutesSpent.grammar +
    session.minutesSpent.writing +
    session.minutesSpent.review;

  const alreadyCountedToday = progress.lastStudyDate === today;
  if (!alreadyCountedToday) {
    const gap = progress.lastStudyDate ? diffInCalendarDays(progress.lastStudyDate, today) : null;
    const continuesStreak = gap === 1;
    const newStreak = continuesStreak ? progress.currentStreak + 1 : 1;

    const updatedProgress: UserProgress = {
      ...progress,
      currentDay: session.day + 1,
      totalStudyDays: progress.totalStudyDays + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      totalStudyMinutes: progress.totalStudyMinutes + totalMinutesToday,
      lastStudyDate: today,
      readingAttempted: progress.readingAttempted + session.readingTotal,
      readingCorrect: progress.readingCorrect + session.readingCorrect,
      grammarAttempted: progress.grammarAttempted + session.grammarTotal,
      grammarCorrect: progress.grammarCorrect + session.grammarCorrect,
      writingCompleted: progress.writingCompleted + session.writingCompleted,
      reviewAttempted: progress.reviewAttempted + session.reviewTotal,
      reviewCorrect: progress.reviewCorrect + session.reviewCorrect,
    };
    await saveProgress(updatedProgress);
    return { session, progress: updatedProgress };
  }

  return { session, progress };
}

/** Used by the streak display: if the user missed a day (gap > 1), the streak should show as broken. */
export function computeDisplayStreak(progress: UserProgress): number {
  if (!progress.lastStudyDate) return 0;
  const today = todayLocalISODate();
  const gap = diffInCalendarDays(progress.lastStudyDate, today);
  if (gap > 1) return 0;
  return progress.currentStreak;
}

export { addDaysISO };
