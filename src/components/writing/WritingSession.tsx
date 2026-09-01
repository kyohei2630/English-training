import { useState } from 'react';
import type { WritingExercise } from '../../types';
import WritingExerciseView from './WritingExerciseView';
import Card from '../common/Card';

interface WritingSessionProps {
  exercises: WritingExercise[];
  onComplete: (completedCount: number, totalCount: number) => void;
}

export default function WritingSession({ exercises, onComplete }: WritingSessionProps) {
  const [index, setIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  if (exercises.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">この教材にはライティング問題がありません。</p>
      </Card>
    );
  }

  const handleDone = (wasCorrect: boolean) => {
    const nextCompleted = wasCorrect ? completedCount + 1 : completedCount;
    if (index === exercises.length - 1) {
      onComplete(nextCompleted, exercises.length);
    } else {
      setCompletedCount(nextCompleted);
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-500">
        問題 {index + 1} / {exercises.length}
      </p>
      <Card>
        <WritingExerciseView key={exercises[index].id} exercise={exercises[index]} onDone={handleDone} />
      </Card>
    </div>
  );
}
