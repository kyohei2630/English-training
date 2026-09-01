import type { LevelInfo } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: 'Level 1: 基礎英語',
    descriptionJa: '中学英語の基礎（be動詞・一般動詞・現在形・過去形・否定文・疑問文・基本前置詞・助動詞）',
    topics: ['be動詞', '一般動詞', '現在形', '過去形', '否定文', '疑問文', '基本前置詞', '助動詞'],
    totalDays: 30,
  },
  {
    level: 2,
    name: 'Level 2: 高校基礎',
    descriptionJa: '高校基礎文法（現在進行形・現在完了・不定詞・動名詞・比較・接続詞・受動態）',
    topics: ['現在進行形', '現在完了', '不定詞', '動名詞', '比較', '接続詞', '受動態'],
    totalDays: 30,
  },
  {
    level: 3,
    name: 'Level 3: 一般英文',
    descriptionJa: '一般英文の読解（関係代名詞・分詞・仮定法・複雑な文構造・長文読解）',
    topics: ['関係代名詞', '分詞', '仮定法', '複雑な文構造', '長文読解'],
    totalDays: 30,
  },
  {
    level: 4,
    name: 'Level 4: Medical / Science English',
    descriptionJa: '医療・科学英語（解剖・生理・循環器・呼吸器・医療機器・血液・血行動態）',
    topics: ['Anatomy', 'Physiology', 'Cardiovascular system', 'Respiratory system', 'Medical devices', 'Blood', 'Hemodynamics'],
    totalDays: 20,
  },
  {
    level: 5,
    name: 'Level 5: Research English',
    descriptionJa: '研究英語（論文構造: Abstract・Introduction・Methods・Results・Discussion）',
    topics: ['Abstract', 'Introduction', 'Methods', 'Results', 'Discussion'],
    totalDays: 20,
  },
  {
    level: 6,
    name: 'Level 6: Academic Writing',
    descriptionJa: '学術ライティング（論文各セクションの英語表現と自分の研究を書く練習）',
    topics: ['Abstract', 'Introduction', 'Methods', 'Results', 'Discussion', 'Scientific expressions'],
    totalDays: 10,
  },
];

export function getLevelInfo(level: 1 | 2 | 3 | 4 | 5 | 6): LevelInfo {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0];
}
