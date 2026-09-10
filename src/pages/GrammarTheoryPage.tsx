import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TheoryCard from '../components/grammar/TheoryCard';
import MiniCheckView from '../components/grammar/MiniCheckView';
import { loadGrammarTheoryLevel } from '../data/grammar/theory/loader';
import { loadGrammarTerms } from '../data/grammar/terms/loader';
import { getAllTheoryProgress } from '../db/repositories/theoryProgressRepository';
import { markTheoryViewed, recordMiniCheckResult, statusOf, THEORY_STATUS_LABELS_JA } from '../services/theoryService';
import { LEVELS } from '../data/levels';
import type { GrammarTerm, GrammarTheory, Level, TheoryProgress, TheoryStatus } from '../types';

type Mode = 'level-select' | 'theory-list' | 'theory-detail' | 'minicheck' | 'minicheck-result';

const STATUS_COLORS: Record<TheoryStatus, string> = {
  unlearned: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  learning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  mastered: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
};

export default function GrammarTheoryPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('level-select');
  const [level, setLevel] = useState<Level>(1);
  const [theories, setTheories] = useState<GrammarTheory[]>([]);
  const [terms, setTerms] = useState<GrammarTerm[]>([]);
  const [progressById, setProgressById] = useState<Map<string, TheoryProgress>>(new Map());
  const [selected, setSelected] = useState<GrammarTheory | null>(null);
  const [loading, setLoading] = useState(false);
  const [miniCheckResult, setMiniCheckResult] = useState<{ correct: number; total: number } | null>(null);

  const refreshProgress = async () => {
    const all = await getAllTheoryProgress();
    setProgressById(new Map(all.map((p) => [p.id, p])));
  };

  useEffect(() => {
    void refreshProgress();
    loadGrammarTerms().then(setTerms);
  }, []);

  const openLevel = async (l: Level) => {
    setLevel(l);
    setLoading(true);
    const data = await loadGrammarTheoryLevel(l);
    setTheories(data);
    setLoading(false);
    setMode('theory-list');
  };

  const openTheory = async (theory: GrammarTheory) => {
    setSelected(theory);
    setMode('theory-detail');
    await markTheoryViewed(theory.id);
    await refreshProgress();
  };

  const finishMiniCheck = async (correct: number, total: number) => {
    if (!selected) return;
    if (total > 0) {
      await recordMiniCheckResult(selected.id, correct, total);
      await refreshProgress();
    }
    setMiniCheckResult({ correct, total });
    setMode('minicheck-result');
  };

  const practiceThis = () => {
    if (!selected) return;
    navigate('/extra-training', { state: { category: 'grammar', tag: selected.tag, level: selected.level } });
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  if (mode === 'level-select') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Grammar Theory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          問題を解く前に、まず文法の仕組みを理解しましょう。Levelを選んでください。
        </p>
        <div className="grid grid-cols-2 gap-3">
          {LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => openLevel(l.level)}
              className="tap-target rounded-2xl border border-slate-200 bg-white p-4 text-left dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="font-bold">Level {l.level}</p>
              <p className="mt-1 text-xs text-slate-400">{l.name.replace(/^Level \d+: /, '')}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'theory-list') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Level {level} Grammar Theory</h1>
          <Button variant="ghost" onClick={() => setMode('level-select')}>
            Level変更
          </Button>
        </div>
        {theories.length === 0 && (
          <Card>
            <p className="text-slate-500">このLevelにはまだTheoryコンテンツがありません。</p>
          </Card>
        )}
        <div className="flex flex-col gap-2">
          {theories.map((theory) => {
            const status = statusOf(progressById.get(theory.id));
            return (
              <button
                key={theory.id}
                onClick={() => openTheory(theory)}
                className="tap-target flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-900"
              >
                <span>
                  <span className="block font-bold">{theory.title}</span>
                  <span className="text-xs text-slate-400">{theory.shortDescription}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[status]}`}>
                  {THEORY_STATUS_LABELS_JA[status]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'theory-detail' && selected) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="self-start" onClick={() => setMode('theory-list')}>
          ← 一覧に戻る
        </Button>
        <TheoryCard
          theory={selected}
          terms={terms}
          onTermClick={(term) => navigate('/grammar-terms', { state: { highlightTermId: term.id } })}
        />
        <div className="flex flex-col gap-2">
          {selected.miniCheck.length > 0 && (
            <Button size="lg" onClick={() => setMode('minicheck')}>
              理解度チェック（Mini Check）へ
            </Button>
          )}
          <Button size="lg" variant="secondary" onClick={practiceThis}>
            この文法を練習する
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'minicheck' && selected) {
    return <MiniCheckView items={selected.miniCheck} onComplete={finishMiniCheck} />;
  }

  if (mode === 'minicheck-result' && selected) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-4xl">{miniCheckResult && miniCheckResult.total > 0 && miniCheckResult.correct / miniCheckResult.total >= 0.8 ? '✅' : '📖'}</p>
        <h1 className="text-xl font-bold">Mini Check 完了</h1>
        {miniCheckResult && miniCheckResult.total > 0 && (
          <p className="text-lg">
            {miniCheckResult.correct} / {miniCheckResult.total} 問正解
          </p>
        )}
        <div className="flex w-full gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setMode('theory-detail')}>
            理論に戻る
          </Button>
          <Button className="flex-1" onClick={practiceThis}>
            練習問題へ
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
