import { useMemo, useRef, type ElementType, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { useWordLookup } from './WordLookupContext';
import { extractSentence, preloadWordBank, tokenizeText } from '../../services/wordLookup';

const LONG_PRESS_MS = 500;
/** a finger that moves further than this is scrolling, not pressing */
const MOVE_TOLERANCE_PX = 10;

interface WordInteractiveTextProps {
  text: string;
  as?: ElementType;
  className?: string;
}

function wordElement(target: EventTarget): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>('[data-word]') : null;
}

/**
 * Renders English text with every word tappable: a tap or a ~500ms long-press opens the shared
 * word popover. Must be inside a WordLookupProvider; without one it renders plain text.
 * Punctuation, spaces and numbers are rendered untouched between the word spans.
 */
export default function WordInteractiveText({ text, as: Tag = 'p', className = '' }: WordInteractiveTextProps) {
  const lookup = useWordLookup();
  const keyWords = lookup?.keyWords;
  const keyPhrases = lookup?.keyPhrases;
  const segments = useMemo(
    () => (keyWords && keyPhrases ? tokenizeText(text, keyWords, keyPhrases) : null),
    [text, keyWords, keyPhrases]
  );
  const press = useRef<{ timer: number; x: number; y: number } | null>(null);
  /** set when a long-press already opened the popover, so the click that follows is ignored */
  const suppressClick = useRef(false);

  if (!lookup || !segments) return <Tag className={className}>{text}</Tag>;

  // The sentence the word sits in is passed along as its in-context example.
  const open = (el: HTMLElement) => lookup.openWord(el.dataset.word!, el, extractSentence(text, Number(el.dataset.start)));

  const cancelPress = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
  };

  const handlePointerDown = (e: PointerEvent) => {
    const el = wordElement(e.target);
    if (!el || e.button !== 0) return;
    preloadWordBank();
    suppressClick.current = false;
    cancelPress();
    press.current = {
      x: e.clientX,
      y: e.clientY,
      timer: window.setTimeout(() => {
        press.current = null;
        suppressClick.current = true;
        open(el);
      }, LONG_PRESS_MS),
    };
  };

  const handlePointerMove = (e: PointerEvent) => {
    const p = press.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_TOLERANCE_PX) cancelPress();
  };

  const handleClick = (e: MouseEvent) => {
    const el = wordElement(e.target);
    if (!el) return;
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    open(el);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const el = wordElement(e.target);
    if (el && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open(el);
    }
  };

  return (
    <Tag
      className={`word-interactive ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelPress}
      onPointerCancel={cancelPress}
      onPointerLeave={cancelPress}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // Stops the iOS/Android long-press callout and the desktop context menu on words.
      onContextMenu={(e: MouseEvent) => wordElement(e.target) && e.preventDefault()}
    >
      {segments.map((seg, i) =>
        seg.kind === 'text' ? (
          seg.text
        ) : (
          <span
            key={i}
            data-word={seg.text}
            data-start={seg.start}
            role="button"
            // Only key vocabulary is in the tab order; tabbing through every word would be unusable.
            tabIndex={seg.isKey ? 0 : -1}
            className={
              seg.isKey
                ? 'word-token rounded bg-blue-50 px-0.5 font-medium text-blue-700 underline decoration-blue-300 decoration-dotted underline-offset-4 dark:bg-blue-950/50 dark:text-blue-300'
                : 'word-token'
            }
          >
            {seg.text}
          </span>
        )
      )}
    </Tag>
  );
}
