import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import GrammarSession from '../components/grammar/GrammarSession';
import VocabularyQuizSession from '../components/vocabulary/VocabularyQuizSession';
import UnderstandingQuiz from '../components/reading/UnderstandingQuiz';
import WritingSession from '../components/writing/WritingSession';
import ToeicQuestionRunner from '../components/toeic/ToeicQuestionRunner';
import { loadGrammarLevel } from '../data/grammar/loader';
import { loadGrammarTheoryLevel } from '../data/grammar/theory/loader';
import { loadVocabularyLevel } from '../data/vocabulary/loader';
import { loadReadingLevel } from '../data/reading/loader';
import { loadWritingLevel } from '../data/writing/loader';
import { loadAllToeicParts } from '../data/toeic/loader';
import { flattenToeicQuestions, type FlatToeicItem } from '../services/toeicService';
import { CONTENT_STATS } from '../data/contentStats.generated';
import { LEVELS } from '../data/levels';
import type { GrammarLesson, GrammarQuestion, GrammarTheory, Level, ReviewCategory, UnderstandingQuestion, VocabularyEntry, WritingExercise } from '../types';

type Mode = 'menu' | 'grammar-level' | 'grammar-quiz' | 'vocabulary-quiz' | 'reading-quiz' | 'writing-quiz' | 'toeic-quiz';

interface WeaknessFilter {
  category: ReviewCategory;
  tag: string;
  level: Level;
}

const CATEGORY_LABELS_JA: Record<ReviewCategory, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  writing: 'Writing',
  toeic: 'TOEIC',
};

export default function ExtraTrainingPage() {
  const location = useLocation();
  const [mode, setMode] = useState<Mode>('menu');
  const [level, setLevel] = useState<Level>(1);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<WeaknessFilter | null>(null);

  const [grammarTheory, setGrammarTheory] = useState<GrammarTheory[]>([]);
  const [grammarLessons, setGrammarLessons] = useState<GrammarLesson[]>([]);
  const [grammarQuestions, setGrammarQuestions] = useState<GrammarQuestion[]>([]);
  const [vocabEntries, setVocabEntries] = useState<VocabularyEntry[]>([]);
  const [vocabPool, setVocabPool] = useState<VocabularyEntry[]>([]);
  const [readingQuestions, setReadingQuestions] = useState<UnderstandingQuestion[]>([]);
  const [writingExercises, setWritingExercises] = useState<WritingExercise[]>([]);
  const [toeicItems, setToeicItems] = useState<FlatToeicItem[]>([]);

  const [result, setResult] = useState<{ label: string; correct: number; total: number } | null>(null);

  const startGrammar = async (targetLevel: Level, tag?: string) => {
    setLoadingQuestions(true);
    const [{ questions, lessons }, theoryPool] = await Promise.all([
      loadGrammarLevel(targetLevel),
      loadGrammarTheoryLevel(targetLevel),
    ]);
    const filteredQuestions = tag ? questions.filter((q) => q.tag === tag) : questions;
    const filteredTheory = tag ? theoryPool.filter((t) => t.tag === tag) : theoryPool;
    const tagsCoveredByTheory = new Set(filteredTheory.map((t) => t.tag));
    const usedLessonIds = new Set(
      filteredQuestions.filter((q) => !tagsCoveredByTheory.has(q.tag)).map((q) => q.lessonId)
    );
    const filteredLessons = lessons.filter((l) => usedLessonIds.has(l.id));
    setGrammarQuestions(filteredQuestions);
    setGrammarTheory(filteredTheory);
    setGrammarLessons(filteredLessons);
    setLevel(targetLevel);
    setLoadingQuestions(false);
    setMode('grammar-quiz');
  };

  const startVocabulary = async (targetLevel: Level, tag: string) => {
    setLoadingQuestions(true);
    const pool = await loadVocabularyLevel(targetLevel);
    const filtered = pool.filter((v) => v.category === tag);
    setVocabEntries(filtered);
    setVocabPool(pool);
    setLoadingQuestions(false);
    setMode('vocabulary-quiz');
  };

  const startReading = async (targetLevel: Level, tag: string) => {
    setLoadingQuestions(true);
    const { questions } = await loadReadingLevel(targetLevel);
    const filtered = questions.filter((q) => q.skillTag === tag);
    setReadingQuestions(filtered);
    setLevel(targetLevel);
    setLoadingQuestions(false);
    setMode('reading-quiz');
  };

  const startWriting = async (targetLevel: Level, tag: string) => {
    setLoadingQuestions(true);
    const pool = await loadWritingLevel(targetLevel);
    const filtered = pool.filter((w) => w.tag === tag);
    setWritingExercises(filtered);
    setLoadingQuestions(false);
    setMode('writing-quiz');
  };

  const startToeic = async (tag: string) => {
    setLoadingQuestions(true);
    const byPart = await loadAllToeicParts();
    const allQuestions = Object.values(byPart).flat();
    const filtered = flattenToeicQuestions(allQuestions).filter((item) => item.tag === tag);
    setToeicItems(filtered);
    setLoadingQuestions(false);
    setMode('toeic-quiz');
  };

  // Coming from Progress's 弱点分析: jump straight into a level-scoped, tag-filtered
  // session in the matching category instead of the generic menu.
  useEffect(() => {
    const state = location.state as Partial<WeaknessFilter> | null;
    if (!state?.category || !state.tag || !state.level) return;
    const filter: WeaknessFilter = { category: state.category, tag: state.tag, level: state.level };
    setActiveFilter(filter);
    setResult(null);
    switch (filter.category) {
      case 'grammar':
        void startGrammar(filter.level, filter.tag);
        break;
      case 'vocabulary':
        void startVocabulary(filter.level, filter.tag);
        break;
      case 'reading':
        void startReading(filter.level, filter.tag);
        break;
      case 'writing':
        void startWriting(filter.level, filter.tag);
        break;
      case 'toeic':
        void startToeic(filter.tag);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const backToMenu = () => {
    setActiveFilter(null);
    setResult(null);
    setMode('menu');
  };

  if (loadingQuestions) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const filterBanner = activeFilter && (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
      <p className="text-sm text-amber-800 dark:text-amber-300">
        弱点克服: <span className="font-bold">{CATEGORY_LABELS_JA[activeFilter.category]}</span> ・ {activeFilter.tag} に絞り込み中
      </p>
    </Card>
  );

  if (mode === 'grammar-quiz') {
    return (
      <div className="flex flex-col gap-4">
        {filterBanner}
        <GrammarSession
          theory={grammarTheory}
          lessons={grammarLessons}
          questions={grammarQuestions}
          onComplete={(correct, total) => {
            setResult({ label: 'Grammar', correct, total });
            backToMenu();
          }}
        />
      </div>
    );
  }

  if (mode === 'vocabulary-quiz') {
    return (
      <div className="flex flex-col gap-4">
        {filterBanner}
        <VocabularyQuizSession
          entries={vocabEntries}
          pool={vocabPool}
          onComplete={(correct, total) => {
            setResult({ label: 'Vocabulary', correct, total });
            backToMenu();
          }}
        />
      </div>
    );
  }

  if (mode === 'reading-quiz') {
    return (
      <div className="flex flex-col gap-4">
        {filterBanner}
        <UnderstandingQuiz
          questions={readingQuestions}
          level={level}
          onComplete={(correct, total) => {
            setResult({ label: 'Reading', correct, total });
            backToMenu();
          }}
        />
      </div>
    );
  }

  if (mode === 'writing-quiz') {
    return (
      <div className="flex flex-col gap-4">
        {filterBanner}
        <WritingSession
          exercises={writingExercises}
          onComplete={(completed, total) => {
            setResult({ label: 'Writing', correct: completed, total });
            backToMenu();
          }}
        />
      </div>
    );
  }

  if (mode === 'toeic-quiz') {
    return (
      <div className="flex flex-col gap-4">
        {filterBanner}
        <ToeicQuestionRunner
          items={toeicItems}
          onComplete={(_answers, correct) => {
            setResult({ label: 'TOEIC', correct, total: toeicItems.length });
            backToMenu();
          }}
        />
      </div>
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
              onClick={() => startGrammar(l.level)}
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
            直前の{result.label}練習: {result.correct} / {result.total} 問正解
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/grammar-theory"
          className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="text-2xl">📐</p>
          <p className="mt-2 font-bold">Grammar Theory</p>
          <p className="text-xs text-slate-400">先に文法の仕組みを理解する</p>
        </Link>
        <button
          onClick={() => setMode('grammar-level')}
          className="tap-target rounded-2xl border border-slate-200 bg-white p-5 text-left dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="text-2xl">📚</p>
          <p className="mt-2 font-bold">Grammar Practice</p>
          <p className="text-xs text-slate-400">レベル別に自由演習（全{CONTENT_STATS.grammar.total}問）</p>
        </button>
        <Link
          to="/grammar-terms"
          className="tap-target rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="text-2xl">📗</p>
          <p className="mt-2 font-bold">文法用語辞典</p>
          <p className="text-xs text-slate-400">主語・SVOなど用語を調べる</p>
        </Link>
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
