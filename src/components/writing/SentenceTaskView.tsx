import { useMemo, useState } from 'react';
import Button from '../common/Button';
import SelfCheckPanel from './SelfCheckPanel';
import type { AnswerSource, SelfCheckStatus, TypedAnswerResult } from '../../types';
import { recordAnswer } from '../../services/reviewService';
import { hintChunks, isSentenceCorrect, normalizeSentence, type SentenceTask } from '../../services/sentenceBuildingService';
import { buildSelfCheck, markForSelfCheck } from '../../services/selfCheckService';

interface SentenceTaskViewProps {
  task: SentenceTask;
  source?: AnswerSource;
  onDone: (result: TypedAnswerResult) => void;
  doneLabel?: string;
  /** false in assessments: no word-chunk hint */
  allowHint?: boolean;
  /** false: don't write to the review deck — the caller applies the result later (assessments) */
  record?: boolean;
  /** called as soon as an answer is submitted, before any self-check (assessments save it) */
  onSubmit?: (userAnswer: string, exact: boolean) => void | Promise<void>;
  /** called when the answer is final (auto-matched, or the self-check decided) */
  onResult?: (result: TypedAnswerResult) => void | Promise<void>;
  /** resume a submitted answer (and its self-check decision, if made) */
  restored?: { userAnswer: string; status?: SelfCheckStatus };
}

/**
 * Compose one English sentence from Japanese. Offline, the app can only compare with the answers
 * it knows: an exact match (ignoring case, punctuation, contractions, spelled-out numbers) is
 * marked right automatically. Anything else is not marked wrong — it goes to 要自己確認, where the
 * learner checks it against the model and the grammar points; that decision is recorded as a
 * self-evaluation, and "判断できない" keeps it for re-checking without counting it either way.
 */
export default function SentenceTaskView({
  task,
  source = 'sentence-building',
  onDone,
  doneLabel = '次へ',
  allowHint = true,
  record = true,
  onSubmit,
  onResult,
  restored,
}: SentenceTaskViewProps) {
  const [answer, setAnswer] = useState(restored?.userAnswer ?? '');
  const [hintShown, setHintShown] = useState(false);
  const [submitted, setSubmitted] = useState(restored !== undefined);
  const exact = submitted && isSentenceCorrect(answer, task.answers);
  const [result, setResult] = useState<TypedAnswerResult | null>(() =>
    restored?.status
      ? { status: restored.status, grading: isSentenceCorrect(restored.userAnswer, task.answers) ? 'auto' : 'self', exact: isSentenceCorrect(restored.userAnswer, task.answers), hintUsed: false, userAnswer: restored.userAnswer }
      : null
  );
  const chunks = useMemo(() => hintChunks(task.answers[0], task.refId), [task]);
  const info = useMemo(() => buildSelfCheck(answer, task.answers, { tag: task.tag, hintJa: task.hintJa }), [answer, task]);

  const save = async (r: TypedAnswerResult) => {
    setResult(r);
    await onResult?.(r);
    if (!record) return;
    const common = {
      category: 'writing' as const,
      refId: task.refId,
      promptText: task.promptJa,
      answerText: task.answers[0],
      explanation: task.hintJa,
      tag: task.tag,
      level: task.level,
    };
    if (r.status === 'unsure') {
      await markForSelfCheck({ ...common, userAnswer: r.userAnswer });
      return;
    }
    await recordAnswer({
      ...common,
      // Right only with the word chunks shown: kept in review until it's done unaided.
      wasCorrect: r.status === 'correct' && !r.hintUsed,
      source,
      grading: r.grading,
      skill: task.research ? 'research' : undefined,
    });
  };

  const check = async () => {
    const isExact = isSentenceCorrect(answer, task.answers);
    setSubmitted(true);
    await onSubmit?.(answer, isExact);
    if (isExact) await save({ status: 'correct', grading: 'auto', exact: true, hintUsed: hintShown, userAnswer: answer });
  };

  const decide = (status: SelfCheckStatus) => save({ status, grading: 'self', exact: false, hintUsed: hintShown, userAnswer: answer });

  const userWords = new Set(normalizeSentence(answer).split(' '));
  const keyPhraseHits = (task.keyPhrases ?? []).map((p) => ({
    phrase: p,
    hit: normalizeSentence(p)
      .split(' ')
      .every((w) => userWords.has(w)),
  }));

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl bg-slate-50 p-3 text-base leading-relaxed dark:bg-slate-800">{task.promptJa}</p>

      {hintShown && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
          {task.hintJa && <p className="mb-2 text-amber-800 dark:text-amber-300">💡 {task.hintJa}</p>}
          <div className="flex flex-wrap gap-1.5">
            {chunks.map((c, i) => (
              <span key={i} className="rounded-lg bg-white px-2 py-1 font-medium dark:bg-slate-900">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
        rows={2}
        autoCapitalize="sentences"
        autoCorrect="off"
        spellCheck={false}
        placeholder="英文を入力..."
        className="w-full rounded-xl border border-slate-300 p-3 text-base leading-relaxed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-900"
      />

      {!submitted && (
        <div className="flex gap-2">
          {allowHint && !hintShown && (
            <Button variant="secondary" className="flex-1" onClick={() => setHintShown(true)}>
              ヒント（語群）
            </Button>
          )}
          <Button className="flex-1" onClick={check} disabled={answer.trim() === ''}>
            答え合わせ
          </Button>
        </div>
      )}

      {submitted && exact && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
          <p className="font-bold">
            {hintShown ? 'ヒントありで正解（自動判定）。次は語群なしで書けるよう、復習に入れます。' : '正解（自動判定）'}
          </p>
          <p className="mt-2">模範解答: {task.answers[0]}</p>
          {task.hintJa && !hintShown && <p className="mt-1 text-xs opacity-80">💡 {task.hintJa}</p>}
        </div>
      )}

      {submitted && !exact && (
        <>
          <SelfCheckPanel userAnswer={answer} answers={task.answers} info={info} decided={result?.status} onDecide={decide} />
          {keyPhraseHits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500">重要表現:</span>
              {keyPhraseHits.map((k) => (
                <span
                  key={k.phrase}
                  className={`rounded-full px-2 py-0.5 text-xs ${k.hit ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
                >
                  {k.phrase}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {result && (
        <Button size="lg" onClick={() => onDone(result)}>
          {doneLabel}
        </Button>
      )}
    </div>
  );
}
