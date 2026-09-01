import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import { MATERIALS_BY_LEVEL } from '../data/materials';
import { LEVELS } from '../data/levels';
import { useProgress } from '../hooks/useProgress';
import type { Level } from '../types';

export default function ReadingPage() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>(progress.currentLevel);
  const materials = MATERIALS_BY_LEVEL[level];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Reading</h1>

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
        {materials.map((m) => (
          <Link key={m.id} to={`/reading/${m.id}`}>
            <Card className="transition-colors hover:border-blue-300 dark:hover:border-blue-700">
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                <span>{m.topic}</span>
                <span>·</span>
                <span>約{m.estimatedMinutes}分</span>
              </div>
              <h2 className="text-lg font-bold">{m.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{m.content[0]}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
