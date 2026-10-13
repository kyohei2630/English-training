import type { ResearchUnit } from '../../types';

/**
 * 研究英語ユニット. Short research texts that grow with the curriculum: Level 1-2 use only basic
 * grammar, Level 3 adds connectors and hedging, Level 4 medical methods/results, Level 5 a full
 * structured abstract. Each unit teaches structure, logical relations and reusable academic
 * expressions — not just vocabulary.
 */
export const RESEARCH_UNITS: ResearchUnit[] = [
  // ---------------------------------------------------------------- Level 1
  {
    id: 'rs-l1-01',
    level: 1,
    section: 'purpose',
    titleJa: '研究の問いを立てる',
    passage: ['Many nurses work at night.', 'Night work can change sleep.', 'We wanted to know how night work affects sleep.'],
    translationJa: '多くの看護師は夜に働く。夜勤は睡眠を変えることがある。私たちは、夜勤が睡眠にどう影響するかを知りたかった。',
    structure: {
      sentence: 'We wanted to know how night work affects sleep.',
      translationJa: '私たちは、夜勤が睡眠にどう影響するかを知りたかった。',
      segments: [
        { text: 'We', role: '主語 S' },
        { text: 'wanted', role: '動詞 V' },
        { text: 'to know', role: '目的語 O（不定詞）' },
        { text: 'how night work affects sleep', role: 'know の目的語（間接疑問）' },
      ],
    },
    logic: [
      { marker: 'Many nurses work at night.', relationJa: '背景', explanationJa: 'まず誰に関係する話かを示す。' },
      { marker: 'can', relationJa: '可能性', explanationJa: '「〜することがある」。断定せずに問題を示す。' },
      { marker: 'how ... affects', relationJa: '研究の問い', explanationJa: '何を明らかにしたいのかを示す文。' },
    ],
    expressions: [
      { en: 'A affects B', ja: 'A は B に影響する', noteJa: 'affect は動詞、effect は名詞' },
      { en: 'We wanted to know how ...', ja: '私たちは…を知りたかった', noteJa: '論文では We aimed to examine how ... と書くことが多い' },
    ],
    question: {
      question: 'What did the researchers want to know?',
      choices: ['How night work affects sleep', 'How many nurses work at night', 'Why nurses like night work', 'When nurses go to bed'],
      correctIndex: 0,
      explanation: '最後の文 We wanted to know how night work affects sleep. が研究の問い。',
    },
    writing: {
      promptJa: '私たちは、運動が睡眠にどう影響するかを知りたかった。',
      answers: ['We wanted to know how exercise affects sleep.'],
      keyPhrases: ['wanted to know', 'how exercise affects sleep'],
    },
  },
  {
    id: 'rs-l1-02',
    level: 1,
    section: 'methods',
    titleJa: '何を・どのくらい測ったか',
    passage: [
      'We asked 30 nurses to join the study.',
      'Each nurse wore a small device on the wrist.',
      'The device recorded sleep time every night for two weeks.',
    ],
    translationJa: '私たちは30人の看護師に研究への参加を依頼した。各看護師は手首に小さな装置を着けた。装置は2週間、毎晩睡眠時間を記録した。',
    structure: {
      sentence: 'The device recorded sleep time every night for two weeks.',
      translationJa: '装置は2週間、毎晩睡眠時間を記録した。',
      segments: [
        { text: 'The device', role: '主語 S' },
        { text: 'recorded', role: '動詞 V' },
        { text: 'sleep time', role: '目的語 O' },
        { text: 'every night', role: '修飾（頻度）' },
        { text: 'for two weeks', role: '修飾（期間）' },
      ],
    },
    logic: [
      { marker: 'Each', relationJa: '全員に同じ手順', explanationJa: '一人ひとりが同じ条件で測定されたことを示す。' },
      { marker: 'every night for two weeks', relationJa: '測定の条件', explanationJa: '頻度と期間。方法の再現に必要な情報。' },
    ],
    expressions: [
      { en: 'ask A to do', ja: 'A に〜するよう頼む' },
      { en: 'record', ja: '記録する' },
      { en: 'for + 期間', ja: '〜の間', noteJa: '方法では期間を必ず書く' },
    ],
    question: {
      question: 'How long did the device record sleep time?',
      choices: ['For two weeks', 'For two days', 'For 30 nights', 'Only once'],
      correctIndex: 0,
      explanation: 'every night for two weeks（2週間、毎晩）。',
    },
    writing: {
      promptJa: '装置は1か月間、毎日心拍数を記録した。',
      answers: [
        'The device recorded heart rate every day for one month.',
        'The device recorded heart rate every day for a month.',
        'The device recorded the heart rate every day for one month.',
        'The device recorded the heart rate every day for a month.',
      ],
      keyPhrases: ['recorded', 'every day', 'for'],
    },
  },
  {
    id: 'rs-l1-03',
    level: 1,
    section: 'results',
    titleJa: '結果を比べて書く',
    passage: ['The nurses slept about six hours after day work.', 'After night work, they slept only about four hours.', 'Night work shortened their sleep.'],
    translationJa: '看護師は日勤の後は約6時間眠った。夜勤の後は約4時間しか眠らなかった。夜勤は睡眠を短くした。',
    structure: {
      sentence: 'After night work, they slept only about four hours.',
      translationJa: '夜勤の後、彼らは約4時間しか眠らなかった。',
      segments: [
        { text: 'After night work,', role: '修飾（時・条件）' },
        { text: 'they', role: '主語 S' },
        { text: 'slept', role: '動詞 V' },
        { text: 'only about four hours', role: '修飾（量）' },
      ],
    },
    logic: [
      { marker: 'after day work / After night work', relationJa: '対比', explanationJa: '2つの条件を並べて比べている。' },
      { marker: 'only', relationJa: '強調', explanationJa: '少なさを強調する。' },
      { marker: 'Night work shortened their sleep.', relationJa: 'まとめ', explanationJa: '数字の結果を一文で言い直している。' },
    ],
    expressions: [
      { en: 'about + 数', ja: '約〜' },
      { en: 'only', ja: '〜しか（ない）' },
      { en: 'shorten', ja: '短くする' },
    ],
    question: {
      question: 'What was the main finding?',
      choices: ['Night work shortened sleep.', 'Day work shortened sleep.', 'Nurses slept longer after night work.', 'Sleep did not change.'],
      correctIndex: 0,
      explanation: '最後の文が結果のまとめ。夜勤後は約4時間、日勤後は約6時間。',
    },
    writing: {
      promptJa: '日勤の後、看護師は約7時間眠った。',
      answers: [
        'After day work, the nurses slept about seven hours.',
        'The nurses slept about seven hours after day work.',
        'After day work, nurses slept about seven hours.',
        'After day work, the nurses slept about 7 hours.',
      ],
      keyPhrases: ['after day work', 'slept', 'about'],
    },
  },
  // ---------------------------------------------------------------- Level 2
  {
    id: 'rs-l2-01',
    level: 2,
    section: 'purpose',
    titleJa: '背景 → 未解明の点 → 目的',
    passage: [
      'Regular exercise is known to improve health.',
      "However, few studies have examined its effect on office workers' sleep.",
      'The purpose of this study was to examine this effect.',
    ],
    translationJa: '定期的な運動は健康を改善することが知られている。しかし、会社員の睡眠への影響を調べた研究はほとんどない。本研究の目的は、この影響を調べることであった。',
    structure: {
      sentence: 'The purpose of this study was to examine this effect.',
      translationJa: '本研究の目的は、この影響を調べることであった。',
      segments: [
        { text: 'The purpose of this study', role: '主語 S' },
        { text: 'was', role: '動詞 V' },
        { text: 'to examine this effect', role: '補語 C（不定詞）' },
      ],
    },
    logic: [
      { marker: 'However', relationJa: '逆接', explanationJa: 'わかっていること → まだわかっていないこと、へ転換する。' },
      { marker: 'few studies have examined', relationJa: '研究の空白（gap）', explanationJa: 'この研究をする理由になる。' },
      { marker: 'The purpose of this study was to', relationJa: '目的', explanationJa: '空白を埋めるために何をするかを示す。' },
    ],
    expressions: [
      { en: 'is known to ~', ja: '〜することが知られている' },
      { en: 'few studies have examined ~', ja: '〜を調べた研究はほとんどない', noteJa: 'few = ほとんどない（否定的）、a few = 少しはある' },
      { en: 'The purpose of this study was to ~', ja: '本研究の目的は〜することであった' },
    ],
    question: {
      question: 'Why was this study needed?',
      choices: [
        "Few studies had examined the effect of exercise on office workers' sleep.",
        'Exercise is bad for health.',
        'Office workers do not exercise.',
        'Many studies had already answered the question.',
      ],
      correctIndex: 0,
      explanation: 'However 以下が研究の空白。few studies have examined = 調べた研究はほとんどない。',
    },
    writing: {
      promptJa: '本研究の目的は、昼寝の記憶への影響を調べることであった。',
      answers: [
        'The purpose of this study was to examine the effect of napping on memory.',
        'The purpose of this study was to examine the effects of napping on memory.',
        'The aim of this study was to examine the effect of napping on memory.',
        'The purpose of this study was to examine the effect of naps on memory.',
      ],
      keyPhrases: ['The purpose of this study was to', 'effect of', 'on memory'],
    },
  },
  {
    id: 'rs-l2-02',
    level: 2,
    section: 'methods',
    titleJa: '受動態で方法を書く',
    passage: [
      'Sixty office workers were divided into two groups.',
      'One group walked for 30 minutes a day, and the other group did not change their routine.',
      'Sleep quality was measured with a questionnaire before and after eight weeks.',
    ],
    translationJa: '60人の会社員が2つのグループに分けられた。一方のグループは1日30分歩き、もう一方のグループは日課を変えなかった。睡眠の質は、8週間の前後に質問票で測定された。',
    structure: {
      sentence: 'Sleep quality was measured with a questionnaire before and after eight weeks.',
      translationJa: '睡眠の質は、8週間の前後に質問票で測定された。',
      segments: [
        { text: 'Sleep quality', role: '主語 S' },
        { text: 'was measured', role: '動詞 V（受動態）' },
        { text: 'with a questionnaire', role: '修飾（手段）' },
        { text: 'before and after eight weeks', role: '修飾（時点）' },
      ],
    },
    logic: [
      { marker: 'One group ..., and the other group ...', relationJa: '対比', explanationJa: '介入する群としない群（対照群）を作っている。' },
      { marker: 'before and after', relationJa: '比較の時点', explanationJa: '変化を見るために2回測定している。' },
    ],
    expressions: [
      { en: 'be divided into ~', ja: '〜に分けられる' },
      { en: 'the other group', ja: 'もう一方のグループ', noteJa: '2つのうち残りの1つは the other' },
      { en: 'be measured with ~', ja: '〜で測定される' },
    ],
    question: {
      question: 'How was sleep quality measured?',
      choices: ['With a questionnaire', 'With a blood test', 'By walking for 30 minutes', "By a doctor's interview"],
      correctIndex: 0,
      explanation: 'was measured with a questionnaire（質問票で測定された）。',
    },
    writing: {
      promptJa: '参加者は3つのグループに分けられた。',
      answers: ['The participants were divided into three groups.', 'Participants were divided into three groups.', 'The participants were divided into 3 groups.'],
      keyPhrases: ['were divided into', 'three groups'],
    },
  },
  {
    id: 'rs-l2-03',
    level: 2,
    section: 'results',
    titleJa: '比較級で群間の差を書く',
    passage: [
      'After eight weeks, sleep quality improved more in the walking group than in the control group.',
      'The walking group also fell asleep faster.',
      'No serious problems were reported.',
    ],
    translationJa: '8週間後、睡眠の質は対照群より歩行群でより改善した。歩行群はまた、より早く眠りについた。重大な問題は報告されなかった。',
    structure: {
      sentence: 'After eight weeks, sleep quality improved more in the walking group than in the control group.',
      translationJa: '8週間後、睡眠の質は対照群より歩行群でより改善した。',
      segments: [
        { text: 'After eight weeks,', role: '修飾（時）' },
        { text: 'sleep quality', role: '主語 S' },
        { text: 'improved', role: '動詞 V' },
        { text: 'more in the walking group than in the control group', role: '修飾（比較）' },
      ],
    },
    logic: [
      { marker: 'more ... than ...', relationJa: '比較', explanationJa: '群間の差を示す。in ... than in ... と前置詞をそろえる。' },
      { marker: 'also', relationJa: '追加', explanationJa: '2つ目の結果を加える。' },
      { marker: 'No serious problems were reported.', relationJa: '安全性', explanationJa: '有害な出来事がなかったことの報告。' },
    ],
    expressions: [
      { en: 'improve more in A than in B', ja: 'B より A でより改善する' },
      { en: 'fall asleep', ja: '眠りにつく' },
      { en: 'be reported', ja: '報告される' },
    ],
    question: {
      question: 'Which statement is true?',
      choices: [
        'Sleep quality improved more in the walking group.',
        'The control group improved more.',
        'Neither group changed.',
        'Serious problems were reported.',
      ],
      correctIndex: 0,
      explanation: 'improved more in the walking group than in the control group。',
    },
    writing: {
      promptJa: '8週間後、体重は対照群より介入群でより減少した。',
      answers: [
        'After eight weeks, body weight decreased more in the intervention group than in the control group.',
        'After eight weeks, weight decreased more in the intervention group than in the control group.',
        'After 8 weeks, body weight decreased more in the intervention group than in the control group.',
      ],
      keyPhrases: ['decreased more', 'in the intervention group', 'than in the control group'],
    },
  },
  // ---------------------------------------------------------------- Level 3
  {
    id: 'rs-l3-01',
    level: 3,
    section: 'discussion',
    titleJa: '控えめな主張と今後の課題',
    passage: [
      'Our results suggest that walking may improve sleep in office workers.',
      'However, the study period was short.',
      'Therefore, longer studies are needed to confirm this effect.',
    ],
    translationJa: '私たちの結果は、歩くことが会社員の睡眠を改善するかもしれないことを示唆している。しかし、研究期間は短かった。したがって、この効果を確かめるには、より長期の研究が必要である。',
    structure: {
      sentence: 'Our results suggest that walking may improve sleep in office workers.',
      translationJa: '私たちの結果は、歩くことが会社員の睡眠を改善するかもしれないことを示唆している。',
      segments: [
        { text: 'Our results', role: '主語 S' },
        { text: 'suggest', role: '動詞 V' },
        { text: 'that walking may improve sleep in office workers', role: '目的語 O（that節）' },
      ],
    },
    logic: [
      { marker: 'suggest ... may', relationJa: '控えめな主張（hedging）', explanationJa: '1つの研究で断定しない。論文では重要な書き方。' },
      { marker: 'However', relationJa: '限界', explanationJa: '主張の弱い点を自分で示す。' },
      { marker: 'Therefore', relationJa: '帰結', explanationJa: '限界から今後の課題を導く。' },
    ],
    expressions: [
      { en: 'Our results suggest that ~', ja: '結果は〜を示唆する' },
      { en: 'may', ja: '〜かもしれない', noteJa: '断定を避ける助動詞' },
      { en: '~ are needed to confirm ...', ja: '…を確かめるには〜が必要である' },
    ],
    question: {
      question: 'Why are longer studies needed?',
      choices: ['Because the study period was short', 'Because walking does not improve sleep', 'Because there were no results', 'Because office workers do not walk'],
      correctIndex: 0,
      explanation: 'However, the study period was short. → Therefore, longer studies are needed. という論理。',
    },
    writing: {
      promptJa: 'したがって、この結果を確かめるには、より大規模な研究が必要である。',
      answers: [
        'Therefore, larger studies are needed to confirm these results.',
        'Therefore, larger studies are needed to confirm this result.',
        'Therefore, larger studies are needed to confirm these findings.',
      ],
      keyPhrases: ['Therefore', 'are needed to confirm'],
    },
  },
  {
    id: 'rs-l3-02',
    level: 3,
    section: 'results',
    titleJa: '「関連」と「原因」を区別する',
    passage: [
      'Patients who slept less than five hours had higher blood pressure.',
      'This difference remained after we adjusted for age.',
      'Short sleep was therefore associated with high blood pressure.',
    ],
    translationJa: '5時間未満しか眠らなかった患者は血圧が高かった。この差は年齢を調整した後も残った。したがって、短い睡眠は高い血圧と関連していた。',
    structure: {
      sentence: 'Patients who slept less than five hours had higher blood pressure.',
      translationJa: '5時間未満しか眠らなかった患者は血圧が高かった。',
      segments: [
        { text: 'Patients', role: '主語 S（中心）' },
        { text: 'who slept less than five hours', role: '主語の修飾（関係代名詞節）' },
        { text: 'had', role: '動詞 V' },
        { text: 'higher blood pressure', role: '目的語 O' },
      ],
    },
    logic: [
      { marker: 'remained after we adjusted for age', relationJa: '他の要因の除外', explanationJa: '年齢の違いだけでは説明できないことを示す。' },
      { marker: 'therefore', relationJa: '結論', explanationJa: '前の2文から導いた結論。' },
      { marker: 'was associated with', relationJa: '関連（因果ではない）', explanationJa: '「原因である」とは言っていない点に注意。' },
    ],
    expressions: [
      { en: 'less than ~', ja: '〜未満' },
      { en: 'adjust for ~', ja: '〜を調整する' },
      { en: 'be associated with ~', ja: '〜と関連している' },
    ],
    question: {
      question: "What does 'associated with' tell us?",
      choices: [
        'The two things are related, but the cause is not proven.',
        'Short sleep definitely causes high blood pressure.',
        'Age caused the difference.',
        'There was no relationship.',
      ],
      correctIndex: 0,
      explanation: 'associated with は関連を示すだけで、因果関係を証明したとは言っていない。',
    },
    writing: {
      promptJa: '喫煙は肺がんと関連していた。',
      answers: ['Smoking was associated with lung cancer.'],
      keyPhrases: ['was associated with'],
    },
  },
  {
    id: 'rs-l3-03',
    level: 3,
    section: 'purpose',
    titleJa: '長い名詞句で目的を書く',
    passage: [
      'The number of older adults living alone is increasing in Japan.',
      'Living alone may increase the risk of depression.',
      'This study aimed to identify factors related to depression in older adults living alone.',
    ],
    translationJa: '日本では一人暮らしの高齢者の数が増えている。一人暮らしはうつ病のリスクを高める可能性がある。本研究は、一人暮らしの高齢者のうつ病に関連する要因を明らかにすることを目的とした。',
    structure: {
      sentence: 'This study aimed to identify factors related to depression in older adults living alone.',
      translationJa: '本研究は、一人暮らしの高齢者のうつ病に関連する要因を明らかにすることを目的とした。',
      segments: [
        { text: 'This study', role: '主語 S' },
        { text: 'aimed', role: '動詞 V' },
        { text: 'to identify factors', role: '目的語 O（不定詞）' },
        { text: 'related to depression', role: 'factors の修飾（過去分詞）' },
        { text: 'in older adults living alone', role: '修飾（対象）' },
      ],
    },
    logic: [
      { marker: '1文目 → 2文目 → 3文目', relationJa: '背景 → 問題 → 目的', explanationJa: 'Introduction の基本の流れ。' },
      { marker: 'may', relationJa: '可能性', explanationJa: '断定せずに問題を提示する。' },
      { marker: 'aimed to', relationJa: '目的', explanationJa: 'This study aimed to ~ は目的文の定番。' },
    ],
    expressions: [
      { en: 'The number of ~ is increasing', ja: '〜の数が増えている', noteJa: 'The number of は単数扱い' },
      { en: 'the risk of ~', ja: '〜のリスク' },
      { en: 'factors related to ~', ja: '〜に関連する要因' },
    ],
    question: {
      question: 'What was the aim of the study?',
      choices: [
        'To identify factors related to depression in older adults living alone',
        'To count older adults in Japan',
        'To treat depression with medicine',
        'To compare Japan with other countries',
      ],
      correctIndex: 0,
      explanation: '最後の文 This study aimed to identify ... が目的。',
    },
    writing: {
      promptJa: '本研究は、看護師の離職に関連する要因を明らかにすることを目的とした。',
      answers: [
        'This study aimed to identify factors related to turnover among nurses.',
        'This study aimed to identify factors related to nurse turnover.',
        'This study aimed to identify factors related to turnover in nurses.',
      ],
      keyPhrases: ['aimed to identify', 'factors related to'],
    },
  },
  // ---------------------------------------------------------------- Level 4
  {
    id: 'rs-l4-01',
    level: 4,
    section: 'methods',
    titleJa: '対象と測定（組み入れ・除外）',
    passage: [
      'Patients undergoing cardiac surgery were enrolled.',
      'Heart rate and blood pressure were recorded every hour for 24 hours after surgery.',
      'Patients with arrhythmia before surgery were excluded.',
    ],
    translationJa: '心臓手術を受ける患者が登録された。心拍数と血圧は術後24時間、1時間ごとに記録された。術前に不整脈のあった患者は除外された。',
    structure: {
      sentence: 'Heart rate and blood pressure were recorded every hour for 24 hours after surgery.',
      translationJa: '心拍数と血圧は術後24時間、1時間ごとに記録された。',
      segments: [
        { text: 'Heart rate and blood pressure', role: '主語 S' },
        { text: 'were recorded', role: '動詞 V（受動態）' },
        { text: 'every hour', role: '修飾（頻度）' },
        { text: 'for 24 hours after surgery', role: '修飾（期間）' },
      ],
    },
    logic: [
      { marker: 'were enrolled / were excluded', relationJa: '対象の選び方', explanationJa: '組み入れ基準と除外基準。' },
      { marker: 'every hour for 24 hours', relationJa: '測定条件', explanationJa: '頻度と期間。' },
    ],
    expressions: [
      { en: 'patients undergoing ~', ja: '〜を受ける患者' },
      { en: 'be enrolled', ja: '（研究に）登録される' },
      { en: 'be excluded', ja: '除外される' },
    ],
    question: {
      question: 'Which patients were excluded?',
      choices: ['Patients with arrhythmia before surgery', 'All patients after surgery', 'Patients with normal blood pressure', 'Patients who stayed 24 hours'],
      correctIndex: 0,
      explanation: 'Patients with arrhythmia before surgery were excluded.',
    },
    writing: {
      promptJa: '術前に心不全のあった患者は除外された。',
      answers: ['Patients with heart failure before surgery were excluded.', 'Patients who had heart failure before surgery were excluded.'],
      keyPhrases: ['were excluded', 'before surgery'],
    },
  },
  {
    id: 'rs-l4-02',
    level: 4,
    section: 'results',
    titleJa: '数値の変化と頻度',
    passage: [
      'Mean systolic blood pressure decreased from 150 to 132 mmHg after treatment.',
      'The decrease was larger in patients over 65 years of age.',
      'Dizziness occurred in 5% of the patients.',
    ],
    translationJa: '平均収縮期血圧は治療後150から132 mmHgに低下した。その低下は65歳を超える患者でより大きかった。めまいは患者の5%に生じた。',
    structure: {
      sentence: 'Mean systolic blood pressure decreased from 150 to 132 mmHg after treatment.',
      translationJa: '平均収縮期血圧は治療後150から132 mmHgに低下した。',
      segments: [
        { text: 'Mean systolic blood pressure', role: '主語 S' },
        { text: 'decreased', role: '動詞 V' },
        { text: 'from 150 to 132 mmHg', role: '修飾（変化の幅）' },
        { text: 'after treatment', role: '修飾（時）' },
      ],
    },
    logic: [
      { marker: 'from ... to ...', relationJa: '変化', explanationJa: '前と後の値を示す。' },
      { marker: 'larger in patients over 65', relationJa: 'サブグループ比較', explanationJa: '一部の患者で効果が大きかった。' },
      { marker: 'occurred in 5%', relationJa: '有害事象', explanationJa: '副作用の頻度。' },
    ],
    expressions: [
      { en: 'decrease from A to B', ja: 'A から B に低下する' },
      { en: 'patients over 65 years of age', ja: '65歳を超える患者' },
      { en: 'occur in X% of ~', ja: '〜の X% に生じる' },
    ],
    question: {
      question: 'In which patients was the decrease larger?',
      choices: ['Patients over 65 years of age', 'Patients under 65', 'Patients with dizziness', 'All patients equally'],
      correctIndex: 0,
      explanation: 'The decrease was larger in patients over 65 years of age.',
    },
    writing: {
      promptJa: '頭痛は患者の10%に生じた。',
      answers: ['Headache occurred in 10% of the patients.', 'Headaches occurred in 10% of the patients.', 'Headache occurred in 10% of patients.'],
      keyPhrases: ['occurred in', 'of the patients'],
    },
  },
  {
    id: 'rs-l4-03',
    level: 4,
    section: 'discussion',
    titleJa: '先行研究と比べる',
    passage: [
      'Our findings are consistent with those of previous studies.',
      'In contrast to earlier reports, however, we found no effect on heart rate.',
      'This may be because our patients were younger.',
    ],
    translationJa: '私たちの知見は先行研究の知見と一致している。しかし、以前の報告とは対照的に、心拍数への影響は見られなかった。これは私たちの患者がより若かったためかもしれない。',
    structure: {
      sentence: 'Our findings are consistent with those of previous studies.',
      translationJa: '私たちの知見は先行研究の知見と一致している。',
      segments: [
        { text: 'Our findings', role: '主語 S' },
        { text: 'are', role: '動詞 V' },
        { text: 'consistent with those of previous studies', role: '補語 C（those = findings）' },
      ],
    },
    logic: [
      { marker: 'consistent with', relationJa: '一致', explanationJa: '先行研究と同じ結果。' },
      { marker: 'In contrast to ..., however,', relationJa: '相違', explanationJa: '先行研究と違う点。' },
      { marker: 'This may be because', relationJa: '理由の推測', explanationJa: '違いの理由を控えめに説明する。' },
    ],
    expressions: [
      { en: 'be consistent with ~', ja: '〜と一致する' },
      { en: 'those of ~', ja: '〜のそれ（ら）', noteJa: '同じ名詞のくり返しを避ける' },
      { en: 'This may be because ~', ja: 'これは〜のためかもしれない' },
    ],
    question: {
      question: 'How do the authors explain the difference from earlier reports?',
      choices: ['Their patients may have been younger.', 'Earlier reports were wrong.', 'Heart rate was not measured.', 'They used a different drug.'],
      correctIndex: 0,
      explanation: 'This may be because our patients were younger.（控えめな推測）',
    },
    writing: {
      promptJa: 'これはサンプルサイズが小さかったためかもしれない。',
      answers: ['This may be because the sample size was small.', 'This may be due to the small sample size.'],
      keyPhrases: ['This may be', 'sample size'],
    },
  },
  // ---------------------------------------------------------------- Level 5
  {
    id: 'rs-l5-01',
    level: 5,
    section: 'abstract',
    titleJa: '構造化抄録（Abstract）を読む・書く',
    passage: [
      'Background: Night-shift work is common among nurses and may disturb sleep.',
      'Objective: This study aimed to evaluate the effect of a brief walking program on sleep quality in night-shift nurses.',
      'Methods: Sixty nurses were randomly assigned to a walking group or a control group for eight weeks. Sleep quality was assessed with the Pittsburgh Sleep Quality Index (PSQI).',
      'Results: The PSQI score improved significantly more in the walking group than in the control group (p = 0.01).',
      'Conclusions: A brief walking program may improve sleep quality in night-shift nurses.',
    ],
    translationJa:
      '背景：夜勤は看護師の間で一般的であり、睡眠を妨げる可能性がある。目的：本研究は、夜勤看護師の睡眠の質に対する短時間歩行プログラムの効果を評価することを目的とした。方法：60人の看護師を8週間、歩行群と対照群に無作為に割り付けた。睡眠の質はピッツバーグ睡眠質問票（PSQI）で評価した。結果：PSQIスコアは対照群より歩行群で有意に大きく改善した（p = 0.01）。結論：短時間の歩行プログラムは夜勤看護師の睡眠の質を改善する可能性がある。',
    structure: {
      sentence: 'Sixty nurses were randomly assigned to a walking group or a control group for eight weeks.',
      translationJa: '60人の看護師を8週間、歩行群と対照群に無作為に割り付けた。',
      segments: [
        { text: 'Sixty nurses', role: '主語 S' },
        { text: 'were randomly assigned', role: '動詞 V（受動態）' },
        { text: 'to a walking group or a control group', role: '修飾（割り付け先）' },
        { text: 'for eight weeks', role: '修飾（期間）' },
      ],
    },
    logic: [
      { marker: 'Background → Objective → Methods → Results → Conclusions', relationJa: '構成', explanationJa: '抄録はこの順に1〜2文ずつで書く。' },
      { marker: 'may disturb / may improve', relationJa: '控えめな主張', explanationJa: '背景と結論で断定を避けている。' },
      { marker: 'significantly more ... than ... (p = 0.01)', relationJa: '統計的な比較', explanationJa: '差が偶然では説明しにくいことを示す。' },
    ],
    expressions: [
      { en: 'be randomly assigned to ~', ja: '〜に無作為に割り付けられる' },
      { en: 'be assessed with ~', ja: '〜で評価される' },
      { en: 'This study aimed to evaluate the effect of A on B', ja: '本研究は B に対する A の効果を評価することを目的とした' },
    ],
    question: {
      question: 'What was the conclusion?',
      choices: [
        'A brief walking program may improve sleep quality in night-shift nurses.',
        'Night-shift work improves sleep.',
        'Walking had no effect on sleep.',
        'All nurses should stop night shifts.',
      ],
      correctIndex: 0,
      explanation: 'Conclusions の文。may で控えめに述べている。',
    },
    writing: {
      promptJa: '目的：本研究は、看護学生のストレスに対するマインドフルネス訓練の効果を評価することを目的とした。',
      answers: [
        'Objective: This study aimed to evaluate the effect of mindfulness training on stress in nursing students.',
        'This study aimed to evaluate the effect of mindfulness training on stress in nursing students.',
        'This study aimed to evaluate the effect of mindfulness training on stress among nursing students.',
        'This study aimed to evaluate the effects of mindfulness training on stress in nursing students.',
      ],
      keyPhrases: ['aimed to evaluate', 'the effect of', 'on stress'],
    },
  },
  {
    id: 'rs-l5-02',
    level: 5,
    section: 'discussion',
    titleJa: '研究の限界（limitation）を書く',
    passage: [
      'This study has several limitations.',
      'First, the sample size was relatively small.',
      'Second, sleep was assessed only by self-report.',
      'Future studies should use objective measures such as actigraphy.',
    ],
    translationJa: '本研究にはいくつかの限界がある。第一に、サンプルサイズが比較的小さかった。第二に、睡眠は自己申告のみで評価された。今後の研究では、アクチグラフィーなどの客観的な指標を用いるべきである。',
    structure: {
      sentence: 'Future studies should use objective measures such as actigraphy.',
      translationJa: '今後の研究では、アクチグラフィーなどの客観的な指標を用いるべきである。',
      segments: [
        { text: 'Future studies', role: '主語 S' },
        { text: 'should use', role: '動詞 V（助動詞 + 原形）' },
        { text: 'objective measures', role: '目的語 O' },
        { text: 'such as actigraphy', role: '修飾（例示）' },
      ],
    },
    logic: [
      { marker: 'First, ... Second, ...', relationJa: '列挙', explanationJa: '限界を一つずつ挙げる。' },
      { marker: 'only by self-report', relationJa: '限界の内容', explanationJa: '主観的な測定だけだった点。' },
      { marker: 'Future studies should', relationJa: '今後の課題', explanationJa: '限界への対策を提案する。' },
    ],
    expressions: [
      { en: 'This study has several limitations.', ja: '本研究にはいくつかの限界がある。' },
      { en: 'relatively', ja: '比較的' },
      { en: 'objective measures such as ~', ja: '〜などの客観的指標' },
    ],
    question: {
      question: 'What do the authors suggest for future studies?',
      choices: ['Using objective measures such as actigraphy', 'Using only self-report', 'Making the sample smaller', 'Stopping research on sleep'],
      correctIndex: 0,
      explanation: 'Future studies should use objective measures such as actigraphy.',
    },
    writing: {
      promptJa: '第一に、追跡期間が比較的短かった。',
      answers: ['First, the follow-up period was relatively short.', 'First, the follow-up period was relatively brief.'],
      keyPhrases: ['First', 'relatively short'],
    },
  },
  {
    id: 'rs-l5-03',
    level: 5,
    section: 'results',
    titleJa: '統計結果を正確に読む',
    passage: [
      'A total of 120 patients were included in the analysis.',
      'The mean age was 68.4 ± 9.2 years, and 55% were women.',
      'Multivariate analysis showed that low physical activity was independently associated with frailty (odds ratio, 2.3; 95% confidence interval, 1.4–3.8).',
    ],
    translationJa:
      '合計120人の患者が解析に含まれた。平均年齢は68.4 ± 9.2歳で、55%が女性であった。多変量解析により、低い身体活動はフレイルと独立して関連していることが示された（オッズ比2.3、95%信頼区間1.4–3.8）。',
    structure: {
      sentence: 'Multivariate analysis showed that low physical activity was independently associated with frailty.',
      translationJa: '多変量解析により、低い身体活動はフレイルと独立して関連していることが示された。',
      segments: [
        { text: 'Multivariate analysis', role: '主語 S' },
        { text: 'showed', role: '動詞 V' },
        { text: 'that low physical activity was independently associated with frailty', role: '目的語 O（that節）' },
      ],
    },
    logic: [
      { marker: 'A total of', relationJa: '対象数', explanationJa: '解析に含めた人数を最初に示す。' },
      { marker: 'independently associated', relationJa: '調整後の関連', explanationJa: '他の要因を考慮しても関連が残った（因果の証明ではない）。' },
      { marker: '(odds ratio, ...; 95% confidence interval, ...)', relationJa: '効果の大きさと精度', explanationJa: '関連の強さと推定の幅。' },
    ],
    expressions: [
      { en: 'A total of N patients were included in the analysis.', ja: '合計 N 人の患者が解析に含まれた。', noteJa: '数字で文を始めないために A total of を使う' },
      { en: 'mean ± SD', ja: '平均 ± 標準偏差' },
      { en: 'be independently associated with ~', ja: '〜と独立して関連している' },
    ],
    question: {
      question: "What does 'independently associated' mean here?",
      choices: ['The link remained after considering other factors.', 'Physical activity certainly caused frailty.', 'There was no link.', 'Only women were analyzed.'],
      correctIndex: 0,
      explanation: '多変量解析で他の要因を調整しても関連が残った、という意味。因果関係の証明ではない。',
    },
    writing: {
      promptJa: '合計85人の参加者が解析に含まれた。',
      answers: ['A total of 85 participants were included in the analysis.'],
      keyPhrases: ['A total of', 'were included in the analysis'],
    },
  },
];
