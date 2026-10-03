import { useEffect, useState } from 'react';
import type { ReviewItem } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import GrammarQuestionView from '../grammar/GrammarQuestionView';
import WritingExerciseView from '../writing/WritingExerciseView';
import WordInteractiveText from '../word/WordInteractiveText';
import WordLookupProvider from '../word/WordLookupProvider';
import { applyReviewAnswer } from '../../services/reviewScheduler';
import { upsertReviewItem } from '../../db/repositories/reviewRepository';
import {
  resolveReviewQuestion,
  type ResolvedReviewQuestion,
  type ReviewChoiceQuestion,
} from '../../services/reviewQuestionResolver';

const CATEGORY_LABELS: Record<ReviewItem['category'], string> = {
  vocabulary: '単語',
  grammar: '文法',
  reading: '読解',
  writing: '英作文',
  toeic: 'TOEIC',
};

async function recordReview(item: ReviewItem, wasCorrect: boolean) {
  await upsertReviewItem(applyReviewAnswer(item, wasCorrect));
}

function CategoryBadge({ item }: { item: ReviewItem }) {
  return (
    <span className="mb-3 inline-block w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {CATEGORY_LABELS[item.category]}
    </span>
  );
}

interface ReviewQuestionProps {
  item: ReviewItem;
  isLast: boolean;
  onNext: (wasCorrect: boolean) => void;
}

function ChoiceReview({ item, question, isLast, onNext }: ReviewQuestionProps & { question: ReviewChoiceQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const wasCorrect = selected === question.correctIndex;

  const handleSelect = async (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    await recordReview(item, i === question.correctIndex);
  };

  const content = (
    <>
      {question.contextIsPassage && question.contextLines && (
        // Reading review shows the whole passage above the question, like the Reading step.
        <Card className="flex flex-col gap-4">
          {question.contextTitle && <h2 className="text-xl font-bold">{question.contextTitle}</h2>}
          {question.contextLines.map((paragraph, i) => (
            <WordInteractiveText key={i} text={paragraph} className="text-base leading-relaxed" />
          ))}
        </Card>
      )}
      <Card>
        <CategoryBadge item={item} />
        {!question.contextIsPassage && question.contextTitle && (
          <p className="mb-2 text-sm font-bold text-slate-500">{question.contextTitle}</p>
        )}
        {!question.contextIsPassage && question.contextLines && (
          <WordInteractiveText
            as="div"
            text={question.contextLines.join('\n')}
            className="mb-4 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm leading-relaxed dark:bg-slate-800"
          />
        )}
        <p className="mb-4 text-lg font-medium leading-relaxed">{question.prompt}</p>
        <div className="flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const isCorrectChoice = i === question.correctIndex;
            const isSelected = i === selected;
            let stateClasses = 'border-slate-200 dark:border-slate-700';
            if (selected !== null) {
              if (isCorrectChoice) stateClasses = 'border-green-500 bg-green-50 dark:bg-green-950/40';
              else if (isSelected) stateClasses = 'border-red-500 bg-red-50 dark:bg-red-950/40';
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`tap-target rounded-xl border px-4 py-3 text-left text-base ${stateClasses} disabled:cursor-default`}
              >
                <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                {choice}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div
            className={`mt-4 whitespace-pre-line rounded-xl p-4 text-sm ${
              wasCorrect
                ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
            }`}
          >
            <p className="mb-1 font-bold">{wasCorrect ? '正解！' : '不正解'}</p>
            <p>{question.explanation}</p>
          </div>
        )}
      </Card>
      {selected !== null && (
        <Button size="lg" onClick={() => onNext(wasCorrect)}>
          {isLast ? '結果を見る' : '次の問題へ'}
        </Button>
      )}
    </>
  );

  // Word lookup is off for vocabulary items: tapping the word in its context would give the answer away.
  return item.category === 'vocabulary' ? content : <WordLookupProvider level={item.level}>{content}</WordLookupProvider>;
}

/** Fallback for entries with no answerable source (e.g. words bookmarked while reading). */
function FlipCardReview({ item, onNext }: ReviewQuestionProps) {
  const [revealed, setRevealed] = useState(false);

  const handleAnswer = async (wasCorrect: boolean) => {
    await recordReview(item, wasCorrect);
    onNext(wasCorrect);
  };

  return (
    <>
      <Card>
        <CategoryBadge item={item} />
        <p className="text-lg leading-relaxed">{item.promptText}</p>

        {revealed ? (
          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm dark:bg-blue-950/40">
            <p className="mb-1 font-bold text-blue-800 dark:text-blue-300">答え</p>
            <p className="text-blue-900 dark:text-blue-200">{item.answerText}</p>
            {item.explanation && <p className="mt-2 text-blue-700 dark:text-blue-400">{item.explanation}</p>}
          </div>
        ) : (
          <Button className="mt-4" variant="secondary" onClick={() => setRevealed(true)}>
            答えを見る
          </Button>
        )}
      </Card>

      {revealed && (
        <div className="flex gap-2">
          <Button variant="danger" className="flex-1" onClick={() => handleAnswer(false)}>
            不正解だった
          </Button>
          <Button className="flex-1" onClick={() => handleAnswer(true)}>
            正解した
          </Button>
        </div>
      )}
    </>
  );
}

interface ReviewSessionProps {
  items: ReviewItem[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

export default function ReviewSession({ items, onComplete }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  /** undefined = still loading the source question, null = no source (flip card) */
  const [resolved, setResolved] = useState<{ itemId: string; value: ResolvedReviewQuestion | null } | undefined>();

  const item = items[index] as ReviewItem | undefined;

  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    resolveReviewQuestion(item)
      .catch(() => null)
      .then((value) => {
        if (!cancelled) setResolved({ itemId: item.id, value });
      });
    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!item) {
    return (
      <Card className="text-center">
        <p className="text-lg font-medium">🎉 復習項目はありません</p>
        <p className="mt-1 text-sm text-slate-500">今日復習すべき項目はすべて終わっています。</p>
      </Card>
    );
  }

  const isLast = index === items.length - 1;

  const handleNext = (wasCorrect: boolean) => {
    const nextCorrect = wasCorrect ? correctCount + 1 : correctCount;
    if (isLast) {
      onComplete(nextCorrect, items.length);
    } else {
      setCorrectCount(nextCorrect);
      setIndex((i) => i + 1);
    }
  };

  const source = resolved?.itemId === item.id ? resolved.value : undefined;

  let body;
  if (source === undefined) {
    body = <div className="py-10 text-center text-slate-400">読み込み中...</div>;
  } else if (source === null) {
    body = <FlipCardReview key={item.id} item={item} isLast={isLast} onNext={handleNext} />;
  } else if (source.kind === 'grammar') {
    // GrammarQuestionView records the answer to the review deck itself (same refId).
    body = <GrammarQuestionView key={item.id} question={source.question} onDone={handleNext} />;
  } else if (source.kind === 'writing') {
    // WritingExerciseView records the answer to the review deck itself (same refId).
    body = (
      <Card>
        <WritingExerciseView key={item.id} exercise={source.exercise} onDone={handleNext} />
      </Card>
    );
  } else {
    body = <ChoiceReview key={item.id} item={item} question={source.question} isLast={isLast} onNext={handleNext} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        {index + 1} / {items.length}
      </p>
      {body}
    </div>
  );
}
