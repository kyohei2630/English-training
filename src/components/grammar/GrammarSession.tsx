import { useState } from 'react';
import type { GrammarQuestion } from '../../types';
import GrammarQuestionView from './GrammarQuestionView';
import Card from '../common/Card';

interface GrammarSessionProps {
  questions: GrammarQuestion[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

export default function GrammarSession({ questions, onComplete }: GrammarSessionProps) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  if (questions.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">このレベルにはまだGrammar問題がありません。</p>
      </Card>
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
