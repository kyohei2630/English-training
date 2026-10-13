import type { AnswerLogEntry, AssessmentResult, AssessmentSection, ReviewItem, SectionComposition } from '../types';
import { addDaysISO } from '../utils/date';
import { objectiveCounts, selfGradedFromLog, type ObjectiveCounts, type ObjectiveContext } from './objectiveCounts';

/** Core abilities toward reading and writing research papers. TOEIC is tracked separately. */
export type AbilityArea = 'grammar' | 'vocabulary' | 'reading' | 'structure' | 'writing' | 'research';

export const ABILITY_AREA_LABELS: Record<AbilityArea, string> = {
  grammar: '文法',
  vocabulary: '語彙',
  reading: '読解',
  structure: '構文理解',
  writing: '英作文',
  research: '研究英語',
};

export interface Rate {
  correct: number;
  total: number;
}

/** Fewer answers than this are shown as 未確認 instead of a percentage. */
export const MIN_SAMPLES = 3;

export function isMeasured(rate: Rate | undefined): rate is Rate {
  return rate !== undefined && rate.total >= MIN_SAMPLES;
}

export function formatRate(rate: Rate | undefined): string {
  return isMeasured(rate) ? `${Math.round((rate.correct / rate.total) * 100)}%` : '未確認';
}

export interface AbilityRow {
  area: AbilityArea;
  /** answers to questions solved before (2nd answer onwards, within a week of the previous one) */
  practiced: Rate;
  /** first answers to questions never seen before, including 4-weekly assessments */
  unseen: Rate;
  /** answers 7+ days after the question was last seen */
  delayed: Rate;
  /** writing only: answers checked by the app vs. judged by the learner */
  autoGraded?: Rate;
  selfGraded?: Rate;
  /** unseen accuracy in the last 28 days vs. the 28 days before (from the answer log) */
  unseenRecent?: Rate;
  unseenPrevious?: Rate;
}

function inArea(area: AbilityArea, x: Pick<ReviewItem, 'category' | 'tag' | 'level' | 'skill' | 'refId'>): boolean {
  if (x.category === 'toeic') return false;
  switch (area) {
    case 'structure':
      return x.skill === 'structure' || (x.category === 'reading' && x.tag === 'structure');
    case 'research':
      return x.skill === 'research' || x.refId.startsWith('rs-') || x.level === 5;
    default:
      return x.category === area;
  }
}

function add(rate: Rate, correct: number, total: number) {
  rate.correct += correct;
  rate.total += total;
}

/** Splits one item's objective (app-checked) counters into first / later answers. Records made
 * before the first answer was stored only know their totals: if answered once, that answer was
 * the first; otherwise the later answers are estimated at the item's overall accuracy. A first
 * answer the learner judged is not an objective unseen result, so it is left out. */
function splitItem(item: ReviewItem, oc: ObjectiveCounts): { first?: boolean; laterCorrect: number; laterTotal: number } {
  const attempts = oc.correct + oc.incorrect;
  if (attempts === 0) return { laterCorrect: 0, laterTotal: 0 };
  if (oc.firstCorrect !== undefined) {
    return { first: oc.firstCorrect, laterCorrect: oc.correct - (oc.firstCorrect ? 1 : 0), laterTotal: attempts - 1 };
  }
  // First answer known but self-graded: everything objective came later.
  if (item.firstAnswerCorrect !== undefined) return { laterCorrect: oc.correct, laterTotal: attempts };
  if (attempts === 1 && item.correctCount + item.incorrectCount === 1) return { first: oc.correct === 1, laterCorrect: 0, laterTotal: 0 };
  return { laterCorrect: Math.round(((attempts - 1) * oc.correct) / attempts), laterTotal: attempts - 1 };
}

/**
 * Practiced / unseen / delayed rates are objective: they count only answers the app checked.
 * Self-graded answers (free writing, self-checked typed answers, notes) appear only in the
 * writing row's separate 自己評価 figure.
 */
export function computeAbilityProfile(
  items: ReviewItem[],
  log: AnswerLogEntry[],
  today: string,
  options: Pick<ObjectiveContext, 'alwaysSelfGraded'> = {}
): AbilityRow[] {
  const ctx: ObjectiveContext = { selfFromLog: selfGradedFromLog(log), alwaysSelfGraded: options.alwaysSelfGraded };
  const recentFrom = addDaysISO(today, -27);
  const previousFrom = addDaysISO(today, -55);
  const areas = Object.keys(ABILITY_AREA_LABELS) as AbilityArea[];

  return areas.map((area) => {
    const row: AbilityRow = {
      area,
      practiced: { correct: 0, total: 0 },
      unseen: { correct: 0, total: 0 },
      delayed: { correct: 0, total: 0 },
      unseenRecent: { correct: 0, total: 0 },
      unseenPrevious: { correct: 0, total: 0 },
    };
    for (const item of items) {
      if (!inArea(area, item)) continue;
      const oc = objectiveCounts(item, ctx);
      const { first, laterCorrect, laterTotal } = splitItem(item, oc);
      if (first !== undefined) add(row.unseen, first ? 1 : 0, 1);
      // Delayed answers are reported on their own, so they're taken out of "practiced".
      const delayedTotal = oc.delayedAttempts;
      const delayedCorrect = oc.delayedCorrect;
      add(row.delayed, delayedCorrect, delayedTotal);
      add(row.practiced, Math.max(0, laterCorrect - delayedCorrect), Math.max(0, laterTotal - delayedTotal));
    }
    if (area === 'writing') {
      row.autoGraded = { correct: 0, total: 0 };
      row.selfGraded = { correct: 0, total: 0 };
    }
    for (const e of log) {
      if (!inArea(area, e)) continue;
      if ((e.kind === 'first' || e.kind === 'assessment') && e.grading === 'auto') {
        if (e.date >= recentFrom) add(row.unseenRecent!, e.wasCorrect ? 1 : 0, 1);
        else if (e.date >= previousFrom) add(row.unseenPrevious!, e.wasCorrect ? 1 : 0, 1);
      }
      if (area === 'writing') add(e.grading === 'self' ? row.selfGraded! : row.autoGraded!, e.wasCorrect ? 1 : 0, 1);
    }
    return row;
  });
}

/** -100..100 percentage-point change, or undefined when either side is unmeasured. */
export function changeInPoints(recent: Rate | undefined, previous: Rate | undefined): number | undefined {
  if (!isMeasured(recent) || !isMeasured(previous)) return undefined;
  return Math.round((recent.correct / recent.total - previous.correct / previous.total) * 100);
}

export const ASSESSMENT_SECTION_LABELS: Record<AssessmentSection, string> = {
  grammar: '文法',
  vocabulary: '語彙',
  reading: '読解',
  structure: '構文理解',
  writingAuto: '英作文（自動採点）',
  writingSelf: '英作文（自己評価・参考）',
};

export interface SectionComparison {
  /** percentage-point change from the previous assessment */
  change: number;
  /** same conditions (Level, estimator, number of questions, difficulty mix, unseen share) */
  comparable: boolean;
  /** why the comparison is only indicative */
  reasons: string[];
}

export interface AssessmentComparison {
  sections: Partial<Record<AssessmentSection, SectionComparison>>;
  /** reasons that apply to every section */
  overall: string[];
}

const bandsText = (c: SectionComposition) => `基礎${c.basic}・標準${c.standard}・応用${c.advanced}`;

/**
 * Compares the two most recent assessments. A change is called comparable only when both were
 * taken under the same conditions: same Level and difficulty estimator, same number of questions
 * and (at most one question apart) the same estimated-difficulty mix and unseen share in that
 * section. Otherwise it is still returned, marked as an indicative comparison with the reasons.
 * Self-graded free writing is never compared (it is a reference value, not a score).
 */
export function compareAssessments(results: AssessmentResult[]): AssessmentComparison | null {
  if (results.length < 2) return null;
  const [prev, last] = results.slice(-2);
  const overall: string[] = [];
  if (prev.level !== last.level) overall.push(`Levelが異なります（前回 L${prev.level}・今回 L${last.level}）`);
  if (!prev.composition || !last.composition) overall.push('難易度構成の記録がない結果との比較です');
  else if (prev.difficultyModel !== last.difficultyModel || prev.blueprintVersion !== last.blueprintVersion) {
    overall.push('難易度の推定方式または出題構成の基準が異なります');
  }

  const sections: AssessmentComparison['sections'] = {};
  for (const key of Object.keys(ASSESSMENT_SECTION_LABELS) as AssessmentSection[]) {
    if (key === 'writingSelf') continue;
    const a = last.sections[key];
    const b = prev.sections[key];
    if (!a || !b || a.total === 0 || b.total === 0) continue;
    const reasons: string[] = [];
    const ca = last.composition?.[key];
    const cb = prev.composition?.[key];
    if (ca && cb) {
      if (ca.total !== cb.total) reasons.push(`問題数が異なります（前回${cb.total}問・今回${ca.total}問）`);
      else {
        const moved = Math.abs(ca.basic - cb.basic) + Math.abs(ca.standard - cb.standard) + Math.abs(ca.advanced - cb.advanced);
        if (moved > 2) reasons.push(`推定難易度の構成が異なります（前回 ${bandsText(cb)}・今回 ${bandsText(ca)}）`);
        if (Math.abs(ca.unseen - cb.unseen) > 1) reasons.push(`初見問題の数が異なります（前回${cb.unseen}問・今回${ca.unseen}問）`);
      }
    }
    sections[key] = {
      change: Math.round((a.correct / a.total - b.correct / b.total) * 100),
      comparable: overall.length === 0 && reasons.length === 0,
      reasons,
    };
  }
  return { sections, overall };
}
