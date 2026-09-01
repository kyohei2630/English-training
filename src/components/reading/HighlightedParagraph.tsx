import { Fragment } from 'react';
import type { VocabularyItem } from '../../types';

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface HighlightedParagraphProps {
  text: string;
  vocabulary: VocabularyItem[];
  onWordClick: (word: VocabularyItem) => void;
}

export default function HighlightedParagraph({ text, vocabulary, onWordClick }: HighlightedParagraphProps) {
  if (vocabulary.length === 0) {
    return <p className="reading-prose text-lg leading-relaxed">{text}</p>;
  }

  const sortedTerms = [...vocabulary].sort((a, b) => b.word.length - a.word.length);
  const pattern = sortedTerms.map((v) => escapeRegExp(v.word)).join('|');
  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

  const parts: Array<{ text: string; vocab?: VocabularyItem }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }
    const matchedText = match[0];
    const vocab = sortedTerms.find((v) => v.word.toLowerCase() === matchedText.toLowerCase());
    parts.push({ text: matchedText, vocab });
    lastIndex = match.index + matchedText.length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  return (
    <p className="reading-prose text-lg leading-relaxed">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part.vocab ? (
            <button
              type="button"
              onClick={() => onWordClick(part.vocab!)}
              className="rounded bg-blue-50 px-0.5 font-medium text-blue-700 underline decoration-blue-300 decoration-dotted underline-offset-4 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300"
            >
              {part.text}
            </button>
          ) : (
            part.text
          )}
        </Fragment>
      ))}
    </p>
  );
}
