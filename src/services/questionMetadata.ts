import type {
  GrammarPoint,
  GrammarQuestion,
  ReadingMaterial,
  ReadingSkillTag,
  SentenceBuildDrill,
  UnderstandingQuestion,
  VocabularyEntry,
  EstimatedDifficulty,
} from '../types';
import { canonicalTag } from '../data/grammar/tagLabels';

/**
 * Question metadata for comparable assessments. It reuses what each question already has —
 * its tag (grammar point / vocabulary category / reading skill) and its format — and adds an
 * ESTIMATED difficulty, in two steps:
 *
 * 1. `load`: a rule-based score of the question itself — the knowledge it requires, how it is
 *    answered (recognise vs. produce a form, whether a cue word signals the answer, whether
 *    choices differ in form or in meaning, whether a reading answer is paraphrased), and how much
 *    text has to be processed. Each point comes with a reason.
 * 2. 基礎 / 標準 / 応用: the question's place among the other questions of the same Level and
 *    kind (tertiles of `load`; equal loads always get the same label). So the label is relative
 *    to the Level, but it is decided by the question's own features, not by the Level.
 *
 * This is a provisional estimate. It has not been validated against answer data (e.g. item
 * response analysis) and must not be presented as a measured difficulty.
 */
export const DIFFICULTY_MODEL_VERSION = 'heuristic-2026-10b';

export type Difficulty = EstimatedDifficulty;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  basic: '基礎',
  standard: '標準',
  advanced: '応用',
};

/** The ability a question measures (matches the assessment sections). */
export type MeasuredAbility = 'grammar' | 'vocabulary' | 'reading' | 'structure' | 'writing';

export interface QuestionLoad {
  /** existing tag, reused: grammar tag ID, vocabulary category or reading skill */
  tag?: string;
  /** existing question format, reused */
  format: string;
  ability: MeasuredAbility;
  /** estimated load (higher = harder); compared only within the same Level and kind */
  load: number;
  /** what the estimate is based on */
  reasons: string[];
}

export interface QuestionMeta extends QuestionLoad {
  difficulty: Difficulty;
}

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const words = (s: string) => s.toLowerCase().match(/[a-z']+/g) ?? [];

/** English part of a prompt (drops Japanese instructions like 「次の文の誤りを直しなさい:」). */
function englishPart(s: string): string {
  const quoted = /"([^"]+)"/.exec(s);
  if (quoted) return quoted[1];
  return s.replace(/[^\x20-\x7E]+/g, ' ').trim();
}

/**
 * Labels a pool of questions by tertiles of their load. Questions with equal load always get the
 * same label, so a band can come out smaller than a third — the assessment reports that as a
 * shortage rather than pretending the pool is balanced.
 */
export function classifyByLoad<T>(pool: T[], loadOf: (t: T) => number): Map<T, Difficulty> {
  const out = new Map<T, Difficulty>();
  if (pool.length === 0) return out;
  const loads = pool.map(loadOf);
  const values = [...new Set(loads)].sort((a, b) => a - b);
  const countAtMost = (v: number) => loads.filter((l) => l <= v).length;
  // Cut between distinct values (ties are never split) so the three bands come as close to
  // thirds as possible. When a pool has too few distinct values a band stays empty; 基礎 and 標準
  // are filled first in that case.
  const third = pool.length / 3;
  let best = { lo: -Infinity, hi: Infinity, cost: Infinity };
  for (const lo of [-Infinity, ...values]) {
    for (const hi of [...values, Infinity]) {
      if (hi < lo) continue;
      const nBasic = lo === -Infinity ? 0 : countAtMost(lo);
      const nUpToStandard = hi === Infinity ? pool.length : countAtMost(hi);
      const sizes = [nBasic, nUpToStandard - nBasic, pool.length - nUpToStandard];
      // Equal splits: prefer the larger 標準 band (the more conservative label).
      const cost =
        sizes.reduce((c, n) => c + (n - third) ** 2, 0) + (sizes[1] === 0 ? 0.5 : 0) + (sizes[0] === 0 ? 0.25 : 0) - sizes[1] * 1e-6;
      if (cost < best.cost) best = { lo, hi, cost };
    }
  }
  for (let i = 0; i < pool.length; i++) {
    out.set(pool[i], loads[i] <= best.lo ? 'basic' : loads[i] <= best.hi ? 'standard' : 'advanced');
  }
  return out;
}

// ---------------------------------------------------------------- grammar

/** Knowledge required, by grammar point. */
const GRAMMAR_KNOWLEDGE: Record<string, 0 | 1 | 2> = {
  be動詞: 0, 一般動詞: 0, 三単現: 0, 否定文: 0, 疑問文: 0, 過去形: 0, 未来: 0, 現在進行形: 0, 命令文: 0,
  助動詞: 0, 前置詞: 0, 接続詞: 0, 'there-is-are': 0, 疑問詞: 0, 冠詞: 0,
  基本文型: 1, 現在完了: 1, 不定詞: 1, 動名詞: 1, 分詞: 1, 比較: 1, 受動態: 1, 時制: 1, 条件文: 1,
  関係代名詞: 1, 接続表現: 1, 因果関係: 1, 数値表現: 1, 論文表現: 1, 統計表現: 1, 図表説明: 1,
  'toeic-品詞': 1, 'toeic-時制': 1, 'toeic-受動態': 1, 'toeic-前置詞': 1, 'toeic-接続詞': 1,
  関係副詞: 2, 仮定法: 2, 分詞構文: 2, 倒置: 2, 強調構文: 2, 長い主語: 2, 段落構造: 2, 省略: 2, 構造把握: 2,
};
const KNOWLEDGE_LABELS = ['基本', '標準', '発展'];

/** How the answer is reached, by format. */
const GRAMMAR_FORMAT: Record<GrammarQuestion['format'], { points: number; label: string }> = {
  truefalse: { points: -0.5, label: '正誤の判断のみ' },
  choice4: { points: 0, label: '4択で選ぶ' },
  'correct-sentence': { points: 0.5, label: '4つの文全体を比べる' },
  fillblank: { points: 0.5, label: '形を自分で書く' },
  reorder: { points: 0.5, label: '語順を組み立てる' },
  structure: { points: 1, label: '文構造を分析する' },
  'error-correction': { points: 1, label: '誤りを見つけて直す' },
  'ja-to-en': { points: 1, label: '文全体を英作する' },
};

/** Words that point straight at the answer (tense, comparison, condition). */
const CUE_WORDS = /\b(yesterday|tomorrow|ago|last|next|since|already|ever|never|yet|now|than|if|every|usually)\b/i;

const FORM_FAMILIES = [
  ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'],
  ['do', 'does', 'did', 'done', 'doing'],
  ['have', 'has', 'had', 'having'],
];

/** Choices that are forms of one word (study / studies / studied, am / is / are) test form,
 * not meaning. */
function choicesShareStem(choices: string[]): boolean {
  const heads = choices.map((c) => words(c).at(-1) ?? '');
  if (FORM_FAMILIES.some((family) => heads.every((h) => family.includes(h)))) return true;
  if (heads.some((h) => h.length < 3)) return false;
  const stem = heads[0].slice(0, 3);
  return heads.every((h) => h.startsWith(stem));
}

export function grammarLoad(q: GrammarQuestion): QuestionLoad {
  const tag = canonicalTag(q.tag);
  const knowledge = GRAMMAR_KNOWLEDGE[tag] ?? 1;
  const format = GRAMMAR_FORMAT[q.format];
  const reasons = [`必要な知識: ${KNOWLEDGE_LABELS[knowledge]}（${tag}）`, `解答過程: ${format.label}`];
  let load = knowledge + format.points;

  const english = englishPart(q.question);
  const text = q.format === 'correct-sentence' && q.choices ? q.choices.reduce((a, b) => (b.length > a.length ? b : a)) : english;
  const n = wordCount(text);
  if (n >= 20) {
    load += 1;
    reasons.push(`文が長い（${n}語）`);
  } else if (n >= 13) {
    load += 0.5;
    reasons.push(`文がやや長い（${n}語）`);
  } else if (n > 0 && n <= 6) {
    load -= 0.5;
    reasons.push(`文が短い（${n}語）`);
  }

  if (q.format === 'choice4' || q.format === 'fillblank') {
    if ((q.question.match(/___/g) ?? []).length >= 2 || wordCount(q.correctAnswer) >= 2) {
      load += 0.5;
      reasons.push('複数の要素を組み合わせる');
    }
    if (CUE_WORDS.test(english)) {
      load -= 0.5;
      reasons.push('答えの手がかりになる語が文中にある');
    }
    if (q.choices && !choicesShareStem(q.choices)) {
      load += 0.5;
      reasons.push('選択肢が意味・用法の違う語');
    }
  }
  return { tag, format: q.format, ability: q.format === 'structure' ? 'structure' : 'grammar', load, reasons };
}

// ---------------------------------------------------------------- vocabulary

const VOCAB_KNOWLEDGE: Record<string, 0 | 1 | 2> = {
  daily: 0,
  'grammar-function': 0,
  'toeic-office': 1,
  'toeic-travel': 1,
  'toeic-business': 1,
  business: 1,
  academic: 1,
  science: 1,
  'medical-noun': 2,
  'medical-verb': 2,
  'medical-adjective': 2,
  'medical-device': 2,
  research: 2,
};

/** Assessed as meaning recognition (English -> Japanese) every time, so tests stay comparable. */
export function vocabularyLoad(entry: VocabularyEntry): QuestionLoad {
  const knowledge = VOCAB_KNOWLEDGE[entry.category] ?? 1;
  const reasons = [`語の種類: ${['日常語', '一般・学術語', '専門語'][knowledge]}（${entry.category}）`];
  let load = knowledge;
  if (entry.word.includes(' ')) {
    load += 0.5;
    reasons.push('複数語の表現');
  }
  if (entry.word.length >= 11) {
    load += 0.5;
    reasons.push(`長い語（${entry.word.length}文字）`);
  } else if (entry.word.length <= 4) {
    load -= 0.5;
    reasons.push(`短い語（${entry.word.length}文字）`);
  }
  if (!/^(noun|名詞)/i.test(entry.partOfSpeech)) {
    load += 0.25;
    reasons.push(`品詞: ${entry.partOfSpeech}`);
  }
  if (/[、;；,]/.test(entry.meaningJa)) {
    load += 0.5;
    reasons.push('複数の意味がある');
  }
  return { tag: entry.category, format: 'en-to-ja', ability: 'vocabulary', load, reasons };
}

// ---------------------------------------------------------------- reading

/** The skill a reading question tests: its skillTag when set, otherwise inferred from the wording. */
export function readingSkill(q: UnderstandingQuestion): ReadingSkillTag {
  if (q.skillTag) return q.skillTag;
  const s = q.question.toLowerCase();
  if (/closest in meaning|the word .*means|meaning of the word|word ".*" (in|means)/.test(s)) return 'vocabulary-in-context';
  if (/refer to|refers to|"it"|"this"|"they"/.test(s)) return 'reference';
  if (/best title|title for/.test(s)) return 'title';
  if (/main (idea|point|purpose|topic)|mainly about|mostly about|main message|best summar/.test(s)) return 'main-idea';
  if (/(infer|imply|implies|suggest|suggests|probably|most likely|can be concluded|would .* likely)/.test(s)) return 'inference';
  if (/^why\b|reason|because|result of|caused|lead to|led to/.test(s)) return 'cause-effect';
  return 'detail';
}

const READING_SKILL: Record<ReadingSkillTag, { points: number; label: string }> = {
  detail: { points: 0, label: '本文の記述を探す' },
  'vocabulary-in-context': { points: 0.5, label: '文脈から語の意味を判断する' },
  reference: { points: 1, label: '指示語の指す内容を特定する' },
  title: { points: 1, label: '全体から題名を判断する' },
  'main-idea': { points: 1, label: '全体の要点をつかむ' },
  'cause-effect': { points: 1, label: '原因と結果の関係をたどる' },
  structure: { points: 1.5, label: '文・段落の構造を分析する' },
  inference: { points: 2, label: '書かれていないことを推論する' },
};

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'and', 'or', 'is', 'are', 'was', 'were', 'it', 'they', 'with', 'for', 'by']);

/** Share of a choice's content words that appear in the passage. */
function overlap(choice: string, passageWords: Set<string>): number {
  const ws = words(choice).filter((w) => !STOP.has(w));
  if (ws.length === 0) return 1;
  return ws.filter((w) => passageWords.has(w)).length / ws.length;
}

export function readingLoad(q: UnderstandingQuestion, material?: ReadingMaterial): QuestionLoad {
  const skill = readingSkill(q);
  const reasons = [`解答過程: ${READING_SKILL[skill].label}`];
  let load = READING_SKILL[skill].points;
  const passage = material ? material.content.join(' ') : '';
  const passageWords = wordCount(passage);
  if (passageWords >= 300) {
    load += 1;
    reasons.push(`本文が長い（${passageWords}語）`);
  } else if (passageWords >= 170) {
    load += 0.5;
    reasons.push(`本文がやや長い（${passageWords}語）`);
  }
  if (/\bnot\b|\bexcept\b/i.test(q.question)) {
    load += 0.5;
    reasons.push('否定形の設問');
  }
  if (passage) {
    const vocab = new Set(words(passage));
    if (overlap(q.choices[q.correctIndex], vocab) < 0.6) {
      load += 0.5;
      reasons.push('正解が本文の言い換え');
    }
    const traps = q.choices.filter((c, i) => i !== q.correctIndex && overlap(c, vocab) >= 0.8).length;
    if (traps >= 2) {
      load += 0.5;
      reasons.push('誤答にも本文の語が使われている');
    }
  }
  const avgChoice = q.choices.reduce((n, c) => n + wordCount(c), 0) / q.choices.length;
  if (avgChoice >= 7) {
    load += 0.5;
    reasons.push('選択肢が長い');
  }
  return { tag: skill, format: 'choice4', ability: skill === 'structure' ? 'structure' : 'reading', load, reasons };
}

/** "Which is the subject (S)?" generated from a passage's analysed key sentence. */
export function subjectQuestionLoad(p: GrammarPoint): QuestionLoad {
  const n = wordCount(p.sentence);
  const subjectWords = wordCount(p.subject);
  const reasons = [`文の長さ ${n}語`, `主語の長さ ${subjectWords}語`];
  let load = 1;
  if (n >= 18) load += 1;
  else if (n >= 11) load += 0.5;
  if (subjectWords >= 4) {
    load += 1;
    reasons.push('主語が長い（修飾語を含む）');
  }
  return { tag: '構文理解', format: 'subject-identification', ability: 'structure', load, reasons };
}

// ---------------------------------------------------------------- writing (英文組み立て)

const STEP_POINTS: Record<SentenceBuildDrill['steps'][number]['kind'], { points: number; label: string }> = {
  base: { points: 0, label: '基本文を作る' },
  expand: { points: 0.5, label: '情報を足す' },
  transform: { points: 1, label: '構文を変える' },
  apply: { points: 1.5, label: '別の文脈で使う' },
};

export function drillStepLoad(drill: SentenceBuildDrill, stepIndex: number): QuestionLoad {
  const step = drill.steps[stepIndex];
  const knowledge = GRAMMAR_KNOWLEDGE[canonicalTag(drill.grammarTag)] ?? 1;
  const n = wordCount(step.answers[0]);
  const reasons = [`解答過程: ${STEP_POINTS[step.kind].label}`, `必要な知識: ${KNOWLEDGE_LABELS[knowledge]}（${drill.grammarTag}）`];
  let load = STEP_POINTS[step.kind].points + knowledge * 0.5;
  if (n >= 12) {
    load += 0.5;
    reasons.push(`作る文が長い（${n}語）`);
  }
  return { tag: canonicalTag(drill.grammarTag), format: 'compose', ability: 'writing', load, reasons };
}

/** Load + label for each question of a pool (one Level, one kind). */
export function withDifficulty<T>(pool: T[], loadOf: (t: T) => QuestionLoad): Map<T, QuestionMeta> {
  const loads = new Map(pool.map((t) => [t, loadOf(t)]));
  const labels = classifyByLoad(pool, (t) => loads.get(t)!.load);
  return new Map(pool.map((t) => [t, { ...loads.get(t)!, difficulty: labels.get(t)! }]));
}
