import type {
  LearningSession,
  NoteSelfEval,
  NoteTask,
  NoteTaskKind,
  ReviewCategory,
  UnderstandingQuestion,
} from '../types';
import type { DailyPlan } from './curriculum';
import { getAllSessions, getSessionByDate, saveSession } from '../db/repositories/sessionRepository';
import { getReviewItemByRef, upsertReviewItem } from '../db/repositories/reviewRepository';
import { createReviewItem } from './reviewScheduler';
import { saveAnswer } from './reviewService';
import { addDaysISO, todayLocalISODate } from '../utils/date';

export const NOTE_KIND_LABELS: Record<NoteTaskKind, string> = {
  composition: '英作文',
  structure: '構文分析',
  explanation: '内容説明',
};

export const SELF_EVAL_LABELS: Record<NoteSelfEval, string> = {
  independent: '自力でできた',
  hinted: 'ヒントが必要だった',
  failed: 'できなかった',
};

const KIND_ORDER: NoteTaskKind[] = ['composition', 'structure', 'explanation'];

const CATEGORY_FOR: Record<NoteTaskKind, ReviewCategory> = {
  composition: 'writing',
  structure: 'grammar',
  explanation: 'reading',
};

/**
 * The day's notebook tasks, made from what was studied that day: an English composition with
 * today's grammar point, a structure analysis of a key sentence from today's passage, and an
 * explanation of the passage's content. One is the day's main task (rotating by day); the other
 * two are optional, so a work break of 5-10 minutes is enough.
 */
export function buildNoteTasks(plan: DailyPlan, questions: UnderstandingQuestion[], date: string): NoteTask[] {
  const level = plan.level;
  const mainKind = KIND_ORDER[plan.day % KIND_ORDER.length];
  const tasks: NoteTask[] = [];

  const theory = plan.grammarTheory[0];
  const lesson = plan.grammarLessons[0];
  const grammarTitle = theory?.title ?? lesson?.title ?? plan.grammarQuestions[0]?.tag;
  if (grammarTitle) {
    const examples = theory
      ? theory.examples.slice(0, 2).map((e) => `${e.english}（${e.japanese}）`)
      : (lesson?.examples ?? []).slice(0, 2).map((e) => `${e.en}（${e.ja}）`);
    tasks.push({
      id: `note-${date}-composition`,
      kind: 'composition',
      titleJa: `英作文：${grammarTitle}`,
      promptJa: `今日の「${grammarTitle}」を使って、英文を3つノートに書きましょう。1文目は例文をまねて、2・3文目は自分の仕事・生活${level >= 3 ? '・研究' : ''}の内容に変えます。辞書は使ってかまいません。`,
      modelAnswer: [
        ...(theory?.basicForm ? [`基本の形: ${theory.basicForm}`] : []),
        ...examples,
        'チェック: 主語と動詞がそろっているか／時制・語順は今日の文法どおりか',
      ],
      estimatedMinutes: 5,
      tag: theory?.tag ?? lesson?.tag ?? plan.grammarQuestions[0]?.tag,
      level,
      main: mainKind === 'composition',
    });
  }

  const breakdown = plan.reading.structureBreakdowns?.[0];
  const point = plan.reading.grammarPoints[0];
  if (breakdown || point) {
    const sentence = breakdown?.sentence ?? point!.sentence;
    const model = breakdown
      ? [...breakdown.segments.map((s) => `${s.role}: ${s.text}`), `訳: ${breakdown.translationJa}`]
      : [
          `S（主語）: ${point!.subject}`,
          `V（動詞）: ${point!.verb}`,
          ...(point!.object ? [`O / C: ${point!.object}`] : []),
          ...(point!.modifiers?.length ? [`M（修飾）: ${point!.modifiers.join(' / ')}`] : []),
          `訳: ${point!.translationJa}`,
          ...point!.notes,
        ];
    tasks.push({
      id: `note-${date}-structure`,
      kind: 'structure',
      titleJa: '構文分析：今日の本文から1文',
      promptJa: '次の英文をノートに書き写し、主語(S)・動詞(V)・目的語(O)/補語(C)・修飾語(M)に線を引いて記号を書きましょう。最後に和訳します。',
      material: sentence,
      readingId: plan.reading.id,
      modelAnswer: model,
      estimatedMinutes: 4,
      level,
      main: mainKind === 'structure',
    });
  }

  const mainIdea = questions.find((q) => q.skillTag === 'main-idea') ?? questions.find((q) => q.skillTag === 'title');
  tasks.push({
    id: `note-${date}-explanation`,
    kind: 'explanation',
    titleJa: `内容説明：「${plan.reading.title}」`,
    promptJa:
      '本文を見ずに、①日本語で2〜3文に要約し、②英語で1文（The text is about ... / The main point is that ...）で説明しましょう。書いたら本文と見比べます。',
    readingId: plan.reading.id,
    modelAnswer: [
      ...(mainIdea ? [`要点: ${mainIdea.choices[mainIdea.correctIndex]}`, mainIdea.explanation] : []),
      `テーマ: ${plan.reading.topic}`,
      `本文の最初の文: ${plan.reading.content[0]?.split(/(?<=[.!?])\s/)[0] ?? ''}`,
    ],
    estimatedMinutes: 5,
    level,
    main: mainKind === 'explanation',
  });

  if (!tasks.some((t) => t.main)) tasks[0].main = true;
  return tasks.sort((a, b) => Number(b.main) - Number(a.main));
}

/** Today's tasks, made once and stored on today's session so they stay the same all day. */
export async function getOrCreateTodayNoteTasks(
  session: LearningSession,
  plan: DailyPlan,
  questions: UnderstandingQuestion[]
): Promise<NoteTask[]> {
  if (session.noteTasks?.length) return session.noteTasks;
  const tasks = buildNoteTasks(plan, questions, session.date);
  const latest = (await getSessionByDate(session.date)) ?? session;
  if (latest.noteTasks?.length) return latest.noteTasks;
  await saveSession({ ...latest, noteTasks: tasks });
  return tasks;
}

/**
 * Saves the learner's self-evaluation. 自力でできた records a success; ヒントが必要だった and
 * できなかった put the task into the review queue (sooner for できなかった), so it comes back as a
 * review card with the model answer.
 */
export async function evaluateNoteTask(date: string, taskId: string, selfEval: NoteSelfEval): Promise<NoteTask | undefined> {
  const session = await getSessionByDate(date);
  const task = session?.noteTasks?.find((t) => t.id === taskId);
  if (!session || !task) return undefined;

  const updatedTask: NoteTask = { ...task, selfEval, evaluatedAt: new Date().toISOString() };
  await saveSession({ ...session, noteTasks: session.noteTasks!.map((t) => (t.id === taskId ? updatedTask : t)) });

  const existing = await getReviewItemByRef(task.id);
  const base =
    existing ??
    createReviewItem({
      category: CATEGORY_FOR[task.kind],
      refId: task.id,
      promptText: [`【ノート課題・${NOTE_KIND_LABELS[task.kind]}】${task.promptJa}`, task.material].filter(Boolean).join('\n'),
      answerText: task.modelAnswer.join('\n'),
      tag: task.tag,
      level: task.level,
      inReview: false,
    });
  const withSkill = task.kind === 'structure' ? { ...base, skill: 'structure' as const } : base;
  const saved = await saveAnswer(withSkill, selfEval === 'independent', { source: 'note', grading: 'self' });
  if (selfEval === 'hinted') {
    // Partly known: a little more time before it comes back than a complete miss.
    await upsertReviewItem({ ...saved, interval: 1, nextReviewDate: addDaysISO(todayLocalISODate(), 3) });
  }
  return updatedTask;
}

/** Tasks from the past week (not today) that were never self-evaluated. */
export async function pendingNoteTasks(today = todayLocalISODate()): Promise<Array<{ date: string; task: NoteTask }>> {
  const from = addDaysISO(today, -7);
  const sessions = await getAllSessions();
  return sessions
    .filter((s) => s.date >= from && s.date < today)
    .flatMap((s) => (s.noteTasks ?? []).filter((t) => !t.selfEval).map((task) => ({ date: s.date, task })))
    .reverse();
}
