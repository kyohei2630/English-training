import type { AnswerLogEntry, LearningSession, ReviewItem } from '../types';
import { addDaysISO, diffInCalendarDays, toLocalISODate } from '../utils/date';
import { DELAYED_GAP_DAYS, isReviewCandidate } from './reviewScheduler';

export interface Mission {
  id: 'review-days' | 'build' | 'notes' | 'unseen' | 'research' | 'retention';
  titleJa: string;
  detailJa: string;
  current: number;
  target: number;
  done: boolean;
}

/** Monday of the week containing `date` (weeks run Monday-Sunday). */
export function weekStart(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay(); // 0 = Sunday
  return addDaysISO(date, -((day + 6) % 7));
}

const UNSEEN_TARGET = 15;
const UNSEEN_ACCURACY = 0.7;

/**
 * This week's missions. Most measure what was actually learned — sentences built unaided,
 * unseen questions answered, knowledge still recalled after a week — rather than minutes or
 * streaks; only "review on 4 days" is about habit.
 */
export function computeWeeklyMissions(input: {
  today: string;
  sessions: LearningSession[];
  log: AnswerLogEntry[];
  items: ReviewItem[];
}): Mission[] {
  const from = weekStart(input.today);
  const to = addDaysISO(from, 6);
  const inWeek = (date: string) => date >= from && date <= to;
  const log = input.log.filter((e) => inWeek(e.date));
  const sessions = input.sessions.filter((s) => inWeek(s.date));

  const reviewDays = sessions.filter((s) => {
    const plan = s.reviewPlan;
    const planDone = plan && plan.itemIds.length > 0 && plan.itemIds.every((id) => Object.hasOwn(plan.results, id));
    return s.sectionsDone.review || planDone;
  }).length;

  const builtSteps = new Set(
    log.filter((e) => e.wasCorrect && e.category === 'writing' && e.refId.startsWith('sb-')).map((e) => e.refId)
  ).size;

  const notesRated = input.sessions
    .flatMap((s) => s.noteTasks ?? [])
    .filter((t) => t.evaluatedAt && inWeek(toLocalISODate(new Date(t.evaluatedAt)))).length;

  // Accuracy on unseen questions: app-checked answers only.
  const unseen = log.filter((e) => (e.kind === 'first' || e.kind === 'assessment') && e.category !== 'toeic' && e.grading === 'auto');
  const unseenCorrect = unseen.filter((e) => e.wasCorrect).length;
  const unseenAccuracy = unseen.length > 0 ? unseenCorrect / unseen.length : 0;

  const researchUnits = new Set(log.filter((e) => e.refId.startsWith('rs-')).map((e) => e.refId.replace(/-[qw]$/, ''))).size;

  const delayedCorrect = log.filter((e) => e.kind === 'delayed' && e.wasCorrect).length;
  // Only set when there is something old enough to check: queued items not seen for a week.
  const delayedAvailable = input.items.filter(
    (i) => isReviewCandidate(i) && diffInCalendarDays(toLocalISODate(new Date(i.updatedAt)), input.today) >= DELAYED_GAP_DAYS
  ).length;

  const missions: Mission[] = [
    {
      id: 'review-days',
      titleJa: '今日の復習を4日やり切る',
      detailJa: 'その日の指定問題を最後まで',
      current: reviewDays,
      target: 4,
      done: reviewDays >= 4,
    },
    {
      id: 'build',
      titleJa: '英文組み立てで8文を自力で正解',
      detailJa: 'ヒントなし・自動判定または自己確認で正解',
      current: builtSteps,
      target: 8,
      done: builtSteps >= 8,
    },
    {
      id: 'notes',
      titleJa: 'ノート課題を3回',
      detailJa: '書いて、答えを見て、自己評価まで',
      current: notesRated,
      target: 3,
      done: notesRated >= 3,
    },
    {
      id: 'unseen',
      titleJa: `初見の問題に${UNSEEN_TARGET}問、正答率${UNSEEN_ACCURACY * 100}%以上`,
      detailJa: unseen.length > 0 ? `今週 ${unseen.length}問・正答率 ${Math.round(unseenAccuracy * 100)}%` : 'まだ解いていません',
      current: Math.min(unseen.length, UNSEEN_TARGET),
      target: UNSEEN_TARGET,
      done: unseen.length >= UNSEEN_TARGET && unseenAccuracy >= UNSEEN_ACCURACY,
    },
    {
      id: 'research',
      titleJa: '研究英語ユニットを1つ',
      detailJa: '読む・確認する・1文書く',
      current: researchUnits,
      target: 1,
      done: researchUnits >= 1,
    },
  ];
  if (delayedAvailable >= 3 || delayedCorrect > 0) {
    missions.push({
      id: 'retention',
      titleJa: '1週間以上前の問題に3問正解',
      detailJa: '長期定着の確認（復習で自然に出題されます）',
      current: delayedCorrect,
      target: 3,
      done: delayedCorrect >= 3,
    });
  }
  return missions;
}
