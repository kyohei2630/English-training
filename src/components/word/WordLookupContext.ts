import { createContext, useContext } from 'react';

export interface WordLookupContextValue {
  /** opens the word popover for a tapped word, anchored to its element; `contextSentence` is
   * the sentence of the text the word was tapped in */
  openWord: (word: string, anchor: HTMLElement, contextSentence: string) => void;
  /** lowercased single-word key vocabulary of the current material (highlighted in the text) */
  keyWords: ReadonlySet<string>;
  /** multi-word key vocabulary ("look forward to"), tappable as one unit */
  keyPhrases: readonly string[];
}

export const WordLookupContext = createContext<WordLookupContextValue | null>(null);

export function useWordLookup(): WordLookupContextValue | null {
  return useContext(WordLookupContext);
}
