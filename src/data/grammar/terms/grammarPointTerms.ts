import type { GrammarTerm } from '../../../types';

export const grammarPointTerms: GrammarTerm[] = [
  {
    id: 'term-negative',
    term: '否定文',
    category: 'grammar-point',
    oneLiner: '「〜ではない」「〜しない」を表す文。',
    explanation:
      'be動詞の否定文はbe動詞の後ろにnotを置くだけ（is not / are not）。一般動詞の否定文はdo not（don\'t）またはdoes not（doesn\'t）を動詞の前に置き、動詞は原形に戻します。助動詞がある文はその助動詞の後にnotを置きます（cannot / must not）。',
    example: {
      english: 'She does not like coffee.',
      japanese: '彼女はコーヒーが好きではありません。',
      breakdown: ['She = 主語', 'does not = 否定の助動詞', 'like = 動詞の原形'],
    },
    relatedTermIds: ['term-general-verb', 'term-auxiliary-verb'],
  },
  {
    id: 'term-question',
    term: '疑問文',
    category: 'grammar-point',
    oneLiner: '相手に問いかける文。文頭の語で作り方が変わる。',
    explanation:
      'be動詞の疑問文は主語とbe動詞を入れ替えます（Is she...?）。一般動詞はDo/Doesを文頭に置き動詞を原形に戻します。助動詞がある文はその助動詞を文頭に出します。疑問詞（What, Whoなど）を使う場合は疑問詞を最初に置き、その後に通常の疑問文の語順を続けます。',
    example: {
      english: 'Does he work at this hospital?',
      japanese: '彼はこの病院で働いていますか。',
      breakdown: ['Does = 疑問文を作る助動詞', 'he = 主語', 'work = 動詞の原形'],
    },
    relatedTermIds: ['term-interrogative', 'term-indirect-question'],
  },
  {
    id: 'term-imperative',
    term: '命令文',
    category: 'grammar-point',
    oneLiner: '主語を省略し、動詞の原形で始める指示・依頼の文。',
    explanation:
      '命令文は聞き手（you）に対する指示・依頼を表し、主語を省略して動詞の原形で文を始めます。否定の命令文はDon\'tを動詞の前に置きます。丁寧に言うときはpleaseを添えますが、文法的な形は変わりません。',
    example: {
      english: 'Please take this medicine after meals.',
      japanese: '食後にこの薬を服用してください。',
      breakdown: ['Please = 丁寧さを添える語', 'take = 動詞の原形（主語youが省略）', 'this medicine = 目的語'],
    },
    relatedTermIds: ['term-base-form'],
  },
  {
    id: 'term-present-progressive',
    term: '現在進行形',
    category: 'grammar-point',
    oneLiner: '「今まさにしている」動作を表す、be動詞+動詞ing。',
    explanation:
      '現在進行形（am/is/are + 動詞のing形）は発話の瞬間に進行中の動作を表します。習慣ではなく「今、この瞬間」に焦点があることが現在形との大きな違いです。likeやknowのような状態動詞は基本的に進行形にしません。',
    example: {
      english: 'The doctor is examining a patient right now.',
      japanese: '医師は今まさに患者を診察しています。',
      breakdown: ['The doctor = 主語', 'is examining = be動詞+動詞ing', 'right now = 現在進行中を示す語'],
    },
    relatedTermIds: ['term-present-participle', 'term-past-progressive'],
  },
  {
    id: 'term-past-progressive',
    term: '過去進行形',
    category: 'grammar-point',
    oneLiner: '過去のある時点で進行していた動作を表す、was/were+動詞ing。',
    explanation:
      '過去進行形（was/were + 動詞のing形）は過去のある時点において進行中だった動作を表します。「〜していたとき、別のことが起きた」という文脈（when節など）でよく使われます。',
    example: {
      english: 'She was sleeping when the phone rang.',
      japanese: '電話が鳴ったとき、彼女は眠っていました。',
      breakdown: ['She was sleeping = 過去進行形（背景の動作）', 'when the phone rang = 過去形（割り込んだ出来事）'],
    },
    relatedTermIds: ['term-present-progressive', 'term-past-tense'],
  },
  {
    id: 'term-future',
    term: '未来表現',
    category: 'grammar-point',
    oneLiner: 'will や be going to を使って未来のことを表す方法。',
    explanation:
      '未来のことはwill＋動詞の原形、またはbe going to＋動詞の原形で表します。willはその場で決めたことや予測を、be going toはすでに決めていた予定や、根拠のある予測を表すことが多いという使い分けがあります。',
    example: {
      english: 'She is going to see a doctor this afternoon.',
      japanese: '彼女は今日の午後、医者に診てもらう予定です。',
      breakdown: ['is going to see = すでに決まっている予定', 'this afternoon = 未来を示す語'],
    },
    relatedTermIds: ['term-future-perfect'],
  },
  {
    id: 'term-there-is-are',
    term: 'There is/are構文',
    category: 'grammar-point',
    oneLiner: '「〜がある/いる」と存在を伝える構文。',
    explanation:
      'There is（単数・数えられない名詞）またはThere are（複数）を使って、聞き手がまだ知らない何かの存在を伝えます。thereはここでは「そこ」という意味ではなく、文法上の形式的な主語です。実際の主語（意味上の主語）はbe動詞の後ろの名詞です。',
    example: {
      english: 'There are three nurses on duty tonight.',
      japanese: '今夜は3人の看護師が勤務しています。',
      breakdown: ['There = 形式上の主語', 'are = be動詞（複数に合わせる）', 'three nurses = 意味上の主語'],
    },
    relatedTermIds: ['term-plural'],
  },
  {
    id: 'term-present-perfect',
    term: '現在完了',
    category: 'grammar-point',
    oneLiner: '過去の出来事が現在とつながっていることを示す、have+過去分詞。',
    explanation:
      '現在完了（have/has + 過去分詞）は過去に起きたことが現在に何らかの形で関係している（完了・経験・継続・結果）ことを表します。「いつ」を明示するyesterdayなどとは一緒に使えません。',
    example: {
      english: 'She has already finished the report.',
      japanese: '彼女はすでにその報告書を終えています。',
      breakdown: ['has finished = 現在完了（完了）', 'already = 完了を強調する副詞'],
    },
    relatedTermIds: ['term-past-participle', 'term-past-perfect'],
  },
  {
    id: 'term-present-perfect-progressive',
    term: '現在完了進行形',
    category: 'grammar-point',
    oneLiner: '過去から今まで続いている動作を強調する、have been+動詞ing。',
    explanation:
      '現在完了進行形（have/has been + 動詞のing形）は、過去のある時点から現在まで動作がずっと続いていることを強調します。現在完了（継続用法）が状態の継続を表すのに対し、こちらは動作そのものの継続に焦点があります。',
    example: {
      english: 'They have been waiting for two hours.',
      japanese: '彼らは2時間ずっと待ち続けています。',
      breakdown: ['have been waiting = 現在完了進行形', 'for two hours = 継続期間'],
    },
    relatedTermIds: ['term-present-perfect'],
  },
  {
    id: 'term-past-perfect',
    term: '過去完了',
    category: 'grammar-point',
    oneLiner: '過去のある時点より、さらに前に起きたことを表す、had+過去分詞。',
    explanation:
      '過去完了（had + 過去分詞）は過去の基準時点よりも前に起きた出来事を表し、2つの過去の出来事の前後関係をはっきりさせます。「AがBより先に起きた」というとき、Aを過去完了、Bを過去形で表します。',
    example: {
      english: 'The patient had already left when the doctor arrived.',
      japanese: '医師が到着したとき、その患者はすでに帰っていました。',
      breakdown: ['had left = 過去完了（より前の出来事）', 'arrived = 過去形（基準となる時点）'],
    },
    relatedTermIds: ['term-present-perfect', 'term-future-perfect'],
  },
  {
    id: 'term-future-perfect',
    term: '未来完了',
    category: 'grammar-point',
    oneLiner: '未来のある時点までに完了しているであろうことを表す、will have+過去分詞。',
    explanation:
      '未来完了（will have + 過去分詞）は未来のある時点までに、動作や状態が完了・継続しているだろうことを表します。「By the time...（〜するまでには）」といった未来の基準点と一緒に使われることが多い形です。',
    example: {
      english: 'By next year, she will have graduated from medical school.',
      japanese: '来年までには、彼女は医学部を卒業しているでしょう。',
      breakdown: ['By next year = 未来の基準時点', 'will have graduated = 未来完了'],
    },
    relatedTermIds: ['term-past-perfect', 'term-future'],
  },
  {
    id: 'term-passive-voice',
    term: '受動態',
    category: 'grammar-point',
    oneLiner: '「〜される」と、動作を受ける側を主語にする表現。',
    explanation:
      '受動態（be動詞 + 過去分詞）は動作を「する側」ではなく「される側」を主語にする表現です。動作主を示す必要があるときはby ...を使いますが、動作主が不明・重要でない場合は省略されることが多く、医療・研究英語で頻出します。',
    example: {
      english: 'The patient was treated with antibiotics.',
      japanese: 'その患者は抗生物質で治療されました。',
      breakdown: ['The patient = 動作を受ける側（主語）', 'was treated = be動詞+過去分詞', 'with antibiotics = 手段'],
    },
    relatedTermIds: ['term-past-participle'],
  },
  {
    id: 'term-infinitive-noun',
    term: '不定詞の名詞的用法',
    category: 'grammar-point',
    oneLiner: '「〜すること」という意味で、名詞と同じように働くto+動詞の原形。',
    explanation:
      'to不定詞は名詞のように主語・目的語・補語になることができます。「〜すること」と訳すと自然な場合はこの用法です。動名詞（-ing）と似た意味になることもありますが、動詞によって不定詞しか使えない・動名詞しか使えないという制限があります。',
    example: {
      english: 'To become a doctor requires many years of study.',
      japanese: '医師になることは何年もの勉強を必要とします。',
      breakdown: ['To become a doctor = 不定詞の名詞的用法（主語）', 'requires = 動詞'],
    },
    relatedTermIds: ['term-gerund', 'term-infinitive-adjective', 'term-infinitive-adverb'],
  },
  {
    id: 'term-infinitive-adjective',
    term: '不定詞の形容詞的用法',
    category: 'grammar-point',
    oneLiner: '「〜するための」と、直前の名詞を修飾するto+動詞の原形。',
    explanation:
      'to不定詞が直前の名詞を後ろから修飾し、「〜するための」「〜すべき」という意味を加える用法です。something to drink（飲むための何か）のように、代名詞や名詞の後ろに置かれます。',
    example: {
      english: 'She has a lot of work to finish today.',
      japanese: '彼女には今日終わらせるべき仕事がたくさんあります。',
      breakdown: ['a lot of work = 名詞', 'to finish today = 不定詞の形容詞的用法（workを修飾）'],
    },
    relatedTermIds: ['term-infinitive-noun', 'term-infinitive-adverb'],
  },
  {
    id: 'term-infinitive-adverb',
    term: '不定詞の副詞的用法',
    category: 'grammar-point',
    oneLiner: '「〜するために」など、目的・感情の原因を表すto+動詞の原形。',
    explanation:
      'to不定詞が動詞や形容詞を修飾し、「〜するために」（目的）、「〜して…だ」（感情の原因）などを表す用法です。文全体、または特定の動詞・形容詞にかかる形で使われます。',
    example: {
      english: 'He went to the hospital to see his grandmother.',
      japanese: '彼は祖母に会うために病院へ行きました。',
      breakdown: ['He went to the hospital = 主節', 'to see his grandmother = 不定詞の副詞的用法（目的）'],
    },
    relatedTermIds: ['term-infinitive-noun', 'term-infinitive-adjective'],
  },
  {
    id: 'term-gerund',
    term: '動名詞',
    category: 'grammar-point',
    oneLiner: '「〜すること」という意味で名詞のように働く、動詞のing形。',
    explanation:
      '動名詞（Gerund）は動詞に-ingを付けた形で、名詞と同じように主語・目的語・補語・前置詞の目的語になります。現在分詞と形は同じですが、動名詞は「〜すること」という名詞の役割を果たす点が異なります。enjoy, finish, avoidなどの動詞は目的語に動名詞のみを取ります。',
    example: {
      english: 'Reading medical journals takes a lot of time.',
      japanese: '医学雑誌を読むことは多くの時間がかかります。',
      breakdown: ['Reading medical journals = 動名詞句（主語）', 'takes = 動詞'],
    },
    relatedTermIds: ['term-infinitive-noun', 'term-present-participle'],
  },
  {
    id: 'term-participle',
    term: '分詞',
    category: 'grammar-point',
    oneLiner: '動詞から作られ、形容詞のように名詞を修飾する現在分詞・過去分詞。',
    explanation:
      '分詞（Participle）は動詞から作られる形容詞的な形で、現在分詞（-ing、能動「〜している」）と過去分詞（-ed/不規則、受動「〜される・された」）があります。名詞の前後に置いて修飾したり、進行形・完了形・受動態を作ったりします。',
    example: {
      english: 'The results shown in the graph were surprising.',
      japanese: 'グラフに示された結果は驚くべきものでした。',
      breakdown: ['The results = 名詞', 'shown in the graph = 過去分詞句（The resultsを修飾）', 'were surprising = 補語（現在分詞）'],
    },
    relatedTermIds: ['term-present-participle', 'term-past-participle', 'term-participial-construction'],
  },
  {
    id: 'term-participial-construction',
    term: '分詞構文',
    category: 'grammar-point',
    oneLiner: '接続詞+主語を省略し、分詞で2つの文を簡潔につなぐ表現。',
    explanation:
      '分詞構文は「〜しながら」「〜なので」「〜すると」のような意味を、接続詞と主語（主節と同じ場合）を省略し、動詞を分詞（-ing、または受動なら過去分詞）に変えることで簡潔に表す表現です。文頭・文中・文末のどこにでも置けます。',
    example: {
      english: 'Feeling tired, she decided to rest.',
      japanese: '疲れを感じたので、彼女は休むことにしました。',
      breakdown: ['Feeling tired = 分詞構文（Because she felt tiredの省略形）', 'she decided to rest = 主節'],
    },
    relatedTermIds: ['term-participle', 'term-independent-participle'],
  },
  {
    id: 'term-independent-participle',
    term: '独立分詞構文',
    category: 'grammar-point',
    oneLiner: '分詞構文の主語が主節の主語と異なる場合に、分詞の前に独自の主語を置く形。',
    explanation:
      '通常の分詞構文は主節と主語が同じときに主語を省略しますが、分詞構文の主語が主節の主語と異なる場合は、分詞の直前にその独自の主語を残します。これを独立分詞構文と呼びます。',
    example: {
      english: 'The weather being cold, we stayed indoors.',
      japanese: '天気が寒かったので、私たちは屋内にいました。',
      breakdown: ['The weather being cold = 独立分詞構文（The weatherが分詞beingの主語）', 'we stayed indoors = 主節'],
    },
    relatedTermIds: ['term-participial-construction'],
  },
  {
    id: 'term-comparative',
    term: '比較級',
    category: 'grammar-point',
    oneLiner: '2つを比べて「より〜」を表す形容詞・副詞の形。',
    explanation:
      '比較級は2つのものを比べて「Aの方がBより〜だ」を表す形です。短い語は語尾に-erを付け（faster）、長い語はmoreを前に置きます（more important）。比較対象はthanで示します。',
    example: {
      english: 'This treatment is more effective than the previous one.',
      japanese: 'この治療法は以前のものより効果的です。',
      breakdown: ['more effective = 比較級', 'than the previous one = 比較対象'],
    },
    relatedTermIds: ['term-superlative', 'term-positive-degree'],
  },
  {
    id: 'term-superlative',
    term: '最上級',
    category: 'grammar-point',
    oneLiner: '3つ以上の中で「最も〜」を表す形容詞・副詞の形。',
    explanation:
      '最上級は3つ以上のものの中で「一番〜だ」を表す形です。短い語は語尾に-estを付け（fastest）、長い語はmostを前に置きます（most important）。ふつう前にtheを付けます。',
    example: {
      english: 'This is the most common side effect of the drug.',
      japanese: 'これはその薬の最も一般的な副作用です。',
      breakdown: ['the most common = 最上級', 'side effect = 名詞（修飾されている語）'],
    },
    relatedTermIds: ['term-comparative'],
  },
  {
    id: 'term-positive-degree',
    term: '原級',
    category: 'grammar-point',
    oneLiner: '比較変化していない、形容詞・副詞のもとの形。',
    explanation:
      '原級は比較級・最上級に変化する前の、形容詞・副詞のもとの形です。「as + 原級 + as」の形で「AはBと同じくらい〜だ」という同等比較を表すのによく使われます。',
    example: {
      english: 'This medicine is as effective as the older one.',
      japanese: 'この薬は以前のものと同じくらい効果的です。',
      breakdown: ['as effective as = 原級を使った同等比較', 'the older one = 比較対象'],
    },
    relatedTermIds: ['term-comparative', 'term-not-as-as'],
  },
  {
    id: 'term-not-as-as',
    term: 'クジラ構文（not as ... as）',
    category: 'grammar-point',
    oneLiner: '「AはBほど〜ではない」という否定の同等比較。',
    explanation:
      '「A is not as/so + 原級 + as B」で「AはBほど〜ではない」を表します。「クジラは魚ほど大きくない」というよく使われた例文（A whale is no more a fish than a horse is.）にちなんで通称「クジラ構文」と呼ばれる、比較を使った否定表現の一種です。',
    example: {
      english: 'This surgery is not as risky as people think.',
      japanese: 'この手術は人々が思うほど危険ではありません。',
      breakdown: ['not as risky as = 否定の同等比較', 'people think = 比較対象（節）'],
    },
    relatedTermIds: ['term-positive-degree'],
  },
  {
    id: 'term-relative-pronoun',
    term: '関係代名詞',
    category: 'grammar-point',
    oneLiner: '前の名詞（先行詞）を説明する節を導き、その節の中で主語や目的語の働きもする語。',
    explanation:
      '関係代名詞（who, which, that など）は直前の名詞（先行詞）を説明する節を導きながら、その節の中でも主語や目的語としての役割を持つ語です。2つの文を1つにまとめて、より詳しい説明を加えることができます。',
    example: {
      english: 'The doctor who treated me was very kind.',
      japanese: '私を治療してくれた医師はとても親切でした。',
      breakdown: ['The doctor = 先行詞', 'who treated me = 関係代名詞節（The doctorを修飾、whoは節内で主語）'],
    },
    relatedTermIds: ['term-restrictive-relative', 'term-non-restrictive-relative', 'term-relative-adverb'],
  },
  {
    id: 'term-relative-adverb',
    term: '関係副詞',
    category: 'grammar-point',
    oneLiner: '場所・時・理由などを表す先行詞を、副詞の働きをしながら説明する語。',
    explanation:
      '関係副詞（where, when, why, how）は先行詞（場所・時・理由など）を説明する節を導きますが、関係代名詞と違って節の中では副詞（前置詞+名詞に相当）として働きます。「前置詞+which」で書き換えられることが多いです。',
    example: {
      english: 'This is the hospital where I was born.',
      japanese: 'これは私が生まれた病院です。',
      breakdown: ['the hospital = 先行詞（場所）', 'where I was born = 関係副詞節（in which I was bornに相当）'],
    },
    relatedTermIds: ['term-relative-pronoun'],
  },
  {
    id: 'term-restrictive-relative',
    term: '関係代名詞の制限用法',
    category: 'grammar-point',
    oneLiner: 'コンマなしで先行詞を限定し、「どの〜か」を絞り込む使い方。',
    explanation:
      '関係代名詞の制限用法（限定用法）はコンマを付けずに先行詞を修飾し、「〜という…」のように先行詞の範囲を限定・特定します。この節がないと、先行詞がどれを指すのか分からなくなるという特徴があります。',
    example: {
      english: 'Students who study hard usually get good grades.',
      japanese: '一生懸命勉強する生徒は、たいてい良い成績を取ります。',
      breakdown: ['Students = 先行詞', 'who study hard = 制限用法（Studentsの範囲を限定）'],
    },
    relatedTermIds: ['term-relative-pronoun', 'term-non-restrictive-relative'],
  },
  {
    id: 'term-non-restrictive-relative',
    term: '関係代名詞の非制限用法',
    category: 'grammar-point',
    oneLiner: 'コンマを付けて、先行詞に補足説明を加える使い方。',
    explanation:
      '関係代名詞の非制限用法（継続用法）はコンマを付けて先行詞に補足情報を加えます。制限用法と違い、先行詞はすでに特定されており、この節がなくても文の基本的な意味は変わりません。学術英語で頻出する形です。',
    example: {
      english: 'My father, who is a doctor, works at this hospital.',
      japanese: '私の父は、医者なのですが、この病院で働いています。',
      breakdown: ['My father = すでに特定された先行詞', 'who is a doctor = 補足説明（非制限用法）'],
    },
    relatedTermIds: ['term-restrictive-relative'],
  },
  {
    id: 'term-relative-what',
    term: '関係代名詞what',
    category: 'grammar-point',
    oneLiner: '「〜すること/もの」の意味で、先行詞を含む特殊な関係代名詞。',
    explanation:
      '関係代名詞whatは他の関係代名詞と違い、先行詞を必要とせず「the thing(s) which」の意味を自分自身に含んでいます。「〜すること」「〜するもの」と訳し、名詞節を作ります。',
    example: {
      english: 'What she said surprised everyone.',
      japanese: '彼女が言ったことは皆を驚かせました。',
      breakdown: ['What she said = 名詞節（the thing that she saidの意味、文の主語）', 'surprised = 動詞'],
    },
    relatedTermIds: ['term-relative-pronoun', 'term-noun-clause'],
  },
  {
    id: 'term-compound-relative',
    term: '複合関係詞',
    category: 'grammar-point',
    oneLiner: 'whoever, whateverなど、「〜は誰でも/何でも」を表す関係詞。',
    explanation:
      '複合関係詞（whoever, whatever, whichever, whenever, whereverなど）は関係詞に-everが付いた形で、「〜は誰でも」「〜は何でも」のように譲歩や全称の意味を表します。名詞節や副詞節を作ります。',
    example: {
      english: 'Whoever calls, please tell them I am busy.',
      japanese: '誰が電話してきても、私は忙しいと伝えてください。',
      breakdown: ['Whoever calls = 複合関係詞節（副詞節、「誰が〜しても」）', 'please tell them = 主節'],
    },
    relatedTermIds: ['term-relative-pronoun'],
  },
  {
    id: 'term-interrogative',
    term: '疑問詞',
    category: 'grammar-point',
    oneLiner: '具体的な情報を尋ねるWhat/Who/When/Where/Why/How。',
    explanation:
      '疑問詞は「何」「誰」「いつ」「どこ」「なぜ」「どのように」といった具体的な情報を尋ねるときに文頭に置く語です。疑問詞の後は通常の疑問文の語順（助動詞+主語+動詞）が続きます。',
    example: {
      english: 'Where does it hurt?',
      japanese: 'どこが痛みますか。',
      breakdown: ['Where = 疑問詞（場所）', 'does it hurt = 通常の疑問文の語順'],
    },
    relatedTermIds: ['term-question', 'term-indirect-question'],
  },
  {
    id: 'term-indirect-question',
    term: '間接疑問文',
    category: 'grammar-point',
    oneLiner: '疑問文が文の一部（名詞節）に組み込まれた形。疑問詞の後は平叙文の語順。',
    explanation:
      '間接疑問文は疑問文が別の文の目的語などとして組み込まれた形です。ふつうの疑問文と違い、疑問詞の後は「主語+動詞」という平叙文と同じ語順になります（do/doesなどは使いません）。',
    example: {
      english: 'I don\'t know where he lives.',
      japanese: '私は彼がどこに住んでいるか知りません。',
      breakdown: ['I don\'t know = 主節', 'where he lives = 間接疑問文（名詞節、目的語）'],
    },
    relatedTermIds: ['term-interrogative', 'term-noun-clause'],
  },
  {
    id: 'term-reported-speech',
    term: '話法',
    category: 'grammar-point',
    oneLiner: '人の発言を伝える2つの方法：直接話法と間接話法。',
    explanation:
      '話法には、発言をそのまま引用符で伝える直接話法（He said, "I am tired."）と、自分の言葉に直して伝える間接話法（He said that he was tired.）があります。間接話法では時制の一致（現在→過去）や代名詞・時を表す語の変化が起こります。',
    example: {
      english: 'She said that she had already taken the medicine.',
      japanese: '彼女はすでに薬を飲んだと言いました。',
      breakdown: ['She said = 伝達動詞', 'that she had already taken the medicine = 間接話法（時制が1つ過去にずれる）'],
    },
    relatedTermIds: ['term-noun-clause'],
  },
  {
    id: 'term-cleft-sentence',
    term: '強調構文',
    category: 'grammar-point',
    oneLiner: '「It is ... that ~」の形で、文の一部を強調して伝える構文。',
    explanation:
      '強調構文は「It is/was + 強調したい語句 + that ...」の形で、文の中の特定の要素（主語・目的語・修飾語など）を際立たせて伝える構文です。強調したい部分をItとthatの間に挟みます。',
    example: {
      english: 'It was the nurse who noticed the change first.',
      japanese: '最初にその変化に気づいたのは、その看護師でした。',
      breakdown: ['It was = 強調構文の骨組み', 'the nurse = 強調されている語（主語）', 'who noticed the change first = that節相当'],
    },
    relatedTermIds: ['term-inversion'],
  },
  {
    id: 'term-inversion',
    term: '倒置',
    category: 'grammar-point',
    oneLiner: '否定語や強調のため、通常の主語+動詞の語順を入れ替える表現。',
    explanation:
      '倒置は否定の副詞（Never, Not only, Little など）が文頭に来たときや、強調したいときに、通常の「主語+動詞」の語順を「助動詞/be動詞+主語」の疑問文のような語順に入れ替える表現です。文章語でよく使われます。',
    example: {
      english: 'Never have I seen such a rapid recovery.',
      japanese: 'これほど急速な回復を見たことは一度もありません。',
      breakdown: ['Never = 否定の副詞（文頭）', 'have I seen = 倒置された語順（通常はI have seen）'],
    },
    relatedTermIds: ['term-cleft-sentence'],
  },
  {
    id: 'term-ellipsis',
    term: '省略',
    category: 'grammar-point',
    oneLiner: '前後の文脈から分かる語句を省く表現。',
    explanation:
      '省略は前後の文脈から補える語句をあえて省く表現です。等位接続詞でつながれた文で繰り返しを避けたり（She likes tea and I (like) coffee.）、関係代名詞や接続詞を省略したりします。文を簡潔にする一方、読解時は省略された語を補って理解する必要があります。',
    example: {
      english: 'The medicine (which) the doctor prescribed worked well.',
      japanese: '医師が処方した薬はよく効きました。',
      breakdown: ['(which) = 省略された目的格の関係代名詞', 'the doctor prescribed = 関係代名詞節'],
    },
    relatedTermIds: ['term-relative-pronoun'],
  },
  {
    id: 'term-apposition',
    term: '同格',
    category: 'grammar-point',
    oneLiner: '名詞の直後に別の名詞（句）を置き、それを言い換え・補足する表現。',
    explanation:
      '同格は名詞の直後に別の名詞や名詞句、that節などを置いて「つまり〜」と言い換えたり補足したりする表現です。コンマで区切られることが多く、「the fact that ...」「the idea that ...」のような形もよく使われます。',
    example: {
      english: 'The fact that smoking causes cancer is well known.',
      japanese: '喫煙ががんを引き起こすという事実はよく知られています。',
      breakdown: ['The fact = 名詞', 'that smoking causes cancer = 同格のthat節（The factの内容を説明）'],
    },
    relatedTermIds: ['term-that-apposition'],
  },
  {
    id: 'term-parenthesis',
    term: '挿入',
    category: 'grammar-point',
    oneLiner: '文の途中にコンマなどで補足情報を挟み込む表現。',
    explanation:
      '挿入は文の主要な流れを一度止めて、コンマやダッシュ、括弧を使って補足的な情報や話し手の判断（I think, however など）を文の途中に挟み込む表現です。挿入部分を取り除いても文はそのまま成立します。',
    example: {
      english: 'The treatment, in most cases, is highly effective.',
      japanese: 'その治療法は、ほとんどの場合、非常に効果的です。',
      breakdown: ['The treatment ... is highly effective = 主要な文', 'in most cases = 挿入された補足情報'],
    },
    relatedTermIds: ['term-apposition'],
  },
  {
    id: 'term-subjunctive-past',
    term: '仮定法過去',
    category: 'grammar-point',
    oneLiner: '現在の事実に反することを仮定する、If+過去形, 主語+would+原形。',
    explanation:
      '仮定法過去は「もし（今）〜だったら、…だろうに」という、現在の事実に反する仮定を表します。If節の中は過去形（be動詞は原則wereを使う）、主節はwould/could/might＋動詞の原形になります。形は過去形ですが、意味は現在のことです。',
    example: {
      english: 'If I had more time, I would learn another language.',
      japanese: 'もしもっと時間があれば、別の言語を学ぶだろうに。',
      breakdown: ['If I had more time = 仮定法過去（If節、実際にはない）', 'I would learn = 主節（would+原形）'],
    },
    relatedTermIds: ['term-subjunctive-past-perfect'],
  },
  {
    id: 'term-subjunctive-past-perfect',
    term: '仮定法過去完了',
    category: 'grammar-point',
    oneLiner: '過去の事実に反することを仮定する、If+had+過去分詞, 主語+would have+過去分詞。',
    explanation:
      '仮定法過去完了は「もし（あのとき）〜だったら、…だっただろうに」という、過去の事実に反する仮定を表します。If節はhad＋過去分詞、主節はwould/could/might have＋過去分詞になります。',
    example: {
      english: 'If she had rested more, she would not have gotten sick.',
      japanese: 'もっと休んでいたら、彼女は病気にならなかっただろうに。',
      breakdown: ['If she had rested more = 仮定法過去完了（過去の事実に反する）', 'would not have gotten sick = 主節'],
    },
    relatedTermIds: ['term-subjunctive-past'],
  },
  {
    id: 'term-concession',
    term: '譲歩構文',
    category: 'grammar-point',
    oneLiner: '「〜だけれども」と、予想に反する内容をつなぐ表現。',
    explanation:
      '譲歩構文はalthough, though, even though, whileなどを使って「〜だけれども」という、後に続く内容が前の内容から予想されることに反することを示す表現です。逆接のbutより一つの文の中で従属関係を作れる点が特徴です。',
    example: {
      english: 'Although the surgery was risky, it was successful.',
      japanese: 'その手術は危険だったが、成功しました。',
      breakdown: ['Although the surgery was risky = 譲歩節', 'it was successful = 主節（予想に反する結果）'],
    },
    relatedTermIds: ['term-contrast-connector', 'term-subordinate-clause'],
  },
  {
    id: 'term-causal-connector',
    term: '因果関係の接続表現',
    category: 'grammar-point',
    oneLiner: 'because, since, therefore など、原因と結果をつなぐ語句。',
    explanation:
      '因果関係の接続表現には、原因を導くbecause/since/as（従属接続詞）と、結果を導くso/therefore/thus/as a result（副詞・接続副詞）があります。学術英語では特にtherefore, thus, consequentlyが結論部でよく使われます。',
    example: {
      english: 'The results were inconclusive; therefore, further study is needed.',
      japanese: 'その結果は決定的ではなかった。したがって、さらなる研究が必要である。',
      breakdown: ['The results were inconclusive = 原因', 'therefore = 因果関係を示す接続副詞', 'further study is needed = 結果'],
    },
    relatedTermIds: ['term-contrast-connector', 'term-coordinating-conjunction'],
  },
  {
    id: 'term-contrast-connector',
    term: '対比の接続表現',
    category: 'grammar-point',
    oneLiner: 'while, whereas, howeverなど、2つの内容を対比させる語句。',
    explanation:
      '対比の接続表現には、従属接続詞のwhile/whereas（「一方で」、2つの節を対比）や、接続副詞のhowever/on the other hand（前の文と対比する新しい文を作る）があります。学術英語やビジネス英語の論理展開で頻出します。',
    example: {
      english: 'Group A showed improvement, whereas Group B did not.',
      japanese: 'A群は改善を示したが、一方でB群はそうではなかった。',
      breakdown: ['Group A showed improvement = 前半の内容', 'whereas Group B did not = 対比する内容'],
    },
    relatedTermIds: ['term-causal-connector', 'term-concession'],
  },
  {
    id: 'term-noun-clause',
    term: '名詞節',
    category: 'grammar-point',
    oneLiner: 'that節やwhat節のように、名詞と同じ働きをする節。',
    explanation:
      '名詞節はthat, what, whether, if、疑問詞などに導かれ、文の中で主語・目的語・補語といった名詞と同じ役割を果たす節です。動詞1つでは表現しきれない複雑な内容を、1つの文の要素として組み込むことができます。',
    example: {
      english: 'I believe that the new treatment will help many patients.',
      japanese: '私はその新しい治療法が多くの患者を助けると信じています。',
      breakdown: ['I believe = 主節', 'that the new treatment will help many patients = 名詞節（目的語）'],
    },
    relatedTermIds: ['term-adverb-clause', 'term-adjective-clause', 'term-subordinate-clause'],
  },
  {
    id: 'term-adverb-clause',
    term: '副詞節',
    category: 'grammar-point',
    oneLiner: 'when, because, ifなどに導かれ、時・理由・条件などを表す節。',
    explanation:
      '副詞節はwhen, because, if, although, so thatなどの従属接続詞に導かれ、主節に対して時・理由・条件・目的・譲歩などの情報を加える節です。文の主要素（S/V/O/C）にはならず、あくまで修飾語として働きます。',
    example: {
      english: 'Take this medicine if you feel pain.',
      japanese: '痛みを感じたら、この薬を飲んでください。',
      breakdown: ['Take this medicine = 主節（命令文）', 'if you feel pain = 副詞節（条件）'],
    },
    relatedTermIds: ['term-noun-clause', 'term-adjective-clause'],
  },
  {
    id: 'term-adjective-clause',
    term: '形容詞節',
    category: 'grammar-point',
    oneLiner: '関係詞に導かれ、直前の名詞を修飾する節。',
    explanation:
      '形容詞節は関係代名詞（who, which, that）や関係副詞（where, when, why）に導かれ、直前の名詞（先行詞）を修飾する節です。形容詞が1語で名詞を修飾するのに対し、形容詞節は節（主語+動詞を含むまとまり）で、より詳しい情報を加えます。',
    example: {
      english: 'The report that she submitted was very detailed.',
      japanese: '彼女が提出した報告書は非常に詳細でした。',
      breakdown: ['The report = 先行詞', 'that she submitted = 形容詞節（The reportを修飾）'],
    },
    relatedTermIds: ['term-relative-pronoun', 'term-noun-clause'],
  },
  {
    id: 'term-subordinate-clause',
    term: '従属節',
    category: 'grammar-point',
    oneLiner: '単独では文として成り立たず、主節に従属する節。',
    explanation:
      '従属節は主語・動詞を含んでいても単独では文として完結せず、主節に意味的に依存する節です。名詞節・副詞節・形容詞節はすべて従属節の一種で、従属接続詞や関係詞によって主節に結び付けられます。',
    example: {
      english: 'Because he was tired, he went to bed early.',
      japanese: '疲れていたので、彼は早く寝ました。',
      breakdown: ['Because he was tired = 従属節（単独では不完全）', 'he went to bed early = 主節'],
    },
    relatedTermIds: ['term-main-clause', 'term-subordinating-conjunction'],
  },
  {
    id: 'term-main-clause',
    term: '主節',
    category: 'grammar-point',
    oneLiner: '文の中で単独でも意味が成り立つ、中心となる節。',
    explanation:
      '主節（独立節）は主語と動詞を含み、単独でも文として意味が成り立つ節です。従属節が付いた複文では、主節が文の中心的なメッセージを担います。',
    example: {
      english: 'She stayed home because she had a fever.',
      japanese: '熱があったので、彼女は家にいました。',
      breakdown: ['She stayed home = 主節（単独で成立）', 'because she had a fever = 従属節'],
    },
    relatedTermIds: ['term-subordinate-clause'],
  },
  {
    id: 'term-coordinating-conjunction',
    term: '等位接続詞',
    category: 'grammar-point',
    oneLiner: 'and, but, orなど、対等な要素を結ぶ接続詞。',
    explanation:
      '等位接続詞（and, but, or, so, forなど）は語と語、句と句、文と文など、文法的に対等な要素を結び付けます。従属接続詞と違い、結ばれる2つの要素に主従の関係はありません。',
    example: {
      english: 'She examined the patient and wrote a report.',
      japanese: '彼女は患者を診察し、報告書を書きました。',
      breakdown: ['examined the patient = 動詞句1', 'and = 等位接続詞', 'wrote a report = 動詞句2（対等に結ばれる）'],
    },
    relatedTermIds: ['term-subordinating-conjunction'],
  },
  {
    id: 'term-subordinating-conjunction',
    term: '従属接続詞',
    category: 'grammar-point',
    oneLiner: 'because, if, althoughなど、従属節を主節に結び付ける接続詞。',
    explanation:
      '従属接続詞（because, if, although, when, whileなど）は従属節を作り、それを主節に意味的に結び付けます。等位接続詞と違い、結ばれる2つの節には主（主節）と従（従属節）の関係があります。',
    example: {
      english: 'You should rest if you feel dizzy.',
      japanese: 'めまいがするなら、休むべきです。',
      breakdown: ['You should rest = 主節', 'if = 従属接続詞', 'you feel dizzy = 従属節'],
    },
    relatedTermIds: ['term-coordinating-conjunction', 'term-adverb-clause'],
  },
  {
    id: 'term-phrase',
    term: '句',
    category: 'grammar-point',
    oneLiner: '主語＋動詞を含まない、2語以上のまとまり。',
    explanation:
      '句（Phrase）は2語以上が集まって1つの意味のまとまりを作るが、その中に「主語＋動詞」の関係を含まないものを指します。前置詞句（in the morning）、不定詞句（to study English）、動名詞句（reading books）などがあります。',
    example: {
      english: 'She is interested in learning new languages.',
      japanese: '彼女は新しい言語を学ぶことに興味があります。',
      breakdown: ['in learning new languages = 前置詞句（主語+動詞を含まない）'],
    },
    relatedTermIds: ['term-clause'],
  },
  {
    id: 'term-clause',
    term: '節',
    category: 'grammar-point',
    oneLiner: '主語＋動詞を含む、2語以上のまとまり。',
    explanation:
      '節（Clause）は句と違い、その中に「主語＋動詞」の関係を含むまとまりです。単独で文になれる主節と、単独ではなれない従属節があります。1つの文は1つ以上の節から成り立っています。',
    example: {
      english: 'I think that she is right.',
      japanese: '私は彼女が正しいと思います。',
      breakdown: ['I think = 主節（主語+動詞）', 'that she is right = 従属節（主語+動詞を含む名詞節）'],
    },
    relatedTermIds: ['term-phrase', 'term-main-clause', 'term-subordinate-clause'],
  },
  {
    id: 'term-perception-verb',
    term: '知覚動詞',
    category: 'grammar-point',
    oneLiner: 'see, hear, feelなど、五感で感じ取ることを表す動詞。',
    explanation:
      '知覚動詞（see, watch, hear, feel, noticeなど）はSVOCの文型で、目的語の後に動詞の原形（現在分詞）を続けて「OがCするのを見る/聞く/感じる」を表す特有の使い方をします。',
    example: {
      english: 'I saw the nurse enter the room.',
      japanese: '私はその看護師が部屋に入るのを見ました。',
      breakdown: ['I saw = 知覚動詞', 'the nurse = O', 'enter the room = C（動詞の原形）'],
    },
    relatedTermIds: ['term-causative-verb', 'term-svoc'],
  },
  {
    id: 'term-causative-verb',
    term: '使役動詞',
    category: 'grammar-point',
    oneLiner: 'make, have, letなど、「〜させる」を表す動詞。',
    explanation:
      '使役動詞（make, have, letなど）はSVOCの文型で、目的語の後に動詞の原形を続けて「Oに〜させる」を表します。makeは強制、haveは依頼・手配、letは許可のニュアンスを持ちます。',
    example: {
      english: 'The doctor had the nurse prepare the equipment.',
      japanese: '医師は看護師に器具を準備させました。',
      breakdown: ['had = 使役動詞', 'the nurse = O', 'prepare the equipment = C（動詞の原形）'],
    },
    relatedTermIds: ['term-perception-verb', 'term-svoc'],
  },
  {
    id: 'term-ditransitive-verb',
    term: '授与動詞',
    category: 'grammar-point',
    oneLiner: 'give, tell, showなど、「人に物を与える」意味を持つ動詞。',
    explanation:
      '授与動詞は「人に物・情報を与える」という意味を持ち、SVOOの文型（人+物）を作れる動詞です。give, tell, show, teach, send, bring, offerなどがあり、多くはgive O2 to/for O1のように前置詞を使った書き換えができます。',
    example: {
      english: 'The nurse showed the patient the results.',
      japanese: '看護師は患者に結果を見せました。',
      breakdown: ['showed = 授与動詞', 'the patient = O1（人）', 'the results = O2（もの）'],
    },
    relatedTermIds: ['term-svoo'],
  },
  {
    id: 'term-interrogative-infinitive',
    term: '疑問詞+to不定詞',
    category: 'grammar-point',
    oneLiner: '「何を〜すべきか」のように、疑問詞とto不定詞を組み合わせた名詞句。',
    explanation:
      '「疑問詞（what, how, whenなど）+ to不定詞」で「何を〜すべきか」「どう〜すればよいか」という名詞のまとまりを作ります。知りたい・分からないという文脈の動詞（know, tell, decideなど）の目的語としてよく使われます。',
    example: {
      english: 'The nurse explained how to use the device.',
      japanese: 'その看護師はその機器の使い方を説明しました。',
      breakdown: ['explained = 動詞', 'how to use the device = 疑問詞+to不定詞（目的語）'],
    },
    relatedTermIds: ['term-infinitive-noun', 'term-indirect-question'],
  },
  {
    id: 'term-so-that',
    term: 'so ... that構文',
    category: 'grammar-point',
    oneLiner: '「とても〜なので…」と、程度とその結果を表す構文。',
    explanation:
      '「so + 形容詞/副詞 + that + 節」で「とても〜なので…だ」という程度とその結果を表します。soの後には形容詞や副詞が直接続く点が、名詞を伴うsuchとの違いです。',
    example: {
      english: 'The pain was so severe that she could not sleep.',
      japanese: '痛みがとてもひどかったので、彼女は眠れませんでした。',
      breakdown: ['so severe = 程度（形容詞）', 'that she could not sleep = 結果'],
    },
    relatedTermIds: ['term-such-that'],
  },
  {
    id: 'term-such-that',
    term: 'such ... that構文',
    category: 'grammar-point',
    oneLiner: '「とても〜な…なので」と、名詞を含む程度とその結果を表す構文。',
    explanation:
      '「such (a/an) + 形容詞 + 名詞 + that + 節」で「とても〜な…なので」を表します。soと似た意味ですが、such は直後に名詞（またはa/an+形容詞+名詞）を伴う点が異なります。',
    example: {
      english: 'It was such a serious illness that he was hospitalized.',
      japanese: 'それはとても深刻な病気だったので、彼は入院しました。',
      breakdown: ['such a serious illness = 程度（名詞を含む）', 'that he was hospitalized = 結果'],
    },
    relatedTermIds: ['term-so-that'],
  },
  {
    id: 'term-not-only-but-also',
    term: 'not only ... but also構文',
    category: 'grammar-point',
    oneLiner: '「〜だけでなく…も」と、2つの要素を強調して並べる構文。',
    explanation:
      '「not only A but also B」で「AだけでなくBも」という意味を表します。not onlyが文頭に来ると倒置が起こる点（Not only did she..., but she also...）にも注意が必要です。',
    example: {
      english: 'The drug not only reduces pain but also lowers fever.',
      japanese: 'その薬は痛みを軽減するだけでなく、熱も下げます。',
      breakdown: ['not only reduces pain = A', 'but also lowers fever = B'],
    },
    relatedTermIds: ['term-either-or', 'term-both-and'],
  },
  {
    id: 'term-either-or',
    term: 'either ... or / neither ... nor構文',
    category: 'grammar-point',
    oneLiner: '「AかBのどちらか」「AもBも〜ない」を表す構文。',
    explanation:
      '「either A or B」は「AかBのどちらか」、「neither A nor B」は「AもBも〜ない」を表します。動詞の形はふつう直前の要素（B）に合わせます。',
    example: {
      english: 'Either the doctor or the nurses are available now.',
      japanese: '医師か看護師のどちらかが今対応可能です。',
      breakdown: ['Either the doctor or the nurses = 主語', 'are = 動詞（直前のnursesに一致、複数形）'],
    },
    relatedTermIds: ['term-not-only-but-also', 'term-both-and'],
  },
  {
    id: 'term-both-and',
    term: 'both ... and構文',
    category: 'grammar-point',
    oneLiner: '「AとBの両方」を表す構文。',
    explanation:
      '「both A and B」は「AとBの両方」という意味を表し、動詞は常に複数扱いになります。',
    example: {
      english: 'Both the mother and the baby are doing well.',
      japanese: '母親と赤ちゃんの両方とも元気です。',
      breakdown: ['Both the mother and the baby = 主語（両方）', 'are = 複数扱いの動詞'],
    },
    relatedTermIds: ['term-either-or', 'term-not-only-but-also'],
  },
  {
    id: 'term-as-soon-as',
    term: 'as soon as構文',
    category: 'grammar-point',
    oneLiner: '「〜するとすぐに」を表す時を表す接続詞句。',
    explanation:
      '「as soon as + 節」は「〜するとすぐに」という意味を表す従属接続詞的な働きをする表現です。時・条件を表す副詞節と同じく、未来のことでも現在形で表す点に注意します。',
    example: {
      english: 'Call me as soon as the results arrive.',
      japanese: '結果が届いたらすぐに私に電話してください。',
      breakdown: ['Call me = 主節', 'as soon as the results arrive = 副詞節（未来でも現在形）'],
    },
    relatedTermIds: ['term-adverb-clause'],
  },
  {
    id: 'term-comparative-comparative',
    term: 'the 比較級, the 比較級構文',
    category: 'grammar-point',
    oneLiner: '「〜すればするほど、ますます…」を表す構文。',
    explanation:
      '「The + 比較級 ..., the + 比較級 ...」で「〜すればするほど、ますます…だ」という、2つのことが連動して変化することを表します。',
    example: {
      english: 'The earlier you detect the disease, the better the outcome.',
      japanese: '病気を早く発見すればするほど、結果は良くなります。',
      breakdown: ['The earlier you detect the disease = 条件（比較級1）', 'the better the outcome = 結果（比較級2）'],
    },
    relatedTermIds: ['term-comparative'],
  },
  {
    id: 'term-too-to',
    term: 'too ... to構文',
    category: 'grammar-point',
    oneLiner: '「あまりに〜すぎて…できない」を表す構文。',
    explanation:
      '「too + 形容詞/副詞 + to不定詞」で「あまりに〜すぎて…できない」という否定的な結果を表します。意味の上ではso ... that ... notに近い内容です。',
    example: {
      english: 'The patient was too weak to walk.',
      japanese: 'その患者は弱すぎて歩けませんでした。',
      breakdown: ['too weak = 程度', 'to walk = 不定詞（できない結果）'],
    },
    relatedTermIds: ['term-enough-to', 'term-so-that'],
  },
  {
    id: 'term-enough-to',
    term: '... enough to構文',
    category: 'grammar-point',
    oneLiner: '「〜するのに十分…だ」を表す構文。',
    explanation:
      '「形容詞/副詞 + enough + to不定詞」で「…するのに十分〜だ」という肯定的な結果を表します。enoughは修飾する形容詞・副詞の後に置く語順に注意が必要です。',
    example: {
      english: 'She was strong enough to walk after the surgery.',
      japanese: '彼女は手術後、歩けるくらい十分な体力がありました。',
      breakdown: ['strong enough = 程度（enoughは形容詞の後）', 'to walk = 不定詞（できる結果）'],
    },
    relatedTermIds: ['term-too-to'],
  },
  {
    id: 'term-dummy-subject',
    term: '仮主語構文（It構文）',
    category: 'grammar-point',
    oneLiner: '長い主語（不定詞句やthat節）の代わりに、形式上Itを主語に置く構文。',
    explanation:
      '不定詞句やthat節のように長い主語を文頭に置くと文のバランスが悪くなるため、形式上の主語としてItを置き、本当の主語（真主語）を文の後ろに移動させます。「It is ... to do」「It is ... that ...」の形でよく使われます。',
    example: {
      english: 'It is important to wash your hands regularly.',
      japanese: '定期的に手を洗うことが重要です。',
      breakdown: ['It = 形式主語', 'is important = 動詞+補語', 'to wash your hands regularly = 真主語（不定詞句）'],
    },
    relatedTermIds: ['term-dummy-object', 'term-infinitive-noun'],
  },
  {
    id: 'term-dummy-object',
    term: '仮目的語構文',
    category: 'grammar-point',
    oneLiner: '長い目的語の代わりに、形式上itを目的語に置く構文（SVOC）。',
    explanation:
      'SVOCの文で、目的語が不定詞句やthat節のように長くなる場合、形式上の目的語としてitを置き、本当の目的語（真目的語）を補語の後ろに移動させます。「find it ... to do」の形が代表的です。',
    example: {
      english: 'She found it difficult to concentrate.',
      japanese: '彼女は集中するのが難しいと感じました。',
      breakdown: ['found = 動詞', 'it = 形式目的語', 'difficult = 補語', 'to concentrate = 真目的語（不定詞句）'],
    },
    relatedTermIds: ['term-dummy-subject', 'term-svoc'],
  },
  {
    id: 'term-that-apposition',
    term: '同格のthat節',
    category: 'grammar-point',
    oneLiner: 'fact, idea, newsなど特定の名詞の直後で、その内容を説明するthat節。',
    explanation:
      '同格のthat節はfact, idea, news, possibility, evidenceなど「内容を持つ」名詞の直後に置かれ、「〜という…」とその名詞の具体的な内容を説明します。関係代名詞のthatと違い、that節の中は完全な文（欠けている要素がない）になります。',
    example: {
      english: 'There is evidence that the treatment reduces symptoms.',
      japanese: 'その治療が症状を軽減するという証拠があります。',
      breakdown: ['evidence = 名詞', 'that the treatment reduces symptoms = 同格のthat節（evidenceの内容、完全な文）'],
    },
    relatedTermIds: ['term-apposition', 'term-noun-clause'],
  },
  {
    id: 'term-preposition-relative',
    term: '前置詞+関係代名詞',
    category: 'grammar-point',
    oneLiner: '「前置詞+which」のように、関係詞節の前に前置詞を置く硬い書き方。',
    explanation:
      '関係代名詞節の中の前置詞は文末に残すのが口語的ですが（the topic (which) we talked about）、フォーマルな文章（論文など）では前置詞を関係代名詞の直前に置きます（the topic about which we talked）。thatの前には前置詞を置けない点に注意します。',
    example: {
      english: 'The method by which the data were collected was described in detail.',
      japanese: 'データが収集された方法は詳細に記述されていました。',
      breakdown: ['The method = 先行詞', 'by which the data were collected = 前置詞+関係代名詞節'],
    },
    relatedTermIds: ['term-relative-pronoun'],
  },
  {
    id: 'term-simple-sentence',
    term: '単文',
    category: 'grammar-point',
    oneLiner: '主節が1つだけで、従属節を含まない文。',
    explanation:
      '単文は主語と動詞の組み合わせ（主節）が1つだけで構成される文です。長い修飾語句が付くことはあっても、従属節や別の独立した節は含みません。',
    example: {
      english: 'The doctor examined the new patient carefully.',
      japanese: '医師は新しい患者を注意深く診察しました。',
      breakdown: ['The doctor examined the new patient carefully = 主節1つのみ（単文）'],
    },
    relatedTermIds: ['term-compound-sentence', 'term-complex-sentence'],
  },
  {
    id: 'term-compound-sentence',
    term: '重文',
    category: 'grammar-point',
    oneLiner: '2つ以上の主節が等位接続詞で結ばれた文。',
    explanation:
      '重文は2つ（以上）の対等な主節が、and, but, orなどの等位接続詞で結ばれた文です。それぞれの節は単独でも文として成立する点が、主従関係を持つ複文との違いです。',
    example: {
      english: 'She finished the report, and she sent it immediately.',
      japanese: '彼女は報告書を完成させ、それをすぐに送りました。',
      breakdown: ['She finished the report = 主節1', 'and = 等位接続詞', 'she sent it immediately = 主節2'],
    },
    relatedTermIds: ['term-simple-sentence', 'term-complex-sentence', 'term-coordinating-conjunction'],
  },
  {
    id: 'term-complex-sentence',
    term: '複文',
    category: 'grammar-point',
    oneLiner: '主節と従属節が組み合わさった文。',
    explanation:
      '複文は1つの主節と、1つ以上の従属節（名詞節・副詞節・形容詞節）が組み合わさった文です。従属節は主節に意味的に依存しており、単独では文として完結しません。',
    example: {
      english: 'Because the results were unclear, the team repeated the experiment.',
      japanese: '結果が不明確だったので、チームは実験を繰り返しました。',
      breakdown: ['Because the results were unclear = 従属節（副詞節）', 'the team repeated the experiment = 主節'],
    },
    relatedTermIds: ['term-simple-sentence', 'term-compound-sentence', 'term-subordinate-clause'],
  },
  {
    id: 'term-phrasal-verb',
    term: '句動詞',
    category: 'grammar-point',
    oneLiner: '動詞+副詞/前置詞が組み合わさり、1つの動詞のような意味を持つ表現。',
    explanation:
      '句動詞（Phrasal Verb）はlook after（世話をする）、give up（あきらめる）、come across（偶然出会う）のように、動詞と副詞・前置詞が組み合わさって、元の動詞とは異なる特有の意味を持つ表現です。日常英語や医療会話でも非常によく使われます。',
    example: {
      english: 'The nurse looked after the patient all night.',
      japanese: 'その看護師は一晩中その患者の世話をしました。',
      breakdown: ['looked after = 句動詞（「世話をする」という1つの意味のまとまり）', 'the patient = 目的語'],
    },
    relatedTermIds: ['term-verb'],
  },
  {
    id: 'term-participial-adjective',
    term: '分詞の形容詞用法',
    category: 'grammar-point',
    oneLiner: '-ing（能動・〜させる）と-ed（受動・〜させられる）の使い分け。',
    explanation:
      '感情を表す動詞から作られる分詞は、-ing形が「（人を）〜させるような」（interesting）、-ed形が「（人が）〜させられる、つまり〜と感じる」（interested）という違いを持ちます。主語が人か物かで、多くの場合どちらを使うべきかが決まります。',
    example: {
      english: 'The students were interested in the interesting lecture.',
      japanese: '学生たちはその面白い講義に興味を持ちました。',
      breakdown: ['interested = 過去分詞（学生たちが感じる側）', 'interesting = 現在分詞（講義がそう感じさせる側）'],
    },
    relatedTermIds: ['term-participle'],
  },
  {
    id: 'term-no-sooner-than',
    term: 'no sooner ... than構文',
    category: 'grammar-point',
    oneLiner: '「〜するとすぐに…した」を表す、倒置を伴う構文。',
    explanation:
      '「No sooner had A happened than B happened」で「Aが起こるとすぐにBが起こった」という意味を表します。No soonerが文頭に出るとhadと主語が倒置される点が特徴で、書き言葉でよく使われます。',
    example: {
      english: 'No sooner had she arrived than the phone rang.',
      japanese: '彼女が到着するとすぐに、電話が鳴りました。',
      breakdown: ['No sooner had she arrived = 倒置された過去完了（先に起きたこと）', 'than the phone rang = 後に起きたこと'],
    },
    relatedTermIds: ['term-inversion', 'term-past-perfect'],
  },
  {
    id: 'term-emphatic-do',
    term: '強調のdo',
    category: 'grammar-point',
    oneLiner: '一般動詞の前にdo/does/didを置いて、その動作を強調する用法。',
    explanation:
      '肯定文の一般動詞の前にdo/does/didを置くと、「本当に〜する」「確かに〜した」という強調の意味になります。疑問文・否定文で使う助動詞のdoとは異なり、意味を強める働きをします。',
    example: {
      english: 'She does understand the risks of the surgery.',
      japanese: '彼女は本当にその手術のリスクを理解しています。',
      breakdown: ['does understand = 強調のdo+動詞の原形（「確かに理解している」を強調）'],
    },
    relatedTermIds: ['term-general-verb'],
  },
];
