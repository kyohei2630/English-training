import { useState } from 'react';
import type { FlatToeicItem } from '../../services/toeicService';
import Card from '../common/Card';
import Button from '../common/Button';
import { recordAnswer } from '../../services/reviewService';

interface ToeicQuestionRunnerProps {
  items: FlatToeicItem[];
  onComplete: (answers: Map<string, number>, correctCount: number) => void;
}

export default function ToeicQuestionRunner({ items, onComplete }: ToeicQuestionRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers] = useState<Map<string, number>>(() => new Map());

  if (items.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">出題できる問題がありません。</p>
      </Card>
    );
  }

  const item = items[index];
  const isLast = index === items.length - 1;

  const handleSelect = async (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    answers.set(item.id, i);
    const wasCorrect = i === item.correctIndex;
    if (wasCorrect) setCorrectCount((c) => c + 1);
    await recordAnswer({
      category: 'toeic',
      refId: item.id,
      promptText: item.prompt,
      answerText: item.choices[item.correctIndex],
      explanation: item.explanation,
      tag: item.tag,
      level: 6,
      wasCorrect,
    });
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(answers, correctCount);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        Part {item.part} ・ {index + 1} / {items.length}
      </p>
      <Card>
        {item.passageTitle && <p className="mb-2 text-sm font-bold text-slate-500">{item.passageTitle}</p>}
        {item.contextLines && (
          <div className="mb-4 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm leading-relaxed dark:bg-slate-800">
            {item.contextLines.join('\n')}
          </div>
        )}
        <p className="mb-4 text-lg font-medium leading-relaxed">{item.prompt}</p>
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
            className={`mt-4 whitespace-pre-line rounded-xl p-4 text-sm ${
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
          {isLast ? '結果を見る' : '次の問題へ'}
        </Button>
      )}
    </div>
  );
}
