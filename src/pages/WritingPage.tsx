import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import WritingExerciseView from '../components/writing/WritingExerciseView';
import { WRITING_BY_LEVEL } from '../data/writing';
import { LEVELS } from '../data/levels';
import { useProgress } from '../hooks/useProgress';
import type { Level, WritingExercise } from '../types';

const TYPE_LABELS: Record<WritingExercise['type'], string> = {
  reorder: '並び替え',
  fillblank: '穴埋め',
  translate: '日本語→英語',
  free: '自由英作文',
};

export default function WritingPage() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>(progress.currentLevel);
  const [active, setActive] = useState<WritingExercise | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const exercises = WRITING_BY_LEVEL[level];

  if (active) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => setActive(null)}>
          ← 一覧に戻る
        </Button>
        <Card>
          <WritingExerciseView
            key={active.id}
            exercise={active}
            onDone={() => {
              setDoneIds((prev) => new Set(prev).add(active.id));
              setActive(null);
            }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Writing</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            onClick={() => setLevel(l.level)}
            className={`tap-target shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              level === l.level
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Level {l.level}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {exercises.map((ex) => (
          <Card
            key={ex.id}
            onClick={() => setActive(ex)}
            className="cursor-pointer transition-colors hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {TYPE_LABELS[ex.type]}
              </span>
              {doneIds.has(ex.id) && <span className="text-green-500">✓ 完了</span>}
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{ex.instructionJa}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
