import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ToeicQuestionRunner from '../components/toeic/ToeicQuestionRunner';
import { TOEIC_PART_LABELS } from '../data/toeic/labels';
import { loadAllToeicParts } from '../data/toeic/loader';
import { buildMockTest, buildToeicResult, type FlatToeicItem } from '../services/toeicService';
import { saveToeicResult } from '../db/repositories/toeicResultRepository';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';
import type { ToeicResult } from '../types';

export default function ToeicMockTestPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [items, setItems] = useState<FlatToeicItem[]>([]);
  const [result, setResult] = useState<ToeicResult | null>(null);
  const startedAtRef = useRef<number>(0);

  const handleStart = async () => {
    setPreparing(true);
    const byPart = await loadAllToeicParts();
    setItems(buildMockTest(byPart));
    setPreparing(false);
    startedAtRef.current = Date.now();
    setStarted(true);
  };

  const handleComplete = async (answers: Map<string, number>) => {
    const durationSeconds = Math.round((Date.now() - startedAtRef.current) / 1000);
    const toeicResult = buildToeicResult({ items, answers, durationSeconds });
    await saveToeicResult(toeicResult);
    const progress = await getProgress();
    await saveProgress({ ...progress, toeicMockTestsTaken: progress.toeicMockTestsTaken + 1 });
    setResult(toeicResult);
  };

  if (!started) {
    return (
      <Card className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">TOEIC 模擬テスト</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Part 1〜7から出題します。すべてオリジナル問題で、公式問題ではありません。
        </p>
        <p className="text-xs text-slate-400">
          ※ここで表示されるスコア目安は学習の到達度を示す参考値であり、実際のTOEICスコアではありません。
        </p>
        <Button size="lg" onClick={handleStart} disabled={preparing}>
          {preparing ? '準備中...' : '模擬テストを開始する'}
        </Button>
      </Card>
    );
  }

  if (!result) {
    return <ToeicQuestionRunner items={items} onComplete={(answers) => handleComplete(answers)} />;
  }

  const accuracy = result.totalQuestions === 0 ? 0 : Math.round((result.correct / result.totalQuestions) * 100);

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-4xl">🏁</p>
        <h1 className="text-xl font-bold">模擬テスト結果</h1>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {result.correct} / {result.totalQuestions}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">正答率 {accuracy}%</p>
        <div className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {result.estimatedScoreBand}
        </div>
        <p className="text-xs text-slate-400">※学習の目安であり、実際のTOEICスコアではありません。</p>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">Part別正答率</h2>
        <div className="flex flex-col gap-2">
          {(Object.entries(result.byPart) as [string, { attempted: number; correct: number }][])
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([part, r]) => {
              const rate = r.attempted === 0 ? 0 : Math.round((r.correct / r.attempted) * 100);
              return (
                <div key={part} className="flex items-center justify-between text-sm">
                  <span>{TOEIC_PART_LABELS[Number(part) as 1 | 2 | 3 | 4 | 5 | 6 | 7]}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {r.correct} / {r.attempted}（{rate}%）
                  </span>
                </div>
              );
            })}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => navigate('/toeic')}>
          TOEICトレーニングに戻る
        </Button>
        <Button className="flex-1" onClick={() => navigate('/progress')}>
          Progressを見る
        </Button>
      </div>
    </div>
  );
}
