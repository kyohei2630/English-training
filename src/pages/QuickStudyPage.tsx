import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ReviewSession from '../components/review/ReviewSession';
import SentenceTaskView from '../components/writing/SentenceTaskView';
import { getTodayReview, markReviewPlanAnswer } from '../services/reviewPlanService';
import { getOrCreateTodaySession, addQuickMinutes } from '../services/sessionService';
import { getDailyPlan } from '../services/curriculum';
import { loadSentenceBuildDrills } from '../data/sentenceBuilding/loader';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { getAllTheoryProgress } from '../db/repositories/theoryProgressRepository';
import { drillStepTask, learnedGrammarTags, pickDrill, type SentenceTask } from '../services/sentenceBuildingService';
import type { ReviewItem } from '../types';

/** Questions from today's review assignment asked in busy-day mode. */
const QUICK_REVIEW_COUNT = 3;

/**
 * 忙しい日の5分学習: up to 3 of today's review questions (they count toward today's review) and
 * one sentence built from scratch. The full training and its curriculum day stay as they are.
 */
export default function QuickStudyPage() {
  const navigate = useNavigate();
  const [review, setReview] = useState<{ items: ReviewItem[]; offset: number; total: number } | null>(null);
  const [task, setTask] = useState<SentenceTask | null>(null);
  const [phase, setPhase] = useState<'review' | 'build' | 'done'>('review');
  const startRef = useRef(0);

  useEffect(() => {
    (async () => {
      startRef.current = Date.now();
      const today = await getTodayReview();
      setReview({ items: today.remaining.slice(0, QUICK_REVIEW_COUNT), offset: today.doneCount, total: today.items.length });
      const session = await getOrCreateTodaySession();
      const [plan, drills, items, theory] = await Promise.all([
        getDailyPlan(session.day),
        loadSentenceBuildDrills(),
        getAllReviewItems(),
        getAllTheoryProgress(),
      ]);
      // A drill on grammar already learned; a new learner gets the first drill of their level.
      const drill =
        pickDrill(drills, { todayTags: [], level: plan.level, learned: await learnedGrammarTags(items, theory), items }) ??
        drills.find((d) => d.level === plan.level) ??
        null;
      if (drill) {
        // The first step not yet solved — a short, self-contained sentence.
        const byRef = new Map(items.map((i) => [i.refId, i]));
        const idx = drill.steps.findIndex((_, i) => (byRef.get(drillStepTask(drill, i).refId)?.consecutiveCorrect ?? 0) === 0);
        setTask(drillStepTask(drill, idx === -1 ? 0 : idx));
      }
      if (today.remaining.length === 0) setPhase('build');
    })();
  }, []);

  const finish = async () => {
    const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
    await addQuickMinutes(minutes);
    setPhase('done');
  };

  if (!review) return <div className="py-20 text-center text-slate-400">読み込み中...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">5分だけ学習</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">忙しい日用：今日の復習から{QUICK_REVIEW_COUNT}問と、英文を1つ組み立てます。</p>
      </div>

      {phase === 'review' && (
        <ReviewSession
          items={review.items}
          progressOffset={review.offset}
          progressTotal={review.total}
          onAnswered={(i, ok, grading) => markReviewPlanAnswer(i.id, ok, grading)}
          onComplete={() => (task ? setPhase('build') : finish())}
        />
      )}

      {phase === 'build' && task && (
        <Card>
          <p className="mb-2 text-sm font-bold text-teal-700 dark:text-teal-300">英文組み立て</p>
          <SentenceTaskView task={task} onDone={() => finish()} doneLabel="終わる" />
        </Card>
      )}
      {phase === 'build' && !task && (
        <Button size="lg" onClick={finish}>
          終わる
        </Button>
      )}

      {phase === 'done' && (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-4xl">👍</p>
          <p className="text-lg font-medium">今日の5分学習ができました</p>
          <p className="text-sm text-slate-500">時間があるときは、通常のトレーニングの続きからできます。</p>
          <Button onClick={() => navigate('/')}>Homeに戻る</Button>
        </Card>
      )}
    </div>
  );
}
