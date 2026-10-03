import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import type { Level, VocabularyItem } from '../../types';
import Button from '../common/Button';
import { getReviewItemByRef } from '../../db/repositories/reviewRepository';
import { addLookedUpWordToReview, registerCustomWord } from '../../services/reviewService';
import { lookupWord, PART_OF_SPEECH_JA, reviewRefIdFor, type WordLookupResult } from '../../services/wordLookup';

interface WordPopoverProps {
  word: string;
  anchor: HTMLElement;
  /** the sentence the word was tapped in, shown and saved as its in-context example */
  contextSentence: string;
  vocabulary: readonly VocabularyItem[];
  materialId?: string;
  level?: Level;
  onClose: () => void;
}

const VIEWPORT_MARGIN = 12;
const GAP = 8;

const SOURCE_LABELS: Record<WordLookupResult['source'], string> = {
  material: 'この教材の重要語',
  bank: '語彙バンク',
  custom: 'マイ単語',
  dictionary: '辞書',
  compound: '複合語',
  unknown: '未登録単語',
};

const REGISTER_POS_OPTIONS = ['noun', 'verb', 'adjective', 'adverb', 'phrase'];

function posLabel(pos?: string): string | undefined {
  return pos ? (PART_OF_SPEECH_JA[pos] ?? pos) : undefined;
}

/** The context sentence with the tapped word marked. */
function ContextSentence({ sentence, word }: { sentence: string; word: string }) {
  const i = sentence.indexOf(word);
  if (i < 0) return <>{sentence}</>;
  return (
    <>
      {sentence.slice(0, i)}
      <mark className="rounded bg-yellow-200/70 px-0.5 font-bold text-inherit dark:bg-yellow-500/30">{word}</mark>
      {sentence.slice(i + word.length)}
    </>
  );
}

export default function WordPopover({ word, anchor, contextSentence, vocabulary, materialId, level, onClose }: WordPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [result, setResult] = useState<WordLookupResult | null>(null);
  const [failed, setFailed] = useState(false);
  /** null while checking whether the word is already in the review deck */
  const [added, setAdded] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ word: '', meaningJa: '', partOfSpeech: '' });

  useEffect(() => {
    let cancelled = false;
    lookupWord(word, { materialVocabulary: vocabulary, preferredLevel: level })
      .then(async (r) => {
        if (cancelled) return;
        setResult(r);
        setForm((f) => ({ ...f, word: r.headword }));
        const existing = r.source === 'unknown' ? undefined : await getReviewItemByRef(reviewRefIdFor(r, materialId));
        if (!cancelled) setAdded(!!existing);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [word, vocabulary, materialId, level]);

  // Place the popover under the word (above it when there is more room there), kept inside the
  // viewport. Re-run on scroll / resize and whenever the popover's own size changes.
  const reposition = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const a = anchor.getBoundingClientRect();
    const { offsetWidth: w, offsetHeight: h } = el;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = vh - a.bottom;
    const above = a.top;
    let top = below >= h + GAP || below >= above ? a.bottom + GAP : a.top - GAP - h;
    top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - h - VIEWPORT_MARGIN));
    const left = Math.max(VIEWPORT_MARGIN, Math.min(a.left + a.width / 2 - w / 2, vw - w - VIEWPORT_MARGIN));
    setPosition({ top, left });
  }, [anchor]);

  useLayoutEffect(() => {
    reposition();
    const el = ref.current;
    const observer = new ResizeObserver(reposition);
    if (el) observer.observe(el);
    window.addEventListener('scroll', reposition, { capture: true, passive: true });
    window.addEventListener('resize', reposition);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', reposition, { capture: true });
      window.removeEventListener('resize', reposition);
    };
  }, [reposition]);

  // Close on Escape or a tap outside. A tap on another word is left alone: that word's own
  // handler swaps the popover over to it.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      if (ref.current?.contains(target) || target.closest?.('[data-word]')) return;
      onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handleAdd = async () => {
    if (!result) return;
    setSaving(true);
    await addLookedUpWordToReview(result, { materialId, contextSentence });
    setSaving(false);
    setAdded(true);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const headword = form.word.trim().toLowerCase();
    const meaningJa = form.meaningJa.trim();
    if (!headword || !meaningJa) return;
    setSaving(true);
    await registerCustomWord({ word: headword, surface: word, meaningJa, partOfSpeech: form.partOfSpeech || undefined, contextSentence });
    setSaving(false);
    setRegistering(false);
    setResult((r) => r && { ...r, headword, source: 'custom', meaningJa, partOfSpeech: form.partOfSpeech || undefined });
    setAdded(true);
  };

  const showHeadword = result && result.headword.toLowerCase() !== result.surface.toLowerCase();

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`${word} の意味`}
      className="fixed z-50 max-h-[70vh] w-[min(22rem,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      // Rendered hidden at 0,0 for the first measurement, then moved next to the word.
      style={position ? { top: position.top, left: position.left } : { top: 0, left: 0, visibility: 'hidden' }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="min-w-0 break-words text-xl font-bold text-slate-900 dark:text-slate-100">
          {word}
          {showHeadword && result.source !== 'unknown' && result.source !== 'compound' && (
            <span className="ml-1.5 text-base font-medium text-slate-500">({result.headword})</span>
          )}
          {result?.pronunciation && <span className="ml-2 text-sm font-normal text-slate-400">{result.pronunciation}</span>}
        </p>
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      {failed ? (
        <p className="text-sm text-red-600">辞書を読み込めませんでした。もう一度タップしてください。</p>
      ) : !result ? (
        <p className="py-2 text-sm text-slate-400">検索中...</p>
      ) : result.source === 'unknown' && !registering ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            単語: <span className="font-bold">{result.headword}</span>（未登録単語）
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setRegistering(true)}>
              意味を登録する
            </Button>
            <a
              href={`https://ejje.weblio.jp/content/${encodeURIComponent(result.headword)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Weblioで調べる ↗
            </a>
          </div>
        </div>
      ) : registering ? (
        <form onSubmit={handleRegister} className="flex flex-col gap-2 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">単語（原形）</span>
            <input
              value={form.word}
              onChange={(e) => setForm({ ...form, word: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base dark:border-slate-600 dark:bg-slate-800"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">意味（日本語）</span>
            <input
              value={form.meaningJa}
              onChange={(e) => setForm({ ...form, meaningJa: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base dark:border-slate-600 dark:bg-slate-800"
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">品詞（任意）</span>
            <select
              value={form.partOfSpeech}
              onChange={(e) => setForm({ ...form, partOfSpeech: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="">—</option>
              {REGISTER_POS_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {posLabel(p)}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-1 flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setRegistering(false)}>
              キャンセル
            </Button>
            <Button type="submit" className="flex-1" disabled={saving || !form.word.trim() || !form.meaningJa.trim()}>
              登録して復習に追加
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {posLabel(result.partOfSpeech) && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {posLabel(result.partOfSpeech)}
              </span>
            )}
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {SOURCE_LABELS[result.source]}
              {result.level ? ` Lv.${result.level}` : ''}
            </span>
          </div>
          <p className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">{result.meaningJa}</p>
          {contextSentence && (
            <div className="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <p className="mb-1 text-xs font-medium text-slate-400">本文での使われ方</p>
              <ContextSentence sentence={contextSentence} word={word} />
            </div>
          )}
          <Button variant={added ? 'secondary' : 'primary'} onClick={handleAdd} disabled={added !== false || saving}>
            {added ? '✓ 復習リストに追加済み' : '＋ 復習リストに追加'}
          </Button>
        </div>
      )}
    </div>
  );
}
