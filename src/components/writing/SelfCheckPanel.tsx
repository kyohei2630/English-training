import { useState } from 'react';
import type { SelfCheckStatus } from '../../types';
import type { SelfCheckInfo } from '../../services/selfCheckService';

interface SelfCheckPanelProps {
  userAnswer: string;
  /** accepted answers; the first is the model */
  answers: string[];
  info: SelfCheckInfo;
  /** shown when the app can never grade this kind of answer (free writing) */
  neverAutoGraded?: boolean;
  translationJa?: string;
  /** set when the learner already decided (e.g. a resumed assessment) */
  decided?: SelfCheckStatus;
  onDecide: (status: SelfCheckStatus) => void | Promise<void>;
}

const DECISION_LABELS: Record<SelfCheckStatus, string> = {
  correct: '正しく書けていた',
  incorrect: '間違いがあった',
  unsure: '判断できない（あとで確認）',
};

/**
 * 要自己確認: shown when a typed answer matches no registered answer. It is not marked wrong —
 * the app can only compare with the answers it knows, and a different correct sentence is
 * possible. The learner checks it against the model and the grammar points and decides.
 */
export default function SelfCheckPanel({ userAnswer, answers, info, neverAutoGraded, translationJa, decided, onDecide }: SelfCheckPanelProps) {
  const [busy, setBusy] = useState(false);
  const [choice, setChoice] = useState<SelfCheckStatus | undefined>(decided);

  const decide = async (s: SelfCheckStatus) => {
    if (choice || busy) return;
    setBusy(true);
    setChoice(s);
    await onDecide(s);
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/30">
      <div>
        <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">要自己確認</span>
        <p className="mt-2 text-amber-900 dark:text-amber-200">
          {neverAutoGraded
            ? '自由記述はアプリでは採点できません。模範解答と確認項目を見て判断してください。'
            : '登録済みの解答と一致しなかったため、自動では判定していません（別の正しい表現の可能性があります）。'}
        </p>
      </div>

      <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
        <p className="text-xs text-slate-500">あなたの解答</p>
        <p className="font-medium">{userAnswer || '（未入力）'}</p>
        <p className="mt-2 text-xs text-slate-500">模範解答</p>
        <p className="font-medium text-blue-800 dark:text-blue-300">{answers[0]}</p>
        {answers.length > 1 && (
          <>
            <p className="mt-2 text-xs text-slate-500">ほかに登録されている解答</p>
            <ul className="list-inside list-disc text-xs text-slate-600 dark:text-slate-300">
              {answers.slice(1).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </>
        )}
        {translationJa && <p className="mt-2 text-xs text-slate-500">訳: {translationJa}</p>}
      </div>

      {(info.missingWords.length > 0 || info.extraWords.length > 0) && (
        <div className="flex flex-col gap-1 text-xs">
          {info.missingWords.length > 0 && (
            <p>
              <span className="text-slate-500">模範解答にあって、あなたの解答にない語: </span>
              {info.missingWords.map((w) => (
                <span key={w} className="mr-1 rounded bg-white px-1.5 py-0.5 font-medium dark:bg-slate-900">
                  {w}
                </span>
              ))}
            </p>
          )}
          {info.extraWords.length > 0 && (
            <p>
              <span className="text-slate-500">あなたの解答にだけある語: </span>
              {info.extraWords.map((w) => (
                <span key={w} className="mr-1 rounded bg-white px-1.5 py-0.5 font-medium dark:bg-slate-900">
                  {w}
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      <div>
        <p className="mb-1 text-xs font-bold text-slate-600 dark:text-slate-300">文法確認項目</p>
        <ul className="list-inside list-disc text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {info.checkpoints.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs text-slate-500">自己評価（記録上「自己評価」として、自動採点と区別されます）</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(['correct', 'incorrect', 'unsure'] as SelfCheckStatus[]).map((s) => (
            <button
              key={s}
              disabled={!!choice || busy}
              onClick={() => decide(s)}
              className={`tap-target rounded-xl px-3 py-3 text-sm font-medium ${
                choice === s
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {DECISION_LABELS[s]}
            </button>
          ))}
        </div>
        {choice === 'unsure' && (
          <p className="mt-2 text-xs text-slate-500">正誤には数えず、明日の復習でもう一度確認します。</p>
        )}
      </div>
    </div>
  );
}
