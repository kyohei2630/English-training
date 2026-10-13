import type { WritingExercise } from '../../types';
import ReorderExerciseView from './ReorderExerciseView';
import FillBlankExerciseView from './FillBlankExerciseView';
import OpenEndedExerciseView from './OpenEndedExerciseView';
import { recordWritingAnswer } from '../../services/reviewService';
import { markForSelfCheck } from '../../services/selfCheckService';
import type { SelfCheckStatus } from '../../types';

const TYPE_LABELS: Record<WritingExercise['type'], string> = {
  reorder: '並び替え',
  fillblank: '穴埋め',
  translate: '日本語→英語',
  free: '自由英作文',
};

interface WritingExerciseViewProps {
  exercise: WritingExercise;
  onDone: (wasCorrect: boolean, grading?: 'auto' | 'self') => void;
}

function modelAnswer(exercise: WritingExercise): string {
  if (exercise.type === 'reorder') return exercise.correctOrder.join(' ');
  if (exercise.type === 'fillblank') return exercise.sentence.replace('___', exercise.answers[0]);
  return exercise.sampleAnswers[0];
}

export default function WritingExerciseView({ exercise, onDone }: WritingExerciseViewProps) {
  const handleResult = async (status: SelfCheckStatus, userAnswerText: string, grading: 'auto' | 'self') => {
    if (status === 'unsure') {
      // Neither right nor wrong: kept for re-checking in tomorrow's review.
      await markForSelfCheck({
        category: 'writing',
        refId: exercise.id,
        promptText: exercise.instructionJa,
        answerText: modelAnswer(exercise),
        tag: exercise.tag,
        level: exercise.level,
        userAnswer: userAnswerText,
      });
    } else {
      await recordWritingAnswer(exercise, status === 'correct', userAnswerText, grading);
    }
    onDone(status === 'correct', grading);
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
