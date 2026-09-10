import { useMemo, useState } from 'react';
import type { GrammarLesson, GrammarQuestion, GrammarTheory } from '../../types';
import GrammarQuestionView from './GrammarQuestionView';
import TheoryCard from './TheoryCard';
import MiniCheckView from './MiniCheckView';
import Card from '../common/Card';
import Button from '../common/Button';
import { markTheoryViewed, recordMiniCheckResult } from '../../services/theoryService';

interface GrammarSessionProps {
  /** rich Theory entries for today's tags (Theory -> Mini Check -> Practice). */
  theory: GrammarTheory[];
  /** lightweight fallback explanations for tags without a matching Theory entry yet.
   * Pass an empty array to skip straight past this phase. */
  lessons: GrammarLesson[];
  questions: GrammarQuestion[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

function LessonCard({ lesson }: { lesson: GrammarLesson }) {
  return (
    <Card>
      <span className="mb-2 inline-block w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        {lesson.tag}
      </span>
      <h3 className="mb-2 text-lg font-bold">{lesson.title}</h3>
      <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{lesson.explanationJa}</p>
      {lesson.examples.length > 0 && (
        <ul className="flex flex-col gap-2">
          {lesson.examples.map((ex, i) => (
            <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
              <p className="font-medium">{ex.en}</p>
              <p className="text-slate-500 dark:text-slate-400">{ex.ja}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

type Phase = 'theory' | 'minicheck' | 'lesson' | 'quiz';

function firstPhase(theory: GrammarTheory[], lessons: GrammarLesson[]): Phase {
  if (theory.length > 0) return 'theory';
  if (lessons.length > 0) return 'lesson';
  return 'quiz';
}

export default function GrammarSession({ theory, lessons, questions, onComplete }: GrammarSessionProps) {
  const [phase, setPhase] = useState<Phase>(() => firstPhase(theory, lessons));
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const allMiniCheckItems = useMemo(() => theory.flatMap((t) => t.miniCheck.map((item) => ({ item, theoryId: t.id }))), [theory]);

  if (questions.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">このレベルにはまだGrammar問題がありません。</p>
        <Button className="mt-4" onClick={() => onComplete(0, 0)}>
          戻る
        </Button>
      </Card>
    );
  }

  if (phase === 'theory') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-slate-500">今日のGrammar Theory</p>
        {theory.map((t) => (
          <TheoryCard key={t.id} theory={t} />
        ))}
        <Button
          size="lg"
          onClick={async () => {
            await Promise.all(theory.map((t) => markTheoryViewed(t.id)));
            setPhase(allMiniCheckItems.length > 0 ? 'minicheck' : lessons.length > 0 ? 'lesson' : 'quiz');
          }}
        >
          {allMiniCheckItems.length > 0 ? '理解度チェック（Mini Check）へ' : lessons.length > 0 ? '続きの文法解説へ' : '練習問題へ進む'}
        </Button>
      </div>
    );
  }

  if (phase === 'minicheck') {
    return (
      <MiniCheckView
        items={allMiniCheckItems.map((m) => m.item)}
        onComplete={async (correct, total) => {
          // Attribute the combined mini-check result to each theory shown today —
          // simple and good enough for a daily-training recap of "did today's
          // theory sink in", vs. the per-theory precision of the dedicated page.
          await Promise.all(theory.map((t) => recordMiniCheckResult(t.id, correct, total)));
          setPhase(lessons.length > 0 ? 'lesson' : 'quiz');
        }}
      />
    );
  }

  if (phase === 'lesson') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-slate-500">今日の文法ポイント</p>
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
        <Button size="lg" onClick={() => setPhase('quiz')}>
          練習問題へ進む
        </Button>
      </div>
    );
  }

  const handleDone = (wasCorrect: boolean) => {
    const nextCorrect = wasCorrect ? correctCount + 1 : correctCount;
    if (index === questions.length - 1) {
      onComplete(nextCorrect, questions.length);
    } else {
      setCorrectCount(nextCorrect);
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        問題 {index + 1} / {questions.length}
      </p>
      <GrammarQuestionView key={questions[index].id} question={questions[index]} onDone={handleDone} />
    </div>
  );
}
