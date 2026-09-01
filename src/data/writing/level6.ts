import type { WritingExercise } from '../../types';

export const level6Writing: WritingExercise[] = [
  {
    id: 'w-l6-001',
    level: 6,
    type: 'translate',
    instructionJa: '次の日本語を英語にしましょう。',
    promptJa: '当初の仮説に反して、有意な差は観察されなかった。',
    sampleAnswers: ['Contrary to our initial hypothesis, no significant difference was observed.'],
    keyPoints: ['Contrary to 〜', 'no significant difference was observed'],
  },
  {
    id: 'w-l6-002',
    level: 6,
    type: 'free',
    instructionJa: '自分の研究を3文の英語で要約してみましょう：①何を研究しているか ②どのように研究しているか ③なぜそれが重要か。',
    promptJa: 'あなたの研究テーマについて、Whatを研究しているか(現在形)、Howで研究しているか(過去形/受動態)、Whyそれが重要か、を1文ずつ書いてください。',
    sampleAnswers: [
      'We study the effect of vessel geometry on blood flow. Wall shear stress was measured using computational fluid dynamics. Understanding this relationship may help improve the design of medical devices such as stents.',
    ],
    keyExpressions: ['We study 〜', 'was measured using 〜', 'may help improve 〜'],
    grammarPoints: ['What: 現在形', 'How: 過去形・受動態', 'Why: may/could + 動詞の原形で可能性を示す'],
  },
  {
    id: 'w-l6-003',
    level: 6,
    type: 'free',
    instructionJa: '自分の研究のAbstractの結論部分を1〜2文の英語で書いてみましょう。',
    promptJa: '"These findings suggest that ..." または "In conclusion, ..." を使って、あなたの研究が示すことをまとめてください。',
    sampleAnswers: [
      'These findings suggest that strut geometry meaningfully affects local blood flow. Further studies are needed to confirm these results in vivo.',
    ],
    keyExpressions: ['these findings suggest that 〜', 'in conclusion', 'further studies are needed to 〜'],
    grammarPoints: ['結論は現在形または現在完了形で一般化して述べる'],
  },
];
