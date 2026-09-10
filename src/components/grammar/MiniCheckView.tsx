import { useState } from 'react';
import type { GrammarTheoryMiniCheckItem } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';

interface MiniCheckViewProps {
  items: GrammarTheoryMiniCheckItem[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

/** A short, low-stakes comprehension check shown right after reading a Theory —
 * separate from Grammar Practice, whose purpose is just "did reading this
 * actually sink in, or did it only feel like it did?" */
export default function MiniCheckView({ items, onComplete }: MiniCheckViewProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  if (items.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">このテーマのMini Checkはまだありません。</p>
        <Button className="mt-4" onClick={() => onComplete(0, 0)}>
          次へ
        </Button>
      </Card>
    );
  }

  const item = items[index];
  const isLast = index === items.length - 1;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === item.correctIndex) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(correctCount, items.length);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        Mini Check {index + 1} / {items.length}
      </p>
      <Card>
        <p className="mb-4 text-lg font-medium leading-relaxed">{item.question}</p>
        <div className="flex flex-col gap-2">
          {item.choices.map((choice, i) => {
            const isCorrectChoice = i === item.correctIndex;
            const isSelected = i === selected;
            let stateClasses = 'border-slate-200 dark:border-slate-700';
            if (selected !== null) {
              if (isCorrectChoice) stateClasses = 'border-green-500 bg-green-50 dark:bg-green-950/40';
              else if (isSelected) stateClasses = 'border-red-500 bg-red-50 dark:bg-red-950/40';
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`tap-target rounded-xl border px-4 py-3 text-left text-base ${stateClasses} disabled:cursor-default`}
              >
                <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                {choice}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm ${
              selected === item.correctIndex
                ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
            }`}
          >
            <p className="mb-1 font-bold">{selected === item.correctIndex ? '正解！' : '不正解'}</p>
            <p>{item.explanation}</p>
          </div>
        )}
      </Card>
      {selected !== null && (
        <Button size="lg" onClick={handleNext}>
          {isLast ? '完了' : '次へ'}
        </Button>
      )}
    </div>
  );
}
