import { useState } from 'react';
import type { GrammarLesson, GrammarQuestion } from '../../types';
import GrammarQuestionView from './GrammarQuestionView';
import Card from '../common/Card';
import Button from '../common/Button';

interface GrammarSessionProps {
  /** lessons to explain before the quiz (Lesson -> explanation -> examples -> practice).
   * Pass an empty array to skip straight to the quiz. */
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

export default function GrammarSession({ lessons, questions, onComplete }: GrammarSessionProps) {
  const [phase, setPhase] = useState<'lesson' | 'quiz'>(lessons.length > 0 ? 'lesson' : 'quiz');
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  if (questions.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">このレベルにはまだGrammar問題がありません。</p>
      </Card>
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
