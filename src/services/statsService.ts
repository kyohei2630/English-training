import type { LearningSession } from '../types';
import { todayLocalISODate, diffInCalendarDays } from '../utils/date';

function sessionTotalMinutes(s: LearningSession): number {
  return s.minutesSpent.reading + s.minutesSpent.understanding + s.minutesSpent.writing + s.minutesSpent.review;
}

export function computeWeeklyMinutes(sessions: LearningSession[]): number {
  const today = todayLocalISODate();
  return sessions
    .filter((s) => diffInCalendarDays(s.date, today) < 7 && diffInCalendarDays(s.date, today) >= 0)
    .reduce((sum, s) => sum + sessionTotalMinutes(s), 0);
}

export function computeTodayMinutes(sessions: LearningSession[]): number {
  const today = todayLocalISODate();
  const todaySession = sessions.find((s) => s.date === today);
  return todaySession ? sessionTotalMinutes(todaySession) : 0;
}

export interface WeekDayStat {
  date: string;
  minutes: number;
}

/** Last 7 days (oldest to newest), including days with no session (0 minutes). */
export function computeLast7Days(sessions: LearningSession[]): WeekDayStat[] {
  const today = todayLocalISODate();
  const byDate = new Map(sessions.map((s) => [s.date, sessionTotalMinutes(s)]));
  const result: WeekDayStat[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = shiftDate(today, -i);
    result.push({ date, minutes: byDate.get(date) ?? 0 });
  }
  return result;
}

function shiftDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}
