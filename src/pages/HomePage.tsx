import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { getDailyPlan, TOTAL_CURRICULUM_DAYS, type DailyPlan } from '../services/curriculum';
import { getLevelInfo } from '../data/levels';
import { getOrCreateTodaySession, isSessionComplete } from '../services/sessionService';
import { getAllSessions } from '../db/repositories/sessionRepository';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { getAnswerLogBetween } from '../db/repositories/answerLogRepository';
import { getAllAssessments, getAssessmentDraft } from '../db/repositories/assessmentRepository';
import { computeWeeklyMinutes } from '../services/statsService';
import { computeDailyMinutes, type DynamicMinutePlan } from '../services/dailyPlanner';
import { getTodayReview } from '../services/reviewPlanService';
import { getOrCreateTodayNoteTasks } from '../services/noteTaskService';
import { computeWeeklyMissions, weekStart, type Mission } from '../services/missionService';
import { assessmentStatus } from '../services/assessmentService';
import { getUnderstandingQuestionsForDay } from '../services/curriculum';
import { addDaysISO, greetingForNow, todayLocalISODate } from '../utils/date';
import type { LearningSession, NoteTask } from '../types';

export default function HomePage() {
  const { progress, loading } = useProgress();
  const [session, setSession] = useState<LearningSession | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const [minutes, setMinutes] = useState<DynamicMinutePlan>(() => computeDailyMinutes(false));
  const [mainNote, setMainNote] = useState<NoteTask | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [assessmentDue, setAssessmentDue] = useState(false);
  const [assessmentInProgress, setAssessmentInProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const s = await getOrCreateTodaySession();
      setSession(s);
      const day = Math.min(s.day, TOTAL_CURRICULUM_DAYS + 1000);
      setPlan(await getDailyPlan(day));
      const sessions = await getAllSessions();
      setWeeklyMinutes(computeWeeklyMinutes(sessions));
      const today = todayLocalISODate();
      const [review, questions, items, log, assessments] = await Promise.all([
        getTodayReview(),
        getUnderstandingQuestionsForDay(day),
        getAllReviewItems(),
        getAnswerLogBetween(weekStart(today), addDaysISO(weekStart(today), 6)),
        getAllAssessments(),
      ]);
      setMinutes(computeDailyMinutes(review.plan.loadHigh));
      const notes = await getOrCreateTodayNoteTasks(s, await getDailyPlan(day), questions);
      setMainNote(notes.find((n) => n.main) ?? null);
      setMissions(computeWeeklyMissions({ today, sessions: await getAllSessions(), log, items }));
      setAssessmentDue(assessmentStatus(assessments, today).due);
      setAssessmentInProgress(!!(await getAssessmentDraft()));
    })();
  }, [progress.currentDay]);

  if (loading || !session || !plan) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  const levelInfo = getLevelInfo(progress.currentLevel);
  const complete = isSessionComplete(session);
  const todayMinutes =
    session.minutesSpent.reading + session.minutesSpent.grammar + session.minutesSpent.writing + session.minutesSpent.review;

  const grammarTopicTitle = plan.grammarTheory[0]?.title ?? plan.grammarLessons[0]?.title ?? null;

  const sectionRows = [
    { key: 'reading', label: 'Reading', minutes: minutes.reading, done: session.sectionsDone.reading },
    { key: 'grammar', label: 'Grammar（新しい知識と演習）', minutes: minutes.grammar, done: session.sectionsDone.grammar },
    { key: 'writing', label: 'Writing（英文組み立て）', minutes: minutes.writing, done: session.sectionsDone.writing },
    { key: 'review', label: 'Review', minutes: minutes.review, done: session.sectionsDone.review },
  ] as const;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{greetingForNow()}</p>
        <h1 className="text-2xl font-bold">今日も一緒に学びましょう</h1>
      </div>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-200">Today's Training</h2>
          <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">Day {session.day}</span>
        </div>
        <p className="mb-1 text-sm text-blue-800 dark:text-blue-300">{levelInfo.name}</p>
        <p className="mb-1 text-sm text-blue-700 dark:text-blue-400">Reading: 「{plan.reading.title}」</p>
        {grammarTopicTitle && (
          <p className="mb-1 text-sm text-blue-700 dark:text-blue-400">
            Grammar: 「{grammarTopicTitle}」を{plan.grammarTheory.length > 0 ? '理解してから練習' : '学ぶ'}
          </p>
        )}
        <p className="mb-4 text-sm text-blue-700 dark:text-blue-400">Vocabulary: 今日の単語で復習</p>

        <ul className="mb-4 flex flex-col gap-2">
          {sectionRows.map((row) => (
            <li key={row.key} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm dark:bg-slate-900/50">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">{row.done ? '✅' : '⬜️'}</span>
                {row.label}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{row.minutes} min</span>
            </li>
          ))}
        </ul>

        {complete ? (
          <div className="rounded-xl bg-green-100 px-4 py-3 text-center font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
            🎉 今日のトレーニングは完了しました！お疲れさまでした。
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full" onClick={() => navigate('/training')}>
              Start Today's Training（約{minutes.totalMinutes}分）
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/quick')}>
              忙しい日は5分だけ
            </Button>
          </div>
        )}
      </Card>

      {(assessmentDue || assessmentInProgress) && (
        <Link
          to="/assessment"
          className="tap-target rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300"
        >
          {assessmentInProgress ? '📏 実力確認の続きがあります（回答は保存済み）→' : '📏 4週間ごとの実力確認を受けられます（約15分）→'}
        </Link>
      )}

      {mainNote && (
        <Link to="/notes" className="block">
          <Card className="transition-colors hover:border-emerald-300 dark:hover:border-emerald-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">📓 今日のノート課題（約{mainNote.estimatedMinutes}分）</p>
              <span className="text-xs text-slate-400">{mainNote.selfEval ? '自己評価済み' : '未実施'}</span>
            </div>
            <p className="mt-1 text-sm">{mainNote.titleJa}</p>
          </Card>
        </Link>
      )}

      {missions.length > 0 && (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">今週のミッション</p>
            <span className="text-xs text-slate-400">
              {missions.filter((m) => m.done).length} / {missions.length} 達成
            </span>
          </div>
          <ul className="flex flex-col gap-1.5 text-sm">
            {missions.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2">
                <span>
                  {m.done ? '✅' : '⬜️'} {m.titleJa}
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {Math.min(m.current, m.target)}/{m.target}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">Current Level</p>
          <p className="mt-1 text-xl font-bold">Level {progress.currentLevel}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">連続学習日数</p>
          <p className="mt-1 text-xl font-bold">🔥 {progress.currentStreak} 日</p>
        </Card>
      </div>

      <Card>
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">今日の進捗</p>
        <ProgressBar value={(todayMinutes / minutes.totalMinutes) * 100} label={`${todayMinutes} / ${minutes.totalMinutes} 分`} />
      </Card>

      <Card>
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">今週の学習時間</p>
        <ProgressBar value={(weeklyMinutes / (minutes.totalMinutes * 7)) * 100} label={`${weeklyMinutes} 分 / 週目標 ${minutes.totalMinutes * 7} 分`} />
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">追加トレーニング（時間制限なし）</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <Link to="/grammar-theory" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            📐 Grammar Theory
          </Link>
          <Link to="/vocabulary" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            🧠 Vocabulary
          </Link>
          <Link to="/reading" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            📖 Reading
          </Link>
          <Link to="/writing" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            ✍️ Writing
          </Link>
          <Link to="/research" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            🔬 研究英語
          </Link>
          <Link to="/notes" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            📓 ノート課題
          </Link>
          <Link to="/toeic" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            📝 TOEIC
          </Link>
          <Link to="/review" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            🔄 Review
          </Link>
          <Link to="/extra-training" className="tap-target rounded-xl border border-slate-200 py-3 dark:border-slate-700">
            ➕ すべて見る
          </Link>
        </div>
      </div>
    </div>
  );
}
