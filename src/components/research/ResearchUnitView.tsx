import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import SentenceStructureView from '../reading/SentenceStructureView';
import WordInteractiveText from '../word/WordInteractiveText';
import WordLookupProvider from '../word/WordLookupProvider';
import SentenceTaskView from '../writing/SentenceTaskView';
import type { ResearchUnit } from '../../types';
import { recordAnswer } from '../../services/reviewService';
import { RESEARCH_SECTION_LABELS, researchQuestionRefId, researchWritingTask } from '../../services/researchService';

interface ResearchUnitViewProps {
  unit: ResearchUnit;
  onComplete: () => void;
}

/** Read (structure, logic, expressions) -> check understanding -> write a sentence of your own. */
export default function ResearchUnitView({ unit, onComplete }: ResearchUnitViewProps) {
  const [showJa, setShowJa] = useState(false);
  const [phase, setPhase] = useState<'read' | 'question' | 'write'>('read');
  const [selected, setSelected] = useState<number | null>(null);

  const answer = async (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    await recordAnswer({
      category: 'reading',
      refId: researchQuestionRefId(unit),
      promptText: unit.question.question,
      answerText: unit.question.choices[unit.question.correctIndex],
      explanation: unit.question.explanation,
      tag: `研究英語:${RESEARCH_SECTION_LABELS[unit.section]}`,
      level: unit.level,
      wasCorrect: i === unit.question.correctIndex,
      skill: 'research',
    });
  };

  return (
    <WordLookupProvider level={unit.level}>
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Level {unit.level}・{RESEARCH_SECTION_LABELS[unit.section]}
          </span>
          <h2 className="text-xl font-bold">{unit.titleJa}</h2>
          {unit.passage.map((p, i) => (
            <WordInteractiveText key={i} text={p} className="text-base leading-relaxed" />
          ))}
          <button onClick={() => setShowJa((v) => !v)} className="tap-target w-fit text-sm text-blue-600 dark:text-blue-400">
            {showJa ? '和訳を隠す' : '和訳を見る'}
          </button>
          {showJa && <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{unit.translationJa}</p>}
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">英文構造</h3>
          <SentenceStructureView structure={unit.structure} />
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">論理関係</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {unit.logic.map((l, i) => (
              <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                <p>
                  <span className="font-medium">{l.marker}</span>
                  <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {l.relationJa}
                  </span>
                </p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{l.explanationJa}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">使える学術表現</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {unit.expressions.map((e, i) => (
              <li key={i}>
                <p className="font-medium">{e.en}</p>
                <p className="text-slate-500 dark:text-slate-400">
                  {e.ja}
                  {e.noteJa && <span className="ml-1 text-xs">（{e.noteJa}）</span>}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        {phase === 'read' && (
          <Button size="lg" onClick={() => setPhase('question')}>
            内容を確認する
          </Button>
        )}

        {phase !== 'read' && (
          <Card>
            <p className="mb-3 text-lg font-medium">{unit.question.question}</p>
            <div className="flex flex-col gap-2">
              {unit.question.choices.map((c, i) => {
                let cls = 'border-slate-200 dark:border-slate-700';
                if (selected !== null && i === unit.question.correctIndex) cls = 'border-green-500 bg-green-50 dark:bg-green-950/40';
                else if (selected === i) cls = 'border-red-500 bg-red-50 dark:bg-red-950/40';
                return (
                  <button
                    key={i}
                    onClick={() => answer(i)}
                    disabled={selected !== null}
                    className={`tap-target rounded-xl border px-4 py-3 text-left ${cls}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {selected !== null && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{unit.question.explanation}</p>}
            {selected !== null && phase === 'question' && (
              <Button className="mt-4 w-full" onClick={() => setPhase('write')}>
                自分で書いてみる
              </Button>
            )}
          </Card>
        )}

        {phase === 'write' && (
          <Card>
            <h3 className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">書いてみよう</h3>
            <SentenceTaskView task={researchWritingTask(unit)} source="practice" onDone={() => onComplete()} doneLabel="完了" />
          </Card>
        )}
      </div>
    </WordLookupProvider>
  );
}
