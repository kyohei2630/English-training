import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/common/Card';
import { loadGrammarTerms } from '../data/grammar/terms/loader';
import type { GrammarTerm, GrammarTermCategory } from '../types';

type CategoryFilter = 'all' | GrammarTermCategory;

const CATEGORY_LABELS_JA: Record<CategoryFilter, string> = {
  all: 'すべて',
  basic: '基本用語',
  'sentence-structure': '文構造',
  'grammar-point': '主要文法',
};

function TermDetail({ term, allTerms, onJump }: { term: GrammarTerm; allTerms: GrammarTerm[]; onJump: (id: string) => void }) {
  const relatedTerms = (term.relatedTermIds ?? [])
    .map((id) => allTerms.find((t) => t.id === id))
    .filter((t): t is GrammarTerm => !!t);

  return (
    <div className="flex flex-col gap-3 text-sm">
      <p>
        <span className="font-bold">一言でいうと：</span>
        {term.oneLiner}
      </p>
      <p className="leading-relaxed text-slate-600 dark:text-slate-300">{term.explanation}</p>
      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
        <p className="font-medium">{term.example.english}</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{term.example.japanese}</p>
        <ul className="mt-2 list-disc pl-4 text-xs text-slate-500 dark:text-slate-400">
          {term.example.breakdown.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
      {relatedTerms.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-bold text-slate-400">関連用語</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedTerms.map((t) => (
              <button
                key={t.id}
                onClick={() => onJump(t.id)}
                className="tap-target rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              >
                {t.term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrammarTermsPage() {
  const location = useLocation();
  const [terms, setTerms] = useState<GrammarTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    loadGrammarTerms().then((data) => {
      setTerms(data);
      setLoading(false);
    });
  }, []);

  // Arriving from a "related term" link elsewhere (Theory detail) — open and
  // scroll straight to that term instead of showing the full unfiltered list.
  useEffect(() => {
    const state = location.state as { highlightTermId?: string } | null;
    if (!state?.highlightTermId || terms.length === 0) return;
    setOpenId(state.highlightTermId);
    setTimeout(() => {
      itemRefs.current.get(state.highlightTermId!)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, [location.state, terms]);

  const jumpTo = (id: string) => {
    setOpenId(id);
    setTimeout(() => {
      itemRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const filtered = terms.filter((t) => {
    if (category !== 'all' && t.category !== category) return false;
    if (query.trim() === '') return true;
    const q = query.trim().toLowerCase();
    return t.term.toLowerCase().includes(q) || t.oneLiner.includes(query.trim());
  });

  if (loading) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">文法用語辞典</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">{terms.length} 語収録</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="用語を検索"
        className="w-full rounded-xl border border-slate-300 p-3 text-base dark:border-slate-600 dark:bg-slate-900"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'basic', 'sentence-structure', 'grammar-point'] as CategoryFilter[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`tap-target shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              category === c
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {CATEGORY_LABELS_JA[c]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && <p className="text-center text-sm text-slate-400">該当する用語がありません。</p>}
        {filtered.map((term) => (
          <div
            key={term.id}
            ref={(el) => {
              if (el) itemRefs.current.set(term.id, el);
            }}
          >
            <Card
              className={openId === term.id ? 'border-blue-400 dark:border-blue-600' : undefined}
              onClick={() => setOpenId(openId === term.id ? null : term.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{term.term}</span>
                <span className="text-xs text-slate-400">{CATEGORY_LABELS_JA[term.category]}</span>
              </div>
              {openId !== term.id && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{term.oneLiner}</p>}
              {openId === term.id && (
                <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <TermDetail term={term} allTerms={terms} onJump={jumpTo} />
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
