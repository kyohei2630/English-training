import type { Level, ReviewCategory } from '../types';
import { canonicalTag } from '../data/grammar/tagLabels';
import { getReviewItemByRef, upsertReviewItem } from '../db/repositories/reviewRepository';
import { createReviewItem } from './reviewScheduler';
import { normalizeSentence } from './sentenceBuildingService';
import { addDaysISO, todayLocalISODate } from '../utils/date';

/** Points to check in every English sentence. */
const BASIC_CHECKPOINTS = [
  '主語と動詞がそろっている（命令文以外）',
  '動詞の形：時制、三単現の -s、be動詞と主語の一致',
  '語順：主語 → 動詞 → 目的語・補語 → 場所 → 時',
  '名詞の形：冠詞（a / the）と単数・複数',
];

/** Extra points for the grammar being practised, keyed by tag ID. */
const TAG_CHECKPOINTS: Record<string, string> = {
  be動詞: 'am / is / are を主語に合わせている',
  一般動詞: '一般動詞と be動詞を並べていない（× I am study）',
  三単現: '主語が三人称単数なら動詞に -s / -es',
  否定文: 'do / does / did not ＋動詞の原形',
  疑問文: 'Do / Does / Did ＋主語＋原形、または be動詞を主語の前へ',
  過去形: '過去を表す語があれば過去形（不規則動詞に注意）',
  未来: 'will ＋原形、または be going to ＋原形',
  現在進行形: 'be動詞 ＋ -ing',
  命令文: '主語なしで動詞の原形から始める',
  助動詞: '助動詞の後は原形、to は付けない',
  前置詞: '時（at / on / in）・場所の前置詞の使い分け',
  接続詞: 'because / so / but の後ろに主語＋動詞がある',
  'there-is-are': 'There ＋ be動詞は後ろの名詞の数に合わせる',
  疑問詞: '疑問詞を文頭に置き、その後は疑問文の語順',
  基本文型: '動詞の後に必要な目的語・補語がそろっている',
  冠詞: '数えられる名詞の単数には a / the が必要',
  現在完了: 'have / has ＋過去分詞（過去を表す語とは使わない）',
  不定詞: 'to ＋動詞の原形',
  動名詞: '前置詞や enjoy / finish / avoid の後は -ing',
  分詞: '名詞を説明する -ing（〜している）／過去分詞（〜された）',
  比較: '比較級 ＋ than、最上級には the',
  受動態: 'be動詞 ＋過去分詞（時制は be動詞で表す）',
  関係代名詞: '先行詞の直後に who / which / that、節の中に動詞がある',
  条件文: 'if 節の中は未来でも現在形',
  仮定法: 'If ＋過去形, would ＋原形（過去の仮定は had ＋過去分詞）',
  分詞構文: '分詞の意味上の主語が主節の主語と同じ',
  接続表現: 'However / Therefore などの後にコンマ',
  因果関係: '原因と結果の向き（A causes B / B results from A）',
  長い主語: '主語の中心の名詞と動詞の数が一致している',
  倒置: '否定語が文頭なら疑問文の語順',
  強調構文: 'It is / was 〜 that ... の形',
  論文表現: '研究目的・結果は過去形、一般的事実は現在形',
  統計表現: 'difference in X between A and B などの前置詞',
  図表説明: 'Table / Figure ＋番号、As shown in ...',
  数値表現: 'from A to B（変化）、by C（変化の幅）、単位',
};

export interface SelfCheckInfo {
  checkpoints: string[];
  /** model-answer words missing from the learner's answer */
  missingWords: string[];
  /** words in the learner's answer that the model answer doesn't use */
  extraWords: string[];
}

/** Material for judging an answer that matched no registered answer: grammar points to check
 * and a word-level comparison with the closest accepted answer. */
export function buildSelfCheck(userAnswer: string, answers: string[], options: { tag?: string; hintJa?: string; extra?: string[] } = {}): SelfCheckInfo {
  const userWords = normalizeSentence(userAnswer).split(' ').filter(Boolean);
  // Compare with the accepted answer sharing the most words.
  let best = normalizeSentence(answers[0] ?? '').split(' ').filter(Boolean);
  let bestShared = -1;
  for (const a of answers) {
    const words = normalizeSentence(a).split(' ').filter(Boolean);
    const shared = words.filter((w) => userWords.includes(w)).length;
    if (shared > bestShared) {
      best = words;
      bestShared = shared;
    }
  }
  const tagPoint = options.tag ? TAG_CHECKPOINTS[canonicalTag(options.tag)] : undefined;
  return {
    checkpoints: [...(tagPoint ? [tagPoint] : []), ...(options.extra ?? []), ...(options.hintJa ? [options.hintJa] : []), ...BASIC_CHECKPOINTS],
    missingWords: [...new Set(best.filter((w) => !userWords.includes(w)))],
    extraWords: [...new Set(userWords.filter((w) => !best.includes(w)))],
  };
}

/**
 * "判断できない": the answer is neither counted right nor wrong. The item is queued for the next
 * day's review with the learner's answer attached, so it can be checked again — with fresh eyes
 * or a teacher. Counters and mastery are not touched.
 */
export async function markForSelfCheck(params: {
  category: ReviewCategory;
  refId: string;
  promptText: string;
  answerText: string;
  explanation?: string;
  tag?: string;
  level?: Level;
  userAnswer: string;
}): Promise<void> {
  const existing = await getReviewItemByRef(params.refId);
  const base =
    existing ??
    createReviewItem({
      category: params.category,
      refId: params.refId,
      promptText: params.promptText,
      answerText: params.answerText,
      explanation: params.explanation,
      tag: params.tag,
      level: params.level,
      inReview: true,
    });
  const tomorrow = addDaysISO(todayLocalISODate(), 1);
  await upsertReviewItem({
    ...base,
    inReview: true,
    pendingSelfCheck: true,
    pendingAnswer: params.userAnswer,
    nextReviewDate: base.nextReviewDate < tomorrow && existing ? base.nextReviewDate : tomorrow,
    updatedAt: new Date().toISOString(),
  });
}
