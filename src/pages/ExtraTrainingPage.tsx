import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import GrammarSession from '../components/grammar/GrammarSession';
import { loadGrammarLevel } from '../data/grammar/loader';
import { CONTENT_STATS } from '../data/contentStats.generated';
import { LEVELS } from '../data/levels';
import type { GrammarQuestion, Level } from '../types';

type Mode = 'menu' | 'grammar-level' | 'grammar-quiz';

export default function ExtraTrainingPage() {
  const [mode, setMode] = useState<Mode>('menu');
  const [level, setLevel] = useState<Level>(1);
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    if (mode !== 'grammar-quiz') return;
    let cancelled = false;
    setLoadingQuestions(true);
    loadGrammarLevel(level).then(({ questions: q }) => {
      if (!cancelled) {
        setQuestions(q);
        setLoadingQuestions(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mode, level]);

  if (mode === 'grammar-quiz') {
    if (loadingQuestions) {
      return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
    }
    return (
      <GrammarSession
        questions={questions}
        onComplete={(correct, total) => {
          setResult({ correct, total });
          setMode('menu');
        }}
      />
    );
  }

  if (mode === 'grammar-level') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Grammar：Levelを選択</h1>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => {
                setLevel(l.level);
                setMode('grammar-quiz');
              }}
              className="tap-target rounded-xl border border-slate-200 py-4 text-center dark:border-slate-700"
            >
              <p className="font-bold">Level {l.level}</p>
              <p className="text-xs text-slate-400">{CONTENT_STATS.grammar.byLevel[l.level]} 問</p>
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={() => setMode('menu')}>
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">追加トレーニング</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        時間制限なしで、Grammar・Vocabulary・Reading・Writing・TOEIC・Reviewを自由に学習できます。
      </p>

      {result && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40">
          <p className="text-sm text-green-800 dark:text-green-300">
            直前のGrammar練習: {result.correct} / {result.total} 問正解
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('grammar-level')}
          className="tap-target rounded-2xl border border-slate-200 bg-white p-5 text-left dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="text-2xl">📚</p>
          <p className="mt-2 font-bold">Grammar</p>
          <p className="text-xs text-slate-400">レベル別に自由演習（全{CONTENT_STATS.grammar.total}問）</p>
        </button>
        <Link to="/vocabulary" className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-2xl">🧠</p>
          <p className="mt-2 font-bold">Vocabulary</p>
          <p className="text-xs text-slate-400">単語を自由に練習（全{CONTENT_STATS.vocabulary.total}語）</p>
        </Link>
        <Link to="/reading" className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-2xl">📖</p>
          <p className="mt-2 font-bold">Reading</p>
          <p className="text-xs text-slate-400">教材を自由に読む（全{CONTENT_STATS.readingMaterials.total}本）</p>
        </Link>
        <Link to="/writing" className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-2xl">✍️</p>
          <p className="mt-2 font-bold">Writing</p>
          <p className="text-xs text-slate-400">問題を自由に練習（全{CONTENT_STATS.writing.total}問）</p>
        </Link>
        <Link to="/toeic" className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-2xl">📝</p>
          <p className="mt-2 font-bold">TOEIC</p>
          <p className="text-xs text-slate-400">Part別・模擬テスト（全{CONTENT_STATS.toeic.total}問）</p>
        </Link>
        <Link to="/review" className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-2xl">🔄</p>
          <p className="mt-2 font-bold">Review</p>
          <p className="text-xs text-slate-400">復習をまとめて消化</p>
        </Link>
      </div>
    </div>
  );
}
