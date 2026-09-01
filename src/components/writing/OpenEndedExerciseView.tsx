import { useState } from 'react';
import type { TranslateExercise, FreeWritingExercise } from '../../types';
import Button from '../common/Button';
import { evaluateAgainstKeywords } from '../../services/writingEvaluator';

interface OpenEndedExerciseViewProps {
  exercise: TranslateExercise | FreeWritingExercise;
  onResult: (wasCorrect: boolean, userAnswerText: string) => void;
}

export default function OpenEndedExerciseView({ exercise, onResult }: OpenEndedExerciseViewProps) {
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);

  const keywords = exercise.type === 'translate' ? exercise.keyPoints : exercise.keyExpressions;
  const evaluation = revealed ? evaluateAgainstKeywords(answer, keywords) : null;

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-slate-50 p-3 text-base leading-relaxed dark:bg-slate-800">{exercise.promptJa}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={revealed}
        rows={exercise.type === 'free' ? 5 : 3}
        placeholder="English answer here..."
        className="w-full rounded-xl border border-slate-300 p-3 text-base leading-relaxed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-900"
      />

      {!revealed ? (
        <Button onClick={() => setRevealed(true)} disabled={answer.trim() === ''}>
          模範解答を見る
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-blue-50 p-4 text-sm dark:bg-blue-950/40">
            <p className="mb-1 font-bold text-blue-800 dark:text-blue-300">模範解答</p>
            <ul className="list-inside list-disc text-blue-900 dark:text-blue-200">
              {exercise.sampleAnswers.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
            <p className="mb-1 font-bold text-slate-600 dark:text-slate-300">
              {exercise.type === 'translate' ? '重要ポイント' : '重要表現'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k, i) => (
                <span
                  key={i}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    evaluation?.matchedKeywords.includes(k)
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {exercise.type === 'free' && (
            <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
              <p className="mb-1 font-bold text-slate-600 dark:text-slate-300">文法ポイント</p>
              <ul className="list-inside list-disc text-slate-600 dark:text-slate-300">
                {exercise.grammarPoints.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            自己評価: 自分の回答は模範解答に近かったですか？
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => onResult(false, answer)}>
              もう少し練習が必要
            </Button>
            <Button className="flex-1" onClick={() => onResult(true, answer)}>
              できた！
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
