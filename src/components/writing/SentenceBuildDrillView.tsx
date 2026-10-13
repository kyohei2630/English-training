import { useState } from 'react';
import Card from '../common/Card';
import SentenceTaskView from './SentenceTaskView';
import type { SentenceBuildDrill } from '../../types';
import { drillStepTask, STEP_KIND_LABELS } from '../../services/sentenceBuildingService';
import { tagLabel } from '../../data/grammar/tagLabels';

interface SentenceBuildDrillViewProps {
  drill: SentenceBuildDrill;
  onComplete: (correctCount: number, totalCount: number) => void;
}

/** 英文組み立て: one sentence grown in four steps. The sentences built so far stay visible, so
 * each step visibly reuses the previous one. */
export default function SentenceBuildDrillView({ drill, onComplete }: SentenceBuildDrillViewProps) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const step = drill.steps[index];

  const handleDone = (wasCorrect: boolean) => {
    const nextCorrect = correct + (wasCorrect ? 1 : 0);
    if (index === drill.steps.length - 1) {
      onComplete(nextCorrect, drill.steps.length);
    } else {
      setCorrect(nextCorrect);
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <span className="mb-2 inline-block w-fit rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          英文組み立て・{tagLabel(drill.grammarTag)}
        </span>
        <h3 className="text-lg font-bold">{drill.titleJa}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">型: {drill.patternJa}</p>
        <ol className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {drill.steps.map((s, i) => (
            <li
              key={i}
              className={`rounded-full px-2.5 py-1 ${
                i === index
                  ? 'bg-teal-600 text-white'
                  : i < index
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              }`}
            >
              {i + 1}. {STEP_KIND_LABELS[s.kind]}
            </li>
          ))}
        </ol>
        {index > 0 && (
          <ul className="mt-3 flex flex-col gap-1 border-l-2 border-teal-300 pl-3 text-sm text-slate-600 dark:border-teal-700 dark:text-slate-300">
            {drill.steps.slice(0, index).map((s, i) => (
              <li key={i}>{s.answers[0]}</li>
            ))}
          </ul>
        )}
      </Card>
      <Card>
        <p className="mb-2 text-sm font-bold text-teal-700 dark:text-teal-300">
          Step {index + 1}: {STEP_KIND_LABELS[step.kind]}
        </p>
        <SentenceTaskView
          key={`${drill.id}-${index}`}
          task={drillStepTask(drill, index)}
          onDone={(r) => handleDone(r.status === 'correct' && !r.hintUsed)}
          doneLabel={index === drill.steps.length - 1 ? '完了' : '次のステップへ'}
        />
      </Card>
    </div>
  );
}
