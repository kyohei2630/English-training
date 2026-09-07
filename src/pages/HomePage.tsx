import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { getDailyPlan, TOTAL_CURRICULUM_DAYS, type DailyPlan } from '../services/curriculum';
import { getLevelInfo } from '../data/levels';
import { getOrCreateTodaySession, TARGET_MINUTES, isSessionComplete } from '../services/sessionService';
import { getAllSessions } from '../db/repositories/sessionRepository';
import { computeWeeklyMinutes } from '../services/statsService';
import { greetingForNow } from '../utils/date';
import type { LearningSession } from '../types';

export default function HomePage() {
  const { progress, loading } = useProgress();
  const [session, setSession] = useState<LearningSession | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const s = await getOrCreateTodaySession();
      setSession(s);
      const day = Math.min(s.day, TOTAL_CURRICULUM_DAYS + 1000);
      setPlan(await getDailyPlan(day));
      const sessions = await getAllSessions();
      setWeeklyMinutes(computeWeeklyMinutes(sessions));
    })();
  }, [progress.currentDay]);

  if (loading || !session || !plan) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const levelInfo = getLevelInfo(progress.currentLevel);
  const complete = isSessionComplete(session);
  const todayMinutes =
    session.minutesSpent.reading + session.minutesSpent.grammar + session.minutesSpent.writing + session.minutesSpent.review;

  const sectionRows = [
    { key: 'reading', label: 'Reading', minutes: TARGET_MINUTES.reading, done: session.sectionsDone.reading },
    { key: 'grammar', label: 'Grammar', minutes: TARGET_MINUTES.grammar, done: session.sectionsDone.grammar },
    { key: 'writing', label: 'Writing', minutes: TARGET_MINUTES.writing, done: session.sectionsDone.writing },
    { key: 'review', label: 'Review', minutes: TARGET_MINUTES.review, done: session.sectionsDone.review },
  ] as const;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{greetingForNow()}</p>
        <h1 className="text-2xl font-bold">今日も一緒に学びましょう</h1>
      </div>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-200">Today's Training</h2>
          <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">Day {session.day}</span>
        </div>
        <p className="mb-1 text-sm text-blue-800 dark:text-blue-300">{levelInfo.name}</p>
        <p className="mb-4 text-sm text-blue-700 dark:text-blue-400">今日の教材: 「{plan.reading.title}」</p>

        <ul className="mb-4 flex flex-col gap-2">
          {sectionRows.map((row) => (
            <li key={row.key} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm dark:bg-slate-900/50">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">{row.done ? '✅' : '⬜️'}</span>
                {row.label}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{row.minutes} min</span>
            </li>
          ))}
        </ul>

        {complete ? (
          <div className="rounded-xl bg-green-100 px-4 py-3 text-center font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
            🎉 今日のトレーニングは完了しました！お疲れさまでした。
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={() => navigate('/training')}>
            Start Today's Training
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">Current Level</p>
          <p className="mt-1 text-xl font-bold">Level {progress.currentLevel}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">連続学習日数</p>
          <p className="mt-1 text-xl font-bold">🔥 {progress.currentStreak} 日</p>
        </Card>
      </div>

      <Card>
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">今日の進捗</p>
        <ProgressBar value={(todayMinutes / 30) * 100} label={`${todayMinutes} / 30 分`} />
      </Card>

      <Card>
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">今週の学習時間</p>
        <ProgressBar value={(weeklyMinutes / (30 * 7)) * 100} label={`${weeklyMinutes} 分 / 週目標 ${30 * 7} 分`} />
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">追加トレーニング（時間制限なし）</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <Link to="/vocabulary" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            🧠 Vocabulary
          </Link>
          <Link to="/reading" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            📖 Reading
          </Link>
          <Link to="/writing" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            ✍️ Writing
          </Link>
          <Link to="/toeic" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            📝 TOEIC
          </Link>
          <Link to="/review" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            🔄 Review
          </Link>
          <Link to="/extra-training" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            ➕ すべて見る
          </Link>
        </div>
      </div>
    </div>
  );
}
