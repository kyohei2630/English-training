import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import StatCard from '../components/progress/StatCard';
import WeekChart from '../components/progress/WeekChart';
import { useProgress } from '../hooks/useProgress';
import { getAllSessions } from '../db/repositories/sessionRepository';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { getAllToeicResults } from '../db/repositories/toeicResultRepository';
import { computeLast7Days } from '../services/statsService';
import { isMastered } from '../services/masteryService';
import { topWeaknesses } from '../services/weaknessAnalysis';
import { LEVELS, getLevelInfo } from '../data/levels';
import { TOTAL_CURRICULUM_DAYS } from '../services/curriculum';
import { CONTENT_STATS } from '../data/contentStats.generated';
import type { LearningSession, ReviewItem, ToeicResult } from '../types';

const CATEGORY_LABELS_JA: Record<ReviewItem['category'], string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  writing: 'Writing',
  toeic: 'TOEIC',
};

export default function ProgressPage() {
  const { progress, loading } = useProgress();
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [toeicResults, setToeicResults] = useState<ToeicResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setSessions(await getAllSessions());
      setReviewItems(await getAllReviewItems());
      setToeicResults(await getAllToeicResults());
    })();
  }, [progress.totalStudyDays]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const levelInfo = getLevelInfo(progress.currentLevel);
  const readingRate = progress.readingAttempted > 0 ? Math.round((progress.readingCorrect / progress.readingAttempted) * 100) : 0;
  const grammarRate = progress.grammarAttempted > 0 ? Math.round((progress.grammarCorrect / progress.grammarAttempted) * 100) : 0;
  const reviewRate = progress.reviewAttempted > 0 ? Math.round((progress.reviewCorrect / progress.reviewAttempted) * 100) : 0;
  const curriculumProgress = Math.min(100, Math.round((progress.currentDay / TOTAL_CURRICULUM_DAYS) * 100));

  const vocabularyItems = reviewItems.filter((i) => i.category === 'vocabulary');
  const vocabularyMastered = vocabularyItems.filter((i) => isMastered(i)).length;

  const latestToeic = toeicResults[0];
  const weaknesses = topWeaknesses(reviewItems, 5, 3);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Progress</h1>

      <Card>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{levelInfo.name}</p>
        <p className="mb-2 text-xs text-slate-400">{levelInfo.descriptionJa}</p>
        <ProgressBar value={curriculumProgress} label={`Day ${progress.currentDay} / 全 ${TOTAL_CURRICULUM_DAYS} 日`} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">学習ステージ</h2>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <span
              key={l.level}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                l.level === progress.currentLevel
                  ? 'bg-blue-600 text-white'
                  : l.level < progress.currentLevel
                    ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {l.level < progress.currentLevel ? '✓ ' : ''}
              L{l.level} {l.name.replace(/^Level \d+: /, '')}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="総学習日数" value={`${progress.totalStudyDays} 日`} />
        <StatCard label="連続学習日数" value={`🔥 ${progress.currentStreak} 日`} sub={`最長 ${progress.longestStreak} 日`} />
        <StatCard label="総学習時間" value={`${Math.round(progress.totalStudyMinutes / 6) / 10} 時間`} />
        <StatCard label="Vocabulary習得数" value={`${vocabularyMastered} / ${vocabularyItems.length} 語`} />
        <StatCard label="Writing学習数" value={`${progress.writingCompleted} 問`} />
        <StatCard label="TOEIC模擬テスト" value={`${progress.toeicMockTestsTaken} 回`} />
        <StatCard
          label="収録コンテンツ総数"
          value={`${CONTENT_STATS.grammar.total + CONTENT_STATS.vocabulary.total + CONTENT_STATS.readingMaterials.total + CONTENT_STATS.readingQuestions.total + CONTENT_STATS.writing.total + CONTENT_STATS.toeic.total} 件`}
        />
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
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Grammar正答率</p>
          <ProgressBar value={grammarRate} label={`${grammarRate}% (${progress.grammarCorrect}/${progress.grammarAttempted})`} colorClassName="bg-indigo-500" />
        </Card>
        <Card>
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Review正答率</p>
          <ProgressBar value={reviewRate} label={`${reviewRate}% (${progress.reviewCorrect}/${progress.reviewAttempted})`} colorClassName="bg-purple-500" />
        </Card>
        {latestToeic && (
          <Card>
            <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">最新TOEIC模擬テスト</p>
            <p className="text-lg font-bold">{latestToeic.correct} / {latestToeic.totalQuestions}</p>
            <p className="text-xs text-slate-400">{latestToeic.estimatedScoreBand}</p>
          </Card>
        )}
      </div>

      {weaknesses.length > 0 && (
        <Card>
          <h2 className="mb-1 text-sm font-bold text-slate-500 dark:text-slate-400">弱点分析</h2>
          <p className="mb-3 text-xs text-slate-400">タップすると、その分野を追加トレーニングで重点的に学習できます。</p>
          <div className="flex flex-col gap-2">
            {weaknesses.map((w) => (
              <button
                key={`${w.category}-${w.tag}`}
                onClick={() => navigate('/extra-training')}
                className="tap-target flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-left text-sm dark:border-amber-900 dark:bg-amber-950/30"
              >
                <span>
                  <span className="mr-2 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {CATEGORY_LABELS_JA[w.category]}
                  </span>
                  {w.tag}
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-400">正答率 {w.accuracy}%</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {(progress.weakWords.length > 0 || progress.weakGrammar.length > 0) && (
        <Card>
          <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">復習に追加した項目</h2>
          {progress.weakWords.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 text-xs text-slate-400">単語</p>
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
              <p className="mb-1 text-xs text-slate-400">文法</p>
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
