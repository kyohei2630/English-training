import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Level, VocabularyItem } from '../../types';
import { WordLookupContext, type WordLookupContextValue } from './WordLookupContext';
import WordPopover from './WordPopover';

interface WordLookupProviderProps {
  children: ReactNode;
  /** the current material's key vocabulary: highlighted, and searched before the word bank */
  vocabulary?: readonly VocabularyItem[];
  /** id of the material the text belongs to (used for review-deck refIds of its key vocabulary) */
  materialId?: string;
  /** level of the text, preferred when a word appears in several levels of the word bank */
  level?: Level;
}

const NO_VOCABULARY: readonly VocabularyItem[] = [];

/** Provides tap-to-lookup to every WordInteractiveText inside it and renders the one shared
 * popover, so only one word is ever open at a time. */
export default function WordLookupProvider({ children, vocabulary = NO_VOCABULARY, materialId, level }: WordLookupProviderProps) {
  const [selection, setSelection] = useState<{ word: string; anchor: HTMLElement; contextSentence: string; key: number } | null>(null);

  const openWord = useCallback((word: string, anchor: HTMLElement, contextSentence: string) => {
    setSelection((prev) => ({ word, anchor, contextSentence, key: (prev?.key ?? 0) + 1 }));
  }, []);
  const close = useCallback(() => setSelection(null), []);

  // Mark the open word so the reader can see which one the popover belongs to.
  useEffect(() => {
    const anchor = selection?.anchor;
    anchor?.classList.add('word-token--active');
    return () => anchor?.classList.remove('word-token--active');
  }, [selection?.anchor]);

  const value = useMemo<WordLookupContextValue>(
    () => ({
      openWord,
      keyWords: new Set(vocabulary.filter((v) => !v.word.includes(' ')).map((v) => v.word.toLowerCase())),
      keyPhrases: vocabulary.filter((v) => v.word.includes(' ')).map((v) => v.word),
    }),
    [openWord, vocabulary]
  );

  return (
    <WordLookupContext.Provider value={value}>
      {children}
      {selection && (
        <WordPopover
          // A fresh popover per tap resets its added / registering state.
          key={selection.key}
          word={selection.word}
          anchor={selection.anchor}
          contextSentence={selection.contextSentence}
          vocabulary={vocabulary}
          materialId={materialId}
          level={level}
          onClose={close}
        />
      )}
    </WordLookupContext.Provider>
  );
}
