import type { GrammarTheory } from '../../../types';

export const level2GrammarTheory: GrammarTheory[] = [
  {
    id: 'theory-l2-01',
    level: 2,
    tag: '5文型の応用',
    title: '第4文型・第5文型の応用',
    shortDescription: 'SVOOとSVOCを見分け、複雑な文でも文型判断できるようにする。',
    concept:
      '高校英語では、動詞の後ろに目的語や補語が複数続く複雑な文が増えます。SVOO（人に物を〜する）とSVOC（Oを〜にする、O＝Cの関係）を正しく見分けられると、長い文でも意味を素早く組み立てられるようになります。',
    rules: [
      { title: 'SVOOはO1=人、O2=もの', explanation: 'give, tell, teachなどは「人に」「ものを」という2つの目的語を続けます。O1とO2の間にイコール関係はありません。' },
      { title: 'SVOCはO=Cの関係', explanation: 'make, call, keep, findなどはO（目的語）とC（補語）の間にイコール関係が成り立ちます。' },
    ],
    examples: [
      {
        english: 'The results made the researchers reconsider their hypothesis.',
        japanese: 'その結果は研究者たちに仮説を再考させました。',
        structureBreakdown: {
          sentence: 'The results made the researchers reconsider their hypothesis.',
          translationJa: 'その結果は研究者たちに仮説を再考させました。',
          segments: [
            { text: 'The results', role: 'S' },
            { text: 'made', role: 'V（使役動詞）' },
            { text: 'the researchers', role: 'O' },
            { text: 'reconsider their hypothesis', role: 'C（動詞の原形、O=reconsiderする関係）' },
          ],
        },
      },
    ],
    keyPoints: ['動詞の直後の名詞が「目的語」か「補語に対応する目的語」かを見極める', 'OとCの間にbe動詞を補ってイコール関係が成り立つか確認するとよい'],
    commonMistakes: ['SVOOとSVOCを混同し、O1=O2だと誤解してしまう。'],
    relatedTermIds: ['term-svoo', 'term-svoc'],
    miniCheck: [
      {
        question: '"They elected her president." の文型はどれですか。',
        choices: ['SVOO', 'SVOC', 'SVO', 'SVC'],
        correctIndex: 1,
        explanation: 'her＝presidentの関係が成り立つのでSVOCです。',
      },
    ],
  },
  {
    id: 'theory-l2-02',
    level: 2,
    tag: '不定詞',
    title: '不定詞の3用法の総復習',
    shortDescription: '名詞的・形容詞的・副詞的用法を文脈から正確に見分ける。',
    concept:
      '不定詞（to + 動詞の原形）は名詞・形容詞・副詞のいずれの働きもできます。高校レベルでは、この3つの用法を文脈から素早く見分け、正確に訳せることが求められます。不定詞の直前・直後の語句に注目するのがコツです。',
    rules: [
      { title: '名詞的用法の見分け方', explanation: '主語・目的語・補語の位置にあり、「〜すること」と訳せれば名詞的用法です。' },
      { title: '形容詞的・副詞的用法の見分け方', explanation: '直前に名詞があれば形容詞的用法（その名詞を修飾）、動詞や文全体を修飾していれば副詞的用法です。' },
    ],
    examples: [
      {
        english: 'She has the ability to solve complex problems quickly.',
        japanese: '彼女には複雑な問題を素早く解決する能力があります。',
        explanation: 'to solve complex problemsはthe abilityを修飾する形容詞的用法。',
      },
    ],
    keyPoints: ['同じto不定詞でも文脈によって用法が変わる', '副詞的用法には目的以外に「感情の原因」を表す使い方もある（glad to hear など）'],
    commonMistakes: ['形容詞的用法と副詞的用法を混同し、修飾しているのが名詞か動詞かを見誤る。'],
    relatedTermIds: ['term-infinitive-noun', 'term-infinitive-adjective', 'term-infinitive-adverb'],
    miniCheck: [
      {
        question: '"I was surprised to hear the news." のto hearの用法はどれですか。',
        choices: ['名詞的用法', '形容詞的用法', '副詞的用法（感情の原因）', '副詞的用法（目的）'],
        correctIndex: 2,
        explanation: '「聞いて驚いた」という感情の原因を表す副詞的用法です。',
      },
    ],
  },
  {
    id: 'theory-l2-03',
    level: 2,
    tag: '不定詞の意味上の主語',
    title: '不定詞の意味上の主語',
    shortDescription: '不定詞の動作を「誰が」するのかを示すfor/of + 人。',
    concept:
      '不定詞の動作主（意味上の主語）は、文の主語と異なる場合にfor + 人（またはof + 人）で示します。forは一般的な場合、ofは人の性質を表す形容詞（kind, foolishなど）の後で使われます。',
    basicForm: 'It is + 形容詞 + for/of + 人 + to不定詞',
    rules: [{ title: 'forとofの使い分け', explanation: '人の性質・評価を表す形容詞（kind, careless, foolishなど）の後はof、それ以外はforを使います。' }],
    examples: [
      {
        english: 'It is important for patients to follow the instructions carefully.',
        japanese: '患者が指示を注意深く守ることが重要です。',
        explanation: 'for patientsがto followの意味上の主語。',
      },
      {
        english: 'It was kind of you to help me.',
        japanese: '手伝ってくれてあなたは親切でした。',
        explanation: 'kindは人の性質を表す形容詞なのでofを使う。',
      },
    ],
    keyPoints: ['意味上の主語は不定詞の直前に置く', 'It is 形容詞 for/of 人 to do の形は仮主語構文と組み合わさることが多い'],
    commonMistakes: ['forとofを取り違える（It is careless for you...ではなくof you）。'],
    relatedTermIds: ['term-infinitive-noun', 'term-dummy-subject'],
    miniCheck: [
      {
        question: '"It was foolish ___ him to say that." に入る正しい語はどれですか。',
        choices: ['for', 'of', 'to', 'by'],
        correctIndex: 1,
        explanation: 'foolishは人の性質を表す形容詞なのでofを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-04',
    level: 2,
    tag: '動名詞',
    title: '動名詞の使い方',
    shortDescription: '「〜すること」を表す動詞のing形と、不定詞との使い分け。',
    concept:
      '動名詞は名詞のように主語・目的語になる動詞のing形です。enjoy, finish, avoid, mind, giveupなどの動詞は目的語に動名詞のみを取ります。一般に、動名詞は「すでに行った・一般的な」動作、不定詞は「これから行う」動作というニュアンスの違いがあります。',
    rules: [{ title: '動名詞のみを目的語に取る動詞', explanation: 'enjoy, finish, avoid, mind, giveup, considerなどは動名詞のみを目的語にします。' }],
    examples: [
      {
        english: 'The committee finished reviewing all the applications.',
        japanese: '委員会はすべての申請書の検討を終えました。',
        explanation: 'finishは動名詞のみを目的語に取る動詞。',
      },
    ],
    keyPoints: ['remember/forget to do（これから〜すること）とremember/forget doing（〜したこと）は意味が異なる', '前置詞の後は動名詞（不定詞は使えない）'],
    commonMistakes: ['"finish to review" のように、動名詞のみを取る動詞に不定詞を使ってしまう。'],
    relatedTermIds: ['term-gerund', 'term-infinitive-noun'],
    miniCheck: [
      {
        question: '"I remember ___ him at the conference last year." で「去年会ったことを覚えている」を表す正しい形はどれですか。',
        choices: ['to meet', 'meeting', 'meet', 'met'],
        correctIndex: 1,
        explanation: '過去に起きたことを覚えている場合はremember + 動名詞を使います。',
      },
    ],
  },
  {
    id: 'theory-l2-05',
    level: 2,
    tag: '動名詞と不定詞の使い分け',
    title: '動名詞と不定詞、両方取れる動詞の意味の違い',
    shortDescription: 'stop, try, forgetなど、動名詞と不定詞で意味が変わる動詞。',
    concept:
      'stop, try, remember, forget, regretなどの動詞は動名詞と不定詞の両方を目的語に取れますが、意味が大きく変わります。動名詞は「すでにしていること」、不定詞は「これからすること」という基本イメージで区別すると覚えやすいです。',
    rules: [
      { title: 'stop + 動名詞 / stop + 不定詞', explanation: 'stop -ingは「〜するのをやめる」、stop to doは「〜するために立ち止まる」という全く別の意味になります。' },
    ],
    examples: [
      {
        english: 'He stopped smoking last year.',
        japanese: '彼は去年タバコをやめました。',
        explanation: 'stop smokingは「タバコを吸うのをやめた」という意味。',
      },
      {
        english: 'He stopped to smoke a cigarette.',
        japanese: '彼はタバコを吸うために立ち止まりました。',
        explanation: 'stop to smokeは「立ち止まって、それから吸った」という意味。',
      },
    ],
    keyPoints: ['try -ingは「試しに〜してみる」、try to doは「〜しようと努力する」', 'forget -ingは「〜したことを忘れる」、forget to doは「〜するのを忘れる」'],
    commonMistakes: ['stop to doとstop -ingの意味を逆に覚えてしまう。'],
    relatedTermIds: ['term-gerund', 'term-infinitive-adverb'],
    miniCheck: [
      {
        question: '「彼は薬を飲むのを忘れた（これからの行為を忘れた）」を正しく表すのはどれですか。',
        choices: ['He forgot taking the medicine.', 'He forgot to take the medicine.', 'He forgot take the medicine.', 'He forgot taken the medicine.'],
        correctIndex: 1,
        explanation: 'これからすべきことを忘れた場合はforget + to不定詞を使います。',
      },
    ],
  },
  {
    id: 'theory-l2-06',
    level: 2,
    tag: '分詞',
    title: '分詞の形容詞的用法（現在分詞・過去分詞）',
    shortDescription: '名詞を修飾する-ing形（能動）と-ed形（受動）。',
    concept:
      '分詞が名詞を修飾するとき、現在分詞（-ing）は「〜している」という能動的な意味、過去分詞（-ed/不規則）は「〜される・された」という受動的な意味を表します。1語なら名詞の前、語句を伴うなら名詞の後ろに置きます。',
    rules: [{ title: '1語なら前、句なら後ろ', explanation: '分詞1語だけなら名詞の前（a sleeping baby）、分詞+他の語句なら名詞の後ろ（a baby sleeping in the crib）に置きます。' }],
    examples: [
      {
        english: 'The results shown in the graph were surprising.',
        japanese: 'グラフに示された結果は驚くべきものでした。',
        structureBreakdown: {
          sentence: 'The results shown in the graph were surprising.',
          translationJa: 'グラフに示された結果は驚くべきものでした。',
          segments: [
            { text: 'The results', role: 'S' },
            { text: 'shown in the graph', role: '過去分詞句（Sを後置修飾）' },
            { text: 'were surprising', role: 'V+C' },
          ],
        },
      },
    ],
    keyPoints: ['能動なら現在分詞、受動なら過去分詞と覚える', '分詞は関係代名詞節の簡略版と考えることができる（which were shown = shown）'],
    commonMistakes: ['能動・受動を逆にしてしまう（a interested movieではなくan interesting movie）。'],
    relatedTermIds: ['term-participle', 'term-participial-adjective'],
    miniCheck: [
      {
        question: '"The man ___ over there is my professor." で「あそこに立っている男性」を表す正しい語はどれですか。',
        choices: ['stand', 'standing', 'stood', 'to stand'],
        correctIndex: 1,
        explanation: '「立っている」という能動的な意味なので現在分詞standingを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-07',
    level: 2,
    tag: '分詞構文の基礎',
    title: '分詞構文の基礎',
    shortDescription: '接続詞+主語を省略し、分詞で文を簡潔につなぐ。',
    concept:
      '分詞構文は「〜しながら」「〜なので」「〜すると」のような意味を、接続詞と（主節と同じ）主語を省略し、動詞を分詞に変えることで簡潔に表す表現です。文頭・文中・文末のどこにでも置け、文章語でよく使われます。',
    basicForm: '動詞のing形（受動なら過去分詞）, 主節.',
    rules: [{ title: '主語が同じときに主語を省略', explanation: '分詞構文の動作主が主節の主語と同じときのみ、主語を省略できます。' }],
    examples: [
      {
        english: 'Feeling tired, she decided to rest.',
        japanese: '疲れを感じたので、彼女は休むことにしました。',
        explanation: 'Feeling tired = Because she felt tiredの意味。',
      },
    ],
    keyPoints: ['分詞構文の意味（時・理由・条件・付帯状況など）は文脈から判断する', '受動の意味なら過去分詞から始める（Written in simple English, ...）'],
    commonMistakes: ['分詞構文の主語と主節の主語が異なるのに主語を省略してしまう（懸垂分詞のミス）。'],
    relatedTermIds: ['term-participial-construction', 'term-independent-participle'],
    miniCheck: [
      {
        question: '"___ in a hurry, he forgot his phone." に自然な形はどれですか。',
        choices: ['Leave', 'Leaving', 'Left', 'To leave'],
        correctIndex: 1,
        explanation: '「急いで出発しながら」という能動的な意味なので、現在分詞Leavingを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-08',
    level: 2,
    tag: '関係代名詞',
    title: '関係代名詞の格（主格・所有格・目的格）',
    shortDescription: '関係代名詞節の中での役割に応じて形が変わる。',
    concept:
      '関係代名詞は節の中での役割（主語・所有格・目的語）によって形が変わります。主格はwho/which/that、所有格はwhose、目的格はwhom/which/that（口語ではしばしば省略）です。',
    rules: [
      { title: '主格：節の中で主語', explanation: '関係代名詞節の中で主語の役割をするときはwho/which/thatを使います。' },
      { title: '目的格：節の中で目的語、省略可能', explanation: '関係代名詞節の中で目的語の役割をするときはwhom/which/thatを使い、省略されることも多いです。' },
    ],
    examples: [
      {
        english: 'The researcher whose study I mentioned earlier will give a talk.',
        japanese: '先ほど言及した研究をした研究者が講演します。',
        explanation: 'whoseは所有格の関係代名詞で、whose studyで「その研究者の研究」を表す。',
      },
    ],
    keyPoints: ['目的格の関係代名詞は日常会話ではよく省略される', 'whoseは人にも物にも使える'],
    commonMistakes: ['目的格の関係代名詞節の中に、余分な目的語（代名詞）を残してしまう。'],
    relatedTermIds: ['term-relative-pronoun', 'term-restrictive-relative'],
    miniCheck: [
      {
        question: '"This is the doctor ___ advice I always trust." に入る正しい語はどれですか。',
        choices: ['who', 'whom', 'whose', 'which'],
        correctIndex: 2,
        explanation: '「その医師の助言」という所有の関係なので、所有格whoseを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-09',
    level: 2,
    tag: '関係代名詞の非制限用法',
    title: '関係代名詞の非制限用法',
    shortDescription: 'コンマを使い、先行詞に補足説明を加える。',
    concept:
      '関係代名詞の前にコンマを置く非制限用法（継続用法）は、すでに特定されている先行詞に補足情報を加えます。制限用法と違い、この節がなくても文の基本的な意味は変わらず、学術英語で頻出します。thatは非制限用法には使えません。',
    rules: [{ title: 'thatは使えない', explanation: '非制限用法（コンマ付き）ではthatを使うことができず、who/whichを使います。' }],
    examples: [
      {
        english: 'The study, which was published last year, has been cited widely.',
        japanese: 'その研究は、昨年発表されたのですが、広く引用されています。',
        explanation: 'which was published last yearはThe studyを補足説明しているだけ。',
      },
    ],
    keyPoints: ['非制限用法は「そして、それは〜」と訳すと自然なことが多い', '文全体を先行詞にすることもできる（, which is why ...）'],
    commonMistakes: ['非制限用法にthatを使ってしまう。'],
    relatedTermIds: ['term-non-restrictive-relative', 'term-restrictive-relative'],
    miniCheck: [
      {
        question: '次のうち文法的に正しい文はどれですか。',
        choices: [
          'My father, that is a doctor, works here.',
          'My father, who is a doctor, works here.',
          'My father who is a doctor, works here.',
          'My father, is a doctor, works here.',
        ],
        correctIndex: 1,
        explanation: '非制限用法はコンマを使い、thatではなくwhoを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-10',
    level: 2,
    tag: '関係副詞',
    title: '関係副詞（where / when / why / how）',
    shortDescription: '場所・時・理由・方法を表す先行詞を、節の中で副詞として説明する。',
    concept:
      '関係副詞は先行詞（場所・時・理由・方法）を説明する節を導きますが、節の中では副詞（前置詞+名詞に相当）として働く点が関係代名詞と異なります。「前置詞+which」で書き換えられることが多いです。howは先行詞the wayと一緒には使いません。',
    rules: [{ title: '前置詞+whichとの書き換え', explanation: '関係副詞は、対応する前置詞+whichで書き換えることができます（where = in/at which など）。' }],
    examples: [
      {
        english: 'This is the reason why the treatment failed.',
        japanese: 'これがその治療が失敗した理由です。',
        explanation: 'whyはthe reasonという先行詞を説明する関係副詞。',
      },
    ],
    keyPoints: ['場所→where、時→when、理由→why、方法→how', 'howとthe wayは同時に使えない（the way how ...とは言わない）'],
    commonMistakes: ['関係副詞の後に、本来なくてもよい前置詞を重ねて付けてしまう（where ... in など）。'],
    relatedTermIds: ['term-relative-adverb', 'term-relative-pronoun'],
    miniCheck: [
      {
        question: '"This is the hospital ___ I was born." に入る正しい語はどれですか。',
        choices: ['which', 'where', 'who', 'why'],
        correctIndex: 1,
        explanation: '先行詞the hospitalは場所なので、関係副詞whereを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-11',
    level: 2,
    tag: '仮定法',
    title: '仮定法過去：現在の事実に反する仮定',
    shortDescription: '「もし（今）〜だったら」と、現実と異なる現在を想像する。',
    concept:
      '仮定法過去は「もし（今）〜だったら、…だろうに」という、現在の事実に反する仮定を表します。形は過去形ですが、意味は「今」のことです。If節はbe動詞なら原則wereを使い、主節はwould/could/might+動詞の原形になります。',
    basicForm: 'If + 主語 + 過去形 ..., 主語 + would/could/might + 動詞の原形 ...',
    rules: [{ title: 'be動詞はwereを使う', explanation: '仮定法過去のIf節では、主語が何であってもbe動詞はwereを使うのが原則です（口語ではwasも使われる）。' }],
    examples: [
      {
        english: 'If I had more time, I would learn another language.',
        japanese: 'もしもっと時間があれば、別の言語を学ぶだろうに。',
        explanation: '実際には時間がないという現在の事実に反する仮定。',
      },
    ],
    keyPoints: ['直説法（If I have time, I will ...）との違いは「実現可能性」', 'If I were you, ...（もし私があなたなら）はアドバイスの定番表現'],
    commonMistakes: ['If節に過去形ではなく現在形を使ってしまい、直説法と仮定法を混同する。'],
    relatedTermIds: ['term-subjunctive-past', 'term-subjunctive-past-perfect'],
    miniCheck: [
      {
        question: '"If I ___ you, I would see a doctor." に入る正しい語はどれですか。',
        choices: ['am', 'was', 'were', 'be'],
        correctIndex: 2,
        explanation: '仮定法過去のIf節ではbe動詞はwereを使うのが原則です。',
      },
    ],
  },
  {
    id: 'theory-l2-12',
    level: 2,
    tag: '仮定法過去完了',
    title: '仮定法過去完了：過去の事実に反する仮定',
    shortDescription: '「もし（あのとき）〜だったら」と、過去を振り返って想像する。',
    concept:
      '仮定法過去完了は「もし（あのとき）〜だったら、…だっただろうに」という、過去の事実に反する仮定を表します。If節はhad+過去分詞、主節はwould/could/might have+過去分詞になります。実際には起きなかった過去を振り返るときに使います。',
    basicForm: 'If + 主語 + had + 過去分詞 ..., 主語 + would/could/might have + 過去分詞 ...',
    rules: [{ title: '過去の事実と反対の結果', explanation: '主節は「実際には起きなかったが、もし〜だったら起きていたであろう結果」を表します。' }],
    examples: [
      {
        english: 'If she had rested more, she would not have gotten sick.',
        japanese: 'もっと休んでいたら、彼女は病気にならなかっただろうに。',
        explanation: '実際には十分休まず、病気になったという過去の事実に反する仮定。',
      },
    ],
    keyPoints: ['If節が過去のこと、主節がその結果として現在に及ぶ場合は「混合仮定法」になる（If she had rested more, she would be healthier now.）', 'Ifを省略して倒置する形（Had she rested more, ...）も頻出'],
    commonMistakes: ['仮定法過去（現在の仮定）と仮定法過去完了（過去の仮定）を混同してしまう。'],
    relatedTermIds: ['term-subjunctive-past-perfect', 'term-subjunctive-past'],
    miniCheck: [
      {
        question: '"If he had studied harder, he ___ the exam." に入る正しい形はどれですか。',
        choices: ['would pass', 'would have passed', 'passed', 'will pass'],
        correctIndex: 1,
        explanation: '仮定法過去完了の主節は would have + 過去分詞になります。',
      },
    ],
  },
  {
    id: 'theory-l2-13',
    level: 2,
    tag: '現在完了',
    title: '現在完了の4用法',
    shortDescription: '完了・経験・継続・結果、4つの意味を持つhave+過去分詞。',
    concept:
      '現在完了（have/has + 過去分詞）は「完了（もう〜した）」「経験（〜したことがある）」「継続（ずっと〜している）」「結果（〜して今…だ）」の4つの意味を持ちます。どの意味かは、一緒に使われる語句（already, ever, for, sinceなど）から判断します。',
    rules: [
      { title: '経験用法はever/neverと', explanation: '「〜したことがある」という経験用法は、ever, never, timesなどの語と一緒によく使われます。' },
      { title: '継続用法はfor/sinceと', explanation: '「ずっと〜している」という継続用法は、for（期間）やsince（起点）と一緒に使われます。' },
    ],
    examples: [
      {
        english: 'I have lived in this city for ten years.',
        japanese: '私はこの街に10年間住んでいます。',
        explanation: 'for ten yearsがあるので継続用法。',
      },
      {
        english: 'She has visited Kyoto twice.',
        japanese: '彼女は京都を2回訪れたことがあります。',
        explanation: 'twiceがあるので経験用法。',
      },
    ],
    keyPoints: ['4つの用法は文脈と一緒に使われる語から判断する', '「いつ」を明示するyesterdayなどとは一緒に使えない'],
    commonMistakes: ['4つの用法を区別せず、機械的に「もう〜した」とだけ訳してしまう。'],
    relatedTermIds: ['term-present-perfect', 'term-past-participle'],
    miniCheck: [
      {
        question: '"Have you ever been to Okinawa?" の現在完了はどの用法ですか。',
        choices: ['完了', '経験', '継続', '結果'],
        correctIndex: 1,
        explanation: 'everがあるので経験用法（〜したことがある）です。',
      },
    ],
  },
  {
    id: 'theory-l2-14',
    level: 2,
    tag: '現在完了進行形',
    title: '現在完了進行形',
    shortDescription: '過去から今まで続いている動作を強調する、have been+動詞ing。',
    concept:
      '現在完了進行形（have/has been + 動詞のing形）は、過去のある時点から現在まで動作がずっと続いていることを強調します。現在完了（継続用法）が状態の継続を表すのに対し、こちらは動作そのものの継続に焦点があります。',
    basicForm: '主語 + have/has been + 動詞のing形',
    rules: [{ title: '動作動詞に使う', explanation: '「ずっと〜し続けている」という動作の継続を強調したいときに使います。' }],
    examples: [
      {
        english: 'They have been waiting for two hours.',
        japanese: '彼らは2時間ずっと待ち続けています。',
        explanation: '待つという動作がずっと続いていることを強調している。',
      },
    ],
    keyPoints: ['知覚・状態を表す動詞（know, likeなど）は進行形にしないので、現在完了（継続）を使う', '「まだ続いている」ことを強く意識させる表現'],
    commonMistakes: ['状態動詞を現在完了進行形にしてしまう（have been knowing ... という誤り）。'],
    relatedTermIds: ['term-present-perfect-progressive', 'term-present-perfect'],
    miniCheck: [
      {
        question: '"It ___ raining since this morning." に入る自然な形はどれですか。',
        choices: ['rains', 'is raining', 'has been raining', 'rained'],
        correctIndex: 2,
        explanation: '朝からずっと降り続けている動作の継続を表すので、現在完了進行形を使います。',
      },
    ],
  },
  {
    id: 'theory-l2-15',
    level: 2,
    tag: '過去完了',
    title: '過去完了：過去のさらに前の出来事',
    shortDescription: '過去の基準時点より前に起きたことを表す、had+過去分詞。',
    concept:
      '過去完了（had + 過去分詞）は過去の基準時点よりも前に起きた出来事を表し、2つの過去の出来事の前後関係をはっきりさせます。「AがBより先に起きた」というとき、Aを過去完了、Bを過去形で表します。',
    basicForm: '主語 + had + 過去分詞',
    rules: [{ title: '基準となる過去より前', explanation: '文中に出てくる別の過去の出来事より、さらに前に起きたことを表すときに使います。' }],
    examples: [
      {
        english: 'The patient had already left when the doctor arrived.',
        japanese: '医師が到着したとき、その患者はすでに帰っていました。',
        structureBreakdown: {
          sentence: 'The patient had already left when the doctor arrived.',
          translationJa: '医師が到着したとき、その患者はすでに帰っていました。',
          segments: [
            { text: 'The patient had already left', role: '過去完了（より前の出来事）' },
            { text: 'when the doctor arrived', role: '過去形（基準となる時点）' },
          ],
        },
      },
    ],
    keyPoints: ['過去完了は必ず「基準となる過去」とセットで使われる', 'byまでにという意味のby the time ...とも相性がよい'],
    commonMistakes: ['単に「昔のこと」というだけで過去完了を使ってしまう（前後関係が明確でない場合は過去形でよい）。'],
    relatedTermIds: ['term-past-perfect', 'term-past-tense'],
    miniCheck: [
      {
        question: '"By the time I arrived, the meeting ___ ." に入る正しい形はどれですか。',
        choices: ['already ended', 'had already ended', 'has already ended', 'already ends'],
        correctIndex: 1,
        explanation: '「到着した」という過去の時点より前に会議が終わっていたので、過去完了を使います。',
      },
    ],
  },
  {
    id: 'theory-l2-16',
    level: 2,
    tag: '受動態',
    title: '受動態の時制のバリエーション',
    shortDescription: '現在・過去・完了形・進行形、それぞれの受動態の形。',
    concept:
      '受動態はbe動詞の部分を時制に応じて変化させることで、現在・過去・現在完了・進行形などさまざまな時制で使うことができます。be動詞の形を正しく選べば、能動態と同じように時制のニュアンスを表現できます。',
    rules: [
      { title: '完了形の受動態', explanation: 'have/has been + 過去分詞（現在完了の受動態）。' },
      { title: '進行形の受動態', explanation: 'am/is/are being + 過去分詞（今まさに〜されている）。' },
    ],
    examples: [
      {
        english: 'The results have been reviewed by the committee.',
        japanese: 'その結果は委員会によって確認されました。',
        explanation: 'have been reviewedは現在完了の受動態。',
      },
    ],
    keyPoints: ['助動詞を含む受動態は「助動詞+be+過去分詞」（must be done など）', '動作主が不明・不要なときはby ...を省略する'],
    commonMistakes: ['完了形の受動態でbeenを忘れてしまう（have reviewedとhave been reviewedを混同）。'],
    relatedTermIds: ['term-passive-voice', 'term-present-perfect'],
    miniCheck: [
      {
        question: '「新しい機器は現在テストされている（最中）」を正しく表すのはどれですか。',
        choices: ['The new device is tested.', 'The new device is being tested.', 'The new device has tested.', 'The new device tests.'],
        correctIndex: 1,
        explanation: '「今まさにテストされている」は進行形の受動態 is being tested で表します。',
      },
    ],
  },
  {
    id: 'theory-l2-17',
    level: 2,
    tag: '群動詞の受動態',
    title: '群動詞（句動詞）の受動態',
    shortDescription: 'look after, take care ofなど、複数語の動詞のまとまりを受動態にする。',
    concept:
      'look after（世話をする）、take care of（世話をする）、laugh at（笑う）のような群動詞（複数の語がまとまって1つの動詞の働きをするもの）も受動態にできます。このとき、群動詞全体をひとつの動詞のように扱い、最後まで分離せずに受動態にします。',
    basicForm: '主語 + be動詞 + 過去分詞 + 残りの前置詞など',
    rules: [{ title: '群動詞はまとめて過去分詞にする', explanation: 'look afterならlooked afterのように、群動詞全体を1つの単位として過去分詞形にします。' }],
    examples: [
      {
        english: 'The baby was looked after by her grandmother.',
        japanese: 'その赤ちゃんは祖母に世話をされました。',
        explanation: 'look after全体をひとまとまりとして受動態にしている。',
      },
    ],
    keyPoints: ['群動詞の一部だけを受動態にすることはできない', '前置詞を文の途中に置いたまま忘れないようにする'],
    commonMistakes: ['"was looked" のように、群動詞の後半（afterなど）を落としてしまう。'],
    relatedTermIds: ['term-passive-voice', 'term-phrasal-verb'],
    miniCheck: [
      {
        question: '"laugh at" を使った受動態として正しいのはどれですか。',
        choices: ['He was laughed.', 'He was laughed at.', 'He was laughed by.', 'He laughed at.'],
        correctIndex: 1,
        explanation: 'laugh at全体を1つの単位として受動態にするので、atを残します。',
      },
    ],
  },
  {
    id: 'theory-l2-18',
    level: 2,
    tag: '助動詞',
    title: '助動詞を使った推量表現',
    shortDescription: 'may/might/must/cannotで「〜かもしれない」「〜に違いない」を表す。',
    concept:
      '助動詞は義務・許可だけでなく、話し手の推量の度合いを表すこともできます。mustは「〜に違いない」（強い確信）、mayやmightは「〜かもしれない」（低い確信）、cannotは「〜のはずがない」という否定の強い確信を表します。',
    rules: [{ title: '確信の強さの順序', explanation: 'must（強い確信）> may/might（弱い確信）、否定の強い確信はcannotを使います（must notではない点に注意）。' }],
    examples: [
      {
        english: 'She must be exhausted after such a long shift.',
        japanese: 'あれほど長い勤務の後では、彼女は疲れ果てているに違いありません。',
        explanation: 'mustは義務ではなく「〜に違いない」という強い推量を表している。',
      },
    ],
    keyPoints: ['推量を過去について言うときはmust/may/might + have + 過去分詞', 'cannot have + 過去分詞で「〜したはずがない」'],
    commonMistakes: ['過去の推量なのに動詞を過去形にしてしまう（must beに戻すべきところをmust wasとしてしまう）。'],
    relatedTermIds: ['term-auxiliary-verb'],
    miniCheck: [
      {
        question: '「彼がそれを知っているはずがない」を表す正しい文はどれですか。',
        choices: ['He must not know it.', 'He cannot know it.', 'He may not know it.', 'He should not know it.'],
        correctIndex: 1,
        explanation: '「〜のはずがない」という強い否定の推量にはcannotを使います。',
      },
    ],
  },
  {
    id: 'theory-l2-19',
    level: 2,
    tag: '助動詞+完了形',
    title: '助動詞+have+過去分詞（過去に対する推量・後悔）',
    shortDescription: '過去のことについての推量・後悔を表す表現。',
    concept:
      '「助動詞 + have + 過去分詞」は過去の出来事について、現在の視点から推量したり、後悔したりする表現です。must have p.p.（〜したに違いない）、may/might have p.p.（〜したかもしれない）、should have p.p.（〜すべきだったのに）などがあります。',
    basicForm: '主語 + 助動詞 + have + 過去分詞',
    rules: [{ title: 'should have p.p.は後悔', explanation: '「〜すべきだったのに（実際はしなかった）」という後悔や非難を表す、よく使う表現です。' }],
    examples: [
      {
        english: 'You should have told me about the change earlier.',
        japanese: 'その変更についてもっと早く教えてくれればよかったのに。',
        explanation: '実際には早く伝えられなかったことへの軽い非難・後悔を表す。',
      },
    ],
    keyPoints: ['must have p.p.は過去についての強い推量（〜したに違いない）', 'need not have p.p.は「〜する必要はなかったのに（したこと）」'],
    commonMistakes: ['should have p.p.を「〜すべきだ」という現在の義務だと誤解してしまう。'],
    relatedTermIds: ['term-auxiliary-verb', 'term-past-participle'],
    miniCheck: [
      {
        question: '"He ___ studied harder." で「彼はもっと勉強すべきだったのに」を表す正しい形はどれですか。',
        choices: ['should have', 'must have', 'may have', 'need have'],
        correctIndex: 0,
        explanation: '「〜すべきだったのに」という後悔はshould have p.p.で表します。',
      },
    ],
  },
  {
    id: 'theory-l2-20',
    level: 2,
    tag: '比較',
    title: '比較を使った重要構文',
    shortDescription: 'クジラ構文、the 比較級 the 比較級、no more thanなどの応用表現。',
    concept:
      '比較の学習が進むと、単純な比較級・最上級だけでなく、not as ... as（クジラ構文）、the + 比較級, the + 比較級（〜すればするほど…）、no more than（〜にすぎない）など、独特の意味を持つ構文が登場します。それぞれの構文を丸ごと覚えておくと読解がスムーズになります。',
    rules: [
      { title: 'the 比較級, the 比較級', explanation: '「〜すればするほど、ますます…だ」という、2つのことが連動して変化することを表します。' },
    ],
    examples: [
      {
        english: 'The earlier you detect the disease, the better the outcome.',
        japanese: '病気を早く発見すればするほど、結果は良くなります。',
        explanation: '2つの比較級が連動して変化する様子を表している。',
      },
    ],
    keyPoints: ['not as ... asは「〜ほど…ではない」という否定の同等比較', 'no more than は「たった〜だけ」という少なさの強調'],
    commonMistakes: ['the 比較級, the 比較級の構文で、theを付け忘れてしまう。'],
    relatedTermIds: ['term-comparative-comparative', 'term-not-as-as'],
    miniCheck: [
      {
        question: '「早ければ早いほど良い」を表す正しい文はどれですか。',
        choices: ['Early is better.', 'The earlier, the better.', 'Earlier the better is.', 'More early, more better.'],
        correctIndex: 1,
        explanation: '「〜すればするほど…」はThe + 比較級, the + 比較級で表します。',
      },
    ],
  },
  {
    id: 'theory-l2-21',
    level: 2,
    tag: '否定の応用',
    title: '部分否定と全否定',
    shortDescription: 'not always（部分否定）とnot ... at all（全否定）の違い。',
    concept:
      'not allやnot alwaysのように、「always（全部・いつも）」を表す語とnotが組み合わさると「必ずしも〜ではない」という部分否定になります。一方、not ... at allやno oneのような表現は「全く〜ない」という全否定を表します。この2つを混同すると意味が正反対になってしまいます。',
    rules: [{ title: '部分否定の合図', explanation: 'not all, not always, not everyなど、「全体を表す語」とnotが一緒に使われると部分否定になります。' }],
    examples: [
      {
        english: 'Not all patients respond to this treatment.',
        japanese: 'すべての患者がこの治療に反応するわけではありません。',
        explanation: '「全員が反応しない」のではなく、「反応しない人もいる」という部分否定。',
      },
    ],
    keyPoints: ['「全く〜ない」はnot ... at all, none, no oneなどで表す', '部分否定は「必ずしも〜というわけではない」と訳すと自然'],
    commonMistakes: ['Not all patients respond...を「すべての患者が反応しない」という全否定だと誤訳してしまう。'],
    relatedTermIds: ['term-negative'],
    miniCheck: [
      {
        question: '"Not everyone agrees with the plan." の正しい意味はどれですか。',
        choices: ['誰もその計画に賛成していない', '全員がその計画に賛成している', '賛成していない人もいる', '計画には誰も興味がない'],
        correctIndex: 2,
        explanation: 'Not everyoneは部分否定で、「全員が賛成というわけではない（賛成しない人もいる）」という意味です。',
      },
    ],
  },
  {
    id: 'theory-l2-22',
    level: 2,
    tag: '強調構文',
    title: '強調構文（It is ... that ~）',
    shortDescription: '「It is ... that ~」の形で、文の一部を強調して伝える。',
    concept:
      '強調構文は「It is/was + 強調したい語句 + that ...」の形で、文の中の特定の要素（主語・目的語・修飾語など）を際立たせて伝える構文です。もとの文からItとthatを取り除くと、普通の文に戻ります。',
    basicForm: 'It is/was + 強調したい語句 + that ...',
    rules: [{ title: '強調できる要素', explanation: '主語・目的語・時や場所を表す修飾語など、名詞句や副詞句を強調できます。' }],
    examples: [
      {
        english: 'It was the nurse who noticed the change first.',
        japanese: '最初にその変化に気づいたのは、その看護師でした。',
        explanation: 'The nurse noticed the change first.のthe nurseを強調した形。',
      },
    ],
    keyPoints: ['先行詞が人ならwho/thatを、物ならthatを使うことが多い', '仮主語構文のIt is ... to doと形が似ているので混同しないよう注意する'],
    commonMistakes: ['強調構文と仮主語構文を混同してしまう。'],
    relatedTermIds: ['term-cleft-sentence', 'term-inversion'],
    miniCheck: [
      {
        question: '"It was in 1990 that the hospital was built." で強調されている要素はどれですか。',
        choices: ['the hospital', 'was built', 'in 1990', 'It'],
        correctIndex: 2,
        explanation: '時を表す修飾語in 1990が強調構文によって強調されています。',
      },
    ],
  },
  {
    id: 'theory-l2-23',
    level: 2,
    tag: '倒置の基礎',
    title: '倒置の基礎',
    shortDescription: '否定語が文頭に来ると、主語と（助）動詞が入れ替わる。',
    concept:
      '否定の意味を持つ副詞（Never, Not only, Littleなど）が強調のために文頭に来ると、その後は疑問文のような「（助）動詞+主語」の語順（倒置）になります。書き言葉でよく使われる、やや硬い表現です。',
    basicForm: '否定の副詞 + 助動詞/be動詞 + 主語 + 動詞の原形...',
    rules: [{ title: '一般動詞の文はdo/does/didを使う', explanation: '一般動詞の文を倒置するときは、疑問文と同じくdo/does/didを主語の前に置きます。' }],
    examples: [
      {
        english: 'Never have I seen such a rapid recovery.',
        japanese: 'これほど急速な回復を見たことは一度もありません。',
        explanation: 'Neverが文頭に出たことで、have Iと倒置されている。',
      },
    ],
    keyPoints: ['Only after, Not until などの語句が文頭に来ても倒置が起きる', '倒置は主に書き言葉・フォーマルな場面で使われる'],
    commonMistakes: ['倒置すべき場面で、通常の語順のままにしてしまう。'],
    relatedTermIds: ['term-inversion', 'term-cleft-sentence'],
    miniCheck: [
      {
        question: '"Never ___ such a mistake before." に入る正しい形はどれですか。',
        choices: ['I made', 'have I made', 'I have made', 'made I'],
        correctIndex: 1,
        explanation: '否定語Neverが文頭に来たので、have Iと倒置されます。',
      },
    ],
  },
  {
    id: 'theory-l2-24',
    level: 2,
    tag: '省略の基礎',
    title: '省略の基礎',
    shortDescription: '前後の文脈から分かる語句を省く表現。',
    concept:
      '省略は前後の文脈から補える語句をあえて省く表現です。等位接続詞でつながれた文で繰り返しを避けたり、比較の文でthanの後の重複部分を省いたりします。文を簡潔にする一方、読解時は省略された語を補って理解する必要があります。',
    rules: [{ title: '比較文での省略', explanation: '比較の文では、than/asの後ろで主節と重複する動詞などがよく省略されます。' }],
    examples: [
      {
        english: 'She studies harder than he (studies).',
        japanese: '彼女は彼より熱心に勉強します。',
        explanation: 'thanの後のstudiesは、主節と重複するため省略されることが多い。',
      },
    ],
    keyPoints: ['省略された部分は主節と同じ語句であることが多い', '会話文ではif possible（it is possibleの省略）のような形も頻出'],
    commonMistakes: ['省略された語を補わずに読み、意味を取り違えてしまう。'],
    relatedTermIds: ['term-ellipsis'],
    miniCheck: [
      {
        question: '"I like tea more than coffee." の文で省略されている語はどれですか。',
        choices: ['I like', 'more', 'than', 'tea'],
        correctIndex: 0,
        explanation: '正式にはI like tea more than I like coffee.で、後半のI likeが省略されています。',
      },
    ],
  },
  {
    id: 'theory-l2-25',
    level: 2,
    tag: '接続詞の発展',
    title: '従属接続詞の発展（whereas, whileなど）',
    shortDescription: '対比・譲歩など、より詳しい意味を持つ従属接続詞。',
    concept:
      'because, ifなどの基本的な従属接続詞に加えて、高校レベルではwhile/whereas（〜する一方で、対比）、although/though（〜だけれども、譲歩）、as long as（〜する限り、条件）など、より詳しい意味を持つ接続詞を使いこなす必要があります。',
    rules: [{ title: '対比のwhile/whereas', explanation: '2つの内容を対比させるとき、while/whereasを使うと「一方で」というニュアンスを加えられます。' }],
    examples: [
      {
        english: 'Group A showed improvement, whereas Group B did not.',
        japanese: 'A群は改善を示したが、一方でB群はそうではなかった。',
        explanation: 'whereasが2つの群の結果を対比させている。',
      },
    ],
    keyPoints: ['althoughは事実に反する内容を導入する', 'as long asは「〜という条件が満たされる限り」という条件を表す'],
    commonMistakes: ['対比のwhileと時を表すwhile（〜している間）を混同してしまう。'],
    relatedTermIds: ['term-contrast-connector', 'term-concession', 'term-subordinating-conjunction'],
    miniCheck: [
      {
        question: '"___ the treatment was expensive, many patients chose it." に自然な語はどれですか。',
        choices: ['Because', 'Although', 'So', 'Whereas'],
        correctIndex: 1,
        explanation: '「高価だったけれども、多くの患者が選んだ」という譲歩の内容なのでAlthoughが自然です。',
      },
    ],
  },
  {
    id: 'theory-l2-26',
    level: 2,
    tag: '名詞節',
    title: '名詞節（that節・疑問詞節）',
    shortDescription: 'that節やwhat節のように、名詞と同じ働きをする節。',
    concept:
      '名詞節はthat, what, whether, if、疑問詞などに導かれ、文の中で主語・目的語・補語といった名詞と同じ役割を果たす節です。特にthat節は believe, think, know, say などの動詞の目的語としてよく使われます。',
    rules: [{ title: 'thatは省略できることが多い', explanation: '動詞の目的語になるthat節のthatは、口語ではよく省略されます。' }],
    examples: [
      {
        english: 'Researchers found that the new drug reduced symptoms significantly.',
        japanese: '研究者たちはその新薬が症状を著しく軽減することを発見しました。',
        explanation: 'that ... significantlyがfoundの目的語になる名詞節。',
      },
    ],
    keyPoints: ['whether/ifは「〜かどうか」という名詞節を作る', '疑問詞節は間接疑問文の形（主語+動詞の語順）になる'],
    commonMistakes: ['名詞節の中を疑問文の語順にしてしまう（間接疑問文のルールを忘れる）。'],
    relatedTermIds: ['term-noun-clause', 'term-indirect-question'],
    miniCheck: [
      {
        question: '"I don\'t know ___ he will come." で「彼が来るかどうか」を表す正しい語はどれですか。',
        choices: ['that', 'what', 'whether', 'which'],
        correctIndex: 2,
        explanation: '「〜かどうか」という意味の名詞節はwhether（またはif）で作ります。',
      },
    ],
  },
  {
    id: 'theory-l2-27',
    level: 2,
    tag: '副詞節',
    title: '副詞節（時・条件・理由・譲歩）',
    shortDescription: 'when, if, becauseなどに導かれ、主節に情報を加える節。',
    concept:
      '副詞節はwhen, if, because, althoughなどの従属接続詞に導かれ、主節に対して時・条件・理由・譲歩などの情報を加える節です。文の主要素（S/V/O/C）にはならず、あくまで修飾語として働きます。時・条件を表す副詞節の中では、未来のことでも現在形を使うという重要なルールがあります。',
    rules: [{ title: '時・条件の副詞節は現在形で未来を表す', explanation: 'when, if, before, after, as soon asなどが導く副詞節の中では、未来のことでも現在形を使います。' }],
    examples: [
      {
        english: 'Call me as soon as the results arrive.',
        japanese: '結果が届いたらすぐに私に電話してください。',
        explanation: '未来のことだがwillは使わず、arriveと現在形になっている。',
      },
    ],
    keyPoints: ['名詞節のthatと違い、副詞節は文から取り除いても文の骨組みは残る', '副詞節は文頭にも文末にも置ける'],
    commonMistakes: ['"as soon as the results will arrive" のように、副詞節の中でwillを使ってしまう。'],
    relatedTermIds: ['term-adverb-clause', 'term-as-soon-as'],
    miniCheck: [
      {
        question: '"If it ___ tomorrow, we will cancel the event." に入る正しい形はどれですか。',
        choices: ['will rain', 'rains', 'rained', 'is raining'],
        correctIndex: 1,
        explanation: '条件を表す副詞節の中では、未来のことでも現在形を使います。',
      },
    ],
  },
  {
    id: 'theory-l2-28',
    level: 2,
    tag: '形容詞節',
    title: '形容詞節（関係詞節の復習と応用）',
    shortDescription: '関係詞に導かれ、直前の名詞を修飾する節。',
    concept:
      '形容詞節は関係代名詞や関係副詞に導かれ、直前の名詞（先行詞）を修飾する節です。文が長くなるほど、どこからどこまでが形容詞節なのかを見極める力が重要になります。形容詞節の終わりは、次の動詞（主節の動詞）が出てくる位置で判断できます。',
    rules: [{ title: '形容詞節の範囲の見極め方', explanation: '関係詞から始まり、主節の動詞が現れる直前までが形容詞節の範囲です。' }],
    examples: [
      {
        english: 'The medicine that the doctor who examined me prescribed worked well.',
        japanese: '私を診察した医師が処方した薬はよく効きました。',
        explanation: 'that ... prescribedがThe medicineを修飾し、その中にさらにwho examined meという形容詞節が入れ子になっている。',
      },
    ],
    keyPoints: ['形容詞節が入れ子になることもあるので、先行詞と動詞の対応を丁寧に追う', '主節の動詞（この例ではworked）を先に見つけると構造が分かりやすい'],
    commonMistakes: ['入れ子になった形容詞節の中の動詞を、主節の動詞だと勘違いしてしまう。'],
    relatedTermIds: ['term-adjective-clause', 'term-relative-pronoun'],
    miniCheck: [
      {
        question: '"The medicine that the doctor prescribed worked well." で文全体の主節の動詞はどれですか。',
        choices: ['that', 'prescribed', 'worked', 'the doctor'],
        correctIndex: 2,
        explanation: 'that the doctor prescribedはThe medicineを修飾する形容詞節で、主節の動詞はworkedです。',
      },
    ],
  },
  {
    id: 'theory-l2-29',
    level: 2,
    tag: '条件文',
    title: '条件文の種類（現実的な条件と仮定）',
    shortDescription: '直説法の条件文と仮定法の条件文の違い。',
    concept:
      '条件文には、実現の可能性がある現実的な条件を表す直説法の条件文（If + 現在形, 主語 + will ...）と、実現しにくい・反実仮想を表す仮定法の条件文（If + 過去形, 主語 + would ...）があります。どちらのIf節かによって、話し手が「どのくらい実現可能だと考えているか」が変わります。',
    rules: [{ title: '直説法と仮定法の違い', explanation: '直説法は「実際に起こりうる」、仮定法は「実際には起こりにくい、または反対のこと」というニュアンスの差があります。' }],
    examples: [
      {
        english: 'If it rains tomorrow, we will cancel the picnic.',
        japanese: '明日雨が降ったら、ピクニックは中止します。',
        explanation: '実現可能性のある現実的な条件なので直説法を使う。',
      },
    ],
    keyPoints: ['天気予報など不確実だが十分あり得ることは直説法で表すのが普通', '仮定法は「ありえないこと・可能性が低いこと」を表す'],
    commonMistakes: ['現実的にありうる条件なのに、仮定法（過去形）を使ってしまう。'],
    relatedTermIds: ['term-subjunctive-past', 'term-adverb-clause'],
    miniCheck: [
      {
        question: '「もし明日晴れたら、公園に行きます」を表す自然な文はどれですか。',
        choices: [
          'If it were sunny tomorrow, I would go to the park.',
          'If it is sunny tomorrow, I will go to the park.',
          'If it was sunny tomorrow, I go to the park.',
          'If it will be sunny tomorrow, I will go to the park.',
        ],
        correctIndex: 1,
        explanation: '実現可能性のある現実的な条件なので、If+現在形, 主語+willの直説法を使います。',
      },
    ],
  },
  {
    id: 'theory-l2-30',
    level: 2,
    tag: '時制',
    title: '時制の一致',
    shortDescription: '主節が過去形のとき、従属節の時制も過去にずれる。',
    concept:
      '主節の動詞が過去形のとき、それに続くthat節などの従属節の時制も、原則として過去（または過去完了）にずれます。これを「時制の一致」と呼びます。ただし、不変の真理や現在も変わらない事実は、時制の一致を受けずに現在形のままにすることもあります。',
    rules: [
      { title: '主節が過去なら従属節も過去にずらす', explanation: '主節がsaidのように過去形なら、that節の中のisはwasに、willはwouldになります。' },
      { title: '不変の真理は現在形のまま', explanation: '科学的事実などは、主節が過去でも現在形のままにすることがあります。' },
    ],
    examples: [
      {
        english: 'She said that she was tired.',
        japanese: '彼女は疲れていると言いました。',
        explanation: '主節said（過去）に合わせ、is→wasに時制がずれている。',
      },
    ],
    keyPoints: ['話法（直接話法→間接話法）の書き換えでも時制の一致が起こる', '時を表す語（yesterday→the day beforeなど）も変化することがある'],
    commonMistakes: ['主節が過去なのに、that節の中を現在形のままにしてしまう。'],
    relatedTermIds: ['term-reported-speech', 'term-past-tense'],
    miniCheck: [
      {
        question: '"He said that he ___ busy." に入る自然な形はどれですか。',
        choices: ['is', 'was', 'has been', 'will be'],
        correctIndex: 1,
        explanation: '主節saidが過去形なので、時制の一致によりisはwasになります。',
      },
    ],
  },
  {
    id: 'theory-l2-31',
    level: 2,
    tag: '知覚動詞・使役動詞',
    title: '知覚動詞・使役動詞のSVOC',
    shortDescription: '目的語の後に動詞の原形（または分詞）を続ける特殊なSVOC。',
    concept:
      'see, hear, feelなどの知覚動詞や、make, have, letなどの使役動詞は、SVOCの文型で補語（C）の位置に動詞の原形（または-ing、過去分詞）を置くという特殊な使い方をします。「OがCする/されるのを見る・させる」という意味を表します。',
    rules: [
      { title: '知覚動詞：見る・聞く・感じる', explanation: 'see, watch, hear, feel + O + 動詞の原形（または-ing）で「OがCするのを見る/聞く/感じる」。' },
      { title: '使役動詞：させる', explanation: 'make（強制）, have（依頼・手配）, let（許可）+ O + 動詞の原形で「Oに〜させる」。' },
    ],
    examples: [
      {
        english: 'The doctor had the nurse prepare the equipment.',
        japanese: '医師は看護師に器具を準備させました。',
        explanation: 'have + O + 動詞の原形で「Oに〜させる（依頼・手配）」という意味。',
      },
    ],
    keyPoints: ['受動態になるとC（動詞の原形）はto不定詞に変わる（was made to do）', 'getを使う使役はget + O + to do（不定詞）という違った形になる'],
    commonMistakes: ['使役動詞・知覚動詞の後にto不定詞を使ってしまう（能動態では原形が基本）。'],
    relatedTermIds: ['term-perception-verb', 'term-causative-verb', 'term-svoc'],
    miniCheck: [
      {
        question: '"I saw him ___ the room." で「彼が部屋に入るのを見た」を表す正しい形はどれですか。',
        choices: ['to enter', 'entering', 'entered', 'enters'],
        correctIndex: 1,
        explanation: '知覚動詞seeの後は動詞の原形または-ing形を使います（entering も正しい選択肢として使える形）。',
      },
    ],
  },
  {
    id: 'theory-l2-32',
    level: 2,
    tag: '疑問詞+to不定詞',
    title: '疑問詞+to不定詞',
    shortDescription: '「何を〜すべきか」のように、疑問詞とto不定詞を組み合わせた名詞句。',
    concept:
      '「疑問詞（what, how, whenなど）+ to不定詞」で「何を〜すべきか」「どう〜すればよいか」という名詞のまとまりを作ります。know, tell, decide, explainなどの動詞の目的語としてよく使われ、間接疑問文（疑問詞+主語+動詞）よりも簡潔に表現できます。',
    basicForm: '疑問詞 + to + 動詞の原形',
    rules: [{ title: '間接疑問文との違い', explanation: '主語が主節と同じ場合、間接疑問文の代わりに疑問詞+to不定詞を使ってより簡潔に表せます。' }],
    examples: [
      {
        english: 'The nurse explained how to use the device.',
        japanese: 'その看護師はその機器の使い方を説明しました。',
        explanation: 'how to use the deviceがexplainedの目的語になっている。',
      },
    ],
    keyPoints: ['whether to doで「〜すべきかどうか」を表す', 'why to doという形は使わない（whyだけ例外）'],
    commonMistakes: ['whyを使って"why to do"のような誤った形を作ってしまう。'],
    relatedTermIds: ['term-interrogative-infinitive', 'term-indirect-question'],
    miniCheck: [
      {
        question: '"I don\'t know ___ ." で「何を言うべきか分からない」を表す正しい形はどれですか。',
        choices: ['what to say', 'what say', 'what saying', 'to what say'],
        correctIndex: 0,
        explanation: '「何を〜すべきか」は疑問詞+to不定詞（what to say）で表します。',
      },
    ],
  },
  {
    id: 'theory-l2-33',
    level: 2,
    tag: '同格',
    title: '同格（the fact that ...など）',
    shortDescription: '名詞の直後に、その内容を説明する語句や節を置く表現。',
    concept:
      '同格は名詞の直後に別の名詞や名詞句、that節などを置いて「つまり〜」と補足説明する表現です。特にfact, idea, news, possibility, evidenceのような「内容を持つ」名詞の後に同格のthat節が続くパターンは、学術英語で非常によく使われます。',
    rules: [{ title: '同格のthat節の中は完全な文', explanation: '関係代名詞のthatと違い、同格のthat節の中には主語・動詞・目的語が全部そろった完全な文が入ります。' }],
    examples: [
      {
        english: 'There is evidence that the treatment reduces symptoms.',
        japanese: 'その治療が症状を軽減するという証拠があります。',
        explanation: 'that the treatment reduces symptomsがevidenceの内容を説明する同格節。',
      },
    ],
    keyPoints: ['同格のthat節は「省略できない」that（関係代名詞のthatとは違う）', 'コンマを使った同格（My father, a doctor, ...）もある'],
    commonMistakes: ['同格のthatを関係代名詞のthatと同じように「不完全な文が続く」と誤解してしまう。'],
    relatedTermIds: ['term-that-apposition', 'term-apposition', 'term-noun-clause'],
    miniCheck: [
      {
        question: '"the fact that he was late" のthat節の性質はどれですか。',
        choices: ['関係代名詞節（不完全な文）', '同格のthat節（完全な文）', '副詞節', '疑問詞節'],
        correctIndex: 1,
        explanation: 'the factの内容を説明する同格のthat節で、中は完全な文（he was late）です。',
      },
    ],
  },
  {
    id: 'theory-l2-34',
    level: 2,
    tag: '挿入の基礎',
    title: '挿入の基礎',
    shortDescription: '文の途中にコンマなどで補足情報を挟み込む表現。',
    concept:
      '挿入は文の主要な流れを一度止めて、コンマやダッシュを使って補足的な情報や話し手の判断（I think, of course, howeverなど）を文の途中に挟み込む表現です。挿入部分を取り除いても、残りの文はそのまま成立するのが特徴です。',
    rules: [{ title: '挿入部分は文の骨組みから独立', explanation: '挿入句・挿入節はコンマで区切られ、前後どちらかのコンマを見つけたら、対応するもう一方のコンマを探すと文の骨組みが見えてきます。' }],
    examples: [
      {
        english: 'The treatment, in most cases, is highly effective.',
        japanese: 'その治療法は、ほとんどの場合、非常に効果的です。',
        explanation: 'in most casesを取り除いても、The treatment is highly effective.という文が成立する。',
      },
    ],
    keyPoints: ['挿入部分をいったん飛ばして読むと、文の骨組みが見つけやすい', '関係代名詞の非制限用法も広い意味では挿入の一種と考えられる'],
    commonMistakes: ['挿入部分を主節の一部だと思い込み、文全体の構造を誤解してしまう。'],
    relatedTermIds: ['term-parenthesis', 'term-apposition'],
    miniCheck: [
      {
        question: '"The results, however, were not statistically significant." で挿入されている語はどれですか。',
        choices: ['The results', 'however', 'were not', 'statistically significant'],
        correctIndex: 1,
        explanation: 'howeverがコンマで挟まれて文中に挿入されています。',
      },
    ],
  },
];
