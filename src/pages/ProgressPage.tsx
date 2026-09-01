import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import StatCard from '../components/progress/StatCard';
import WeekChart from '../components/progress/WeekChart';
import { useProgress } from '../hooks/useProgress';
import { getAllSessions } from '../db/repositories/sessionRepository';
import { computeLast7Days } from '../services/statsService';
import { getLevelInfo } from '../data/levels';
import { TOTAL_CURRICULUM_DAYS } from '../services/curriculum';
import type { LearningSession } from '../types';

export default function ProgressPage() {
  const { progress, loading } = useProgress();
  const [sessions, setSessions] = useState<LearningSession[]>([]);

  useEffect(() => {
    (async () => setSessions(await getAllSessions()))();
  }, [progress.totalStudyDays]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const levelInfo = getLevelInfo(progress.currentLevel);
  const readingRate = progress.readingAttempted > 0 ? Math.round((progress.readingCorrect / progress.readingAttempted) * 100) : 0;
  const reviewRate = progress.reviewAttempted > 0 ? Math.round((progress.reviewCorrect / progress.reviewAttempted) * 100) : 0;
  const curriculumProgress = Math.min(100, Math.round((progress.currentDay / TOTAL_CURRICULUM_DAYS) * 100));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Progress</h1>

      <Card>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{levelInfo.name}</p>
        <p className="mb-2 text-xs text-slate-400">{levelInfo.descriptionJa}</p>
        <ProgressBar value={curriculumProgress} label={`Day ${progress.currentDay} / 全 ${TOTAL_CURRICULUM_DAYS} 日`} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="総学習日数" value={`${progress.totalStudyDays} 日`} />
        <StatCard label="連続学習日数" value={`🔥 ${progress.currentStreak} 日`} sub={`最長 ${progress.longestStreak} 日`} />
        <StatCard label="総学習時間" value={`${Math.round(progress.totalStudyMinutes / 6) / 10} 時間`} />
        <StatCard label="Writing学習数" value={`${progress.writingCompleted} 問`} />
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">直近7日間の学習時間</h2>
        <WeekChart data={computeLast7Days(sessions)} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Reading正答率</p>
          <ProgressBar value={readingRate} label={`${readingRate}% (${progress.readingCorrect}/${progress.readingAttempted})`} colorClassName="bg-green-500" />
        </Card>
        <Card>
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Review正答率</p>
          <ProgressBar value={reviewRate} label={`${reviewRate}% (${progress.reviewCorrect}/${progress.reviewAttempted})`} colorClassName="bg-purple-500" />
        </Card>
      </div>

      {(progress.weakWords.length > 0 || progress.weakGrammar.length > 0) && (
        <Card>
          <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">苦手項目</h2>
          {progress.weakWords.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 text-xs text-slate-400">苦手単語</p>
              <div className="flex flex-wrap gap-1.5">
                {progress.weakWords.map((w) => (
                  <span key={w} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
          {progress.weakGrammar.length > 0 && (
            <div>
              <p className="mb-1 text-xs text-slate-400">苦手文法</p>
              <div className="flex flex-wrap gap-1.5">
                {progress.weakGrammar.map((g) => (
                  <span key={g} className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      <Link to="/settings" className="text-center text-sm text-blue-600 underline dark:text-blue-400">
        学習データのExport / Importは設定画面から行えます →
      </Link>
    </div>
  );
}
