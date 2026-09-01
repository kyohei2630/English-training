function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface EvaluationResult {
  matchedKeywords: string[];
  missedKeywords: string[];
  score: number; // 0-100, based on keyword coverage
}

/** Simple offline keyword-coverage check — not an exact-match grader.
 * Used to give the learner quick, encouraging feedback before they compare with the sample answers. */
export function evaluateAgainstKeywords(userAnswer: string, keywords: string[]): EvaluationResult {
  const normalizedAnswer = normalize(userAnswer);
  const matched: string[] = [];
  const missed: string[] = [];

  for (const keyword of keywords) {
    const normalizedKeyword = normalize(keyword);
    if (normalizedKeyword && normalizedAnswer.includes(normalizedKeyword)) {
      matched.push(keyword);
    } else {
      missed.push(keyword);
    }
  }

  const score = keywords.length === 0 ? 100 : Math.round((matched.length / keywords.length) * 100);
  return { matchedKeywords: matched, missedKeywords: missed, score };
}

export function isReorderCorrect(userOrder: string[], correctOrder: string[]): boolean {
  if (userOrder.length !== correctOrder.length) return false;
  return userOrder.every((token, i) => token === correctOrder[i]);
}

export function isFillBlankCorrect(userAnswer: string, acceptedAnswers: string[]): boolean {
  const normalizedUser = normalize(userAnswer);
  return acceptedAnswers.some((a) => normalize(a) === normalizedUser);
}
