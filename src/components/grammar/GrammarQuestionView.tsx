import { useMemo, useState } from 'react';
import type { GrammarQuestion } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import { isFillBlankCorrect, normalize } from '../../services/writingEvaluator';
import { shuffle } from '../../utils/random';
import { recordAnswer } from '../../services/reviewService';

const FORMAT_LABELS: Record<GrammarQuestion['format'], string> = {
  choice4: '4択',
  truefalse: '○×',
  reorder: '並べ替え',
  fillblank: '空欄補充',
  'correct-sentence': '正しい英文選択',
  'error-correction': '誤文訂正',
  'ja-to-en': '日本語→英語',
  structure: '文構造判定',
};

interface GrammarQuestionViewProps {
  question: GrammarQuestion;
  onDone: (wasCorrect: boolean) => void;
}

async function record(question: GrammarQuestion, wasCorrect: boolean) {
  await recordAnswer({
    category: 'grammar',
    refId: question.id,
    promptText: question.question,
    answerText: question.correctAnswer,
    explanation: question.explanation,
    tag: question.tag,
    level: question.level,
    wasCorrect,
  });
}

function FeedbackPanel({ wasCorrect, question }: { wasCorrect: boolean; question: GrammarQuestion }) {
  return (
    <div
      className={`mt-4 rounded-xl p-4 text-sm ${
        wasCorrect
          ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300'
          : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
      }`}
    >
      <p className="mb-1 font-bold">{wasCorrect ? '正解！' : '不正解'}</p>
      <p>正解: {question.correctAnswer}</p>
      <p className="mt-2 whitespace-pre-line text-slate-600 dark:text-slate-300">{question.explanation}</p>
      {question.translationJa && <p className="mt-1 text-slate-500 dark:text-slate-400">{question.translationJa}</p>}
      {question.whyOthersWrong && question.whyOthersWrong.length > 0 && (
        <ul className="mt-2 list-disc pl-4 text-slate-500 dark:text-slate-400">
          {question.whyOthersWrong.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChoiceQuestion({ question, onDone }: GrammarQuestionViewProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const choices = question.choices ?? [];
  const correctIndex = choices.indexOf(question.correctAnswer);

  const handleSelect = async (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    await record(question, i === correctIndex);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {choices.map((choice, i) => {
          const isCorrectChoice = i === correctIndex;
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
      {selected !== null && <FeedbackPanel wasCorrect={selected === correctIndex} question={question} />}
      {selected !== null && (
        <Button size="lg" className="mt-4 w-full" onClick={() => onDone(selected === correctIndex)}>
          次へ
        </Button>
      )}
    </>
  );
}

function TextQuestion({ question, onDone }: GrammarQuestionViewProps) {
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<boolean | null>(null);

  const handleCheck = async () => {
    const correct = isFillBlankCorrect(answer, [question.correctAnswer]);
    setChecked(correct);
    await record(question, correct);
  };

  return (
    <>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={checked !== null}
        placeholder="英語で入力"
        className="w-full rounded-lg border-2 border-blue-300 bg-blue-50 px-3 py-2 text-base disabled:opacity-70 dark:bg-blue-950/40"
      />
      {checked === null ? (
        <Button className="mt-4" onClick={handleCheck} disabled={answer.trim() === ''}>
          答え合わせ
        </Button>
      ) : (
        <>
          <FeedbackPanel wasCorrect={checked} question={question} />
          <Button size="lg" className="mt-4 w-full" onClick={() => onDone(checked)}>
            次へ
          </Button>
        </>
      )}
    </>
  );
}

function ReorderQuestion({ question, onDone }: GrammarQuestionViewProps) {
  const shuffledTokens = useMemo(() => shuffle(question.tokens ?? []), [question.tokens]);
  const [available, setAvailable] = useState<string[]>(shuffledTokens);
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);

  const pick = (token: string, fromIndex: number) => {
    if (checked !== null) return;
    setChosen((c) => [...c, token]);
    setAvailable((a) => a.filter((_, i) => i !== fromIndex));
  };

  const removeChosen = (index: number) => {
    if (checked !== null) return;
    const token = chosen[index];
    setChosen((c) => c.filter((_, i) => i !== index));
    setAvailable((a) => [...a, token]);
  };

  const handleCheck = async () => {
    const correct = normalize(chosen.join(' ')) === normalize(question.correctAnswer);
    setChecked(correct);
    await record(question, correct);
  };

  return (
    <>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{question.question}</p>
      <div className="min-h-16 rounded-xl border-2 border-dashed border-slate-300 p-3 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          {chosen.length === 0 && <span className="text-sm text-slate-400">下の単語をタップして文を作りましょう</span>}
          {chosen.map((token, i) => (
            <button key={i} onClick={() => removeChosen(i)} className="tap-target rounded-lg bg-blue-600 px-3 py-2 text-white">
              {token}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {available.map((token, i) => (
          <button
            key={`${token}-${i}`}
            onClick={() => pick(token, i)}
            disabled={checked !== null}
            className="tap-target rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800"
          >
            {token}
          </button>
        ))}
      </div>
      {checked === null ? (
        <Button className="mt-4 w-full" onClick={handleCheck} disabled={available.length > 0}>
          答え合わせ
        </Button>
      ) : (
        <>
          <FeedbackPanel wasCorrect={checked} question={question} />
          <Button size="lg" className="mt-4 w-full" onClick={() => onDone(checked)}>
            次へ
          </Button>
        </>
      )}
    </>
  );
}

export default function GrammarQuestionView({ question, onDone }: GrammarQuestionViewProps) {
  return (
    <Card>
      <span className="mb-3 inline-block w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        {FORMAT_LABELS[question.format]}
      </span>
      {question.format !== 'reorder' && <p className="mb-4 text-lg font-medium leading-relaxed">{question.question}</p>}

      {question.format === 'reorder' ? (
        <ReorderQuestion question={question} onDone={onDone} />
      ) : question.choices ? (
        <ChoiceQuestion question={question} onDone={onDone} />
      ) : (
        <TextQuestion question={question} onDone={onDone} />
      )}
    </Card>
  );
}
