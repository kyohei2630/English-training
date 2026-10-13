/**
 * Grammar questions that duplicate another question (same sentence, same answer, same point —
 * audit 2026-10). The duplicate stays in the data, so existing answers, review items and their
 * history keep resolving; it is only no longer chosen for new practice, daily training or
 * assessments, and counts as the same knowledge as the kept question.
 * duplicate id -> kept id
 */
export const DUPLICATE_QUESTION_IDS: Record<string, string> = {
  // identical apart from the order of the choices
  grammar_l2_155: 'grammar_l2_043',
  // identical
  grammar_l2_197: 'grammar_l2_126',
  // same question and answer, explanation worded differently
  grammar_l2_158: 'grammar_l2_120',
  // same sentence; the duplicate's distractors ("have seen I") are not English, and it had no
  // reasons for wrong choices
  grammar_l3_111: 'grammar_l3_004',
  // same sentence; in the duplicate the distractor "was" is also correct
  // ("One limitation of this study was the small sample size.")
  grammar_l5_083: 'grammar_l5_004',
};

export function isRetiredQuestion(id: string): boolean {
  return Object.hasOwn(DUPLICATE_QUESTION_IDS, id);
}

/** The question that stands for this piece of knowledge. */
export function canonicalQuestionId(id: string): string {
  return DUPLICATE_QUESTION_IDS[id] ?? id;
}
