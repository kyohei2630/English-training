import type { Level, ResearchSection, ResearchUnit, ReviewItem } from '../types';
import type { SentenceTask } from './sentenceBuildingService';

/** The order a paper is read and written in; also the order the track is learned in. */
export const RESEARCH_SECTION_LABELS: Record<ResearchSection, string> = {
  purpose: '研究目的',
  methods: '方法',
  results: '結果',
  discussion: '考察',
  abstract: 'Abstract',
};

export const RESEARCH_SECTIONS = Object.keys(RESEARCH_SECTION_LABELS) as ResearchSection[];

export function researchQuestionRefId(unit: ResearchUnit): string {
  return `${unit.id}-q`;
}

export function researchWritingTask(unit: ResearchUnit): SentenceTask {
  return {
    refId: `${unit.id}-w`,
    promptJa: unit.writing.promptJa,
    answers: unit.writing.answers,
    keyPhrases: unit.writing.keyPhrases,
    tag: `研究英語:${RESEARCH_SECTION_LABELS[unit.section]}`,
    level: unit.level,
    research: true,
  };
}

/** done = both the reading question and the writing task answered correctly last time */
export function unitStatus(unit: ResearchUnit, items: ReviewItem[]): 'new' | 'started' | 'done' {
  const q = items.find((i) => i.refId === researchQuestionRefId(unit));
  const w = items.find((i) => i.refId === `${unit.id}-w`);
  if (!q && !w) return 'new';
  const ok = (i?: ReviewItem) => !!i && (i.consecutiveCorrect ?? 0) > 0;
  return ok(q) && ok(w) ? 'done' : 'started';
}

/** The next unit to study at the learner's level: the lowest-level unit not done yet, following
 * section order. Units above the current level are not recommended yet. */
export function nextResearchUnit(units: ResearchUnit[], level: Level, items: ReviewItem[]): ResearchUnit | null {
  const order = (u: ResearchUnit) => u.level * 10 + RESEARCH_SECTIONS.indexOf(u.section);
  return (
    units
      .filter((u) => u.level <= level && unitStatus(u, items) !== 'done')
      .sort((a, b) => order(a) - order(b))[0] ?? null
  );
}
