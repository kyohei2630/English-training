import type { WritingExercise } from '../../types';
import ReorderExerciseView from './ReorderExerciseView';
import FillBlankExerciseView from './FillBlankExerciseView';
import OpenEndedExerciseView from './OpenEndedExerciseView';
import { recordIncompleteWriting } from '../../services/reviewService';

const TYPE_LABELS: Record<WritingExercise['type'], string> = {
  reorder: '並び替え',
  fillblank: '穴埋め',
  translate: '日本語→英語',
  free: '自由英作文',
};

interface WritingExerciseViewProps {
  exercise: WritingExercise;
  onDone: (wasCorrect: boolean) => void;
}

export default function WritingExerciseView({ exercise, onDone }: WritingExerciseViewProps) {
  const handleResult = async (wasCorrect: boolean, userAnswerText: string) => {
    if (!wasCorrect) {
      await recordIncompleteWriting(exercise, userAnswerText);
    }
    onDone(wasCorrect);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="w-fit rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
        {TYPE_LABELS[exercise.type]}
      </span>
      <p className="text-sm text-slate-500 dark:text-slate-400">{exercise.instructionJa}</p>

      {exercise.type === 'reorder' && <ReorderExerciseView exercise={exercise} onResult={handleResult} />}
      {exercise.type === 'fillblank' && <FillBlankExerciseView exercise={exercise} onResult={handleResult} />}
      {(exercise.type === 'translate' || exercise.type === 'free') && (
        <OpenEndedExerciseView exercise={exercise} onResult={handleResult} />
      )}
    </div>
  );
}
