import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import VocabularyQuizSession from '../components/vocabulary/VocabularyQuizSession';
import { loadVocabularyLevel, loadAllVocabulary } from '../data/vocabulary/loader';
import { LEVELS } from '../data/levels';
import { getReviewItemsByCategory } from '../db/repositories/reviewRepository';
import { computeMasteryTier, MASTERY_LABELS_JA, type MasteryTier } from '../services/masteryService';
import type { Level, ReviewItem, VocabularyEntry } from '../types';

type MasteryFilter = 'all' | MasteryTier;

export default function VocabularyPage() {
  const [level, setLevel] = useState<Level>(1);
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VocabularyEntry[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>('all');
  const [masteryByWordId, setMasteryByWordId] = useState<Map<string, ReviewItem>>(new Map());
  const [detail, setDetail] = useState<VocabularyEntry | null>(null);
  const [quizzing, setQuizzing] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadVocabularyLevel(level).then((data) => {
      if (!cancelled) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [level]);

  useEffect(() => {
    (async () => {
      const items = await getReviewItemsByCategory('vocabulary');
      setMasteryByWordId(new Map(items.map((i) => [i.refId, i])));
    })();
  }, [result]);

  // Searching across all 2,000+ words needs every level loaded — only do that
  // when the learner actually types a query, not on every page visit.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === '') {
      setSearchResults(null);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(async () => {
      const all = await loadAllVocabulary();
      if (cancelled) return;
      const q = trimmed.toLowerCase();
      const matches = all.filter(
        (v) => v.word.toLowerCase().includes(q) || v.meaningJa.includes(trimmed) || v.category.toLowerCase().includes(q)
      );
      setSearchResults(matches);
      setSearching(false);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const tierOf = (entry: VocabularyEntry): MasteryTier => {
    const item = masteryByWordId.get(entry.id);
    return item ? computeMasteryTier(item) : 'unlearned';
  };

  const baseList = searchResults ?? entries;
  const displayList = masteryFilter === 'all' ? baseList : baseList.filter((e) => tierOf(e) === masteryFilter);

  if (quizzing) {
    return (
      <VocabularyQuizSession
        entries={entries}
        pool={entries}
        onComplete={(correct, total) => {
          setQuizzing(false);
          setResult({ correct, total });
        }}
      />
    );
  }

  if (result) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-4xl">✅</p>
        <h1 className="text-xl font-bold">Vocabulary練習 完了</h1>
        <p className="text-lg">
          {result.correct} / {result.total} 問正解
        </p>
        <Button onClick={() => setResult(null)}>単語一覧に戻る</Button>
      </Card>
    );
  }

  const masteredCount = entries.filter((e) => {
    const t = tierOf(e);
    return t === 'acquired' || t === 'retained';
  }).length;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Vocabulary</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="全レベルから検索（英単語・日本語・カテゴリ）"
        className="w-full rounded-xl border border-slate-300 p-3 text-base dark:border-slate-600 dark:bg-slate-900"
      />

      {!searchResults && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => setLevel(l.level)}
              className={`tap-target shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
                level === l.level
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              Level {l.level}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'unlearned', 'learning', 'acquired', 'retained'] as MasteryFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setMasteryFilter(f)}
            className={`tap-target shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              masteryFilter === f
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {f === 'all' ? 'すべて' : MASTERY_LABELS_JA[f]}
          </button>
        ))}
      </div>

      {!searchResults && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
          <p className="mb-1 text-sm text-blue-800 dark:text-blue-300">
            Level {level} の単語: {entries.length} 語（習得 {masteredCount} 語）
          </p>
          <p className="mb-3 text-xs text-blue-700 dark:text-blue-400">英→日・日→英・文脈問題・類義語などをランダムに出題します。</p>
          <Button size="lg" className="w-full" onClick={() => setQuizzing(true)} disabled={entries.length === 0}>
            この Level の単語を練習する
          </Button>
        </Card>
      )}

      {(loading || searching) && <div className="py-10 text-center text-slate-400">読み込み中...</div>}

      {!loading && !searching && (
        <div className="flex flex-col gap-2">
          {displayList.length === 0 && <p className="text-center text-sm text-slate-400">該当する単語がありません。</p>}
          {displayList.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setDetail(entry)}
              className="tap-target flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-900"
            >
              <span>
                <span className="font-bold">{entry.word}</span>
                <span className="ml-2 text-xs text-slate-400">{entry.partOfSpeech}</span>
                {searchResults && <span className="ml-2 text-xs text-slate-400">L{entry.level}</span>}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{entry.meaningJa}</span>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.word}>
        {detail && (
          <div className="flex flex-col gap-3 text-sm">
            <p className="text-xs text-slate-400">{detail.pronunciation} ・ {detail.partOfSpeech} ・ Level {detail.level}</p>
            <p className="text-lg font-bold">{detail.meaningJa}</p>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p>{detail.exampleEn}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{detail.exampleJa}</p>
            </div>
            {detail.collocations && detail.collocations.length > 0 && (
              <p><span className="font-bold">コロケーション: </span>{detail.collocations.join(', ')}</p>
            )}
            {detail.synonyms && detail.synonyms.length > 0 && (
              <p><span className="font-bold">類義語: </span>{detail.synonyms.join(', ')}</p>
            )}
            {detail.antonyms && detail.antonyms.length > 0 && (
              <p><span className="font-bold">反意語: </span>{detail.antonyms.join(', ')}</p>
            )}
            {detail.relatedExpressions && detail.relatedExpressions.length > 0 && (
              <p><span className="font-bold">関連表現: </span>{detail.relatedExpressions.join(', ')}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
