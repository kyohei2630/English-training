import { useCallback, useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ReviewSession from '../components/review/ReviewSession';
import { getDueReviewItems } from '../db/repositories/reviewRepository';
import { getTodayReview, markReviewPlanAnswer, selectExtraReview, type TodayReview } from '../services/reviewPlanService';
import { todayLocalISODate } from '../utils/date';
import type { ReviewItem } from '../types';

const CATEGORY_LABELS: Record<ReviewItem['category'] | 'all', string> = {
  all: '今日の復習',
  vocabulary: '単語',
  grammar: '文法',
  reading: '読解',
  writing: '英作文',
  toeic: 'TOEIC',
};

type Category = ReviewItem['category'] | 'all';

export default function ReviewPage() {
  const [today, setToday] = useState<TodayReview | null>(null);
  const [dueCounts, setDueCounts] = useState<Record<Category, number> | null>(null);
  const [category, setCategory] = useState<Category>('all');
  /** an optional extra batch (a category, or more after today's review is done) */
  const [extra, setExtra] = useState<ReviewItem[] | null>(null);
  const [result, setResult] = useState<{ correct: number; total: number; selfGraded: number } | null>(null);
  const [round, setRound] = useState(0);

  const reload = useCallback(async () => {
    const [todayReview, due] = await Promise.all([getTodayReview(), getDueReviewItems(todayLocalISODate())]);
    const counts = { all: todayReview.remaining.length } as Record<Category, number>;
    for (const key of Object.keys(CATEGORY_LABELS) as Category[]) {
      if (key !== 'all') counts[key] = due.filter((i) => i.category === key).length;
    }
    setToday(todayReview);
    setDueCounts(counts);
  }, []);

  useEffect(() => {
    (async () => {
      await reload();
    })();
  }, [reload]);

  const chooseCategory = async (key: Category) => {
    setCategory(key);
    setResult(null);
    setExtra(key === 'all' ? null : await selectExtraReview(key));
    setRound((r) => r + 1);
  };

  const startMore = async () => {
    setResult(null);
    setExtra(await selectExtraReview());
    setRound((r) => r + 1);
  };

  const finish = async (correct: number, total: number, selfGraded: number) => {
    setResult({ correct, total, selfGraded });
    await reload();
  };

  if (!today || !dueCounts) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const carriedOver = Math.max(0, today.backlog - today.remaining.length);

  const header = (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold">Review</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        今日の復習 {today.doneCount} / {today.items.length} 問
        {carriedOver > 0 && `・残り${carriedOver}件は翌日以降に優先度順で出題`}
      </p>
      {today.plan.loadHigh && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          復習待ちが増えています。しばらくは復習を多め（最大10問）にし、新しい文法演習を少し減らして調整します。
        </p>
      )}
    </div>
  );

  if (result) {
    const extraDone = extra !== null || today.complete;
    return (
      <div className="flex flex-col gap-5">
        {header}
        <Card className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-4xl">🔄</p>
          <h2 className="text-xl font-bold">{extra === null ? '今日の復習完了' : '追加の復習完了'}</h2>
          <p className="text-lg">
            {result.correct} / {result.total} 問正解
          </p>
          {result.selfGraded > 0 && (
            <p className="text-xs text-slate-500">自己評価で判定した {result.selfGraded} 問は、正答数に含めていません。</p>
          )}
          <div className="flex w-full flex-col gap-2">
            {extraDone && today.backlog > 0 && (
              <Button variant="secondary" onClick={startMore}>
                もう少し復習する（任意・5問）
              </Button>
            )}
            <Button
              onClick={() => {
                setResult(null);
                setExtra(null);
                setCategory('all');
              }}
            >
              Review画面に戻る
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  let session;
  if (extra !== null) {
    session = <ReviewSession key={`extra-${round}`} items={extra} onAnswered={(i, ok, grading) => markReviewPlanAnswer(i.id, ok, grading)} onComplete={finish} />;
  } else if (today.complete) {
    session = (
      <Card className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-lg font-medium">🎉 今日の復習は完了しています</p>
        {today.backlog > 0 ? (
          <>
            <p className="text-sm text-slate-500">復習待ちの残りは翌日以降に回ります。続けたい場合だけどうぞ。</p>
            <Button variant="secondary" onClick={startMore}>
              もう少し復習する（任意・5問）
            </Button>
          </>
        ) : (
          <p className="text-sm text-slate-500">復習待ちの項目はありません。</p>
        )}
      </Card>
    );
  } else {
    session = (
      <ReviewSession
        key={`plan-${round}`}
        items={today.remaining}
        progressOffset={today.doneCount}
        progressTotal={today.items.length}
        onAnswered={(i, ok, grading) => markReviewPlanAnswer(i.id, ok, grading)}
        onComplete={async () => {
          // Score the whole day's assignment, including questions answered before an interruption.
          const updated = await getTodayReview();
          await finish(updated.correctCount, updated.objectiveTotal, updated.selfGradedCount);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {header}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((key) => (
          <button
            key={key}
            onClick={() => chooseCategory(key)}
            className={`tap-target shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              category === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {CATEGORY_LABELS[key]} ({dueCounts[key]})
          </button>
        ))}
      </div>

      {session}
    </div>
  );
}
