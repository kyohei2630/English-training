import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import type { NoteSelfEval, NoteTask } from '../../types';
import { NOTE_KIND_LABELS, SELF_EVAL_LABELS } from '../../services/noteTaskService';

interface NoteTaskCardProps {
  task: NoteTask;
  /** e.g. "10月12日の課題" for a task from an earlier day */
  dateLabel?: string;
  onEvaluate: (selfEval: NoteSelfEval) => Promise<void> | void;
}

const EVAL_STYLES: Record<NoteSelfEval, string> = {
  independent: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  hinted: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  failed: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
};

/** A paper-notebook task: read the prompt on the iPad, write in the notebook, then compare with
 * the model answer and rate yourself. Nothing has to be photographed or uploaded. */
export default function NoteTaskCard({ task, dateLabel, onEvaluate }: NoteTaskCardProps) {
  const [showModel, setShowModel] = useState(false);
  const [busy, setBusy] = useState(false);

  const rate = async (e: NoteSelfEval) => {
    setBusy(true);
    await onEvaluate(e);
    setBusy(false);
  };

  return (
    <Card className={task.main ? 'border-emerald-300 dark:border-emerald-800' : ''}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {NOTE_KIND_LABELS[task.kind]}
        </span>
        <span className="text-xs text-slate-500">約{task.estimatedMinutes}分</span>
        {task.main && <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">今日のメイン</span>}
        {dateLabel && <span className="text-xs text-slate-400">{dateLabel}</span>}
      </div>
      <h3 className="font-bold">{task.titleJa}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{task.promptJa}</p>
      {task.material && (
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-lg leading-relaxed dark:bg-slate-800">{task.material}</p>
      )}

      {task.selfEval ? (
        <p className={`mt-3 w-fit rounded-full px-3 py-1 text-sm font-medium ${EVAL_STYLES[task.selfEval]}`}>
          自己評価: {SELF_EVAL_LABELS[task.selfEval]}
        </p>
      ) : (
        <>
          {!showModel ? (
            <Button variant="secondary" className="mt-3 w-full" onClick={() => setShowModel(true)}>
              ノートに書いたら、答えを確認する
            </Button>
          ) : (
            <>
              <ul className="mt-3 flex flex-col gap-1 rounded-xl bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                {task.modelAnswer.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <p className="mt-3 text-center text-xs text-slate-500">自己評価（できなかったものは復習に入ります）</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(['independent', 'hinted', 'failed'] as NoteSelfEval[]).map((e) => (
                  <button
                    key={e}
                    disabled={busy}
                    onClick={() => rate(e)}
                    className={`tap-target rounded-xl px-2 py-3 text-sm font-medium ${EVAL_STYLES[e]}`}
                  >
                    {SELF_EVAL_LABELS[e]}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}
