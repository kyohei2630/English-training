import { useState } from 'react';
import type { Level, UnderstandingQuestion } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { recordUnderstandingAnswer } from '../../services/reviewService';

interface UnderstandingQuizProps {
  questions: UnderstandingQuestion[];
  level?: Level;
  onComplete: (correctCount: number, totalCount: number) => void;
}

export default function UnderstandingQuiz({ questions, level, onComplete }: UnderstandingQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  if (questions.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">この教材には理解度チェック問題がありません。</p>
        <Button className="mt-4" onClick={() => onComplete(0, 0)}>
          次へ進む
        </Button>
      </Card>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = async (choiceIndex: number) => {
    if (selected !== null) return;
    setSelected(choiceIndex);
    const isCorrect = choiceIndex === question.correctIndex;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }
    await recordUnderstandingAnswer(question, isCorrect, level);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(correctCount, questions.length);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        問題 {index + 1} / {questions.length}
      </p>
      <Card>
        <p className="mb-4 text-lg font-medium leading-relaxed">{question.question}</p>
        <div className="flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const isCorrectChoice = i === question.correctIndex;
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
              selected === question.correctIndex
                ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
            }`}
          >
            <p className="mb-1 font-bold">{selected === question.correctIndex ? '正解！' : '不正解'}</p>
            <p>{question.explanation}</p>
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
