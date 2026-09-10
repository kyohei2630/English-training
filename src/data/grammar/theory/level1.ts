import type { GrammarTheory } from '../../../types';

export const level1GrammarTheory: GrammarTheory[] = [
  {
    id: 'theory-l1-01',
    level: 1,
    tag: '文の要素',
    title: '英文の基本構造',
    shortDescription: '英語の文は「主語＋動詞」を核に組み立てられる。',
    concept:
      '英語の文は、日本語と違って語順がとても重要です。基本的にすべての文は「誰が（主語）＋どうする（動詞）」という骨組みを中心に、必要に応じて目的語や補語、修飾語が加わって組み立てられます。この骨組みさえ見つけられれば、どんなに長い文でも意味を組み立てられます。',
    basicForm: '主語 + 動詞（+ 目的語 / 補語）+ 修飾語',
    rules: [
      {
        title: '主語と動詞は必ず必要',
        explanation: '日本語では主語を省略することがよくありますが、英語の文（命令文を除く）には必ず主語と動詞が必要です。',
      },
      {
        title: '語順で意味が決まる',
        explanation: '日本語は助詞（は・を・に）で役割が分かりますが、英語は語順（どこに置かれているか）で主語・目的語などの役割が決まります。',
      },
    ],
    examples: [
      {
        english: 'My brother plays soccer every weekend.',
        japanese: '私の兄は毎週末サッカーをします。',
        structureBreakdown: {
          sentence: 'My brother plays soccer every weekend.',
          translationJa: '私の兄は毎週末サッカーをします。',
          segments: [
            { text: 'My brother', role: '主語' },
            { text: 'plays', role: '動詞' },
            { text: 'soccer', role: '目的語' },
            { text: 'every weekend', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: [
      '英文はまず主語と動詞を探すことから読み始める',
      '語順を入れ替えると意味やニュアンスが変わってしまう',
      '修飾語（時・場所など）は文の最後に置かれることが多い',
    ],
    commonMistakes: ['日本語の語順のまま単語を並べてしまい、Every weekend soccer my brother plays.のような不自然な文を作ってしまう。'],
    relatedTermIds: ['term-subject', 'term-verb', 'term-object', 'term-modifier'],
    miniCheck: [
      {
        question: '英語の文に必ず必要な要素の組み合わせはどれですか（命令文を除く）。',
        choices: ['主語と目的語', '主語と動詞', '動詞と補語', '目的語と修飾語'],
        correctIndex: 1,
        explanation: '英語の文には（命令文を除き）必ず主語と動詞が必要です。',
      },
    ],
  },
  {
    id: 'theory-l1-02',
    level: 1,
    tag: '主語と動詞',
    title: '主語と動詞の見つけ方',
    shortDescription: '文を読むときは、まず「誰が」「どうする」を探す。',
    concept:
      '英文を読むときの最初のステップは、主語（誰が/何が）と動詞（どうする/どんな状態か）を見つけることです。この2つが分かれば、文の基本的な意味の骨組みがつかめます。長い文でも、まずこの2つを探す習慣をつけましょう。',
    rules: [
      {
        title: '主語は文頭付近にある名詞・代名詞',
        explanation: '主語はふつう文の最初の方にあり、名詞や代名詞（I, you, he, she, it, we, theyなど）です。',
      },
      {
        title: '動詞は主語の直後にあることが多い',
        explanation: '動詞は主語の直後に置かれることが基本です。ただし、修飾語が間に入ることもあります。',
      },
    ],
    examples: [
      {
        english: 'The little girl in the red coat is smiling.',
        japanese: '赤いコートを着た小さな女の子が微笑んでいます。',
        structureBreakdown: {
          sentence: 'The little girl in the red coat is smiling.',
          translationJa: '赤いコートを着た小さな女の子が微笑んでいます。',
          segments: [
            { text: 'The little girl', role: '主語（の中心）' },
            { text: 'in the red coat', role: '主語を修飾する語句' },
            { text: 'is smiling', role: '動詞' },
          ],
        },
      },
    ],
    keyPoints: ['主語の直後に修飾語句が挟まることがあるので注意する', '主語は1語とは限らず、複数の語からなる「主語のまとまり」であることが多い'],
    commonMistakes: ['主語を修飾する語句（in the red coatなど）を動詞と勘違いしてしまう。'],
    relatedTermIds: ['term-subject', 'term-verb'],
    miniCheck: [
      {
        question: '"The book on the table is mine." で主語はどれですか。',
        choices: ['on the table', 'is', 'The book', 'mine'],
        correctIndex: 2,
        explanation: '主語は"The book"で、"on the table"はThe bookを修飾する語句です。',
      },
    ],
  },
  {
    id: 'theory-l1-03',
    level: 1,
    tag: 'be動詞',
    title: 'be動詞（am / is / are）',
    shortDescription: '「〜は…です」や「〜にいる/ある」を表す動詞。',
    concept:
      'be動詞は「主語＝補語」という「イコール」の関係を表したり（I am a student.＝私は学生だ）、「〜にいる/ある」という存在を表したりする、英語で最も基本的な動詞です。主語によってam, is, areと形が変わります。',
    basicForm: 'I → am / you・複数 → are / それ以外の単数（he, she, it など）→ is',
    rules: [
      { title: '主語で形が決まる', explanation: 'be動詞は主語の人称と数によってam/is/areのいずれかを選びます。' },
      { title: '否定文・疑問文はbe動詞が中心', explanation: '否定文はbe動詞の後にnotを、疑問文はbe動詞を主語の前に出して作ります。' },
    ],
    examples: [
      {
        english: 'They are in the hospital now.',
        japanese: '彼らは今、病院にいます。',
        structureBreakdown: {
          sentence: 'They are in the hospital now.',
          translationJa: '彼らは今、病院にいます。',
          segments: [
            { text: 'They', role: '主語' },
            { text: 'are', role: 'be動詞（存在）' },
            { text: 'in the hospital', role: '修飾語（場所）' },
          ],
        },
      },
    ],
    keyPoints: ['「〜です」（イコール）と「〜にいる/ある」（存在）の2つの使い方がある', 'be動詞の後には名詞・形容詞・場所を表す語句が続く'],
    commonMistakes: ['一般動詞と一緒にbe動詞を使ってしまう（例：I am like this. のような誤り）。'],
    relatedTermIds: ['term-be-verb', 'term-verb'],
    miniCheck: [
      {
        question: '"She ___ a nurse." に入る正しい語はどれですか。',
        choices: ['am', 'is', 'are', 'be'],
        correctIndex: 1,
        explanation: '主語Sheは三人称単数なのでisを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-04',
    level: 1,
    tag: '一般動詞',
    title: '一般動詞の現在形',
    shortDescription: 'be動詞以外の「〜する」を表す動詞。',
    concept:
      '一般動詞はrun, study, likeのように、具体的な動作や気持ちを表す動詞です。現在形は「習慣」や「いつも成り立つこと」を表すときに使い、主語が三人称単数（he, she, itなど）のときだけ動詞の語尾にs/esが付きます。',
    basicForm: '主語 + 動詞（三人称単数なら動詞+s/es）',
    rules: [
      { title: '三人称単数のときだけs/esが付く', explanation: '主語がI/you/we/they（複数）のときは動詞はそのままの形、he/she/itのときだけ-s/-esを付けます。' },
      { title: '否定文・疑問文はdo/doesを使う', explanation: '一般動詞の否定文・疑問文にはdo/doesを使い、動詞は原形に戻します。' },
    ],
    examples: [
      {
        english: 'She studies English every day.',
        japanese: '彼女は毎日英語を勉強します。',
        structureBreakdown: {
          sentence: 'She studies English every day.',
          translationJa: '彼女は毎日英語を勉強します。',
          segments: [
            { text: 'She', role: '主語（三人称単数）' },
            { text: 'studies', role: '動詞（三単現のs）' },
            { text: 'English', role: '目的語' },
            { text: 'every day', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['三単現のsを忘れやすいので特に注意する', 'studyのようにyで終わる語はyをiに変えてesを付ける（studies）'],
    commonMistakes: ['三人称単数の主語なのに動詞にsを付け忘れる（She study... と言ってしまう）。'],
    relatedTermIds: ['term-general-verb', 'term-verb'],
    miniCheck: [
      {
        question: '"He ___ to the gym every morning." の正しい形はどれですか。',
        choices: ['go', 'goes', 'going', 'gone'],
        correctIndex: 1,
        explanation: '主語Heは三人称単数なので、動詞にesを付けてgoesにします。',
      },
    ],
  },
  {
    id: 'theory-l1-05',
    level: 1,
    tag: 'be動詞と一般動詞',
    title: 'be動詞と一般動詞の違い',
    shortDescription: '「イコール・存在」を表すか「動作」を表すかの違い。',
    concept:
      'be動詞は「主語＝補語」や「存在」を表すのに対し、一般動詞は「〜する」という具体的な動作を表します。この2つは1つの文の中で同時には使いません（is likeのような誤りに注意）。否定文・疑問文の作り方も異なるので、まずどちらの動詞かを見分けることが大切です。',
    rules: [
      { title: '1つの動詞のまとまりに1種類だけ', explanation: '1つの動詞句の中でbe動詞と一般動詞を両方使うことはありません（現在進行形など特別な形を除く）。' },
    ],
    examples: [
      {
        english: 'He is a doctor, and he works at this hospital.',
        japanese: '彼は医者で、この病院で働いています。',
        explanation: 'is（be動詞、イコール）とworks（一般動詞、動作）が別々の節で使われている。',
      },
    ],
    keyPoints: ['be動詞の後には名詞・形容詞・場所の語句が続く', '一般動詞の後には目的語や修飾語が続く'],
    commonMistakes: ['"He is like soccer." のようにbe動詞と一般動詞を混ぜて使ってしまう（正しくはHe likes soccer.）。'],
    relatedTermIds: ['term-be-verb', 'term-general-verb'],
    miniCheck: [
      {
        question: '次のうち正しい文はどれですか。',
        choices: ['She is like tea.', 'She likes tea.', 'She is likes tea.', 'She like tea.'],
        correctIndex: 1,
        explanation: '一般動詞likeを使う場合、be動詞は不要です。三人称単数なのでlikesとします。',
      },
    ],
  },
  {
    id: 'theory-l1-06',
    level: 1,
    tag: '否定文',
    title: '否定文の作り方',
    shortDescription: '「〜ではない」「〜しない」を表す。',
    concept:
      '否定文はbe動詞と一般動詞で作り方が異なります。be動詞の否定文はbe動詞の後にnotを置くだけですが、一般動詞の否定文はdo not（don\'t）/does not（doesn\'t）を動詞の前に置き、動詞を原形に戻します。',
    basicForm: 'be動詞: 主語 + be動詞 + not ... / 一般動詞: 主語 + do(es) not + 動詞の原形 ...',
    rules: [
      { title: 'be動詞の否定文', explanation: 'be動詞の直後にnotを置くだけで完成します（is not, are not, am not）。' },
      { title: '一般動詞の否定文', explanation: '主語が三人称単数ならdoes not、それ以外ならdo notを動詞の前に置き、動詞は原形にします。' },
    ],
    examples: [
      {
        english: 'She does not like coffee.',
        japanese: '彼女はコーヒーが好きではありません。',
        structureBreakdown: {
          sentence: 'She does not like coffee.',
          translationJa: '彼女はコーヒーが好きではありません。',
          segments: [
            { text: 'She', role: '主語' },
            { text: 'does not', role: '否定の助動詞' },
            { text: 'like', role: '動詞の原形' },
            { text: 'coffee', role: '目的語' },
          ],
        },
      },
    ],
    keyPoints: ['does notを使うとき、動詞にsを付けない（doesがすでに三単現を担っている）', '短縮形（don\'t, doesn\'t, isn\'t）は会話でよく使われる'],
    commonMistakes: ['"She doesn\'t likes coffee." のように、does notの後の動詞にもsを付けてしまう二重の三単現。'],
    relatedTermIds: ['term-negative', 'term-general-verb'],
    miniCheck: [
      {
        question: '"He ___ eat meat." で「彼は肉を食べません」を正しく表すのはどれですか。',
        choices: ['not', 'don\'t', 'doesn\'t', 'isn\'t'],
        correctIndex: 2,
        explanation: '主語Heは三人称単数なので、doesn\'tを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-07',
    level: 1,
    tag: '疑問文',
    title: '疑問文の作り方',
    shortDescription: '相手に問いかける文の語順ルール。',
    concept:
      '疑問文はbe動詞・一般動詞・助動詞のどれを使うかによって語順のルールが変わります。基本は「動詞（またはdo/does/助動詞）を主語の前に出す」という考え方です。',
    basicForm: 'be動詞: Be動詞 + 主語 ...? / 一般動詞: Do(es) + 主語 + 動詞の原形 ...?',
    rules: [
      { title: 'be動詞の疑問文', explanation: 'be動詞と主語を入れ替えるだけで作れます（Is she...?）。' },
      { title: '一般動詞の疑問文', explanation: 'Do/Doesを文頭に置き、主語の後の動詞は原形に戻します。' },
    ],
    examples: [
      {
        english: 'Does he work at this hospital?',
        japanese: '彼はこの病院で働いていますか。',
        structureBreakdown: {
          sentence: 'Does he work at this hospital?',
          translationJa: '彼はこの病院で働いていますか。',
          segments: [
            { text: 'Does', role: '疑問文を作る助動詞' },
            { text: 'he', role: '主語' },
            { text: 'work', role: '動詞の原形' },
            { text: 'at this hospital', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['答えるときはYes, he does. / No, he doesn\'t.のようにdo/doesを使う', '疑問詞を使うときは疑問詞を最初に置く'],
    commonMistakes: ['"Does he works...?" のように、Doesを使ったのに動詞にもsを付けてしまう。'],
    relatedTermIds: ['term-question', 'term-interrogative'],
    miniCheck: [
      {
        question: '"Is she a teacher?" の答え方として正しいのはどれですか。',
        choices: ['Yes, she is.', 'Yes, she does.', 'Yes, she do.', 'Yes, is she.'],
        correctIndex: 0,
        explanation: 'be動詞の疑問文にはbe動詞で答えます。',
      },
    ],
  },
  {
    id: 'theory-l1-08',
    level: 1,
    tag: '命令文',
    title: '命令文',
    shortDescription: '主語を省略し、動詞の原形で始める指示・依頼の文。',
    concept:
      '命令文は相手（you）に対する指示や依頼を表す文で、主語youを省略して動詞の原形から文を始めます。否定の命令文はDon\'tを動詞の前に置きます。',
    basicForm: '動詞の原形 ....（否定は Don\'t + 動詞の原形 ....）',
    rules: [{ title: '主語は省略、動詞は原形', explanation: '命令文では主語youが省略され、動詞は常に原形（三単現のsも付かない）です。' }],
    examples: [
      {
        english: 'Please take this medicine after meals.',
        japanese: '食後にこの薬を服用してください。',
        structureBreakdown: {
          sentence: 'Please take this medicine after meals.',
          translationJa: '食後にこの薬を服用してください。',
          segments: [
            { text: 'Please', role: '丁寧さを添える語' },
            { text: 'take', role: '動詞の原形' },
            { text: 'this medicine', role: '目的語' },
            { text: 'after meals', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['pleaseを付けると丁寧な依頼になる', '否定の命令文はDon\'t + 動詞の原形'],
    commonMistakes: ['命令文なのに主語を付けてしまう（You take this medicine.は命令文ではなく事実を述べる文になる）。'],
    relatedTermIds: ['term-imperative', 'term-base-form'],
    miniCheck: [
      {
        question: '「その機械に触らないでください」を表す正しい文はどれですか。',
        choices: ['Not touch the machine.', 'You don\'t touch the machine.', 'Don\'t touch the machine.', 'Doesn\'t touch the machine.'],
        correctIndex: 2,
        explanation: '否定の命令文はDon\'t + 動詞の原形で作ります。',
      },
    ],
  },
  {
    id: 'theory-l1-09',
    level: 1,
    tag: '名詞',
    title: '名詞（可算・不可算）',
    shortDescription: '人・もの・ことの名前を表す語。単数・複数の区別がある。',
    concept:
      '名詞には数えられる名詞（可算名詞：book, doctorなど）と数えられない名詞（不可算名詞：water, informationなど）があります。可算名詞は単数形と複数形を区別し、通常a/anや複数のsを伴います。不可算名詞にはa/anを付けず、複数形にもしません。',
    rules: [
      { title: '可算名詞は単数・複数を区別', explanation: '可算名詞の単数形にはa/anが必要で、複数形は語尾に-s/-esを付けます。' },
      { title: '不可算名詞は数えない', explanation: 'water, information, adviceのような不可算名詞にはa/anを付けず、常に単数扱いです。' },
    ],
    examples: [
      {
        english: 'I need some information about the medicine.',
        japanese: 'その薬についての情報が必要です。',
        explanation: 'informationは不可算名詞なので、a informationやinformationsとは言わない。',
      },
    ],
    keyPoints: ['不可算名詞の量はsome/much/a lot ofなどで表す', '同じ単語でも意味によって可算・不可算が変わることがある'],
    commonMistakes: ['"an informations" のように不可算名詞にa/anや複数のsを付けてしまう。'],
    relatedTermIds: ['term-noun', 'term-singular', 'term-plural'],
    miniCheck: [
      {
        question: '次のうち正しい表現はどれですか。',
        choices: ['an informations', 'much informations', 'some information', 'an information'],
        correctIndex: 2,
        explanation: 'informationは不可算名詞なので、someを使い、a/anや複数形は使いません。',
      },
    ],
  },
  {
    id: 'theory-l1-10',
    level: 1,
    tag: '代名詞',
    title: '代名詞',
    shortDescription: '名詞の繰り返しを避けるために使う語。',
    concept:
      '代名詞はすでに話題に出た名詞の代わりに使う語です。人称代名詞（I, you, he, she, it, we, they）には、主格（I）、所有格（my）、目的格（me）、所有代名詞（mine）の4つの形があり、文中の役割によって使い分けます。',
    rules: [{ title: '格によって形が変わる', explanation: '主語ならI/he/she、動詞や前置詞の後ならme/him/her、「〜の」ならmy/his/herのように形が変わります。' }],
    examples: [
      {
        english: 'The doctor gave her the results, and she thanked him.',
        japanese: '医師は彼女に結果を渡し、彼女は彼に感謝しました。',
        explanation: 'her（目的格）、she（主格）、him（目的格）と、役割によって代名詞の形が変わっている。',
      },
    ],
    keyPoints: ['所有格（my, her, hisなど）の後には必ず名詞が続く', 'itは物だけでなく、時間・天気を表す文の主語としても使われる'],
    commonMistakes: ['"Her is a nurse." のように、主語の位置に目的格を使ってしまう（正しくはShe is a nurse.）。'],
    relatedTermIds: ['term-pronoun', 'term-noun'],
    miniCheck: [
      {
        question: '"I gave ___ the book." の空所に入る正しい語はどれですか。',
        choices: ['he', 'his', 'him', 'himself'],
        correctIndex: 2,
        explanation: '動詞gaveの後（目的語の位置）なので、目的格のhimを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-11',
    level: 1,
    tag: '複数形',
    title: '名詞の複数形',
    shortDescription: '「2つ以上」を表す名詞の形。',
    concept:
      '可算名詞が2つ以上あることを表すには、語尾に-s/-esを付けて複数形にします。規則的な変化が多いですが、child→childrenのような不規則変化をする名詞もあります。',
    basicForm: '名詞 + s（多くの場合）',
    rules: [
      { title: '基本は-sを付ける', explanation: '多くの名詞はそのまま語尾に-sを付けます（book→books）。' },
      { title: '語尾によって-esや変化形になる', explanation: 's, x, ch, shで終わる語は-esを付け（box→boxes）、子音+yで終わる語はyをiに変えてesを付けます（city→cities）。不規則変化もあります（child→children, man→men）。' },
    ],
    examples: [
      {
        english: 'There are three doctors and two nurses in this clinic.',
        japanese: 'このクリニックには3人の医師と2人の看護師がいます。',
        explanation: 'doctors, nursesはどちらも規則的に-sを付けた複数形。',
      },
    ],
    keyPoints: ['複数形になると動詞もareなど複数扱いの形になる', '不規則変化は個別に覚える必要がある'],
    commonMistakes: ['childやmanのような不規則名詞に-sを付けてしまう（childs, mansという誤り）。'],
    relatedTermIds: ['term-plural', 'term-singular', 'term-noun'],
    miniCheck: [
      {
        question: '"child" の正しい複数形はどれですか。',
        choices: ['childs', 'childes', 'children', 'child'],
        correctIndex: 2,
        explanation: 'childの複数形は不規則変化でchildrenになります。',
      },
    ],
  },
  {
    id: 'theory-l1-12',
    level: 1,
    tag: '形容詞',
    title: '形容詞',
    shortDescription: '名詞の性質や状態を説明する語。',
    concept:
      '形容詞は名詞を直接修飾したり（a tall man）、be動詞などの後で主語の状態を説明したり（He is tall.）する語です。名詞の前に置く使い方と、補語として使う使い方の2種類を覚えましょう。',
    rules: [{ title: '2つの使い方', explanation: '名詞の直前に置く「限定用法」と、be動詞などの後に置く「叙述用法」の2つがあります。' }],
    examples: [
      {
        english: 'The patient looked very tired after the long surgery.',
        japanese: 'その患者は長い手術の後、とても疲れているように見えました。',
        structureBreakdown: {
          sentence: 'The patient looked very tired after the long surgery.',
          translationJa: 'その患者は長い手術の後、とても疲れているように見えました。',
          segments: [
            { text: 'The patient', role: '主語' },
            { text: 'looked', role: '動詞' },
            { text: 'very tired', role: '補語（形容詞、叙述用法）' },
            { text: 'after the long surgery', role: '修飾語（longは名詞surgeryを修飾、限定用法）' },
          ],
        },
      },
    ],
    keyPoints: ['形容詞自体は複数形にならない（tall booksであってtalls booksではない）', 'look, feel, soundなどの動詞の後は形容詞（副詞ではない）'],
    commonMistakes: ['"She felt happily." のように、feelの後に副詞を使ってしまう（正しくはShe felt happy.）。'],
    relatedTermIds: ['term-adjective', 'term-complement'],
    miniCheck: [
      {
        question: '"He looks ___ today." に入る正しい語はどれですか。',
        choices: ['tiredly', 'tired', 'tire', 'tiring quickly'],
        correctIndex: 1,
        explanation: 'lookの後で主語の状態を説明するときは形容詞tiredを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-13',
    level: 1,
    tag: '副詞',
    title: '副詞',
    shortDescription: '動詞・形容詞・文全体を修飾する語。',
    concept:
      '副詞は「どのように」「いつ」「どのくらい」といった情報を動詞や形容詞、文全体に加える語です。多くは形容詞に-lyを付けて作られますが（quick→quickly）、fast, hard, wellのように形が変わらないものもあります。',
    rules: [{ title: '動詞・形容詞・他の副詞を修飾', explanation: '副詞は名詞以外のほぼすべての品詞（動詞・形容詞・副詞・文全体）を修飾できます。' }],
    examples: [
      {
        english: 'The team responded quickly to the emergency.',
        japanese: 'そのチームは緊急事態に素早く対応しました。',
        structureBreakdown: {
          sentence: 'The team responded quickly to the emergency.',
          translationJa: 'そのチームは緊急事態に素早く対応しました。',
          segments: [
            { text: 'The team', role: '主語' },
            { text: 'responded', role: '動詞' },
            { text: 'quickly', role: '副詞（respondedを修飾）' },
            { text: 'to the emergency', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['形容詞+lyの形が多いが、例外（fast, hard, wellなど）もある', '頻度を表す副詞（always, usually, oftenなど）は一般動詞の前、be動詞の後に置く'],
    commonMistakes: ['"He runs very good." のように、動詞を修飾するのに形容詞goodを使ってしまう（正しくはHe runs very well.）。'],
    relatedTermIds: ['term-adverb', 'term-adjective'],
    miniCheck: [
      {
        question: '"She always ___ up early." に最も自然な位置と語はどれですか。',
        choices: ['always wakes', 'wakes always', 'always wake', 'wake always'],
        correctIndex: 0,
        explanation: '頻度を表す副詞alwaysは一般動詞の前に置き、主語sheに合わせてwakesとします。',
      },
    ],
  },
  {
    id: 'theory-l1-14',
    level: 1,
    tag: '前置詞',
    title: '前置詞（in / on / at など）',
    shortDescription: '名詞の前に置いて時・場所・方向などの関係を表す語。',
    concept:
      '前置詞は名詞（句）の前に置かれ、時間・場所・手段などの関係を表します。特に時を表すat（時刻）、on（曜日・日付）、in（月・年・広い場所）の使い分けはよく問われます。',
    rules: [
      { title: 'at・on・inの基本', explanation: 'at＝時刻や地点、on＝曜日・日付や面、in＝月・年や広い場所、という基本の使い分けがあります。' },
    ],
    examples: [
      {
        english: 'The meeting starts at nine on Monday in March.',
        japanese: '会議は3月の月曜日の9時に始まります。',
        structureBreakdown: {
          sentence: 'The meeting starts at nine on Monday in March.',
          translationJa: '会議は3月の月曜日の9時に始まります。',
          segments: [
            { text: 'The meeting starts', role: '主語+動詞' },
            { text: 'at nine', role: '前置詞句（時刻）' },
            { text: 'on Monday', role: '前置詞句（曜日）' },
            { text: 'in March', role: '前置詞句（月）' },
          ],
        },
      },
    ],
    keyPoints: ['前置詞+名詞のまとまりを「前置詞句」と呼び、修飾語として働く', '決まった組み合わせ（depend on, interested inなど）は熟語として覚える'],
    commonMistakes: ['"at Monday" のように、曜日にatを使ってしまう（正しくはon Monday）。'],
    relatedTermIds: ['term-preposition', 'term-modifier'],
    miniCheck: [
      {
        question: '"I was born ___ 1998." に入る正しい前置詞はどれですか。',
        choices: ['at', 'on', 'in', 'by'],
        correctIndex: 2,
        explanation: '年（1998）にはinを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-15',
    level: 1,
    tag: '三単現',
    title: '三人称単数現在形（三単現のs）',
    shortDescription: '主語がhe/she/itのとき、一般動詞の語尾にs/esを付けるルール。',
    concept:
      '主語がhe, she, itなど「三人称・単数」で、文が現在形のときだけ、一般動詞の語尾にs（またはes）を付けます。この「三単現のs」は英語学習で最も間違えやすいポイントの一つなので、主語を見たら必ずチェックする習慣をつけましょう。',
    basicForm: '三人称単数の主語 + 動詞 + s/es',
    rules: [
      { title: '主語がI/you/we/theyのときは付けない', explanation: 'sが付くのは主語が三人称単数のときだけで、それ以外の主語には付きません。' },
      { title: '語尾によってesやyの変化がある', explanation: 's, x, ch, shで終わる語は-esを付け（wash→washes）、子音+yで終わる語はyをiに変えてesを付けます（study→studies）。' },
    ],
    examples: [
      {
        english: 'The nurse checks the patient\'s pulse every hour.',
        japanese: 'その看護師は1時間ごとに患者の脈を確認します。',
        structureBreakdown: {
          sentence: 'The nurse checks the patient\'s pulse every hour.',
          translationJa: 'その看護師は1時間ごとに患者の脈を確認します。',
          segments: [
            { text: 'The nurse', role: '主語（三人称単数）' },
            { text: 'checks', role: '動詞（三単現のs）' },
            { text: "the patient's pulse", role: '目的語' },
            { text: 'every hour', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['haveは特殊でhasになる', '主語が複数（people, they など）のときはsを付けない'],
    commonMistakes: ['"The nurse check..." のように、三人称単数の主語なのにsを付け忘れる。'],
    relatedTermIds: ['term-general-verb', 'term-present-tense'],
    miniCheck: [
      {
        question: '"My father ___ a car every weekend." に入る正しい形はどれですか。',
        choices: ['wash', 'washs', 'washes', 'washing'],
        correctIndex: 2,
        explanation: 'washはshで終わるので、三単現はesを付けてwashesになります。',
      },
    ],
  },
  {
    id: 'theory-l1-16',
    level: 1,
    tag: '過去形',
    title: '過去形',
    shortDescription: '過去に起きた動作・状態を表す動詞の形。',
    concept:
      '過去形は「〜した」「〜だった」のように、過去のある時点で起きた出来事や状態を表します。規則動詞は語尾に-edを付けますが、不規則動詞は独自の変化をするので、よく使う不規則動詞は少しずつ覚えていく必要があります。',
    basicForm: '規則動詞: 動詞 + ed / 不規則動詞: 個別の形（go→went など）',
    rules: [
      { title: '規則動詞は-edを付ける', explanation: 'work→worked, study→studiedのように、多くの動詞は語尾に-edを付けます。' },
      { title: '不規則動詞は形が変わる', explanation: 'go→went, see→saw, have→hadのように、決まった形に変化する動詞があります。' },
    ],
    examples: [
      {
        english: 'The patient visited the clinic last week and received a checkup.',
        japanese: 'その患者は先週クリニックを訪れ、健康診断を受けました。',
        explanation: 'visitedは規則動詞（+ed）、receivedも規則動詞（+ed）。',
      },
    ],
    keyPoints: ['過去形はbe動詞・一般動詞ともに主語による形の違いがない（wasとwereを除く）', '否定文・疑問文はdidを使い、動詞は原形に戻す'],
    commonMistakes: ['"I didn\'t went there." のように、didn\'tを使ったのに動詞を過去形のままにしてしまう（正しくはdidn\'t go）。'],
    relatedTermIds: ['term-past-tense', 'term-base-form'],
    miniCheck: [
      {
        question: '"go" の過去形はどれですか。',
        choices: ['goed', 'went', 'gone', 'going'],
        correctIndex: 1,
        explanation: 'goは不規則動詞で、過去形はwentです。',
      },
    ],
  },
  {
    id: 'theory-l1-17',
    level: 1,
    tag: '未来',
    title: '未来を表す表現（will / be going to）',
    shortDescription: 'willとbe going toで未来のことを表す。',
    concept:
      '未来のことはwill＋動詞の原形、またはbe going to＋動詞の原形で表します。willはその場で決めたことや予測を、be going toはすでに決めていた予定や根拠のある予測を表すことが多いという使い分けがあります。',
    basicForm: '主語 + will + 動詞の原形 / 主語 + be動詞 + going to + 動詞の原形',
    rules: [
      { title: 'willはその場の判断・予測', explanation: '話している今、その場で決めたことや、確信のない予測にはwillを使います。' },
      { title: 'be going toは既定の予定', explanation: 'すでに決まっている予定や、根拠のある予測にはbe going toを使います。' },
    ],
    examples: [
      {
        english: 'She is going to see a doctor this afternoon.',
        japanese: '彼女は今日の午後、医者に診てもらう予定です。',
        explanation: 'すでに決まっている予定なのでbe going toを使う。',
      },
    ],
    keyPoints: ['未来を表す語（tomorrow, next weekなど）と一緒に使われることが多い', '否定文はwill not（won\'t）/ be動詞+not going to'],
    commonMistakes: ['"I will going to..." のように、willとbe going toを混ぜて使ってしまう。'],
    relatedTermIds: ['term-future'],
    miniCheck: [
      {
        question: '電話が鳴った瞬間に「私が出ます」と言うとき、自然な表現はどれですか。',
        choices: ['I am going to answer it.', 'I will answer it.', 'I answer it.', 'I answered it.'],
        correctIndex: 1,
        explanation: 'その場で決めた判断にはwillを使うのが自然です。',
      },
    ],
  },
  {
    id: 'theory-l1-18',
    level: 1,
    tag: '現在進行形',
    title: '現在進行形（be動詞＋ing）',
    shortDescription: '「今まさに〜している」ことを表す。',
    concept:
      '現在進行形は発話の瞬間に進行中の動作を表します。「今、この瞬間」に焦点がある点が、習慣を表す現在形との大きな違いです。動詞の原形にingを付けて作りますが、eで終わる語はeを取ってingを付けます。',
    basicForm: '主語 + am/is/are + 動詞のing形',
    rules: [
      { title: '進行中の動作を表す', explanation: '今まさに起きていること、一時的に続いていることを表します。' },
      { title: 'ing形の作り方に注意', explanation: 'makeのようにeで終わる語はeを取ってing（making）、runのように短母音+子音で終わる語は子音を重ねてing（running）にします。' },
    ],
    examples: [
      {
        english: 'The doctor is examining a patient right now.',
        japanese: '医師は今まさに患者を診察しています。',
        structureBreakdown: {
          sentence: 'The doctor is examining a patient right now.',
          translationJa: '医師は今まさに患者を診察しています。',
          segments: [
            { text: 'The doctor', role: '主語' },
            { text: 'is examining', role: 'be動詞+動詞ing' },
            { text: 'a patient', role: '目的語' },
            { text: 'right now', role: '修飾語（現在進行中を示す）' },
          ],
        },
      },
    ],
    keyPoints: ['like, know, wantなど「状態」を表す動詞は基本的に進行形にしない', 'now, right nowなどの語と一緒に使われることが多い'],
    commonMistakes: ['"I am knowing him." のように状態動詞を進行形にしてしまう（正しくはI know him.）。'],
    relatedTermIds: ['term-present-progressive', 'term-present-participle'],
    miniCheck: [
      {
        question: '"Look! The baby ___ !" に自然な形はどれですか。',
        choices: ['sleeps', 'is sleeping', 'sleep', 'slept'],
        correctIndex: 1,
        explanation: '「見て、今眠っている」という今この瞬間の動作なので現在進行形を使います。',
      },
    ],
  },
  {
    id: 'theory-l1-19',
    level: 1,
    tag: '過去進行形',
    title: '過去進行形',
    shortDescription: '過去のある時点で進行していた動作を表す。',
    concept:
      '過去進行形（was/were + 動詞のing形）は過去のある時点において進行中だった動作を表します。「〜していたとき、別のことが起きた」という文脈（when節など）でよく使われ、背景となる動作と、それに割り込んだ出来事を対比させます。',
    basicForm: '主語 + was/were + 動詞のing形',
    rules: [{ title: '背景の動作と割り込む出来事', explanation: '過去進行形（背景）＋過去形（割り込んだ出来事）の組み合わせがよく使われます。' }],
    examples: [
      {
        english: 'She was sleeping when the phone rang.',
        japanese: '電話が鳴ったとき、彼女は眠っていました。',
        explanation: 'was sleeping（背景の動作、過去進行形）とrang（割り込んだ出来事、過去形）の対比。',
      },
    ],
    keyPoints: ['whenやwhileと一緒によく使われる', '2つの動作が同時に進行していたことを表すこともある'],
    commonMistakes: ['背景の動作と割り込んだ出来事の時制を逆にしてしまう（She slept when the phone was ringing.のような不自然な組み合わせ）。'],
    relatedTermIds: ['term-past-progressive', 'term-present-progressive'],
    miniCheck: [
      {
        question: '「私が到着したとき、彼らは会議をしていました」を正しく表すのはどれですか。',
        choices: [
          'They had a meeting when I arrived.',
          'They were having a meeting when I arrived.',
          'They have a meeting when I arrived.',
          'They are having a meeting when I arrived.',
        ],
        correctIndex: 1,
        explanation: '背景の動作（会議をしていた）には過去進行形を使います。',
      },
    ],
  },
  {
    id: 'theory-l1-20',
    level: 1,
    tag: '助動詞',
    title: '助動詞 can / must / should',
    shortDescription: '動詞の前に置いて「できる」「〜すべき」などの意味を加える語。',
    concept:
      '助動詞は一般動詞やbe動詞の前に置かれ、可能性・義務・助言などの意味を追加します。canは「〜できる」、mustは「〜しなければならない」、shouldは「〜すべきだ」を表し、助動詞の直後の動詞は必ず原形になります。',
    basicForm: '主語 + 助動詞 + 動詞の原形',
    rules: [{ title: '助動詞の後は必ず原形', explanation: '助動詞の後に来る動詞は、主語が何であっても常に原形です（三単現のsも付きません）。' }],
    examples: [
      {
        english: 'Patients must take this medicine twice a day.',
        japanese: '患者はこの薬を1日2回服用しなければなりません。',
        structureBreakdown: {
          sentence: 'Patients must take this medicine twice a day.',
          translationJa: '患者はこの薬を1日2回服用しなければなりません。',
          segments: [
            { text: 'Patients', role: '主語' },
            { text: 'must', role: '助動詞（義務）' },
            { text: 'take', role: '動詞の原形' },
            { text: 'this medicine', role: '目的語' },
          ],
        },
      },
    ],
    keyPoints: ['否定文は助動詞の後にnotを置く（cannot, must not）', 'mustの過去形はなく、had toで代用する'],
    commonMistakes: ['"He can plays..." のように、助動詞の後の動詞にsを付けてしまう。'],
    relatedTermIds: ['term-auxiliary-verb', 'term-base-form'],
    miniCheck: [
      {
        question: '"You ___ rest for a while." で「休むべきだ」を表す正しい助動詞はどれですか。',
        choices: ['can', 'must', 'should', 'will'],
        correctIndex: 2,
        explanation: '「〜すべきだ」という助言にはshouldを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-21',
    level: 1,
    tag: 'There is/are',
    title: 'There is / There are 構文',
    shortDescription: '「〜がある/いる」と存在を伝える。',
    concept:
      'There is（単数・数えられない名詞）またはThere are（複数）を使って、聞き手がまだ知らない何かの存在を伝えます。thereはここでは「そこ」という意味ではなく、形式的な主語で、実際の主語（意味上の主語）はbe動詞の後ろの名詞です。',
    basicForm: 'There is + 単数名詞 ... / There are + 複数名詞 ...',
    rules: [{ title: 'be動詞は後ろの名詞に合わせる', explanation: 'is/areは、thereの後ではなく、その後に続く名詞（意味上の主語）の数に合わせます。' }],
    examples: [
      {
        english: 'There are three nurses on duty tonight.',
        japanese: '今夜は3人の看護師が勤務しています。',
        structureBreakdown: {
          sentence: 'There are three nurses on duty tonight.',
          translationJa: '今夜は3人の看護師が勤務しています。',
          segments: [
            { text: 'There', role: '形式上の主語' },
            { text: 'are', role: 'be動詞（複数に合わせる）' },
            { text: 'three nurses', role: '意味上の主語' },
            { text: 'on duty tonight', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['特定できるもの（the, my などが付く名詞）にはふつう使わない', '過去のことはThere was/thereで表す'],
    commonMistakes: ['"There is three nurses." のように、後ろの名詞が複数なのにisを使ってしまう。'],
    relatedTermIds: ['term-there-is-are', 'term-plural'],
    miniCheck: [
      {
        question: '"___ a hospital near my house." に入る正しい語はどれですか。',
        choices: ['There is', 'There are', 'It is', 'This is'],
        correctIndex: 0,
        explanation: '後ろのa hospitalは単数なので、There isを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-22',
    level: 1,
    tag: '比較の基礎',
    title: '比較の基礎（比較級・最上級）',
    shortDescription: '2つ・3つ以上を比べる表現の第一歩。',
    concept:
      '「AはBより〜だ」と比べるときは比較級（-er / more）、「一番〜だ」というときは最上級（-est / most）を使います。短い語は語尾を変化させ、長い語はmore/mostを前に置きます。',
    basicForm: '比較級: 形容詞+er（またはmore+形容詞）+ than / 最上級: the+形容詞+est（またはthe most+形容詞）',
    rules: [
      { title: '短い語は-er/-est', explanation: 'fast→faster→fastestのように、1〜2音節の短い語は語尾を変化させます。' },
      { title: '長い語はmore/most', explanation: 'important→more important→most importantのように、長い語はmore/mostを前に置きます。' },
    ],
    examples: [
      {
        english: 'This medicine is more effective than the previous one.',
        japanese: 'この薬は以前のものより効果的です。',
        explanation: 'effectiveは長い語なので、more effectiveという比較級になる。',
      },
    ],
    keyPoints: ['比較級の後にはthanで比較対象を示す', '最上級の前にはふつうtheを付ける'],
    commonMistakes: ['"more faster" のように、-erとmoreを両方使ってしまう二重比較級。'],
    relatedTermIds: ['term-comparative', 'term-superlative'],
    miniCheck: [
      {
        question: '"important" の比較級として正しいのはどれですか。',
        choices: ['importanter', 'more important', 'most important', 'importantest'],
        correctIndex: 1,
        explanation: 'importantは長い語なので、moreを前に置いて比較級を作ります。',
      },
    ],
  },
  {
    id: 'theory-l1-23',
    level: 1,
    tag: '不定詞の基礎',
    title: '不定詞（to + 動詞の原形）の基礎',
    shortDescription: '「to + 動詞の原形」でさまざまな意味を表す形の入門。',
    concept:
      '不定詞（to + 動詞の原形）は「〜すること」「〜するための」「〜するために」のように、文の中でいろいろな役割を果たします。ここではまず「〜すること」（名詞的用法）と「〜するために」（副詞的用法、目的）の基本を押さえましょう。',
    basicForm: 'to + 動詞の原形',
    rules: [
      { title: '名詞的用法：〜すること', explanation: '不定詞が動詞の目的語や文の主語になり、「〜すること」という意味を表します。' },
      { title: '副詞的用法：〜するために', explanation: '「なぜその動作をしたか」という目的を表すときに使います。' },
    ],
    examples: [
      {
        english: 'He went to the hospital to see his grandmother.',
        japanese: '彼は祖母に会うために病院へ行きました。',
        explanation: 'to see his grandmotherは「〜するために」という目的を表す副詞的用法。',
      },
    ],
    keyPoints: ['不定詞の後の動詞は必ず原形', 'want to, like to, need toなど、動詞+to不定詞の組み合わせをよく使う'],
    commonMistakes: ['"to seeing" のように、不定詞の後にing形を使ってしまう。'],
    relatedTermIds: ['term-infinitive-noun', 'term-infinitive-adverb'],
    miniCheck: [
      {
        question: '「英語を勉強するために日本に来ました」を表す正しい文はどれですか。',
        choices: [
          'I came to Japan for study English.',
          'I came to Japan to study English.',
          'I came to Japan studying English.',
          'I came to Japan to studying English.',
        ],
        correctIndex: 1,
        explanation: '目的を表す副詞的用法はto + 動詞の原形で表します。',
      },
    ],
  },
  {
    id: 'theory-l1-24',
    level: 1,
    tag: '動名詞の基礎',
    title: '動名詞（動詞のing形）の基礎',
    shortDescription: '「〜すること」を名詞のように表す動詞のing形。',
    concept:
      '動名詞は動詞に-ingを付けた形で、名詞と同じように主語や目的語になります。「〜すること」と訳すと自然な場合が多く、enjoy, finishなどの動詞は目的語に動名詞だけを取ります。',
    basicForm: '動詞のing形（名詞として）',
    rules: [{ title: '主語・目的語になる', explanation: '動名詞は文の主語や、動詞・前置詞の目的語として使われます。' }],
    examples: [
      {
        english: 'Reading medical journals takes a lot of time.',
        japanese: '医学雑誌を読むことは多くの時間がかかります。',
        explanation: 'Reading medical journalsが文全体の主語になっている。',
      },
    ],
    keyPoints: ['enjoy, finish, avoidなどは目的語に動名詞のみを取る', 'want, decideなどは目的語に不定詞のみを取る（この違いは今後学んでいく）'],
    commonMistakes: ['"enjoy to swim" のように、動名詞のみを取る動詞に不定詞を使ってしまう（正しくはenjoy swimming）。'],
    relatedTermIds: ['term-gerund', 'term-infinitive-noun'],
    miniCheck: [
      {
        question: '"She enjoys ___ the piano." に入る正しい形はどれですか。',
        choices: ['play', 'to play', 'playing', 'played'],
        correctIndex: 2,
        explanation: 'enjoyは目的語に動名詞を取る動詞です。',
      },
    ],
  },
  {
    id: 'theory-l1-25',
    level: 1,
    tag: '受動態の基礎',
    title: '受動態の基礎（be動詞+過去分詞）',
    shortDescription: '「〜される」と、動作を受ける側を主語にする表現の入門。',
    concept:
      '受動態（be動詞 + 過去分詞）は「〜する」側ではなく「〜される」側を主語にする表現です。動作をする人が誰か分からない、または重要でないときによく使われます。',
    basicForm: '主語（〜される側） + be動詞 + 過去分詞',
    rules: [{ title: 'be動詞は主語と時制に合わせる', explanation: 'be動詞は主語の人称・数と、文の時制（現在・過去）に合わせて変化させます。' }],
    examples: [
      {
        english: 'This medicine is taken twice a day.',
        japanese: 'この薬は1日2回服用されます。',
        structureBreakdown: {
          sentence: 'This medicine is taken twice a day.',
          translationJa: 'この薬は1日2回服用されます。',
          segments: [
            { text: 'This medicine', role: '主語（動作を受ける側）' },
            { text: 'is taken', role: 'be動詞+過去分詞' },
            { text: 'twice a day', role: '修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['動作をする人を示すときはby ...を使う', '過去分詞は規則動詞なら過去形と同じ-ed、不規則動詞は個別の形'],
    commonMistakes: ['"is take" のように、be動詞の後を過去分詞ではなく原形にしてしまう。'],
    relatedTermIds: ['term-passive-voice', 'term-past-participle'],
    miniCheck: [
      {
        question: '"This building ___ in 1990." に入る正しい形はどれですか。',
        choices: ['built', 'was built', 'builds', 'is building'],
        correctIndex: 1,
        explanation: '「建てられた」という受け身の過去なので、was builtを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-26',
    level: 1,
    tag: '現在完了の基礎',
    title: '現在完了の基礎（have + 過去分詞）',
    shortDescription: '過去の出来事が現在とつながっていることを示す表現の入門。',
    concept:
      '現在完了（have/has + 過去分詞）は過去に起きたことが現在に何らかの形で関係していることを表します。まずは「もう〜した（完了）」という使い方から始めましょう。',
    basicForm: '主語 + have/has + 過去分詞',
    rules: [{ title: '主語で have/has を使い分ける', explanation: '主語が三人称単数のときはhas、それ以外はhaveを使います。' }],
    examples: [
      {
        english: 'She has already finished the report.',
        japanese: '彼女はすでにその報告書を終えています。',
        explanation: 'has finishedで「すでに終えた（完了）」という状態を表す。',
      },
    ],
    keyPoints: ['「いつ」を明示するyesterdayなどとは一緒に使えない', 'alreadyやyetと一緒によく使われる'],
    commonMistakes: ['"I have finished it yesterday." のように、現在完了と過去を示す語を一緒に使ってしまう。'],
    relatedTermIds: ['term-present-perfect', 'term-past-participle'],
    miniCheck: [
      {
        question: '"He ___ already left the hospital." に入る正しい語はどれですか。',
        choices: ['have', 'has', 'is', 'was'],
        correctIndex: 1,
        explanation: '主語Heは三人称単数なのでhasを使います。',
      },
    ],
  },
  {
    id: 'theory-l1-27',
    level: 1,
    tag: '接続詞',
    title: '接続詞（and / but / because / so）',
    shortDescription: '語・句・節をつなぐ語。',
    concept:
      '接続詞は語と語、句と句、文と文をつなぐ働きをします。and（そして）、but（しかし）、because（なぜなら、理由）、so（だから、結果）は最初に覚えるべき基本の接続詞です。',
    rules: [{ title: 'becauseの後は理由、soの後は結果', explanation: 'becauseの後には理由を表す文が、soの後には結果を表す文が続きます。' }],
    examples: [
      {
        english: 'She stayed home because she had a fever, so she missed the meeting.',
        japanese: '熱があったので彼女は家にいて、そのため会議を欠席しました。',
        explanation: 'because（理由）とso（結果）がそれぞれ節をつないでいる。',
      },
    ],
    keyPoints: ['andとbutは対等な要素をつなぐ', 'becauseは従属節を作り、主節の前にも後にも置ける'],
    commonMistakes: ['"Because it was raining, so I stayed home." のように、becauseとsoを1つの文に両方使ってしまう（英語ではどちらか一方だけでよい）。'],
    relatedTermIds: ['term-conjunction', 'term-causal-connector'],
    miniCheck: [
      {
        question: '「疲れていたので早く寝ました」を表す自然な文はどれですか。',
        choices: [
          'I was tired, but I went to bed early.',
          'I was tired, so I went to bed early.',
          'I was tired, and I went to bed early.',
          'I was tired because I went to bed early.',
        ],
        correctIndex: 1,
        explanation: '「疲れていた」という理由の結果として「早く寝た」ので、soでつなぐのが自然です。',
      },
    ],
  },
  {
    id: 'theory-l1-28',
    level: 1,
    tag: '関係代名詞の基礎',
    title: '関係代名詞の基礎（who / which / that）',
    shortDescription: '前の名詞を説明する節を作る語の入門。',
    concept:
      '関係代名詞（who, which, that）は直前の名詞（先行詞）を説明する節を導きます。2つの文を1つにまとめて、より詳しい説明を加えることができる、少し高度な文の作り方です。',
    basicForm: '名詞（先行詞） + 関係代名詞 + 動詞...',
    rules: [
      { title: '先行詞が人ならwho', explanation: '先行詞が人のときはwho（またはthat）を使います。' },
      { title: '先行詞が物ならwhich', explanation: '先行詞が物や動物のときはwhich（またはthat）を使います。' },
    ],
    examples: [
      {
        english: 'The doctor who treated me was very kind.',
        japanese: '私を治療してくれた医師はとても親切でした。',
        structureBreakdown: {
          sentence: 'The doctor who treated me was very kind.',
          translationJa: '私を治療してくれた医師はとても親切でした。',
          segments: [
            { text: 'The doctor', role: '先行詞' },
            { text: 'who treated me', role: '関係代名詞節（The doctorを修飾）' },
            { text: 'was very kind', role: '主節の動詞+補語' },
          ],
        },
      },
    ],
    keyPoints: ['thatはwho/whichのどちらの代わりにも使える', '関係代名詞節の中では、その関係代名詞自体が主語や目的語の役割をしている'],
    commonMistakes: ['"The doctor who he treated me..." のように、関係代名詞に加えて余分な代名詞heを入れてしまう。'],
    relatedTermIds: ['term-relative-pronoun', 'term-adjective-clause'],
    miniCheck: [
      {
        question: '"This is the book ___ I bought yesterday." に入る正しい語はどれですか。',
        choices: ['who', 'which', 'where', 'what'],
        correctIndex: 1,
        explanation: '先行詞the bookは物なので、whichを使います。',
      },
    ],
  },
];
