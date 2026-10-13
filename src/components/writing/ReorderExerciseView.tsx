import { useMemo, useState } from 'react';
import type { ReorderExercise, SelfCheckStatus } from '../../types';
import Button from '../common/Button';
import SelfCheckPanel from './SelfCheckPanel';
import { isReorderCorrect } from '../../services/writingEvaluator';
import { buildSelfCheck } from '../../services/selfCheckService';

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
  onResult: (status: SelfCheckStatus, userAnswerText: string, grading: 'auto' | 'self') => void;
}

export default function ReorderExerciseView({ exercise, onResult }: ReorderExerciseViewProps) {
  const shuffledTokens = useMemo(() => shuffle(exercise.tokens), [exercise.tokens]);
  const [available, setAvailable] = useState<string[]>(shuffledTokens);
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [decision, setDecision] = useState<SelfCheckStatus | null>(null);

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
    if (checked) onResult('correct', chosen.join(' '), 'auto');
    else if (decision) onResult(decision, chosen.join(' '), 'self');
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
      ) : checked ? (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
          <p className="mb-1 font-bold">正解！（自動判定）</p>
          <p>正解: {exercise.correctOrder.join(' ')}</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{exercise.translationJa}</p>
        </div>
      ) : (
        // A different order can still be correct English (e.g. where a time phrase goes).
        <SelfCheckPanel
          userAnswer={chosen.join(' ')}
          answers={[exercise.correctOrder.join(' ')]}
          info={buildSelfCheck(chosen.join(' '), [exercise.correctOrder.join(' ')], {
            tag: exercise.tag,
            extra: ['語順が違っても、英文として意味と文法が成り立つか'],
          })}
          translationJa={exercise.translationJa}
          onDecide={setDecision}
        />
      )}

      {(checked === true || decision !== null) && (
        <Button size="lg" onClick={handleNext}>
          次へ
        </Button>
      )}
    </div>
  );
}
