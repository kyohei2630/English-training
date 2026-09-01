import { useState } from 'react';
import type { FillBlankExercise } from '../../types';
import Button from '../common/Button';
import { isFillBlankCorrect } from '../../services/writingEvaluator';

interface FillBlankExerciseViewProps {
  exercise: FillBlankExercise;
  onResult: (wasCorrect: boolean, userAnswerText: string) => void;
}

export default function FillBlankExerciseView({ exercise, onResult }: FillBlankExerciseViewProps) {
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<boolean | null>(null);

  const parts = exercise.sentence.split('___');

  const handleCheck = () => {
    setChecked(isFillBlankCorrect(answer, exercise.answers));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg leading-relaxed">
        {parts[0]}
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={checked !== null}
          placeholder="___"
          className="mx-1 w-28 rounded-lg border-b-2 border-blue-400 bg-blue-50 px-2 py-1 text-center font-medium disabled:opacity-70 dark:bg-blue-950/40"
        />
        {parts[1]}
      </p>
      {exercise.hint && <p className="text-xs text-slate-400">ヒント: {exercise.hint}</p>}

      {checked === null ? (
        <Button onClick={handleCheck} disabled={answer.trim() === ''}>
          答え合わせ
        </Button>
      ) : (
        <>
          <div className={`rounded-xl p-4 text-sm ${checked ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>
            <p className="mb-1 font-bold">{checked ? '正解！' : '不正解'}</p>
            <p>正解: {exercise.answers.join(' / ')}</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{exercise.translationJa}</p>
          </div>
          <Button size="lg" onClick={() => onResult(!!checked, answer)}>
            次へ
          </Button>
        </>
      )}
    </div>
  );
}
