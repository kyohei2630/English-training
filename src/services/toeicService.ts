import type { ToeicPart, ToeicQuestion, ToeicResult } from '../types';
import { generateId } from '../utils/id';
import { pickRandom } from '../utils/random';
import { todayLocalISODate } from '../utils/date';

export interface FlatToeicItem {
  id: string;
  part: ToeicPart;
  tag: string;
  passageTitle?: string;
  contextLines?: string[];
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

/** Flattens the nested TOEIC content (conversations, talks, multi-blank passages,
 * reading passages) into a uniform list of single-answer items, so the same
 * question-runner UI can drive Part 1 through Part 7. */
export function flattenToeicQuestions(questions: ToeicQuestion[]): FlatToeicItem[] {
  const flat: FlatToeicItem[] = [];
  for (const q of questions) {
    switch (q.part) {
      case 1:
        flat.push({
          id: q.id,
          part: 1,
          tag: q.tag,
          contextLines: [q.sceneDescriptionJa, q.sceneDescriptionEn],
          prompt: '写真を最もよく表している文を選びなさい。',
          choices: q.choices,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
        break;
      case 2:
        flat.push({
          id: q.id,
          part: 2,
          tag: q.tag,
          prompt: q.question,
          choices: q.choices,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
        break;
      case 3:
        for (const sub of q.questions) {
          flat.push({
            id: sub.id,
            part: 3,
            tag: q.tag,
            contextLines: q.conversation,
            prompt: sub.question,
            choices: sub.choices,
            correctIndex: sub.correctIndex,
            explanation: q.explanation,
          });
        }
        break;
      case 4:
        for (const sub of q.questions) {
          flat.push({
            id: sub.id,
            part: 4,
            tag: q.tag,
            contextLines: q.talk,
            prompt: sub.question,
            choices: sub.choices,
            correctIndex: sub.correctIndex,
            explanation: q.explanation,
          });
        }
        break;
      case 5:
        flat.push({
          id: q.id,
          part: 5,
          tag: q.tag,
          prompt: q.sentence,
          choices: q.choices,
          correctIndex: q.correctIndex,
          explanation: `${q.explanation}\n${q.translationJa}`,
        });
        break;
      case 6:
        q.blanks.forEach((blank, i) => {
          flat.push({
            id: `${q.id}_blank${i + 1}`,
            part: 6,
            tag: q.tag,
            passageTitle: q.passageTitle,
            contextLines: q.passage,
            prompt: `空欄 (${i + 1}) に入る最も適切な語句を選びなさい。`,
            choices: blank.choices,
            correctIndex: blank.correctIndex,
            explanation: q.explanation,
          });
        });
        break;
      case 7:
        for (const sub of q.questions) {
          flat.push({
            id: sub.id,
            part: 7,
            tag: q.tag,
            passageTitle: q.passageTitle,
            contextLines: q.passage,
            prompt: sub.question,
            choices: sub.choices,
            correctIndex: sub.correctIndex,
            explanation: q.explanation,
          });
        }
        break;
    }
  }
  return flat;
}

export interface MockTestConfig {
  perPart: Partial<Record<ToeicPart, number>>;
}

const DEFAULT_MOCK_CONFIG: MockTestConfig = {
  perPart: { 1: 5, 2: 8, 3: 3, 4: 3, 5: 15, 6: 2, 7: 3 },
};

/** Builds a mock test by sampling a bounded number of *source* questions per part
 * (not flattened items, so a Part 3 conversation always keeps all of its sub-questions
 * together) and then flattening the result for the question-runner UI. */
export function buildMockTest(byPart: Record<ToeicPart, ToeicQuestion[]>, config: MockTestConfig = DEFAULT_MOCK_CONFIG): FlatToeicItem[] {
  const selected: ToeicQuestion[] = [];
  for (const partKey of Object.keys(byPart) as unknown as ToeicPart[]) {
    const part = Number(partKey) as ToeicPart;
    const pool = byPart[part] ?? [];
    const count = config.perPart[part] ?? pool.length;
    selected.push(...pickRandom(pool, Math.min(count, pool.length)));
  }
  return flattenToeicQuestions(selected);
}

/** Learning-guide score band only — never presented as an official TOEIC score. */
export function estimateScoreBand(accuracyPercent: number): string {
  if (accuracyPercent < 40) return '基礎段階（目安）';
  if (accuracyPercent < 55) return 'TOEIC 400レベル目安';
  if (accuracyPercent < 65) return 'TOEIC 500レベル目安';
  if (accuracyPercent < 75) return 'TOEIC 600レベル目安';
  if (accuracyPercent < 85) return 'TOEIC 700レベル目安';
  return 'TOEIC 800レベル目安';
}

export function buildToeicResult(params: {
  items: FlatToeicItem[];
  answers: Map<string, number>; // itemId -> chosen choice index
  durationSeconds: number;
}): ToeicResult {
  const byPart: ToeicResult['byPart'] = {};
  let correct = 0;

  for (const item of params.items) {
    const chosen = params.answers.get(item.id);
    const wasCorrect = chosen === item.correctIndex;
    if (wasCorrect) correct += 1;
    const partResult = byPart[item.part] ?? { attempted: 0, correct: 0 };
    partResult.attempted += 1;
    if (wasCorrect) partResult.correct += 1;
    byPart[item.part] = partResult;
  }

  const total = params.items.length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    id: generateId('toeic-result'),
    date: todayLocalISODate(),
    completedAt: new Date().toISOString(),
    totalQuestions: total,
    correct,
    byPart,
    durationSeconds: params.durationSeconds,
    estimatedScoreBand: estimateScoreBand(accuracy),
  };
}
