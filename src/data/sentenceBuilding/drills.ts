import type { SentenceBuildDrill } from '../../types';

/**
 * 英文組み立てドリル. Each drill grows one short sentence: 基本文 -> 情報の追加 -> 構文の変更 ->
 * 別の文脈での応用 (often a simple research sentence, so research English appears from Level 1).
 * `grammarTag` matches GrammarQuestion.tag, which is how drills follow the grammar already studied.
 * `answers[0]` is the model; the other entries are accepted variants for the offline exact check.
 */
export const SENTENCE_BUILD_DRILLS: SentenceBuildDrill[] = [
  // ---------------------------------------------------------------- Level 1
  {
    id: 'sb-l1-01',
    level: 1,
    grammarTag: 'be動詞',
    titleJa: 'be動詞で「〜は…です」',
    patternJa: '主語 + be動詞 + 補語',
    steps: [
      { kind: 'base', promptJa: '私は看護師です。', answers: ['I am a nurse.'] },
      {
        kind: 'expand',
        promptJa: '私はこの病院の看護師です。',
        answers: ['I am a nurse at this hospital.', 'I am a nurse in this hospital.'],
        hintJa: '場所は文の最後に at / in + 場所 で足す',
      },
      {
        kind: 'transform',
        promptJa: 'あなたはこの病院の看護師ですか。',
        answers: ['Are you a nurse at this hospital?', 'Are you a nurse in this hospital?'],
        hintJa: '疑問文は be動詞を主語の前へ',
      },
      {
        kind: 'apply',
        promptJa: 'この研究の参加者は学生です。',
        answers: ['The participants in this study are students.', 'The participants of this study are students.'],
        hintJa: '主語が複数なので are。participant = 参加者',
      },
    ],
  },
  {
    id: 'sb-l1-02',
    level: 1,
    grammarTag: '一般動詞',
    titleJa: '一般動詞で「〜は…する」',
    patternJa: '主語 + 動詞 + 目的語',
    steps: [
      { kind: 'base', promptJa: '私たちは英語を勉強します。', answers: ['We study English.'] },
      {
        kind: 'expand',
        promptJa: '私たちは毎朝、電車で英語を勉強します。',
        answers: [
          'We study English on the train every morning.',
          'We study English every morning on the train.',
          'Every morning, we study English on the train.',
          'Every morning we study English on the train.',
        ],
        hintJa: '「場所 → 時」の順で文末に足すのが基本',
      },
      {
        kind: 'transform',
        promptJa: '私たちは週末には英語を勉強しません。',
        answers: ['We do not study English on weekends.', 'We do not study English at weekends.'],
        hintJa: '否定は do not + 動詞の原形',
      },
      {
        kind: 'apply',
        promptJa: '私たちは心拍数を測定します。',
        answers: ['We measure heart rate.', 'We measure the heart rate.', 'We measure heart rates.'],
        hintJa: 'measure = 測定する、heart rate = 心拍数',
      },
    ],
  },
  {
    id: 'sb-l1-03',
    level: 1,
    grammarTag: '三単現',
    titleJa: '三人称単数の -s',
    patternJa: '三人称単数の主語 + 動詞-s + 目的語',
    steps: [
      { kind: 'base', promptJa: '彼女は毎日コーヒーを飲みます。', answers: ['She drinks coffee every day.'] },
      {
        kind: 'expand',
        promptJa: '彼女は毎朝、仕事の前にコーヒーを飲みます。',
        answers: [
          'She drinks coffee before work every morning.',
          'She drinks coffee every morning before work.',
          'Every morning, she drinks coffee before work.',
          'Every morning she drinks coffee before work.',
        ],
      },
      {
        kind: 'transform',
        promptJa: '彼女は毎朝コーヒーを飲みますか。',
        answers: ['Does she drink coffee every morning?'],
        hintJa: 'Does を使うと動詞は原形に戻る',
      },
      {
        kind: 'apply',
        promptJa: 'その装置は血圧を測定します。',
        answers: ['The device measures blood pressure.', 'This device measures blood pressure.'],
        hintJa: 'The device は三人称単数',
      },
    ],
  },
  {
    id: 'sb-l1-04',
    level: 1,
    grammarTag: '過去形',
    titleJa: '過去形で「〜した」',
    patternJa: '主語 + 動詞の過去形 + 目的語',
    steps: [
      {
        kind: 'base',
        promptJa: '私は昨日、そのデータを確認しました。',
        answers: ['I checked the data yesterday.', 'Yesterday, I checked the data.', 'Yesterday I checked the data.'],
      },
      {
        kind: 'expand',
        promptJa: '私は昨日、会議の前にそのデータを注意深く確認しました。',
        answers: [
          'I checked the data carefully before the meeting yesterday.',
          'I carefully checked the data before the meeting yesterday.',
          'Yesterday, I carefully checked the data before the meeting.',
          'Yesterday, I checked the data carefully before the meeting.',
        ],
        hintJa: 'carefully は動詞の前か目的語の後ろ',
      },
      {
        kind: 'transform',
        promptJa: '私は昨日、そのデータを確認しませんでした。',
        answers: ['I did not check the data yesterday.', 'Yesterday, I did not check the data.'],
        hintJa: 'did not + 動詞の原形',
      },
      {
        kind: 'apply',
        promptJa: '私たちは20人の患者からデータを集めました。',
        answers: ['We collected data from 20 patients.', 'We collected data from twenty patients.'],
        hintJa: 'collect data from ... = …からデータを集める（論文の Methods でよく使う）',
      },
    ],
  },
  {
    id: 'sb-l1-05',
    level: 1,
    grammarTag: '未来',
    titleJa: 'will / be going to で未来',
    patternJa: '主語 + will + 動詞の原形',
    steps: [
      {
        kind: 'base',
        promptJa: '私は明日その論文を読みます。',
        answers: ['I will read the paper tomorrow.', 'I am going to read the paper tomorrow.', 'Tomorrow, I will read the paper.'],
      },
      {
        kind: 'expand',
        promptJa: '私は明日、昼休みにその論文を読みます。',
        answers: [
          'I will read the paper during my lunch break tomorrow.',
          'I will read the paper during lunch tomorrow.',
          'I will read the paper at lunchtime tomorrow.',
          'I am going to read the paper during my lunch break tomorrow.',
          'Tomorrow, I will read the paper during my lunch break.',
        ],
      },
      {
        kind: 'transform',
        promptJa: 'あなたは明日その論文を読みますか。',
        answers: ['Will you read the paper tomorrow?', 'Are you going to read the paper tomorrow?'],
        hintJa: 'Will を主語の前へ',
      },
      {
        kind: 'apply',
        promptJa: '私たちは来年、新しい研究を始めます。',
        answers: [
          'We will start a new study next year.',
          'We will begin a new study next year.',
          'We are going to start a new study next year.',
          'We are going to begin a new study next year.',
        ],
      },
    ],
  },
  {
    id: 'sb-l1-06',
    level: 1,
    grammarTag: '現在進行形',
    titleJa: '現在進行形で「今〜している」',
    patternJa: '主語 + be動詞 + 動詞-ing',
    steps: [
      {
        kind: 'base',
        promptJa: '彼は今、報告書を書いています。',
        answers: ['He is writing a report now.', 'He is now writing a report.', 'He is writing a report right now.'],
      },
      {
        kind: 'expand',
        promptJa: '彼は今、自分の机で月次報告書を書いています。',
        answers: [
          'He is writing a monthly report at his desk now.',
          'He is now writing a monthly report at his desk.',
          'He is writing a monthly report at his desk right now.',
        ],
      },
      {
        kind: 'transform',
        promptJa: '彼は今、報告書を書いていますか。',
        answers: ['Is he writing a report now?', 'Is he writing a report right now?'],
      },
      {
        kind: 'apply',
        promptJa: '私たちは現在、新しい治療法を試験しています。',
        answers: ['We are currently testing a new treatment.', 'We are testing a new treatment now.', 'We are now testing a new treatment.'],
        hintJa: 'currently = 現在、test = 試験する',
      },
    ],
  },
  {
    id: 'sb-l1-07',
    level: 1,
    grammarTag: '助動詞',
    titleJa: '助動詞 can / must / should',
    patternJa: '主語 + 助動詞 + 動詞の原形',
    steps: [
      { kind: 'base', promptJa: '私は英語の論文を読むことができます。', answers: ['I can read English papers.'] },
      {
        kind: 'expand',
        promptJa: '私は辞書を使って英語の論文を読むことができます。',
        answers: ['I can read English papers with a dictionary.', 'I can read English papers using a dictionary.'],
      },
      {
        kind: 'transform',
        promptJa: '私たちは毎回データを確認しなければなりません。',
        answers: ['We must check the data every time.', 'We have to check the data every time.'],
        hintJa: '義務は must / have to',
      },
      {
        kind: 'apply',
        promptJa: '研究者は患者の個人情報を守るべきです。',
        answers: [
          "Researchers should protect patients' personal information.",
          'Researchers should protect the personal information of patients.',
        ],
        hintJa: '助言・当然の義務は should',
      },
    ],
  },
  {
    id: 'sb-l1-08',
    level: 1,
    grammarTag: '疑問詞',
    titleJa: '疑問詞で尋ねる',
    patternJa: '疑問詞 + 疑問文の語順',
    steps: [
      { kind: 'base', promptJa: 'あなたは何を測定しましたか。', answers: ['What did you measure?'] },
      {
        kind: 'expand',
        promptJa: 'あなたはその実験で何を測定しましたか。',
        answers: ['What did you measure in the experiment?', 'What did you measure in that experiment?'],
      },
      {
        kind: 'transform',
        promptJa: 'あなたはいつその実験を行いましたか。',
        answers: [
          'When did you do the experiment?',
          'When did you perform the experiment?',
          'When did you conduct the experiment?',
          'When did you carry out the experiment?',
        ],
        hintJa: '疑問詞を入れ替えるだけで別の質問になる',
      },
      {
        kind: 'apply',
        promptJa: 'なぜ睡眠は記憶にとって重要なのですか。',
        answers: ['Why is sleep important for memory?'],
        hintJa: '研究の「問い（research question）」はこの形から始まる',
      },
    ],
  },
  {
    id: 'sb-l1-09',
    level: 1,
    grammarTag: '否定文',
    titleJa: '否定文で「〜ない」',
    patternJa: '主語 + do/does/did not + 動詞の原形',
    steps: [
      { kind: 'base', promptJa: 'その機械は動きません。', answers: ['The machine does not work.'] },
      {
        kind: 'expand',
        promptJa: 'その古い機械は寒い日には動きません。',
        answers: ['The old machine does not work on cold days.'],
      },
      {
        kind: 'transform',
        promptJa: 'その古い機械は昨日動きませんでした。',
        answers: ['The old machine did not work yesterday.', "The old machine didn't work yesterday."],
        hintJa: '過去の否定は did not',
      },
      {
        kind: 'apply',
        promptJa: 'その治療は副作用を引き起こしませんでした。',
        answers: ['The treatment did not cause side effects.', 'The treatment did not cause any side effects.'],
        hintJa: 'cause = 引き起こす、side effect = 副作用',
      },
    ],
  },
  {
    id: 'sb-l1-10',
    level: 1,
    grammarTag: '基本文型',
    titleJa: '第4文型・第5文型',
    patternJa: 'S + V + O + O ／ S + V + O + C',
    steps: [
      {
        kind: 'base',
        promptJa: '先生は私たちに宿題を出しました。',
        answers: ['The teacher gave us homework.', 'The teacher gave homework to us.'],
      },
      {
        kind: 'expand',
        promptJa: '先生は授業のあとで私たちに宿題を出しました。',
        answers: [
          'The teacher gave us homework after class.',
          'The teacher gave us homework after the class.',
          'After class, the teacher gave us homework.',
        ],
      },
      {
        kind: 'transform',
        promptJa: 'そのニュースは私たちを幸せにしました。',
        answers: ['The news made us happy.'],
        hintJa: 'make + O + C で「O を C にする」',
      },
      {
        kind: 'apply',
        promptJa: '運動は心臓を強くします。',
        answers: ['Exercise makes the heart strong.', 'Exercise makes the heart stronger.', 'Exercise makes your heart strong.'],
      },
    ],
  },
  {
    id: 'sb-l1-11',
    level: 1,
    grammarTag: '接続詞',
    titleJa: '接続詞で2つの文をつなぐ',
    patternJa: '文 + because / but / so + 文',
    steps: [
      {
        kind: 'base',
        promptJa: '私は疲れていたので、早く寝ました。',
        answers: ['I went to bed early because I was tired.', 'Because I was tired, I went to bed early.', 'I was tired, so I went to bed early.'],
      },
      {
        kind: 'expand',
        promptJa: '私はとても疲れていたので、夕食のあとすぐに寝ました。',
        answers: [
          'I went to bed soon after dinner because I was very tired.',
          'I went to bed right after dinner because I was very tired.',
          'Because I was very tired, I went to bed soon after dinner.',
          'Because I was very tired, I went to bed right after dinner.',
          'I was very tired, so I went to bed soon after dinner.',
          'I was very tired, so I went to bed right after dinner.',
        ],
      },
      {
        kind: 'transform',
        promptJa: '私は疲れていましたが、その論文を読みました。',
        answers: ['I was tired, but I read the paper.', 'Although I was tired, I read the paper.', 'I read the paper although I was tired.'],
        hintJa: '逆接は but / although',
      },
      {
        kind: 'apply',
        promptJa: '患者が高齢だったので、私たちは投与量を減らしました。',
        answers: [
          'We reduced the dose because the patient was elderly.',
          'Because the patient was elderly, we reduced the dose.',
          'The patient was elderly, so we reduced the dose.',
          'We reduced the dose because the patient was old.',
        ],
        hintJa: 'reduce the dose = 投与量を減らす',
      },
    ],
  },
  {
    id: 'sb-l1-12',
    level: 1,
    grammarTag: 'there-is-are',
    titleJa: 'There is / are で「〜がある」',
    patternJa: 'There + be動詞 + 主語 + 場所',
    steps: [
      { kind: 'base', promptJa: '机の上に本があります。', answers: ['There is a book on the desk.'] },
      {
        kind: 'expand',
        promptJa: '机の上に古い英語の本が3冊あります。',
        answers: ['There are three old English books on the desk.', 'There are 3 old English books on the desk.'],
        hintJa: '複数なので are。形容詞は「数 → 性質 → 種類」の順',
      },
      {
        kind: 'transform',
        promptJa: '机の上に英語の本はありますか。',
        answers: ['Are there any English books on the desk?', 'Is there an English book on the desk?'],
      },
      {
        kind: 'apply',
        promptJa: '2つのグループの間に有意な差がありました。',
        answers: ['There was a significant difference between the two groups.'],
        hintJa: '結果の報告でよく使う形。significant = 有意な',
      },
    ],
  },
  // ---------------------------------------------------------------- Level 2
  {
    id: 'sb-l2-01',
    level: 2,
    grammarTag: '現在完了',
    titleJa: '現在完了（経験・継続）',
    patternJa: '主語 + have/has + 過去分詞',
    steps: [
      { kind: 'base', promptJa: '私はその論文を読んだことがあります。', answers: ['I have read the paper.', 'I have read that paper.'] },
      {
        kind: 'expand',
        promptJa: '私はその論文を2回読んだことがあります。',
        answers: ['I have read the paper twice.', 'I have read that paper twice.'],
      },
      {
        kind: 'transform',
        promptJa: '私は5年間この病院で働いています。',
        answers: [
          'I have worked at this hospital for five years.',
          'I have been working at this hospital for five years.',
          'I have worked at this hospital for 5 years.',
          'I have worked in this hospital for five years.',
        ],
        hintJa: '継続は have + 過去分詞 + for 期間',
      },
      {
        kind: 'apply',
        promptJa: '多くの研究がこの問題を調べてきました。',
        answers: [
          'Many studies have examined this problem.',
          'Many studies have examined this issue.',
          'Many studies have investigated this problem.',
          'Many studies have investigated this issue.',
        ],
        hintJa: '先行研究の紹介（Introduction）の定番の形',
      },
    ],
  },
  {
    id: 'sb-l2-02',
    level: 2,
    grammarTag: '不定詞',
    titleJa: '不定詞で目的を表す',
    patternJa: '文 + to + 動詞の原形',
    steps: [
      {
        kind: 'base',
        promptJa: '私は英語を勉強するために早く起きます。',
        answers: ['I get up early to study English.', 'I wake up early to study English.'],
      },
      {
        kind: 'expand',
        promptJa: '私は仕事の前に英語を勉強するために毎朝6時に起きます。',
        answers: [
          'I get up at six every morning to study English before work.',
          'I get up at 6 every morning to study English before work.',
          'I wake up at six every morning to study English before work.',
          'Every morning, I get up at six to study English before work.',
        ],
      },
      {
        kind: 'transform',
        promptJa: '毎日英語を読むことは大切です。',
        answers: ['It is important to read English every day.'],
        hintJa: '形式主語 It + is + 形容詞 + to 不定詞',
      },
      {
        kind: 'apply',
        promptJa: 'この研究の目的は睡眠の質を評価することでした。',
        answers: [
          'The purpose of this study was to evaluate sleep quality.',
          'The aim of this study was to evaluate sleep quality.',
          'The purpose of this study was to assess sleep quality.',
          'The aim of this study was to assess sleep quality.',
        ],
        hintJa: '論文の目的文：The aim / purpose of this study was to ...',
      },
    ],
  },
  {
    id: 'sb-l2-03',
    level: 2,
    grammarTag: '動名詞',
    titleJa: '動名詞で「〜すること」',
    patternJa: '動詞-ing が主語・目的語になる',
    steps: [
      {
        kind: 'base',
        promptJa: '私は英語の記事を読むのが好きです。',
        answers: ['I like reading English articles.', 'I like to read English articles.'],
      },
      {
        kind: 'expand',
        promptJa: '私は朝の電車で英語の記事を読むのが好きです。',
        answers: ['I like reading English articles on the morning train.', 'I like to read English articles on the morning train.'],
      },
      {
        kind: 'transform',
        promptJa: '英語の記事を読むことは語彙を増やすのに役立ちます。',
        answers: [
          'Reading English articles helps increase vocabulary.',
          'Reading English articles helps to increase vocabulary.',
          'Reading English articles helps you increase your vocabulary.',
          'Reading English articles helps build vocabulary.',
        ],
        hintJa: '動名詞が主語のときは三人称単数扱い（helps）',
      },
      {
        kind: 'apply',
        promptJa: '定期的に運動することは血圧を下げます。',
        answers: ['Exercising regularly lowers blood pressure.', 'Exercising regularly reduces blood pressure.', 'Regular exercise lowers blood pressure.'],
      },
    ],
  },
  {
    id: 'sb-l2-04',
    level: 2,
    grammarTag: '分詞',
    titleJa: '分詞で名詞を説明する',
    patternJa: '名詞 + 現在分詞 / 過去分詞 + 語句',
    steps: [
      { kind: 'base', promptJa: 'これは壊れた機械です。', answers: ['This is a broken machine.'] },
      {
        kind: 'expand',
        promptJa: '窓のそばで寝ている男性は私の父です。',
        answers: ['The man sleeping by the window is my father.', 'The man sleeping near the window is my father.'],
        hintJa: '2語以上で説明するときは名詞の後ろに置く',
      },
      {
        kind: 'transform',
        promptJa: 'これは英語で書かれた本です。',
        answers: ['This is a book written in English.'],
        hintJa: '「〜された」は過去分詞',
      },
      {
        kind: 'apply',
        promptJa: 'この研究で使われた装置は日本製でした。',
        answers: ['The device used in this study was made in Japan.'],
        hintJa: 'Methods の定番：the device used in this study',
      },
    ],
  },
  {
    id: 'sb-l2-05',
    level: 2,
    grammarTag: '比較',
    titleJa: '比較級・最上級',
    patternJa: 'A + be動詞 + 比較級 + than B',
    steps: [
      {
        kind: 'base',
        promptJa: 'この方法はあの方法より速いです。',
        answers: ['This method is faster than that method.', 'This method is faster than that one.'],
      },
      {
        kind: 'expand',
        promptJa: 'この新しい方法は古い方法よりずっと速いです。',
        answers: ['This new method is much faster than the old method.', 'This new method is much faster than the old one.'],
        hintJa: '比較級の強調は much',
      },
      {
        kind: 'transform',
        promptJa: 'この方法は3つの中で最も速いです。',
        answers: ['This method is the fastest of the three.'],
      },
      {
        kind: 'apply',
        promptJa: '介入群の血圧は対照群より低かった。',
        answers: [
          'Blood pressure in the intervention group was lower than in the control group.',
          'Blood pressure was lower in the intervention group than in the control group.',
          'The blood pressure of the intervention group was lower than that of the control group.',
        ],
        hintJa: '比べるものをそろえる（that of the control group）',
      },
    ],
  },
  {
    id: 'sb-l2-06',
    level: 2,
    grammarTag: '受動態',
    titleJa: '受動態で「〜される」',
    patternJa: '主語 + be動詞 + 過去分詞 (+ by ...)',
    steps: [
      { kind: 'base', promptJa: 'この本は多くの学生に読まれています。', answers: ['This book is read by many students.'] },
      {
        kind: 'expand',
        promptJa: 'この本は世界中の多くの学生に読まれています。',
        answers: ['This book is read by many students around the world.', 'This book is read by many students all over the world.'],
      },
      {
        kind: 'transform',
        promptJa: 'その本は1990年に書かれました。',
        answers: ['The book was written in 1990.', 'That book was written in 1990.'],
        hintJa: '過去の受動態は was / were + 過去分詞',
      },
      {
        kind: 'apply',
        promptJa: '血液サンプルは毎朝採取されました。',
        answers: ['Blood samples were collected every morning.', 'Blood samples were taken every morning.'],
        hintJa: 'Methods では「誰が」より「何がされたか」を受動態で書くことが多い',
      },
    ],
  },
  {
    id: 'sb-l2-07',
    level: 2,
    grammarTag: '関係代名詞',
    titleJa: '関係代名詞で名詞を説明する',
    patternJa: '名詞 + who / which / that + 文',
    steps: [
      { kind: 'base', promptJa: '私には英語を話す友人がいます。', answers: ['I have a friend who speaks English.', 'I have a friend that speaks English.'] },
      {
        kind: 'expand',
        promptJa: '私には英語とフランス語を話す友人がいます。',
        answers: ['I have a friend who speaks English and French.', 'I have a friend that speaks English and French.'],
      },
      {
        kind: 'transform',
        promptJa: 'これは私が昨日読んだ論文です。',
        answers: [
          'This is the paper that I read yesterday.',
          'This is the paper which I read yesterday.',
          'This is the paper I read yesterday.',
        ],
        hintJa: '目的格の関係代名詞は省略できる',
      },
      {
        kind: 'apply',
        promptJa: '研究に参加した患者は全員成人でした。',
        answers: [
          'All the patients who participated in the study were adults.',
          'All patients who participated in the study were adults.',
          'All of the patients who participated in the study were adults.',
          'The patients who participated in the study were all adults.',
          'All the patients who took part in the study were adults.',
        ],
      },
    ],
  },
  {
    id: 'sb-l2-08',
    level: 2,
    grammarTag: '条件文',
    titleJa: '条件文 if / unless',
    patternJa: 'If + 現在形, 主語 + will + 動詞',
    steps: [
      {
        kind: 'base',
        promptJa: '雨が降れば、私は家にいます。',
        answers: ['If it rains, I will stay home.', 'If it rains, I will stay at home.', 'I will stay home if it rains.', 'I will stay at home if it rains.'],
        hintJa: 'if の中は未来でも現在形',
      },
      {
        kind: 'expand',
        promptJa: '明日雨が降れば、私は家で論文を読みます。',
        answers: [
          'If it rains tomorrow, I will read papers at home.',
          'If it rains tomorrow, I will read a paper at home.',
          'I will read papers at home if it rains tomorrow.',
        ],
      },
      {
        kind: 'transform',
        promptJa: '急がなければ、電車に乗り遅れますよ。',
        answers: ['If you do not hurry, you will miss the train.', 'Unless you hurry, you will miss the train.'],
      },
      {
        kind: 'apply',
        promptJa: '体温が38度を超えたら、医師に知らせてください。',
        answers: [
          'If the body temperature exceeds 38 degrees, please inform the doctor.',
          'If the temperature exceeds 38 degrees, please inform the doctor.',
          'If the body temperature exceeds 38 degrees, please tell the doctor.',
          'Please inform the doctor if the body temperature exceeds 38 degrees.',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Level 3
  {
    id: 'sb-l3-01',
    level: 3,
    grammarTag: '分詞構文',
    titleJa: '分詞構文で文を短くする',
    patternJa: '動詞-ing / 過去分詞 ..., 主節',
    steps: [
      {
        kind: 'base',
        promptJa: '駅に着いたとき、私は友人に電話しました。（分詞構文で）',
        answers: ['Arriving at the station, I called my friend.', 'After arriving at the station, I called my friend.'],
        hintJa: '主語が同じなら接続詞と主語を省いて -ing に',
      },
      {
        kind: 'expand',
        promptJa: '駅に着くと、私はすぐに友人に電話しました。（分詞構文で）',
        answers: ['Arriving at the station, I immediately called my friend.', 'Arriving at the station, I called my friend immediately.'],
      },
      {
        kind: 'transform',
        promptJa: '英語で書かれているので、その本は読みにくい。（分詞構文で）',
        answers: ['Written in English, the book is difficult to read.', 'Written in English, the book is hard to read.'],
        hintJa: '受け身の意味なら過去分詞で始める',
      },
      {
        kind: 'apply',
        promptJa: '2つのグループを比較して、私たちは大きな違いを見つけました。（分詞構文で）',
        answers: ['Comparing the two groups, we found a large difference.', 'Comparing the two groups, we found a big difference.'],
      },
    ],
  },
  {
    id: 'sb-l3-02',
    level: 3,
    grammarTag: '接続表現',
    titleJa: '接続表現で文と文の関係を示す',
    patternJa: '文. However / Therefore / In addition, 文.',
    steps: [
      { kind: 'base', promptJa: 'その方法は簡単です。しかし、時間がかかります。', answers: ['The method is simple. However, it takes time.'] },
      {
        kind: 'expand',
        promptJa: 'その方法は簡単で安価です。しかし、多くの時間がかかります。',
        answers: [
          'The method is simple and inexpensive. However, it takes a lot of time.',
          'The method is simple and cheap. However, it takes a lot of time.',
          'The method is simple and inexpensive. However, it takes much time.',
        ],
      },
      {
        kind: 'transform',
        promptJa: 'その方法は時間がかかります。したがって、私たちは新しい方法を開発しました。',
        answers: ['The method takes time. Therefore, we developed a new method.', 'The method takes a lot of time. Therefore, we developed a new method.'],
        hintJa: '結論・帰結は Therefore',
      },
      {
        kind: 'apply',
        promptJa: 'サンプルサイズは小さかった。さらに、追跡期間は短かった。',
        answers: [
          'The sample size was small. In addition, the follow-up period was short.',
          'The sample size was small. Furthermore, the follow-up period was short.',
          'The sample size was small. Moreover, the follow-up period was short.',
        ],
        hintJa: 'Discussion の limitation でよく使う追加の表現',
      },
    ],
  },
  {
    id: 'sb-l3-03',
    level: 3,
    grammarTag: '因果関係',
    titleJa: '原因と結果を表す',
    patternJa: '原因 + cause(s) + 結果 ／ 結果 + result(s) from + 原因',
    steps: [
      { kind: 'base', promptJa: '睡眠不足は疲労を引き起こします。', answers: ['Lack of sleep causes fatigue.', 'Sleep deprivation causes fatigue.'] },
      {
        kind: 'expand',
        promptJa: '慢性的な睡眠不足は日中の疲労を引き起こします。',
        answers: ['Chronic lack of sleep causes daytime fatigue.', 'Chronic sleep deprivation causes daytime fatigue.'],
      },
      {
        kind: 'transform',
        promptJa: '日中の疲労は睡眠不足から生じます。（結果を主語にして）',
        answers: [
          'Daytime fatigue results from lack of sleep.',
          'Daytime fatigue results from a lack of sleep.',
          'Daytime fatigue is caused by lack of sleep.',
          'Daytime fatigue is caused by a lack of sleep.',
          'Daytime fatigue results from sleep deprivation.',
        ],
        hintJa: 'result from + 原因 ／ be caused by + 原因',
      },
      {
        kind: 'apply',
        promptJa: '血圧の上昇は塩分の多い食事によるものだった。',
        answers: [
          'The increase in blood pressure was due to a high-salt diet.',
          'The increase in blood pressure was caused by a high-salt diet.',
          'The increase in blood pressure resulted from a high-salt diet.',
        ],
      },
    ],
  },
  {
    id: 'sb-l3-04',
    level: 3,
    grammarTag: '長い主語',
    titleJa: '長い主語を組み立てる',
    patternJa: '名詞 + 修飾（前置詞句・関係詞節） + 動詞',
    steps: [
      { kind: 'base', promptJa: 'その結果は驚くべきものでした。', answers: ['The results were surprising.', 'The result was surprising.'] },
      {
        kind: 'expand',
        promptJa: '昨年私たちが行った調査の結果は驚くべきものでした。',
        answers: [
          'The results of the survey that we conducted last year were surprising.',
          'The results of the survey we conducted last year were surprising.',
          'The results of the survey which we conducted last year were surprising.',
        ],
        hintJa: '主語が長くなっても動詞（were）は主語の中心 results に合わせる',
      },
      {
        kind: 'transform',
        promptJa: '多くの参加者が途中で脱落したことは驚きでした。（It で始めて）',
        answers: [
          'It was surprising that many participants dropped out.',
          'It was surprising that many participants dropped out midway.',
          'It was surprising that many participants dropped out during the study.',
        ],
        hintJa: '長い主語は It ... that で後ろへ回せる',
      },
      {
        kind: 'apply',
        promptJa: '夜勤をしている看護師の数は増えています。',
        answers: [
          'The number of nurses who work night shifts is increasing.',
          'The number of nurses working night shifts is increasing.',
          'The number of nurses who work night shifts has been increasing.',
        ],
        hintJa: 'The number of ... は単数扱い（is）',
      },
    ],
  },
  // ---------------------------------------------------------------- Level 4
  {
    id: 'sb-l4-01',
    level: 4,
    grammarTag: '受動態',
    titleJa: 'Methods の受動態',
    patternJa: '測定したもの + was/were + 過去分詞 + 条件',
    steps: [
      { kind: 'base', promptJa: '血圧が測定されました。', answers: ['Blood pressure was measured.'] },
      {
        kind: 'expand',
        promptJa: '血圧は5分間の安静の後に測定されました。',
        answers: [
          'Blood pressure was measured after five minutes of rest.',
          'Blood pressure was measured after 5 minutes of rest.',
          'Blood pressure was measured after a five-minute rest.',
          'Blood pressure was measured after a 5-minute rest.',
        ],
      },
      {
        kind: 'transform',
        promptJa: '血圧は自動血圧計を用いて測定されました。',
        answers: [
          'Blood pressure was measured using an automatic blood pressure monitor.',
          'Blood pressure was measured with an automatic blood pressure monitor.',
          'Blood pressure was measured using an automated blood pressure monitor.',
        ],
        hintJa: '方法・道具は using / with',
      },
      {
        kind: 'apply',
        promptJa: 'すべての患者は手術の前に評価されました。',
        answers: ['All patients were assessed before surgery.', 'All the patients were assessed before surgery.', 'All patients were evaluated before surgery.'],
      },
    ],
  },
  {
    id: 'sb-l4-02',
    level: 4,
    grammarTag: '数値表現',
    titleJa: '数値の変化を書く',
    patternJa: '主語 + increased/decreased + from A to B / by C',
    steps: [
      {
        kind: 'base',
        promptJa: '心拍数は1分あたり80回でした。',
        answers: ['The heart rate was 80 beats per minute.', 'Heart rate was 80 beats per minute.'],
      },
      {
        kind: 'expand',
        promptJa: '平均心拍数は1分あたり80回から95回に増加しました。',
        answers: [
          'The mean heart rate increased from 80 to 95 beats per minute.',
          'The average heart rate increased from 80 to 95 beats per minute.',
          'Mean heart rate increased from 80 to 95 beats per minute.',
        ],
        hintJa: 'from A to B = A から B へ',
      },
      {
        kind: 'transform',
        promptJa: '平均心拍数は1分あたり15回増加しました。',
        answers: [
          'The mean heart rate increased by 15 beats per minute.',
          'The average heart rate increased by 15 beats per minute.',
          'Mean heart rate increased by 15 beats per minute.',
        ],
        hintJa: '変化の幅は by',
      },
      {
        kind: 'apply',
        promptJa: '患者の約3分の1が合併症を経験しました。',
        answers: [
          'About one-third of the patients experienced complications.',
          'About one third of the patients experienced complications.',
          'Approximately one-third of the patients experienced complications.',
          'Approximately one third of the patients experienced complications.',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Level 5
  {
    id: 'sb-l5-01',
    level: 5,
    grammarTag: '論文表現',
    titleJa: '研究の目的を書く',
    patternJa: 'This study investigated ... ／ The aim of this study was to ...',
    steps: [
      {
        kind: 'base',
        promptJa: '本研究は睡眠の質を調査した。',
        answers: ['This study investigated sleep quality.', 'This study examined sleep quality.', 'This study investigated the quality of sleep.'],
      },
      {
        kind: 'expand',
        promptJa: '本研究は夜勤看護師の睡眠の質を調査した。',
        answers: [
          'This study investigated sleep quality in night-shift nurses.',
          'This study investigated sleep quality among night-shift nurses.',
          'This study examined sleep quality in night-shift nurses.',
          'This study investigated sleep quality in nurses working night shifts.',
        ],
        hintJa: '対象は in / among + 集団',
      },
      {
        kind: 'transform',
        promptJa: '本研究の目的は、夜勤看護師の睡眠の質を調査することであった。',
        answers: [
          'The aim of this study was to investigate sleep quality in night-shift nurses.',
          'The purpose of this study was to investigate sleep quality in night-shift nurses.',
          'The aim of this study was to investigate sleep quality among night-shift nurses.',
          'The purpose of this study was to investigate sleep quality among night-shift nurses.',
        ],
      },
      {
        kind: 'apply',
        promptJa: '本研究の目的は、新しい教育プログラムの効果を評価することであった。',
        answers: [
          'The aim of this study was to evaluate the effectiveness of a new educational program.',
          'The purpose of this study was to evaluate the effectiveness of a new educational program.',
          'The aim of this study was to evaluate the effect of a new educational program.',
          'The aim of this study was to assess the effectiveness of a new educational program.',
        ],
      },
    ],
  },
  {
    id: 'sb-l5-02',
    level: 5,
    grammarTag: '統計表現',
    titleJa: '統計結果を書く',
    patternJa: 'There was (no) significant difference in X between ...',
    steps: [
      { kind: 'base', promptJa: '2群間に有意差はなかった。', answers: ['There was no significant difference between the two groups.'] },
      {
        kind: 'expand',
        promptJa: '年齢について、2群間に有意差はなかった。',
        answers: ['There was no significant difference in age between the two groups.'],
        hintJa: '何の差かは in + 項目',
      },
      {
        kind: 'transform',
        promptJa: '2群間の差は統計的に有意であった（p < 0.05）。',
        answers: [
          'The difference between the two groups was statistically significant (p < 0.05).',
          'The difference between the two groups was statistically significant.',
        ],
      },
      {
        kind: 'apply',
        promptJa: '運動時間は睡眠の質と正の相関を示した。',
        answers: [
          'Exercise time was positively correlated with sleep quality.',
          'Exercise time showed a positive correlation with sleep quality.',
        ],
        hintJa: '相関は be correlated with / show a correlation with',
      },
    ],
  },
  {
    id: 'sb-l5-03',
    level: 5,
    grammarTag: '図表説明',
    titleJa: '図表を説明する',
    patternJa: 'Table/Figure X shows ... ／ As shown in Figure X, ...',
    steps: [
      {
        kind: 'base',
        promptJa: '表1は参加者の特徴を示している。',
        answers: ['Table 1 shows the characteristics of the participants.', 'Table 1 shows participant characteristics.', "Table 1 shows the participants' characteristics."],
      },
      {
        kind: 'expand',
        promptJa: '表1は2つのグループの参加者の特徴を示している。',
        answers: ['Table 1 shows the characteristics of the participants in the two groups.', 'Table 1 shows the characteristics of the participants in both groups.'],
      },
      {
        kind: 'transform',
        promptJa: '図2に示すように、血圧は徐々に低下した。',
        answers: ['As shown in Figure 2, blood pressure gradually decreased.', 'As shown in Figure 2, blood pressure decreased gradually.'],
        hintJa: 'As shown in Figure X, ... は Results の定番',
      },
      {
        kind: 'apply',
        promptJa: '図3に示すように、症状は治療後に改善した。',
        answers: [
          'As shown in Figure 3, symptoms improved after treatment.',
          'As shown in Figure 3, the symptoms improved after treatment.',
          'As shown in Figure 3, the symptoms improved after the treatment.',
        ],
      },
    ],
  },
];
