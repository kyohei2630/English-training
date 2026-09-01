import type { WritingExercise } from '../../types';

export const level5Writing: WritingExercise[] = [
  {
    id: 'w-l5-001',
    level: 5,
    type: 'translate',
    instructionJa: '次の日本語を英語にしましょう（研究英語の定型表現を使ってください）。',
    promptJa: 'これらの結果は、ストラットの太さが局所的な流れに影響を与えることを示唆している。',
    sampleAnswers: ['These findings suggest that strut thickness affects local flow.'],
    keyPoints: ['findings suggest that 〜', 'affect'],
  },
  {
    id: 'w-l5-002',
    level: 5,
    type: 'translate',
    instructionJa: '次の日本語を英語にしましょう。',
    promptJa: '本研究は、安静時と運動時のセンサーの精度を評価することを目的とする。',
    sampleAnswers: ['This study aims to evaluate the accuracy of the sensor during rest and exercise.'],
    keyPoints: ['aim to 〜', 'evaluate the accuracy of 〜'],
  },
  {
    id: 'w-l5-003',
    level: 5,
    type: 'free',
    instructionJa: '自分の研究テーマについて、Introductionの書き出しを1〜2文の英語で書いてみましょう（模範解答と見比べて自己評価してください）。',
    promptJa: '例：あなたの研究分野で重要な問題を1つ挙げ、それがなぜ重要かを英語で説明してください。',
    sampleAnswers: [
      'Cardiovascular disease remains one of the leading causes of death, and early detection is critical for improving patient outcomes.',
      'Accurate monitoring of blood flow is essential for the safe design of medical devices such as stents and catheters.',
    ],
    keyExpressions: ['remains one of the leading causes of', 'is critical/essential for', 'in recent years'],
    grammarPoints: ['現在形で一般的事実・背景を述べる', 'that 節や for 〜ing で理由・目的を補足する'],
  },
  {
    id: 'w-l5-004',
    level: 5,
    type: 'free',
    instructionJa: '自分の研究のMethodsを1文だけ、受動態を使って英語で書いてみましょう。',
    promptJa: '例：あなたが行った実験や解析の手順を1つ、受動態（was/were + 過去分詞）で説明してください。',
    sampleAnswers: [
      'Blood flow was simulated using computational fluid dynamics.',
      'Ten samples were tested under three different conditions.',
    ],
    keyExpressions: ['was/were + 過去分詞', 'using 〜', 'under 〜 conditions'],
    grammarPoints: ['Methods は受動態・過去形が基本'],
  },
];
