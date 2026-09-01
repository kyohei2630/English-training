import type { WritingExercise } from '../../types';

export const level3Writing: WritingExercise[] = [
  {
    id: 'w-l3-001',
    level: 3,
    type: 'fillblank',
    instructionJa: '空欄に入る最も適切な関係代名詞を答えましょう。',
    sentence: 'The project, ___ took nearly ten years to complete, changed the city.',
    answers: ['which'],
    translationJa: 'その計画は、完成までに10年近くかかったが、都市を変えた。',
    hint: '非制限用法・先行詞は物',
  },
  {
    id: 'w-l3-002',
    level: 3,
    type: 'fillblank',
    instructionJa: '空欄に入る最も適切な語を答えましょう（仮定法過去）。',
    sentence: 'If I ___ more time, I would travel more slowly.',
    answers: ['had'],
    translationJa: 'もし私にもっと時間があれば、もっとゆっくり旅行するのに。',
    hint: '仮定法過去は if節で動詞の過去形を使う',
  },
  {
    id: 'w-l3-003',
    level: 3,
    type: 'translate',
    instructionJa: '次の日本語を英語にしましょう。',
    promptJa: '睡眠は記憶において重要な役割を果たします。',
    sampleAnswers: ['Sleep plays an important role in memory.'],
    keyPoints: ['play a role in 〜', 'important'],
  },
  {
    id: 'w-l3-004',
    level: 3,
    type: 'translate',
    instructionJa: '次の日本語を英語にしましょう。',
    promptJa: 'もし失敗をすべて無駄なものとして扱えば、私たちは大切な情報を失うだろう。',
    sampleAnswers: [
      'If we treated every failure as useless, we would lose important information.',
      'If we treat every mistake as useless, we will lose important information.',
    ],
    keyPoints: ['仮定法 If + 過去形, would + 動詞の原形', 'treat A as B'],
  },
  {
    id: 'w-l3-005',
    level: 3,
    type: 'translate',
    instructionJa: '次の日本語を英語にしましょう。',
    promptJa: '観光客の多くが訪れない地域を歩く旅行者もいます。',
    sampleAnswers: ['Some travelers walk through areas that ordinary tourists never visit.'],
    keyPoints: ['関係代名詞 that', 'ordinary tourists'],
  },
];
