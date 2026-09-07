import { useState } from 'react';
import type { ReviewItem } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { applyReviewAnswer } from '../../services/reviewScheduler';
import { upsertReviewItem } from '../../db/repositories/reviewRepository';

const CATEGORY_LABELS: Record<ReviewItem['category'], string> = {
  vocabulary: '単語',
  grammar: '文法',
  reading: '読解',
  writing: '英作文',
  toeic: 'TOEIC',
};

interface ReviewSessionProps {
  items: ReviewItem[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

export default function ReviewSession({ items, onComplete }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-lg font-medium">🎉 復習項目はありません</p>
        <p className="mt-1 text-sm text-slate-500">今日復習すべき項目はすべて終わっています。</p>
      </Card>
    );
  }

  const item = items[index];
  const isLast = index === items.length - 1;

  const handleAnswer = async (wasCorrect: boolean) => {
    const updated = applyReviewAnswer(item, wasCorrect);
    await upsertReviewItem(updated);
    const nextCorrect = wasCorrect ? correctCount + 1 : correctCount;
    if (isLast) {
      onComplete(nextCorrect, items.length);
    } else {
      setCorrectCount(nextCorrect);
      setRevealed(false);
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        {index + 1} / {items.length}
      </p>
      <Card>
        <span className="mb-3 inline-block w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {CATEGORY_LABELS[item.category]}
        </span>
        <p className="text-lg leading-relaxed">{item.promptText}</p>

        {revealed ? (
          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm dark:bg-blue-950/40">
            <p className="mb-1 font-bold text-blue-800 dark:text-blue-300">答え</p>
            <p className="text-blue-900 dark:text-blue-200">{item.answerText}</p>
            {item.explanation && <p className="mt-2 text-blue-700 dark:text-blue-400">{item.explanation}</p>}
          </div>
        ) : (
          <Button className="mt-4" variant="secondary" onClick={() => setRevealed(true)}>
            答えを見る
          </Button>
        )}
      </Card>

      {revealed && (
        <div className="flex gap-2">
          <Button variant="danger" className="flex-1" onClick={() => handleAnswer(false)}>
            不正解だった
          </Button>
          <Button className="flex-1" onClick={() => handleAnswer(true)}>
            正解した
          </Button>
        </div>
      )}
    </div>
  );
}
