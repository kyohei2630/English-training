import type { GrammarTerm } from '../../../types';

export const basicTerms: GrammarTerm[] = [
  {
    id: 'term-subject',
    term: '主語',
    category: 'basic',
    oneLiner: '「誰が・何が」を表す、文の動作や状態の主体。',
    explanation:
      '主語（Subject）は文の中心となる「誰が」「何が」にあたる語句です。英語の文は基本的に主語なしでは成り立たず（命令文を除く）、主語が決まることで動詞の形（三単現のsなど）も決まります。名詞や代名詞、動名詞句、to不定詞句などが主語になれます。',
    example: {
      english: 'My sister studies medicine at university.',
      japanese: '私の姉は大学で医学を勉強しています。',
      breakdown: ['My sister = 主語', 'studies = 動詞', 'medicine = 目的語', 'at university = 修飾語（前置詞句）'],
    },
    relatedTermIds: ['term-verb', 'term-object'],
  },
  {
    id: 'term-verb',
    term: '動詞',
    category: 'basic',
    oneLiner: '主語の動作や状態を表す語。',
    explanation:
      '動詞（Verb）は「〜する」「〜である」など、主語の動作や状態を表す語です。英語の文には必ず動詞が必要で、be動詞と一般動詞の2種類に大きく分かれます。時制（現在形・過去形など）や主語の人称・数に応じて形が変化します。',
    example: {
      english: 'The nurse checks the patient every hour.',
      japanese: 'その看護師は1時間ごとに患者を確認します。',
      breakdown: ['The nurse = 主語', 'checks = 動詞', 'the patient = 目的語', 'every hour = 修飾語'],
    },
    relatedTermIds: ['term-be-verb', 'term-general-verb', 'term-auxiliary-verb'],
  },
  {
    id: 'term-be-verb',
    term: 'be動詞',
    category: 'basic',
    oneLiner: 'am / is / are / was / were など、「イコール」や「存在」を表す動詞。',
    explanation:
      'be動詞は主語とその後ろの語句をイコールで結んだり（She is a doctor. 彼女＝医者）、「〜にいる/ある」という存在を表したりする動詞です。主語によって am（I）、is（三人称単数）、are（複数・you）と形が変わり、過去形は was / were になります。',
    example: {
      english: 'They are in the waiting room.',
      japanese: '彼らは待合室にいます。',
      breakdown: ['They = 主語', 'are = be動詞（存在を表す）', 'in the waiting room = 修飾語（場所）'],
    },
    relatedTermIds: ['term-verb', 'term-general-verb'],
  },
  {
    id: 'term-general-verb',
    term: '一般動詞',
    category: 'basic',
    oneLiner: 'be動詞以外の、具体的な動作を表す動詞。',
    explanation:
      '一般動詞（General Verb）は run, study, examine のように、be動詞以外で具体的な動作や行為を表す動詞の総称です。現在形では主語が三人称単数のとき語尾にs/esが付きます（三単現のs）。否定文・疑問文にはdo/doesを使います。',
    example: {
      english: 'The doctor examines the X-ray carefully.',
      japanese: 'その医師はレントゲンを注意深く調べます。',
      breakdown: ['The doctor = 主語（三人称単数）', 'examines = 一般動詞（三単現のs）', 'the X-ray = 目的語'],
    },
    relatedTermIds: ['term-be-verb', 'term-verb'],
  },
  {
    id: 'term-auxiliary-verb',
    term: '助動詞',
    category: 'basic',
    oneLiner: '動詞の前に置いて意味を付け加える語（can, must, willなど）。',
    explanation:
      '助動詞（Auxiliary Verb）は一般動詞やbe動詞の前に置かれ、「〜できる（can）」「〜しなければならない（must）」「〜だろう（will）」など、可能性・義務・未来などの意味を追加します。助動詞の直後の動詞は必ず原形になります。',
    example: {
      english: 'Patients must take this medicine twice a day.',
      japanese: '患者はこの薬を1日2回服用しなければなりません。',
      breakdown: ['Patients = 主語', 'must = 助動詞', 'take = 動詞の原形', 'this medicine = 目的語'],
    },
    relatedTermIds: ['term-verb'],
  },
  {
    id: 'term-object',
    term: '目的語',
    category: 'basic',
    oneLiner: '動詞の動作を受ける人・もの。',
    explanation:
      '目的語（Object）は「〜を」「〜に」にあたる、動詞が表す動作の対象となる語句です。名詞・代名詞・動名詞・to不定詞・that節などが目的語になれます。文型によっては目的語が2つ（SVOO）続くこともあります。',
    example: {
      english: 'I read a book.',
      japanese: '私は本を読みます。',
      breakdown: ['I = 主語', 'read = 動詞', 'a book = 目的語'],
    },
    relatedTermIds: ['term-subject', 'term-verb', 'term-complement'],
  },
  {
    id: 'term-complement',
    term: '補語',
    category: 'basic',
    oneLiner: '主語や目的語の性質・状態を説明する語。',
    explanation:
      '補語（Complement）は主語や目的語がどんな状態・性質であるかを補って説明する語です。主語を説明する主格補語（She is a nurse.のa nurse）と、目的語を説明する目的格補語（We call him Ken.のKen）があります。主語＝補語、目的語＝補語という「イコール」の関係が成り立つのが特徴です。',
    example: {
      english: 'She is a nurse.',
      japanese: '彼女は看護師です。',
      breakdown: ['She = 主語', 'is = be動詞', 'a nurse = 補語（She = a nurseの関係）'],
    },
    relatedTermIds: ['term-subject', 'term-object'],
  },
  {
    id: 'term-modifier',
    term: '修飾語',
    category: 'basic',
    oneLiner: '他の語に情報を付け加える、文の骨組み以外の要素。',
    explanation:
      '修飾語（Modifier）は主語・動詞・目的語・補語という文の骨組みに、時・場所・方法・理由などの追加情報を加える語句です。形容詞・副詞・前置詞句・不定詞句などが修飾語になり、なくても文自体は成立しますが、なければ情報が不十分になります。',
    example: {
      english: 'The patient recovered quickly after surgery.',
      japanese: 'その患者は手術後、すぐに回復しました。',
      breakdown: ['The patient = 主語', 'recovered = 動詞', 'quickly = 修飾語（副詞）', 'after surgery = 修飾語（前置詞句）'],
    },
    relatedTermIds: ['term-adjective', 'term-adverb', 'term-preposition'],
  },
  {
    id: 'term-noun',
    term: '名詞',
    category: 'basic',
    oneLiner: '人・もの・こと・場所などの名前を表す語。',
    explanation:
      '名詞（Noun）は人・もの・場所・概念などの名前を表す語で、主語・目的語・補語になります。数えられる名詞（可算名詞）と数えられない名詞（不可算名詞）があり、可算名詞は単数・複数の区別があります。',
    example: {
      english: 'The hospital has three doctors.',
      japanese: 'その病院には3人の医師がいます。',
      breakdown: ['The hospital = 名詞（主語）', 'three doctors = 名詞（目的語、複数形）'],
    },
    relatedTermIds: ['term-pronoun', 'term-singular', 'term-plural', 'term-article'],
  },
  {
    id: 'term-pronoun',
    term: '代名詞',
    category: 'basic',
    oneLiner: '名詞の代わりに使う語（I, you, he, itなど）。',
    explanation:
      '代名詞（Pronoun）はすでに話題に出た名詞の繰り返しを避けるために使う語です。人称代名詞（I, you, he, she, it, we, they）、所有代名詞（mine, yoursなど）、指示代名詞（this, that）などがあり、格（主格・所有格・目的格）によって形が変わります。',
    example: {
      english: 'The doctor said she would call back later.',
      japanese: 'その医師は後で電話をかけ直すと言いました。',
      breakdown: ['The doctor = 名詞', 'she = 代名詞（The doctorを指す）', 'would call back = 動詞句'],
    },
    relatedTermIds: ['term-noun'],
  },
  {
    id: 'term-adjective',
    term: '形容詞',
    category: 'basic',
    oneLiner: '名詞の性質や状態を説明する語。',
    explanation:
      '形容詞（Adjective）は名詞を直接修飾したり（a serious illness）、be動詞の後で補語として主語の状態を説明したり（The illness is serious.）します。比較級・最上級に変化することも大きな特徴です。',
    example: {
      english: 'The patient looked very tired.',
      japanese: 'その患者はとても疲れているように見えました。',
      breakdown: ['The patient = 主語', 'looked = 動詞', 'very tired = 補語（形容詞句）'],
    },
    relatedTermIds: ['term-noun', 'term-adverb', 'term-complement'],
  },
  {
    id: 'term-adverb',
    term: '副詞',
    category: 'basic',
    oneLiner: '動詞・形容詞・他の副詞・文全体を修飾する語。',
    explanation:
      '副詞（Adverb）は「どのように」「いつ」「どこで」「どのくらい」といった情報を、動詞・形容詞・別の副詞・文全体に付け加えます。多くは形容詞に-lyを付けて作られますが（quick→quickly）、fast, hard, wellのように形が変わらないものもあります。',
    example: {
      english: 'The team responded quickly to the emergency.',
      japanese: 'そのチームは緊急事態に素早く対応しました。',
      breakdown: ['The team = 主語', 'responded = 動詞', 'quickly = 副詞（respondedを修飾）', 'to the emergency = 修飾語'],
    },
    relatedTermIds: ['term-adjective', 'term-modifier'],
  },
  {
    id: 'term-preposition',
    term: '前置詞',
    category: 'basic',
    oneLiner: '名詞の前に置いて時・場所・方向などの関係を表す語。',
    explanation:
      '前置詞（Preposition）は in, on, at, with, by, for, from, aboutなど、名詞（句）の前に置かれて時間・場所・手段・理由などの関係を表す語です。前置詞＋名詞のまとまりを「前置詞句」と呼び、修飾語として働きます。',
    example: {
      english: 'The clinic is located near the station.',
      japanese: 'そのクリニックは駅の近くにあります。',
      breakdown: ['The clinic = 主語', 'is located = 動詞句', 'near the station = 前置詞句（修飾語）'],
    },
    relatedTermIds: ['term-modifier'],
  },
  {
    id: 'term-conjunction',
    term: '接続詞',
    category: 'basic',
    oneLiner: '語・句・節をつなぐ語（and, but, becauseなど）。',
    explanation:
      '接続詞（Conjunction）は語と語、句と句、節と節をつなぐ働きをします。and/but/orのように対等に結ぶ「等位接続詞」と、because/although/whenのように主節と従属節を結ぶ「従属接続詞」の2種類があります。',
    example: {
      english: 'She stayed home because she had a fever.',
      japanese: '熱があったので、彼女は家にいました。',
      breakdown: ['She stayed home = 主節', 'because = 従属接続詞（理由）', 'she had a fever = 従属節'],
    },
    relatedTermIds: ['term-clause'],
  },
  {
    id: 'term-article',
    term: '冠詞',
    category: 'basic',
    oneLiner: '名詞の前に置くa / an / the。',
    explanation:
      '冠詞（Article）は名詞の前に置かれ、その名詞が「どれか一つの不特定のもの」か「特定できるもの」かを示します。不定冠詞a/anは初めて話題に出る単数の可算名詞に、定冠詞theは話し手と聞き手の間で特定できる名詞に使います。',
    example: {
      english: 'I saw a doctor yesterday. The doctor was very kind.',
      japanese: '私は昨日医者に診てもらいました。その医者はとても親切でした。',
      breakdown: ['a doctor = 不定冠詞（初出）', 'The doctor = 定冠詞（2回目、特定できる）'],
    },
    relatedTermIds: ['term-noun', 'term-singular'],
  },
  {
    id: 'term-singular',
    term: '単数',
    category: 'basic',
    oneLiner: '人・ものが1つであること。',
    explanation:
      '単数（Singular）は名詞が指すものが1つであることを表す形です。可算名詞の単数形にはa/anや所有格などの限定詞が必要になることが多く、動詞の形（三単現のsなど）にも影響します。',
    example: {
      english: 'A child is waiting in the lobby.',
      japanese: '一人の子供がロビーで待っています。',
      breakdown: ['A child = 単数形の名詞', 'is = be動詞の単数形'],
    },
    relatedTermIds: ['term-plural', 'term-noun'],
  },
  {
    id: 'term-plural',
    term: '複数',
    category: 'basic',
    oneLiner: '人・ものが2つ以上であること。',
    explanation:
      '複数（Plural）は名詞が指すものが2つ以上であることを表す形で、多くは語尾に-s/-esを付けて作ります（不規則な変化をする語もあります：child→children）。主語が複数のときはbe動詞にareを使うなど、動詞の形にも影響します。',
    example: {
      english: 'Several children are waiting in the lobby.',
      japanese: '何人かの子供たちがロビーで待っています。',
      breakdown: ['children = 複数形の名詞', 'are = be動詞の複数形'],
    },
    relatedTermIds: ['term-singular', 'term-noun'],
  },
  {
    id: 'term-present-tense',
    term: '現在形',
    category: 'basic',
    oneLiner: '現在の習慣・事実・状態を表す動詞の形。',
    explanation:
      '現在形（Present Tense）は「今」だけでなく、習慣的な行動（I study every day.）や、いつでも成り立つ事実（Water boils at 100°C.）を表すのに使われます。主語が三人称単数のときは一般動詞に-s/-esが付きます。',
    example: {
      english: 'The heart pumps blood through the body.',
      japanese: '心臓は血液を体中に送り出します。',
      breakdown: ['The heart = 主語（三人称単数）', 'pumps = 現在形（三単現のs）', 'blood = 目的語'],
    },
    relatedTermIds: ['term-past-tense', 'term-base-form'],
  },
  {
    id: 'term-past-tense',
    term: '過去形',
    category: 'basic',
    oneLiner: '過去に起きた動作・状態を表す動詞の形。',
    explanation:
      '過去形（Past Tense）は過去のある時点で起きた出来事や、その時の状態を表します。規則動詞は語尾に-edを付けて作りますが（work→worked）、不規則動詞は独自の変化をします（go→went, see→saw）。',
    example: {
      english: 'The patient visited the clinic last week.',
      japanese: 'その患者は先週クリニックを訪れました。',
      breakdown: ['The patient = 主語', 'visited = 過去形（規則動詞+ed）', 'last week = 修飾語（過去を示す）'],
    },
    relatedTermIds: ['term-present-tense', 'term-past-participle'],
  },
  {
    id: 'term-past-participle',
    term: '過去分詞',
    category: 'basic',
    oneLiner: '完了形・受動態などで使う動詞の形（-ed/不規則変化）。',
    explanation:
      '過去分詞（Past Participle）は現在完了形（have + 過去分詞）や受動態（be + 過去分詞）を作るときに使う動詞の形です。規則動詞は過去形と同じ-edの形ですが、不規則動詞は独自の形を持ちます（go→gone, write→written）。形容詞的に名詞を修飾することもあります。',
    example: {
      english: 'The results have been reviewed by the committee.',
      japanese: 'その結果は委員会によって確認されました。',
      breakdown: ['have been reviewed = 現在完了の受動態（have + been + 過去分詞）', 'by the committee = 動作主'],
    },
    relatedTermIds: ['term-present-participle', 'term-past-tense'],
  },
  {
    id: 'term-present-participle',
    term: '現在分詞',
    category: 'basic',
    oneLiner: '動詞の-ing形。進行形や分詞構文などで使う。',
    explanation:
      '現在分詞（Present Participle）は動詞に-ingを付けた形で、進行形（be + -ing）を作るほか、形容詞的に名詞を修飾したり（a sleeping baby）、分詞構文として文をつないだりします。動名詞（同じ-ing形だが名詞として働く）と形は同じでも役割が異なります。',
    example: {
      english: 'The nurse checking the chart noticed an error.',
      japanese: 'カルテを確認していた看護師が誤りに気づきました。',
      breakdown: ['The nurse = 主語（先行詞）', 'checking the chart = 現在分詞句（The nurseを修飾）', 'noticed = 動詞'],
    },
    relatedTermIds: ['term-past-participle'],
  },
  {
    id: 'term-base-form',
    term: '原形',
    category: 'basic',
    oneLiner: '活用しない、動詞のもとの形。',
    explanation:
      '原形（Base Form）は動詞の最も基本的な形で、辞書に載っている形です。助動詞（can, must, willなど）の直後、命令文、to不定詞の後ろ、doやdoesを使う否定文・疑問文の中では、動詞は必ず原形になります。',
    example: {
      english: 'You should drink more water.',
      japanese: 'あなたはもっと水を飲むべきです。',
      breakdown: ['should = 助動詞', 'drink = 動詞の原形（助動詞の後）', 'more water = 目的語'],
    },
    relatedTermIds: ['term-auxiliary-verb', 'term-present-tense'],
  },
];
