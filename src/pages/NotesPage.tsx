import { useCallback, useEffect, useState } from 'react';
import NoteTaskCard from '../components/notes/NoteTaskCard';
import { getOrCreateTodaySession } from '../services/sessionService';
import { getDailyPlan, getUnderstandingQuestionsForDay } from '../services/curriculum';
import { evaluateNoteTask, getOrCreateTodayNoteTasks, pendingNoteTasks } from '../services/noteTaskService';
import { formatDateJa } from '../utils/date';
import type { NoteTask } from '../types';

export default function NotesPage() {
  const [today, setToday] = useState<{ date: string; tasks: NoteTask[] } | null>(null);
  const [pending, setPending] = useState<Array<{ date: string; task: NoteTask }>>([]);

  const reload = useCallback(async () => {
    const session = await getOrCreateTodaySession();
    const [plan, questions] = await Promise.all([getDailyPlan(session.day), getUnderstandingQuestionsForDay(session.day)]);
    const tasks = await getOrCreateTodayNoteTasks(session, plan, questions);
    setToday({ date: session.date, tasks });
    setPending(await pendingNoteTasks(session.date));
  }, []);

  useEffect(() => {
    (async () => {
      await reload();
    })();
  }, [reload]);

  if (!today) return <div className="py-20 text-center text-slate-400">読み込み中...</div>;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">ノート課題</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          仕事の空き時間に紙のノートで5〜10分。メイン課題1つで十分です。書き終えたら答えを見て自己評価してください（写真のアップロードは不要です）。
        </p>
      </div>

      {today.tasks.map((t) => (
        <NoteTaskCard
          key={t.id}
          task={t}
          onEvaluate={async (e) => {
            await evaluateNoteTask(today.date, t.id, e);
            await reload();
          }}
        />
      ))}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">まだ自己評価していない課題（過去7日）</h2>
          {pending.map(({ date, task }) => (
            <NoteTaskCard
              key={task.id}
              task={task}
              dateLabel={`${formatDateJa(date)}の課題`}
              onEvaluate={async (e) => {
                await evaluateNoteTask(date, task.id, e);
                await reload();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
