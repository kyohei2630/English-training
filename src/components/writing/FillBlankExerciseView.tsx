import { useState } from 'react';
import type { FillBlankExercise, SelfCheckStatus } from '../../types';
import Button from '../common/Button';
import SelfCheckPanel from './SelfCheckPanel';
import { isSentenceCorrect } from '../../services/sentenceBuildingService';
import { buildSelfCheck } from '../../services/selfCheckService';

interface FillBlankExerciseViewProps {
  exercise: FillBlankExercise;
  onResult: (status: SelfCheckStatus, userAnswerText: string, grading: 'auto' | 'self') => void;
}

export default function FillBlankExerciseView({ exercise, onResult }: FillBlankExerciseViewProps) {
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<'exact' | 'self-check' | null>(null);
  const [decision, setDecision] = useState<SelfCheckStatus | null>(null);

  const parts = exercise.sentence.split('___');
  const fill = (word: string) => `${parts[0]}${word}${parts[1] ?? ''}`;
  const modelSentences = exercise.answers.map(fill);

  const handleCheck = () => {
    // Compared as whole sentences, so contractions and spacing don't matter (don't = do not).
    setChecked(isSentenceCorrect(fill(answer), modelSentences) ? 'exact' : 'self-check');
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
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="mx-1 w-28 rounded-lg border-b-2 border-blue-400 bg-blue-50 px-2 py-1 text-center font-medium disabled:opacity-70 dark:bg-blue-950/40"
        />
        {parts[1]}
      </p>
      {exercise.hint && <p className="text-xs text-slate-400">ヒント: {exercise.hint}</p>}

      {checked === null && (
        <Button onClick={handleCheck} disabled={answer.trim() === ''}>
          答え合わせ
        </Button>
      )}

      {checked === 'exact' && (
        <>
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
            <p className="mb-1 font-bold">正解！（自動判定）</p>
            <p>正解: {exercise.answers.join(' / ')}</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{exercise.translationJa}</p>
          </div>
          <Button size="lg" onClick={() => onResult('correct', answer, 'auto')}>
            次へ
          </Button>
        </>
      )}

      {checked === 'self-check' && (
        <>
          <SelfCheckPanel
            userAnswer={fill(answer)}
            answers={modelSentences}
            info={buildSelfCheck(fill(answer), modelSentences, { tag: exercise.tag, hintJa: exercise.hint })}
            translationJa={exercise.translationJa}
            onDecide={setDecision}
          />
          {decision && (
            <Button size="lg" onClick={() => onResult(decision, answer, 'self')}>
              次へ
            </Button>
          )}
        </>
      )}
    </div>
  );
}
