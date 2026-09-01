import { useMemo, useState } from 'react';
import type { ReorderExercise } from '../../types';
import Button from '../common/Button';
import { isReorderCorrect } from '../../services/writingEvaluator';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface ReorderExerciseViewProps {
  exercise: ReorderExercise;
  onResult: (wasCorrect: boolean, userAnswerText: string) => void;
}

export default function ReorderExerciseView({ exercise, onResult }: ReorderExerciseViewProps) {
  const shuffledTokens = useMemo(() => shuffle(exercise.tokens), [exercise.tokens]);
  const [available, setAvailable] = useState<string[]>(shuffledTokens);
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);

  const pick = (token: string, fromIndex: number) => {
    if (checked !== null) return;
    setChosen((c) => [...c, token]);
    setAvailable((a) => a.filter((_, i) => i !== fromIndex));
  };

  const removeChosen = (index: number) => {
    if (checked !== null) return;
    const token = chosen[index];
    setChosen((c) => c.filter((_, i) => i !== index));
    setAvailable((a) => [...a, token]);
  };

  const reset = () => {
    setAvailable(shuffledTokens);
    setChosen([]);
    setChecked(null);
  };

  const handleCheck = () => {
    const correct = isReorderCorrect(chosen, exercise.correctOrder);
    setChecked(correct);
  };

  const handleNext = () => {
    onResult(!!checked, chosen.join(' '));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-16 rounded-xl border-2 border-dashed border-slate-300 p-3 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          {chosen.length === 0 && <span className="text-sm text-slate-400">下の単語をタップして文を作りましょう</span>}
          {chosen.map((token, i) => (
            <button
              key={i}
              onClick={() => removeChosen(i)}
              className="tap-target rounded-lg bg-blue-600 px-3 py-2 text-white"
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map((token, i) => (
          <button
            key={`${token}-${i}`}
            onClick={() => pick(token, i)}
            disabled={checked !== null}
            className="tap-target rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800"
          >
            {token}
          </button>
        ))}
      </div>

      {checked === null ? (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={reset}>
            リセット
          </Button>
          <Button className="flex-1" onClick={handleCheck} disabled={available.length > 0}>
            答え合わせ
          </Button>
        </div>
      ) : (
        <div className={`rounded-xl p-4 text-sm ${checked ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>
          <p className="mb-1 font-bold">{checked ? '正解！' : '不正解'}</p>
          <p>正解: {exercise.correctOrder.join(' ')}</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{exercise.translationJa}</p>
        </div>
      )}

      {checked !== null && (
        <Button size="lg" onClick={handleNext}>
          次へ
        </Button>
      )}
    </div>
  );
}
