import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ReviewSession from '../components/review/ReviewSession';
import { getDueReviewItems } from '../db/repositories/reviewRepository';
import { todayLocalISODate } from '../utils/date';
import type { ReviewItem } from '../types';

const CATEGORY_LABELS: Record<ReviewItem['category'] | 'all', string> = {
  all: 'すべて',
  vocabulary: '単語',
  grammar: '文法',
  reading: '読解',
  writing: '英作文',
};

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [category, setCategory] = useState<ReviewItem['category'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    (async () => {
      const due = await getDueReviewItems(todayLocalISODate());
      setItems(due);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  if (result) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-4xl">🔄</p>
        <h1 className="text-xl font-bold">復習完了</h1>
        <p className="text-lg">
          {result.correct} / {result.total} 問正解
        </p>
        <Button onClick={() => setResult(null)}>Review画面に戻る</Button>
      </Card>
    );
  }

  const filtered = category === 'all' ? items : items.filter((i) => i.category === category);
  const counts: Record<ReviewItem['category'] | 'all', number> = {
    all: items.length,
    vocabulary: items.filter((i) => i.category === 'vocabulary').length,
    grammar: items.filter((i) => i.category === 'grammar').length,
    reading: items.filter((i) => i.category === 'reading').length,
    writing: items.filter((i) => i.category === 'writing').length,
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Review</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(CATEGORY_LABELS) as Array<ReviewItem['category'] | 'all'>).map((key) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`tap-target shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              category === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {CATEGORY_LABELS[key]} ({counts[key]})
          </button>
        ))}
      </div>

      <ReviewSession
        key={category}
        items={filtered}
        onComplete={(correct, total) => setResult({ correct, total })}
      />
    </div>
  );
}
