import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StepDots from '../components/layout/StepDots';
import ReadingView from '../components/reading/ReadingView';
import UnderstandingQuiz from '../components/reading/UnderstandingQuiz';
import GrammarSession from '../components/grammar/GrammarSession';
import WritingSession from '../components/writing/WritingSession';
import ReviewSession from '../components/review/ReviewSession';
import { getDailyPlan, getUnderstandingQuestionsForDay, type DailyPlan } from '../services/curriculum';
import {
  getOrCreateTodaySession,
  markSectionProgress,
  completeTodaySession,
} from '../services/sessionService';
import { getDueReviewItems } from '../db/repositories/reviewRepository';
import { todayLocalISODate } from '../utils/date';
import type { LearningSession, ReviewItem, SectionKey, UnderstandingQuestion } from '../types';

type Step = SectionKey | 'complete';

const STEP_LABELS: Record<SectionKey, string> = {
  reading: 'Reading',
  grammar: 'Grammar',
  writing: 'Writing',
  review: 'Review',
};

function elapsedMinutesSince(startedAt: number): number {
  return Math.max(1, Math.round((Date.now() - startedAt) / 60000));
}

export default function TrainingPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<LearningSession | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [questions, setQuestions] = useState<UnderstandingQuestion[]>([]);
  const [step, setStep] = useState<Step>('reading');
  const [readingPhase, setReadingPhase] = useState<'passage' | 'quiz'>('passage');
  const [dueReviewItems, setDueReviewItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const stepStartRef = useRef(Date.now());

  useEffect(() => {
    (async () => {
      const s = await getOrCreateTodaySession();
      setSession(s);
      const firstIncomplete = (Object.keys(STEP_LABELS) as SectionKey[]).find((k) => !s.sectionsDone[k]);
      setStep(firstIncomplete ?? 'complete');
      const [dailyPlan, dailyQuestions, due] = await Promise.all([
        getDailyPlan(s.day),
        getUnderstandingQuestionsForDay(s.day),
        getDueReviewItems(todayLocalISODate()),
      ]);
      setPlan(dailyPlan);
      setQuestions(dailyQuestions);
      setDueReviewItems(due);
      setLoading(false);
      stepStartRef.current = Date.now();
    })();
  }, []);

  if (loading || !session || !plan) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const goToStep = (next: Step) => {
    stepStartRef.current = Date.now();
    setStep(next);
  };

  const finishReadingPassage = () => {
    setReadingPhase('quiz');
  };

  const finishReading = async (correct: number, total: number) => {
    const minutes = elapsedMinutesSince(stepStartRef.current);
    const updated = await markSectionProgress('reading', {
      sectionsDone: { ...session.sectionsDone, reading: true },
      minutesSpent: { ...session.minutesSpent, reading: minutes },
      readingCorrect: correct,
      readingTotal: total,
      materialsCompleted: [...session.materialsCompleted, plan.reading.id],
    });
    setSession(updated);
    goToStep('grammar');
  };

  const finishGrammar = async (correct: number, total: number) => {
    const minutes = elapsedMinutesSince(stepStartRef.current);
    const updated = await markSectionProgress('grammar', {
      sectionsDone: { ...session.sectionsDone, grammar: true },
      minutesSpent: { ...session.minutesSpent, grammar: minutes },
      grammarCorrect: correct,
      grammarTotal: total,
    });
    setSession(updated);
    goToStep('writing');
  };

  const finishWriting = async (completedCount: number, total: number) => {
    const minutes = elapsedMinutesSince(stepStartRef.current);
    const updated = await markSectionProgress('writing', {
      sectionsDone: { ...session.sectionsDone, writing: true },
      minutesSpent: { ...session.minutesSpent, writing: minutes },
      writingCompleted: completedCount,
    });
    setSession(updated);
    void total;
    goToStep('review');
  };

  const finishReview = async (correct: number, total: number) => {
    const minutes = elapsedMinutesSince(stepStartRef.current);
    const updated = await markSectionProgress('review', {
      sectionsDone: { ...session.sectionsDone, review: true },
      minutesSpent: { ...session.minutesSpent, review: minutes },
      reviewCorrect: correct,
      reviewTotal: total,
    });
    setSession(updated);
    await completeTodaySession();
    goToStep('complete');
  };

  const steps = (Object.keys(STEP_LABELS) as SectionKey[]).map((key) => ({
    key,
    label: STEP_LABELS[key],
    done: session.sectionsDone[key],
    active: step === key,
  }));

  const totalMinutes =
    session.minutesSpent.reading + session.minutesSpent.grammar + session.minutesSpent.writing + session.minutesSpent.review;

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 flex flex-col items-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
        <div className="flex w-full max-w-2xl items-center justify-between">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Today's Training · Day {session.day}</span>
          <button
            onClick={() => navigate('/')}
            aria-label="ホームに戻る"
            className="tap-target rounded-full p-1 text-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        {step !== 'complete' && <StepDots steps={steps} />}
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {step === 'reading' && readingPhase === 'passage' && (
          <div className="flex flex-col gap-5">
            <ReadingView material={plan.reading} />
            <Button size="lg" onClick={finishReadingPassage}>
              理解度チェックへ進む
            </Button>
          </div>
        )}

        {step === 'reading' && readingPhase === 'quiz' && (
          <UnderstandingQuiz questions={questions} level={plan.level} onComplete={finishReading} />
        )}

        {step === 'grammar' && (
          <GrammarSession
            theory={plan.grammarTheory}
            lessons={plan.grammarLessons}
            questions={plan.grammarQuestions}
            onComplete={finishGrammar}
          />
        )}

        {step === 'writing' && <WritingSession exercises={plan.writing} onComplete={finishWriting} />}

        {step === 'review' &&
          (dueReviewItems.length === 0 ? (
            <Card className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-4xl">🎉</p>
              <p className="text-lg font-medium">今日復習する項目はありません</p>
              <Button size="lg" onClick={() => finishReview(0, 0)}>
                トレーニングを完了する
              </Button>
            </Card>
          ) : (
            <ReviewSession items={dueReviewItems} onComplete={finishReview} />
          ))}

        {step === 'complete' && (
          <Card className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-5xl">🎉</p>
            <h1 className="text-2xl font-bold">Today's Training Complete!</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">{totalMinutes} min</p>
            <ul className="flex flex-col gap-1 text-left text-sm">
              <li>Reading ✓</li>
              <li>Grammar ✓</li>
              <li>Writing ✓</li>
              <li>Review ✓</li>
            </ul>
            <p className="text-slate-500 dark:text-slate-400">Keep going!</p>
            <div className="flex w-full gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => navigate('/progress')}>
                Progressを見る
              </Button>
              <Button className="flex-1" onClick={() => navigate('/')}>
                Homeに戻る
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
