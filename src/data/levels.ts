import type { LevelInfo } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: 'Level 1: 中学英語基礎',
    descriptionJa: '英文の基本構造を理解する（be動詞・一般動詞・否定文・疑問文・三単現・過去形・未来・現在進行形・命令文・助動詞・前置詞・接続詞・基本文型・There is/are・疑問詞）',
    topics: ['be動詞', '一般動詞', '否定文', '疑問文', '三単現', '過去形', '未来', '現在進行形', '命令文', '助動詞', '前置詞', '接続詞', '基本文型', 'There is/are', '疑問詞'],
    totalDays: 30,
  },
  {
    level: 2,
    name: 'Level 2: 高校基礎英語',
    descriptionJa: '高校基礎文法（現在完了・不定詞・動名詞・分詞・比較・受動態・関係代名詞・関係副詞・条件文・仮定法の基礎・時制の使い分け）',
    topics: ['現在完了', '不定詞', '動名詞', '分詞', '比較', '受動態', '関係代名詞', '関係副詞', '条件文', '仮定法の基礎', '時制の使い分け'],
    totalDays: 30,
  },
  {
    level: 3,
    name: 'Level 3: 一般英語・長文読解',
    descriptionJa: 'TOEIC対策・論文読解への橋渡し（複雑な英文構造・分詞構文・仮定法・倒置・強調・省略・接続表現・因果関係・段落構造）',
    topics: ['複雑な英文構造', '分詞構文', '仮定法', '倒置', '強調', '省略', '接続表現', '因果関係', '段落構造', '長い主語・目的語'],
    totalDays: 30,
  },
  {
    level: 4,
    name: 'Level 4: 医療・科学英語',
    descriptionJa: '医療・科学英語（解剖・生理・循環器・呼吸器・医療機器・血行動態を英文の中で使えるようにする）',
    topics: ['Anatomy', 'Physiology', 'Cardiovascular system', 'Respiratory system', 'Medical devices', 'Blood', 'Hemodynamics'],
    totalDays: 20,
  },
  {
    level: 5,
    name: 'Level 5: Research English（論文英語）',
    descriptionJa: '英語論文を読む・書くための英語力（Abstract・Introduction・Methods・Results・Discussion・limitation・統計表現・学術ライティング）',
    topics: ['Abstract', 'Introduction', 'Methods', 'Results', 'Discussion', 'Limitation', 'Statistical expressions', 'Academic writing'],
    totalDays: 30,
  },
  {
    level: 6,
    name: 'Level 6: TOEIC',
    descriptionJa: 'TOEIC形式の総合対策（Part1〜7、ビジネス語彙・文法・言い換え・文脈把握）。英語の基礎力を測り、伸ばすための到達点として位置づけ、論文英語と並行して学習できます。',
    topics: ['TOEIC Part1-2', 'TOEIC Part3-4', 'TOEIC Part5-6', 'TOEIC Part7', 'Business vocabulary', 'Business grammar'],
    totalDays: 20,
  },
];

export function getLevelInfo(level: 1 | 2 | 3 | 4 | 5 | 6): LevelInfo {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0];
}
