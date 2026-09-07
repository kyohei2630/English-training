import { useMemo, useState } from 'react';
import type { VocabularyEntry } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { generateVocabQuizSet } from '../../services/vocabularyQuiz';
import { recordAnswer } from '../../services/reviewService';

interface VocabularyQuizSessionProps {
  entries: VocabularyEntry[];
  pool: VocabularyEntry[];
  questionCount?: number;
  onComplete: (correctCount: number, totalCount: number) => void;
}

export default function VocabularyQuizSession({ entries, pool, questionCount = 10, onComplete }: VocabularyQuizSessionProps) {
  const quiz = useMemo(() => generateVocabQuizSet(entries, pool, questionCount), [entries, pool, questionCount]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  if (quiz.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">出題できる単語がありません。</p>
        <Button className="mt-4" onClick={() => onComplete(0, 0)}>
          戻る
        </Button>
      </Card>
    );
  }

  const item = quiz[index];
  const isLast = index === quiz.length - 1;

  const handleSelect = async (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const wasCorrect = i === item.correctIndex;
    if (wasCorrect) setCorrectCount((c) => c + 1);
    await recordAnswer({
      category: 'vocabulary',
      refId: item.entry.id,
      promptText: item.entry.word,
      answerText: item.entry.meaningJa,
      explanation: item.explanation,
      tag: item.entry.category,
      level: item.entry.level,
      wasCorrect,
    });
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(correctCount, quiz.length);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        {index + 1} / {quiz.length}
      </p>
      <Card>
        <p className="mb-4 text-xl font-medium leading-relaxed">{item.prompt}</p>
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
