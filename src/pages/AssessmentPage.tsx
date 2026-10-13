import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SentenceTaskView from '../components/writing/SentenceTaskView';
import SelfCheckPanel from '../components/writing/SelfCheckPanel';
import { useProgress } from '../hooks/useProgress';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { deleteAssessmentDraft, getAllAssessments, getAssessmentDraft } from '../db/repositories/assessmentRepository';
import { assessmentStatus, finishAssessment, nextItemIndex, saveDraftAnswer, startAssessment } from '../services/assessmentService';
import { ASSESSMENT_SECTION_LABELS, compareAssessments } from '../services/abilityService';
import { ChangeBadge, ComparisonNotes } from '../components/progress/AbilityProfileCard';
import { buildSelfCheck } from '../services/selfCheckService';
import { formatDateJa, todayLocalISODate, toLocalISODate } from '../utils/date';
import type {
  AssessmentDraft,
  AssessmentDraftAnswer,
  AssessmentResult,
  AssessmentSection,
  ChoiceAssessmentItem,
  FreeAssessmentItem,
} from '../types';

type SaveAnswer = (patch: AssessmentDraftAnswer) => Promise<void>;

function ChoiceStep({ item, saved, save }: { item: ChoiceAssessmentItem; saved?: AssessmentDraftAnswer; save: SaveAnswer }) {
  const selected = saved?.choiceIndex ?? null;
  const pick = async (i: number) => {
    if (selected !== null) return;
    await save({ choiceIndex: i, status: i === item.correctIndex ? 'correct' : 'incorrect', grading: 'auto' });
  };
  return (
    <>
      {item.contextLines && (
        <Card className="flex flex-col gap-3">
          {item.contextTitle && <h2 className="font-bold">{item.contextTitle}</h2>}
          {item.contextLines.map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </Card>
      )}
      <Card>
        <p className="mb-4 text-lg font-medium leading-relaxed">{item.prompt}</p>
        <div className="flex flex-col gap-2">
          {item.choices.map((c, i) => {
            let cls = 'border-slate-200 dark:border-slate-700';
            if (selected !== null && i === item.correctIndex) cls = 'border-green-500 bg-green-50 dark:bg-green-950/40';
            else if (selected === i) cls = 'border-red-500 bg-red-50 dark:bg-red-950/40';
            return (
              <button key={i} onClick={() => pick(i)} disabled={selected !== null} className={`tap-target rounded-xl border px-4 py-3 text-left ${cls}`}>
                {c}
              </button>
            );
          })}
        </div>
        {selected !== null && <p className="mt-3 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">{item.explanation}</p>}
      </Card>
    </>
  );
}

function FreeStep({ item, saved, save }: { item: FreeAssessmentItem; saved?: AssessmentDraftAnswer; save: SaveAnswer }) {
  const [text, setText] = useState(saved?.userAnswer ?? '');
  const revealed = saved?.userAnswer !== undefined;
  const ex = item.exercise;
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">{ex.instructionJa}</p>
      <p className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">{ex.promptJa}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={revealed}
        rows={4}
        autoCorrect="off"
        spellCheck={false}
        className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-900"
      />
      {!revealed ? (
        <Button onClick={() => save({ userAnswer: text })} disabled={text.trim() === ''}>
          模範解答と比べる
        </Button>
      ) : (
        <SelfCheckPanel
          userAnswer={text}
          answers={ex.sampleAnswers}
          info={buildSelfCheck(text, ex.sampleAnswers, {
            tag: ex.tag,
            extra: ex.type === 'translate' ? ex.keyPoints : ex.keyExpressions,
          })}
          neverAutoGraded
          decided={saved?.status}
          onDecide={(status) => save({ status, grading: 'self' })}
        />
      )}
    </Card>
  );
}

function ResultView({ result, history }: { result: AssessmentResult; history: AssessmentResult[] }) {
  const comparison = compareAssessments(history);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h1 className="text-xl font-bold">実力確認の結果</h1>
        <p className="text-sm text-slate-500">
          {formatDateJa(result.date)}・Level {result.level}・初見問題の割合 {Math.round(result.unseenRatio * 100)}%
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {(Object.keys(ASSESSMENT_SECTION_LABELS) as AssessmentSection[]).map((key) => {
            const s = result.sections[key];
            if (!s) return null;
            return (
              <li key={key} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                <span>{ASSESSMENT_SECTION_LABELS[key]}</span>
                <span className="font-bold">
                  {s.correct}/{s.total}
                  <ChangeBadge comparison={comparison?.sections[key]} />
                </span>
              </li>
            );
          })}
        </ul>
        {(result.selfCheckUnresolved ?? 0) > 0 && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
            「判断できない」とした {result.selfCheckUnresolved} 問は成績に含めず、復習で再確認します。
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          自動採点の範囲: 選択問題と、登録済みの正解に一致する英作文。それ以外の英作文は自己評価のため参考値で、前回との比較もしません。間違えた問題は復習に入りました。
        </p>
        <ComparisonNotes comparison={comparison} notes={result.selectionNotes} />
      </Card>
      <Button size="lg" onClick={() => navigate('/progress')}>
        Progressで変化を見る
      </Button>
    </div>
  );
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { progress, loading } = useProgress();
  const [history, setHistory] = useState<AssessmentResult[] | null>(null);
  const [draft, setDraft] = useState<AssessmentDraft | null | undefined>(undefined);
  /** the question on screen; advances only on 次へ, so an answer's feedback stays visible */
  const [index, setIndex] = useState(0);
  const [inTest, setInTest] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const today = todayLocalISODate();

  useEffect(() => {
    (async () => {
      const [h, d] = await Promise.all([getAllAssessments(), getAssessmentDraft()]);
      setHistory(h);
      setDraft(d ?? null);
    })();
  }, []);

  if (loading || !history || draft === undefined) return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  if (result) return <ResultView result={result} history={[...history, result]} />;

  const finish = async (d: AssessmentDraft) => {
    if (finishing) return;
    setFinishing(true);
    setResult(await finishAssessment(d));
  };

  const resume = (d: AssessmentDraft) => {
    const next = nextItemIndex(d);
    if (next === -1) {
      // Every question was answered before the app closed: just finish.
      void finish(d);
      return;
    }
    setIndex(next);
    setInTest(true);
  };

  if (!inTest) {
    const status = assessmentStatus(history, today);
    const answeredCount = draft ? draft.items.filter((i) => draft.answers[i.refId]?.status).length : 0;
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">4週間ごとの実力確認</h1>
        {draft ? (
          <Card className="flex flex-col gap-3 border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40">
            <p className="font-medium">途中の実力確認があります</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {formatDateJa(toLocalISODate(new Date(draft.startedAt)))}に開始・{answeredCount} / {draft.items.length} 問回答済み。回答は保存されています。同じ問題の続きから再開します。
            </p>
            <Button size="lg" onClick={() => resume(draft)} disabled={finishing}>
              {answeredCount === draft.items.length ? '結果を確定する' : '続きから再開する'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDiscard(true)}>
              破棄して最初からやり直す
            </Button>
          </Card>
        ) : (
          <>
            <Card className="flex flex-col gap-2 text-sm leading-relaxed">
              <p>
                今のレベル（Level {Math.min(progress.currentLevel, 5)}）の、まだ解いたことのない問題で、文法・語彙・読解・構文理解・短い英作文を確認します（約15分・22問程度）。毎回、分野ごとに推定難易度（基礎・標準・応用）の構成をそろえて出題します。
              </p>
              <p>同じ問題を覚えて正解したかではなく、初めて見る英文で使えるかを測るためのテストです。ヒントはありません。</p>
              <p>途中でアプリを閉じても回答は保存され、続きから再開できます。最後まで終えるまで、成績や復習には反映されません。</p>
              <p className="text-xs text-slate-500">
                採点：選択問題と、登録済みの正解に一致する英作文は自動。一致しない英作文と自由記述は「要自己確認」として自己評価し、参考値として別に記録します。TOEIC は別の指標（模擬テスト）で管理します。
              </p>
              {status.last && <p className="text-xs text-slate-500">前回: {formatDateJa(status.last.date)}</p>}
            </Card>
            {status.due ? (
              <Button
                size="lg"
                onClick={async () => {
                  const d = await startAssessment(progress.currentLevel, await getAllReviewItems(), today);
                  setDraft(d);
                  setIndex(0);
                  setInTest(true);
                }}
              >
                {history.length === 0 ? '最初の実力確認を始める' : '実力確認を始める'}
              </Button>
            ) : (
              <Card className="text-center text-sm text-slate-500">次回は {formatDateJa(status.nextDate!)} から受けられます。</Card>
            )}
          </>
        )}
        <ConfirmDialog
          open={confirmDiscard}
          title="途中の実力確認を破棄しますか？"
          message={'ここまでの回答は成績にも復習にも反映されずに消えます。\n破棄すると、新しい問題で最初からやり直せます。'}
          confirmLabel="破棄する"
          danger
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={async () => {
            await deleteAssessmentDraft();
            setDraft(null);
            setConfirmDiscard(false);
          }}
        />
      </div>
    );
  }

  const d = draft!;
  const item = d.items[index];
  const saved = d.answers[item.refId];
  const save: SaveAnswer = async (patch) => setDraft(await saveDraftAnswer(d, item.refId, patch));
  const goNext = async () => {
    const next = d.items.findIndex((it, i) => i > index && !d.answers[it.refId]?.status);
    if (next !== -1) setIndex(next);
    else if (nextItemIndex(d) === -1) await finish(d);
    else setIndex(nextItemIndex(d));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {ASSESSMENT_SECTION_LABELS[item.section]}・{index + 1} / {d.items.length}
        </p>
        <button onClick={() => navigate('/')} className="tap-target text-sm text-blue-600 dark:text-blue-400">
          中断する（保存済み）
        </button>
      </div>
      {item.kind === 'choice' && <ChoiceStep key={item.refId} item={item} saved={saved} save={save} />}
      {item.kind === 'sentence' && (
        <Card>
          <SentenceTaskView
            key={item.refId}
            task={item.task}
            source="assessment"
            allowHint={false}
            record={false}
            restored={saved?.userAnswer !== undefined ? { userAnswer: saved.userAnswer, status: saved.status } : undefined}
            onSubmit={(userAnswer, exact) => save(exact ? { userAnswer, exact, status: 'correct', grading: 'auto' } : { userAnswer, exact })}
            onResult={(r) => (r.exact ? Promise.resolve() : save({ status: r.status, grading: 'self' }))}
            onDone={() => goNext()}
          />
        </Card>
      )}
      {item.kind === 'free' && <FreeStep key={item.refId} item={item} saved={saved} save={save} />}
      {saved?.status && item.kind !== 'sentence' && (
        <Button size="lg" onClick={goNext} disabled={finishing}>
          {nextItemIndex(d) === -1 ? '結果を見る' : '次へ'}
        </Button>
      )}
    </div>
  );
}
