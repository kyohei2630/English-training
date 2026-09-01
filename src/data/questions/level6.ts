import type { UnderstandingQuestion } from '../../types';

export const level6Questions: UnderstandingQuestion[] = [
  {
    id: 'q-l6-001-1',
    materialId: 'l6-001',
    question: 'What four questions does a strong abstract answer?',
    choices: [
      'Who, what, when, where',
      'Problem, method, findings, importance',
      'Title, author, date, journal',
      'Cost, time, place, people',
    ],
    correctIndex: 1,
    explanation: '"What problem did you study? How did you study it? What did you find? Why does it matter?" とあります。',
  },
  {
    id: 'q-l6-001-2',
    materialId: 'l6-001',
    question: 'What tense is typically used to describe methods in an abstract?',
    choices: ['Present tense', 'Past tense', 'Future tense', 'Present perfect'],
    correctIndex: 1,
    explanation: '"The next sentences describe the methods, typically in past tense" とあります。',
  },
  {
    id: 'q-l6-002-1',
    materialId: 'l6-002',
    question: 'What pattern is suggested for describing an unexpected result?',
    choices: [
      'Starting with "unexpectedly" or "notably"',
      'Using only the word "was"',
      'Avoiding numbers',
      'Writing in the first person only',
    ],
    correctIndex: 0,
    explanation: '"phrases like \'unexpectedly\' or \'notably\' can be placed at the beginning of a sentence" とあります。',
  },
  {
    id: 'q-l6-002-2',
    materialId: 'l6-002',
    question: 'What is suggested as the fastest way to make these patterns feel natural?',
    choices: [
      'Memorizing grammar rules',
      'Practicing with your own data',
      'Reading more papers only',
      'Avoiding writing practice',
    ],
    correctIndex: 1,
    explanation: '"Practicing these patterns with your own data ... is the fastest way to make them feel natural." とあります。',
  },
  {
    id: 'q-l6-003-1',
    materialId: 'l6-003',
    question: 'What do most experienced scientific writers value more?',
    choices: [
      'Long, complicated sentences',
      'Short, clear sentences',
      'Sentences with many adjectives',
      'Sentences without a subject',
    ],
    correctIndex: 1,
    explanation: '"most experienced scientific writers value short, clear sentences far more than long, complicated ones" とあります。',
  },
  {
    id: 'q-l6-003-2',
    materialId: 'l6-003',
    question: 'What is suggested as a simple way to catch unclear sentences?',
    choices: [
      'Reading your sentences aloud',
      'Writing in a foreign language first',
      'Asking a machine translator',
      'Skipping revision entirely',
    ],
    correctIndex: 0,
    explanation: '"Reading your own sentences aloud is a simple but effective way to catch sentences that have become too long or unclear." とあります。',
  },
];
