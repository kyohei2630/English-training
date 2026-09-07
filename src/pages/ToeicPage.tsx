import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ToeicQuestionRunner from '../components/toeic/ToeicQuestionRunner';
import { TOEIC_PART_LABELS } from '../data/toeic/labels';
import { loadToeicPart } from '../data/toeic/loader';
import { CONTENT_STATS } from '../data/contentStats.generated';
import { flattenToeicQuestions, type FlatToeicItem } from '../services/toeicService';
import type { ToeicPart } from '../types';

const PARTS: ToeicPart[] = [1, 2, 3, 4, 5, 6, 7];

export default function ToeicPage() {
  const navigate = useNavigate();
  const [activePart, setActivePart] = useState<ToeicPart | null>(null);
  const [items, setItems] = useState<FlatToeicItem[]>([]);
  const [loadingPart, setLoadingPart] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; part: ToeicPart } | null>(null);

  const startPart = async (part: ToeicPart) => {
    setActivePart(part);
    setResult(null);
    setLoadingPart(true);
    const questions = await loadToeicPart(part);
    setItems(flattenToeicQuestions(questions));
    setLoadingPart(false);
  };

  if (activePart && loadingPart) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  if (activePart && !result) {
    return (
      <ToeicQuestionRunner
        items={items}
        onComplete={(_answers, correct) => setResult({ correct, total: items.length, part: activePart })}
      />
    );
  }

  if (result) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-4xl">✅</p>
        <h1 className="text-xl font-bold">{TOEIC_PART_LABELS[result.part]} 完了</h1>
        <p className="text-lg">
          {result.correct} / {result.total} 問正解
        </p>
        <Button onClick={() => { setActivePart(null); setResult(null); }}>Part選択に戻る</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">TOEIC トレーニング</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Part を選んで練習しましょう。特にPart 5〜7はTOEICのスコアに直結しやすい分野です。
      </p>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
        <p className="mb-3 text-sm text-blue-800 dark:text-blue-300">全パートを通しで解く模擬テストも用意しています。</p>
        <Button size="lg" className="w-full" onClick={() => navigate('/toeic/mock-test')}>
          TOEIC模擬テストを受ける
        </Button>
      </Card>

      <div className="flex flex-col gap-2">
        {PARTS.map((part) => (
          <button
            key={part}
            onClick={() => startPart(part)}
            className="tap-target flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="font-medium">{TOEIC_PART_LABELS[part]}</span>
            <span className="text-sm text-slate-400">{CONTENT_STATS.toeic.byPart[part]} 問収録</span>
          </button>
        ))}
      </div>
    </div>
  );
}
