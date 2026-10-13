import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import WritingExerciseView from '../components/writing/WritingExerciseView';
import SentenceBuildDrillView from '../components/writing/SentenceBuildDrillView';
import { loadWritingLevel } from '../data/writing/loader';
import { loadSentenceBuildDrills } from '../data/sentenceBuilding/loader';
import { tagLabel } from '../data/grammar/tagLabels';
import { LEVELS } from '../data/levels';
import { useProgress } from '../hooks/useProgress';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { getAllTheoryProgress } from '../db/repositories/theoryProgressRepository';
import { drillProgress, learnedGrammarTags, tagKey } from '../services/sentenceBuildingService';
import type { Level, ReviewItem, SentenceBuildDrill, WritingExercise } from '../types';

const TYPE_LABELS: Record<WritingExercise['type'], string> = {
  reorder: '並び替え',
  fillblank: '穴埋め',
  translate: '日本語→英語',
  free: '自由英作文',
};

export default function WritingPage() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>(progress.currentLevel);
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<WritingExercise | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'exercises' | 'build'>('exercises');
  const [drills, setDrills] = useState<SentenceBuildDrill[]>([]);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [activeDrill, setActiveDrill] = useState<SentenceBuildDrill | null>(null);

  const loadDrillState = async () => {
    const [all, reviewItems, theory] = await Promise.all([loadSentenceBuildDrills(), getAllReviewItems(), getAllTheoryProgress()]);
    setDrills(all);
    setItems(reviewItems);
    setLearned(await learnedGrammarTags(reviewItems, theory));
  };

  useEffect(() => {
    (async () => {
      await loadDrillState();
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadWritingLevel(level).then((data) => {
      if (!cancelled) {
        setExercises(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [level]);

  if (activeDrill) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => setActiveDrill(null)}>
          ← 一覧に戻る
        </Button>
        <SentenceBuildDrillView
          key={activeDrill.id}
          drill={activeDrill}
          onComplete={async () => {
            setActiveDrill(null);
            await loadDrillState();
          }}
        />
      </div>
    );
  }

  const levelDrills = drills
    .filter((d) => d.level === level)
    .sort((a, b) => Number(learned.has(tagKey(b.grammarTag))) - Number(learned.has(tagKey(a.grammarTag))));

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

      <div className="grid grid-cols-2 gap-2">
        {(['exercises', 'build'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tap-target rounded-xl px-4 py-2.5 text-sm font-medium ${
              tab === t ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t === 'exercises' ? '問題' : '英文組み立て'}
          </button>
        ))}
      </div>

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

      {tab === 'build' ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            短い基本文から始めて、情報を足す → 形を変える → 別の場面で使う、の順に自分で英文を組み立てます。学習済みの文法（解いた問題・読んだ Grammar Theory）のドリルが上に並びます。
          </p>
          {levelDrills.length === 0 && <p className="py-6 text-center text-sm text-slate-400">このレベルの英文組み立てはまだありません。</p>}
          {levelDrills.map((d) => {
            const p = drillProgress(d, items);
            const isLearned = learned.has(tagKey(d.grammarTag));
            return (
              <Card key={d.id} onClick={() => setActiveDrill(d)} className="cursor-pointer transition-colors hover:border-teal-300 dark:hover:border-teal-700">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    {tagLabel(d.grammarTag)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isLearned ? '学習済みの文法' : '先に文法を学ぶと効果的'}・{p.solved}/{d.steps.length}
                  </span>
                </div>
                <p className="mt-2 font-medium">{d.titleJa}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{d.patternJa}</p>
              </Card>
            );
          })}
        </div>
      ) : loading ? (
        <div className="py-10 text-center text-slate-400">読み込み中...</div>
      ) : (
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
      )}
    </div>
  );
}
