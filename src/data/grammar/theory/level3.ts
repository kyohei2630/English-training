import type { GrammarTheory } from '../../../types';

export const level3GrammarTheory: GrammarTheory[] = [
  {
    id: 'theory-l3-01',
    level: 3,
    tag: '長い主語',
    title: '長い主語の見抜き方',
    shortDescription: '主語が長くなっても、まず動詞を探して骨組みをつかむ。',
    concept:
      '長文読解でつまずく最大の原因の一つが「長い主語」です。不定詞句・動名詞句・that節・関係詞節などが主語になると、主語が数十語に及ぶこともあります。こうした文では、まず「文全体の動詞」を先に探し、そこから逆算して「どこまでが主語か」を見つけるのが効果的です。',
    rules: [
      { title: '動詞を先に探す', explanation: '長い主語の文では、まず時制のある動詞（述語動詞）を見つけ、その直前までが主語だと判断します。' },
      { title: '主語の中の動詞に惑わされない', explanation: '主語の中にto不定詞や分詞、関係詞節の動詞が含まれることがありますが、これらは文全体の述語動詞ではありません。' },
    ],
    examples: [
      {
        english: 'The fact that the treatment showed no significant side effects surprised the researchers.',
        japanese: 'その治療法が重大な副作用を示さなかったという事実は、研究者たちを驚かせました。',
        structureBreakdown: {
          sentence: 'The fact that the treatment showed no significant side effects surprised the researchers.',
          translationJa: 'その治療法が重大な副作用を示さなかったという事実は、研究者たちを驚かせました。',
          segments: [
            { text: 'The fact that the treatment showed no significant side effects', role: 'S（長い主語、同格のthat節を含む）' },
            { text: 'surprised', role: 'V（文全体の述語動詞）' },
            { text: 'the researchers', role: 'O' },
          ],
        },
      },
    ],
    keyPoints: ['長い主語の中のshowedは主語内部の動詞であり、文全体の動詞ではない', '主語の終わりは、文全体の動詞が現れる直前'],
    commonMistakes: ['主語の中の動詞（showed）を文全体の述語動詞だと勘違いし、そこで文が終わったと誤読してしまう。'],
    relatedTermIds: ['term-noun-clause', 'term-that-apposition'],
    miniCheck: [
      {
        question: '上の例文で、文全体の述語動詞はどれですか。',
        choices: ['showed', 'surprised', 'was', 'that'],
        correctIndex: 1,
        explanation: 'showedは主語内部（同格節）の動詞で、文全体の述語動詞はsurprisedです。',
      },
    ],
  },
  {
    id: 'theory-l3-02',
    level: 3,
    tag: '長い目的語',
    title: '長い目的語の見抜き方',
    shortDescription: 'that節・疑問詞節・不定詞句など、目的語が長くなるパターン。',
    concept:
      '動詞の後ろに続く目的語も、that節や疑問詞節、長い名詞句によって大きく膨らむことがあります。特にsuggest, show, indicate, argueなど「主張・示唆」を表す動詞は、that節を目的語に取ることが多く、学術英語で頻出です。',
    rules: [{ title: '「主張系動詞+that」のパターンに慣れる', explanation: 'suggest that, show that, argue thatのような組み合わせをセットで認識できると、目的語の範囲がすぐに分かります。' }],
    examples: [
      {
        english: 'The study suggests that regular exercise significantly reduces the risk of heart disease.',
        japanese: 'その研究は定期的な運動が心臓病のリスクを著しく減少させることを示唆しています。',
        explanation: 'suggestsの目的語はthat以下、文末までの節全体。',
      },
    ],
    keyPoints: ['目的語のthatは省略されることも多い', '長い目的語の中にもさらに従属節が入れ子になることがある'],
    commonMistakes: ['長い目的語の途中で意味の切れ目を見誤り、文の構造を誤解してしまう。'],
    relatedTermIds: ['term-noun-clause', 'term-object'],
    miniCheck: [
      {
        question: '"suggests that ..." のthat節はどんな役割ですか。',
        choices: ['主語', '目的語', '補語', '修飾語'],
        correctIndex: 1,
        explanation: 'suggestsの目的語として、that以下の節全体が使われています。',
      },
    ],
  },
  {
    id: 'theory-l3-03',
    level: 3,
    tag: '前置詞句の連続',
    title: '前置詞句が連続する文の読み方',
    shortDescription: '複数の前置詞句が連なっても、それぞれの修飾先を1つずつ確認する。',
    concept:
      '学術英語や医療英語では、1つの文に複数の前置詞句が連続することがよくあります。それぞれの前置詞句がどの語を修飾しているのかを丁寧に確認しないと、意味を取り違えてしまいます。前置詞句は基本的に直前の名詞、または動詞を修飾します。',
    rules: [{ title: '前置詞句は直前の要素を修飾するのが基本', explanation: '前置詞句は原則として直前の名詞句（または動詞）を修飾すると考えると、連続していても整理しやすくなります。' }],
    examples: [
      {
        english: 'The rate of infection among patients in the intensive care unit increased significantly.',
        japanese: '集中治療室の患者の間での感染率は著しく増加しました。',
        structureBreakdown: {
          sentence: 'The rate of infection among patients in the intensive care unit increased significantly.',
          translationJa: '集中治療室の患者の間での感染率は著しく増加しました。',
          segments: [
            { text: 'The rate', role: 'S（中心）' },
            { text: 'of infection', role: '前置詞句（rateを修飾）' },
            { text: 'among patients', role: '前置詞句（前のinfectionではなくrate of infection全体を修飾）' },
            { text: 'in the intensive care unit', role: '前置詞句（patientsを修飾）' },
            { text: 'increased significantly', role: 'V+修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['前置詞句の連続は「名詞の入れ子構造」になっていることが多い', '意味的に自然なつながりを考えながら修飾関係を判断する'],
    commonMistakes: ['前置詞句がすべて同じ語を修飾していると誤解し、意味のつながりを間違える。'],
    relatedTermIds: ['term-preposition', 'term-phrase'],
    miniCheck: [
      {
        question: '上の例文で"in the intensive care unit"はどの語を修飾していますか。',
        choices: ['The rate', 'infection', 'patients', 'increased'],
        correctIndex: 2,
        explanation: '「集中治療室にいる患者」という意味なので、patientsを修飾しています。',
      },
    ],
  },
  {
    id: 'theory-l3-04',
    level: 3,
    tag: '関係代名詞',
    title: '関係詞による修飾の応用',
    shortDescription: '関係詞節が連続・入れ子になる複雑な文の読み方。',
    concept:
      '学術的な文章では、1つの名詞に複数の関係詞節が付いたり、関係詞節の中にさらに関係詞節が入れ子になったりすることがあります。それぞれの関係詞が「どの先行詞を修飾しているか」を1つずつ確認しながら読む練習が必要です。',
    rules: [{ title: '関係詞の直前の名詞が先行詞とは限らない', explanation: '関係詞の直前に複数の名詞がある場合、意味的に最も自然な名詞が先行詞になります。' }],
    examples: [
      {
        english: 'The patients who received the treatment that researchers developed last year showed improvement.',
        japanese: '研究者が昨年開発した治療を受けた患者は改善を示しました。',
        explanation: 'who received ...がThe patientsを、that researchers developed ...がthe treatmentを、それぞれ修飾している。',
      },
    ],
    keyPoints: ['複数の関係詞節が連続する場合、それぞれ別の先行詞を修飾していることが多い', '文全体の主語・動詞を見失わないようにする'],
    commonMistakes: ['入れ子になった関係詞節の動詞を、文全体の述語動詞だと勘違いしてしまう。'],
    relatedTermIds: ['term-relative-pronoun', 'term-adjective-clause'],
    miniCheck: [
      {
        question: '上の例文で、文全体の述語動詞はどれですか。',
        choices: ['received', 'developed', 'showed', 'was'],
        correctIndex: 2,
        explanation: 'receivedとdevelopedはそれぞれ関係詞節内の動詞で、文全体の述語動詞はshowedです。',
      },
    ],
  },
  {
    id: 'theory-l3-05',
    level: 3,
    tag: '分詞修飾',
    title: '分詞による後置修飾',
    shortDescription: '分詞句が名詞の後ろから、関係詞節のように修飾する。',
    concept:
      '分詞（現在分詞・過去分詞）は語句を伴って名詞の後ろに置かれ、関係詞節の簡略版のように名詞を修飾します。which is/whoが省略されたと考えると理解しやすくなります。学術英語では、こうした分詞による後置修飾が非常に多く使われます。',
    rules: [{ title: '関係詞節との対応', explanation: '名詞 + 分詞句 は、名詞 + which/who is + 分詞 から「which/who is」を省略した形と考えられます。' }],
    examples: [
      {
        english: 'Data collected from over 1,000 participants were analyzed using statistical software.',
        japanese: '1000人以上の参加者から収集されたデータが、統計ソフトウェアを用いて分析されました。',
        structureBreakdown: {
          sentence: 'Data collected from over 1,000 participants were analyzed using statistical software.',
          translationJa: '1000人以上の参加者から収集されたデータが、統計ソフトウェアを用いて分析されました。',
          segments: [
            { text: 'Data', role: 'S' },
            { text: 'collected from over 1,000 participants', role: '過去分詞句（Dataを後置修飾）' },
            { text: 'were analyzed', role: 'V（受動態）' },
            { text: 'using statistical software', role: '分詞構文（手段）' },
          ],
        },
      },
    ],
    keyPoints: ['能動の意味なら現在分詞、受動の意味なら過去分詞', '分詞句と分詞構文を混同しないよう、修飾している対象（名詞か文全体か）を確認する'],
    commonMistakes: ['分詞句をその文全体の動詞だと誤読してしまう（collectedを述語動詞と勘違いする）。'],
    relatedTermIds: ['term-participle', 'term-adjective-clause'],
    miniCheck: [
      {
        question: '上の例文で、文全体の述語動詞はどれですか。',
        choices: ['collected', 'were analyzed', 'using', 'Data'],
        correctIndex: 1,
        explanation: 'collectedはDataを修飾する過去分詞句で、文全体の述語動詞はwere analyzedです。',
      },
    ],
  },
  {
    id: 'theory-l3-06',
    level: 3,
    tag: '分詞構文',
    title: '分詞構文の応用（結果・付帯状況）',
    shortDescription: '分詞構文が「〜して、その結果…」という意味を表すこともある。',
    concept:
      '分詞構文は「〜しながら」「〜なので」だけでなく、文の後半に置かれて「そしてその結果…」という結果を表すこともあります。また、withを伴う分詞構文（with + 名詞 + 分詞）は「〜した状態で」という付帯状況を表す、学術英語頻出の形です。',
    rules: [
      { title: '文末の分詞構文は結果を表すことが多い', explanation: 'カンマの後、文末に置かれた分詞構文は「そして〜した」という結果を表すことがよくあります。' },
      { title: 'with + 名詞 + 分詞', explanation: 'with以下が「〜が…な状態で」という付帯状況を表します。' },
    ],
    examples: [
      {
        english: 'The dosage was increased gradually, resulting in fewer side effects.',
        japanese: '用量は徐々に増やされ、その結果、副作用が減少しました。',
        explanation: 'resulting in ...は文末に置かれ、前の内容の結果を表している。',
      },
    ],
    keyPoints: ['分詞構文の意味（時・理由・結果・付帯状況）は前後の文脈から判断する', 'withの分詞構文は分詞の後ろに補語が来ることもある（with the door open）'],
    commonMistakes: ['文末の分詞構文をすべて「〜しながら」という付帯状況だと決めつけてしまう。'],
    relatedTermIds: ['term-participial-construction'],
    miniCheck: [
      {
        question: '"She spoke slowly, with her hands shaking." のwith以下の意味はどれですか。',
        choices: ['理由', '結果', '付帯状況（〜な状態で）', '条件'],
        correctIndex: 2,
        explanation: 'with + 名詞 + 分詞は「〜な状態で」という付帯状況を表します。',
      },
    ],
  },
  {
    id: 'theory-l3-07',
    level: 3,
    tag: '独立分詞構文の応用',
    title: '独立分詞構文の応用',
    shortDescription: '分詞構文の主語が主節と異なるとき、独自の主語を残す。',
    concept:
      '分詞構文の主語が主節の主語と異なる場合、分詞の直前にその独自の主語（独立分詞構文の主語）を残します。学術英語では、天候や一般的な状況を表す主語（The data, All things considered など）を伴う独立分詞構文がよく登場します。',
    rules: [{ title: 'All things consideredなどの慣用表現', explanation: 'considering, given, all things consideredなどは、独立分詞構文が定型化した慣用表現として使われます。' }],
    examples: [
      {
        english: 'All factors considered, the treatment appears to be safe and effective.',
        japanese: 'すべての要因を考慮すると、その治療法は安全で効果的であるように思われます。',
        explanation: 'All factorsが分詞consideredの独自の主語（独立分詞構文）。',
      },
    ],
    keyPoints: ['considering ...（〜を考慮すると）は独立分詞構文が前置詞化したもの', 'Given that ...（〜だということを考えると）も同じ発想の表現'],
    commonMistakes: ['独立分詞構文の主語を主節の主語だと勘違いしてしまう。'],
    relatedTermIds: ['term-independent-participle', 'term-participial-construction'],
    miniCheck: [
      {
        question: '"All factors considered, ..." のAll factorsの役割はどれですか。',
        choices: ['主節の主語', '分詞consideredの独自の主語', '目的語', '補語'],
        correctIndex: 1,
        explanation: '主節の主語（the treatment）とは別に、分詞consideredの主語として独自に置かれています。',
      },
    ],
  },
  {
    id: 'theory-l3-08',
    level: 3,
    tag: '同格の応用',
    title: '同格構文の応用',
    shortDescription: 'コンマを使った同格、of構文による同格など、多様なパターン。',
    concept:
      '同格には、the fact that ...のようなthat節を使うものだけでなく、コンマを使って名詞を並べるもの（My colleague, Dr. Tanaka, ...）、of構文を使うもの（the city of Kyoto）など、いくつかのパターンがあります。それぞれが「＝（イコール）」の関係を作っていることを意識すると理解しやすくなります。',
    rules: [{ title: 'すべて「＝」の関係', explanation: '同格のパターンはどれも、前後の名詞（句）が同じものを指しているという点で共通しています。' }],
    examples: [
      {
        english: 'The lead author, Dr. Sato, presented the findings at the conference.',
        japanese: '筆頭著者である佐藤博士が、学会でその結果を発表しました。',
        explanation: 'The lead author = Dr. Satoという同格の関係。',
      },
    ],
    keyPoints: ['コンマによる同格は「つまり」と訳すと自然', 'the term "..." やso-called ...も広い意味で同格的な働きをする'],
    commonMistakes: ['コンマによる同格を、非制限用法の関係代名詞節（関係詞が省略された形）と混同してしまう。'],
    relatedTermIds: ['term-apposition', 'term-that-apposition'],
    miniCheck: [
      {
        question: '"My colleague, Dr. Tanaka, published a new paper." でDr. Tanakaが指しているのは誰ですか。',
        choices: ['筆者自身', 'My colleague', '別の研究者', '読者'],
        correctIndex: 1,
        explanation: '同格の関係により、Dr. Tanaka = My colleagueを指しています。',
      },
    ],
  },
  {
    id: 'theory-l3-09',
    level: 3,
    tag: '挿入の応用',
    title: '挿入構文の応用',
    shortDescription: 'ダッシュや括弧を使った挿入、文中に埋め込まれた話者の判断。',
    concept:
      '学術英語では、コンマだけでなくダッシュ（—）や括弧（）を使った挿入もよく使われます。また、it seems, arguably, in factのような「話し手の判断」を表す語句が文の途中に挿入されることも多く、これらを読み飛ばす練習をすると、文の骨組みがすっきり見えるようになります。',
    rules: [{ title: '挿入部分は一時的に無視してよい', explanation: '挿入されている語句は、文の主要な意味には影響しないので、まずは無視して文の骨組みを把握するとよいです。' }],
    examples: [
      {
        english: 'The results, it should be noted, were based on a relatively small sample.',
        japanese: 'その結果は、注意すべきことに、比較的小さなサンプルに基づいていました。',
        explanation: 'it should be notedという挿入節が文の主要な流れの途中に入っている。',
      },
    ],
    keyPoints: ['ダッシュによる挿入はコンマによる挿入よりもやや強調のニュアンスを持つ', '挿入節はそれ自体が主語+動詞を持つ小さな文であることもある'],
    commonMistakes: ['挿入節を主節の一部だと誤解し、文全体の主語・動詞を誤って特定してしまう。'],
    relatedTermIds: ['term-parenthesis', 'term-apposition'],
    miniCheck: [
      {
        question: '上の例文で、文全体の主語と動詞はどれですか。',
        choices: ['it / should be noted', 'The results / were based', 'a relatively small sample / was', 'results / noted'],
        correctIndex: 1,
        explanation: '"it should be noted"は挿入節で、文全体の主語と動詞はThe resultsとwere basedです。',
      },
    ],
  },
  {
    id: 'theory-l3-10',
    level: 3,
    tag: '省略',
    title: '省略の応用（学術英語での省略）',
    shortDescription: '比較文や等位接続の文で、繰り返しを避けるための省略。',
    concept:
      '学術英語では、簡潔さを重視するために、比較文や等位接続詞でつながれた文でよく省略が起こります。省略された部分は、たいてい直前の文と同じ構造（動詞など）です。省略に気づかず読むと、文が不完全に見えて混乱することがあります。',
    rules: [{ title: '省略を補って読む', explanation: '不自然に文が途切れて見えるときは、前の部分から同じ語句を補って読んでみましょう。' }],
    examples: [
      {
        english: 'Group A received the new treatment, and Group B, the standard one.',
        japanese: 'A群は新しい治療を受け、B群は標準的な治療を受けました。',
        explanation: 'Group Bの後にreceivedが省略されている（..., and Group B received the standard one.）。',
      },
    ],
    keyPoints: ['等位接続詞（and, butなど）の後でよく省略が起こる', '省略された動詞は、たいてい文の前半と同じもの'],
    commonMistakes: ['省略に気づかず、Group Bの後に動詞がないことに混乱してしまう。'],
    relatedTermIds: ['term-ellipsis', 'term-coordinating-conjunction'],
    miniCheck: [
      {
        question: '上の例文でGroup Bの後に省略されている語はどれですか。',
        choices: ['is', 'received', 'was', 'has'],
        correctIndex: 1,
        explanation: '前半のGroup A receivedと対応する形で、receivedが省略されています。',
      },
    ],
  },
  {
    id: 'theory-l3-11',
    level: 3,
    tag: '倒置',
    title: '倒置構文の応用',
    shortDescription: '否定語だけでなく、場所・様態を表す語句が前に出るときの倒置。',
    concept:
      '倒置は否定語だけでなく、場所や様態を表す副詞句が文頭に来るときにも起こります（Only then did she realize the mistake.）。また、条件文でIfを省略して倒置する形（Had I known, ...）も学術英語や文章語でよく見られます。',
    rules: [
      { title: '場所を表す副詞句の倒置', explanation: '"Here comes the bus." のように、場所を表す副詞句が文頭に来ると、主語と動詞が入れ替わることがあります。' },
      { title: 'Ifの省略による倒置', explanation: '仮定法のIfを省略すると、Had/Were/Shouldを主語の前に出す倒置が起こります。' },
    ],
    examples: [
      {
        english: 'Had the researchers known this earlier, they would have changed the protocol.',
        japanese: 'もし研究者たちがこれをもっと早く知っていたら、プロトコルを変更していただろう。',
        explanation: 'If the researchers had known...のIfが省略され、Hadが文頭に出て倒置されている。',
      },
    ],
    keyPoints: ['Ifの省略による倒置は、仮定法過去完了で特によく使われる', '倒置文だと気づけば、通常の語順に戻して意味を取ればよい'],
    commonMistakes: ['Ifが省略された倒置文を疑問文だと誤解してしまう。'],
    relatedTermIds: ['term-inversion', 'term-subjunctive-past-perfect'],
    miniCheck: [
      {
        question: '"Had I known the truth, I would have acted differently." はどの構文の倒置ですか。',
        choices: ['否定倒置', '仮定法（Ifの省略）', '疑問文', '強調構文'],
        correctIndex: 1,
        explanation: 'If I had known...のIfが省略されて、Hadが文頭に出た仮定法の倒置です。',
      },
    ],
  },
  {
    id: 'theory-l3-12',
    level: 3,
    tag: '複雑な節構造',
    title: '複雑な節構造（節の入れ子）の読み方',
    shortDescription: '節の中に節が入る「入れ子構造」を層で捉える。',
    concept:
      '学術的な文章では、主節の中に従属節があり、さらにその従属節の中に別の節が入る「入れ子構造」がよく登場します。こうした文を読むコツは、一度にすべてを理解しようとせず、外側の層（主節）から内側の層（従属節、さらにその中の節）へと、階層ごとに分解して読むことです。',
    rules: [{ title: '外側から内側へ分解する', explanation: 'まず主節の主語・動詞を特定し、次に従属節、さらにその中の節、という順に階層を分けて処理します。' }],
    examples: [
      {
        english: 'Researchers believe that the reason patients who receive early treatment recover faster is that inflammation is controlled before it spreads.',
        japanese: '研究者たちは、早期治療を受けた患者がより早く回復する理由は、炎症が広がる前に制御されるからだと考えています。',
        explanation: '主節（Researchers believe）の中にthat節、その中にさらに関係詞節とthat節が入れ子になっている。',
      },
    ],
    keyPoints: ['1つの文に複数のthat/whichが出てきても慌てず、それぞれの役割を1つずつ確認する', '図に描き出す（下線や括弧でくくる）と構造が見えやすくなる'],
    commonMistakes: ['入れ子の階層を混同し、どのthat節がどの動詞に対応するかを誤って結び付けてしまう。'],
    relatedTermIds: ['term-noun-clause', 'term-adjective-clause', 'term-subordinate-clause'],
    miniCheck: [
      {
        question: '複雑な節構造を読むときに最も有効な方法はどれですか。',
        choices: ['すべての節を一度に訳す', '外側の主節から内側へ階層ごとに分解する', '節を無視して単語だけ拾う', '最後の節だけ読む'],
        correctIndex: 1,
        explanation: '主節から従属節、その中の節へと階層ごとに分解して読むのが効果的です。',
      },
    ],
  },
  {
    id: 'theory-l3-13',
    level: 3,
    tag: '因果関係',
    title: '因果関係を表す表現の総整理',
    shortDescription: 'because, therefore, due toなど、原因と結果をつなぐ多様な表現。',
    concept:
      '因果関係を表す表現には、従属接続詞（because, since, as）、接続副詞（therefore, thus, consequently, hence）、前置詞句（due to, owing to, because of）などがあり、それぞれ文中での使い方（節を導くか、名詞句を導くか）が異なります。学術英語ではこれらを正確に読み分けることが重要です。',
    rules: [
      { title: '節を導くか、名詞句を導くか', explanation: 'because/sinceは後ろに節（主語+動詞）、because of/due toは後ろに名詞句が続きます。' },
    ],
    examples: [
      {
        english: 'Due to the limited sample size, the results should be interpreted with caution.',
        japanese: 'サンプルサイズが限られているため、結果は慎重に解釈されるべきです。',
        explanation: 'Due toの後には名詞句（the limited sample size）が続いている。',
      },
    ],
    keyPoints: ['therefore/thusは文と文の間、または文頭でセミコロンやピリオドの後に置かれることが多い', 'becauseとbecause ofを文法的に混同しないよう注意する'],
    commonMistakes: ['"because of the results showed..." のように、because ofの後に節（主語+動詞）を続けてしまう。'],
    relatedTermIds: ['term-causal-connector'],
    miniCheck: [
      {
        question: '"___ the results were inconclusive, further research is needed." に入る正しい語はどれですか。',
        choices: ['Because', 'Because of', 'Due to', 'Owing to'],
        correctIndex: 0,
        explanation: '後ろに節（the results were inconclusive）が続くので、接続詞Becauseを使います。',
      },
    ],
  },
  {
    id: 'theory-l3-14',
    level: 3,
    tag: '対比表現',
    title: '対比・譲歩を表す表現の総整理',
    shortDescription: 'however, while, in contrast, despiteなど、対比を表す多様な語句。',
    concept:
      '対比・譲歩を表す表現には、接続副詞（however, nevertheless, in contrast, on the other hand）、従属接続詞（while, whereas, although）、前置詞（despite, in spite of）などがあります。それぞれ文中での位置や、後ろに続く形（節か名詞句か）が異なるため、正確な使い分けが必要です。',
    rules: [{ title: 'despiteの後は名詞句、althoughの後は節', explanation: 'despite/in spite ofの後には名詞句、although/thoughの後には節（主語+動詞）が続きます。' }],
    examples: [
      {
        english: 'Despite the promising early results, the drug failed in later clinical trials.',
        japanese: '有望な初期結果にもかかわらず、その薬は後の臨床試験で失敗しました。',
        explanation: 'Despiteの後に名詞句the promising early resultsが続いている。',
      },
    ],
    keyPoints: ['howeverは文と文をつなぐ副詞で、接続詞のbutとは文法的な使い方が異なる（セミコロンやピリオドが必要）', 'in contrastは前の内容と対照的な内容を導入する'],
    commonMistakes: ['howeverを等位接続詞butと同じようにコンマだけでつないでしまう（正しくはセミコロンかピリオドが必要）。'],
    relatedTermIds: ['term-contrast-connector', 'term-concession'],
    miniCheck: [
      {
        question: '"___ the limitations, the study provides valuable insights." に入る正しい語はどれですか。',
        choices: ['Although', 'Despite', 'However', 'Because'],
        correctIndex: 1,
        explanation: '後ろに名詞句the limitationsが続くので、前置詞Despiteを使います。',
      },
    ],
  },
  {
    id: 'theory-l3-15',
    level: 3,
    tag: '段落構造',
    title: '段落構造と論理展開の読み方',
    shortDescription: '段落の最初の文（トピックセンテンス）から要点をつかむ。',
    concept:
      '英語の説明的な文章では、多くの場合、段落の最初の1〜2文（トピックセンテンス）にその段落の要点が示され、続く文がその具体例やデータで支えます。段落構造を意識すると、細部を読む前に大まかな論理展開を予測でき、速く正確に読めるようになります。',
    rules: [{ title: 'トピックセンテンス→具体例→まとめの流れ', explanation: '多くの段落は「主張（トピックセンテンス）→具体例・データ→まとめ・帰結」という流れで構成されます。' }],
    examples: [
      {
        english: 'Exercise has numerous benefits for cardiovascular health. For example, regular aerobic activity lowers blood pressure and improves circulation. These effects together reduce the risk of heart disease.',
        japanese: '運動には心血管の健康に多くの利点があります。例えば、定期的な有酸素運動は血圧を下げ、血流を改善します。これらの効果が合わさって心臓病のリスクを減らします。',
        explanation: '最初の文が主張、For exampleの文が具体例、最後の文がまとめという典型的な段落構造。',
      },
    ],
    keyPoints: ['For example, For instanceは具体例の合図', 'In summary, Overall, Thereforeはまとめの合図'],
    commonMistakes: ['段落の構造を意識せず、すべての文を同じ重要度で読んでしまい、要点を見失う。'],
    relatedTermIds: ['term-causal-connector', 'term-contrast-connector'],
    miniCheck: [
      {
        question: '段落の最初の文（トピックセンテンス）の役割は何ですか。',
        choices: ['具体例を示す', '段落の要点を示す', '反対意見を述べる', '結論を保留する'],
        correctIndex: 1,
        explanation: 'トピックセンテンスはその段落全体の要点・主張を示す役割を持ちます。',
      },
    ],
  },
  {
    id: 'theory-l3-16',
    level: 3,
    tag: '強調構文',
    title: '強調構文とNotによる強調の応用',
    shortDescription: 'It is ... thatに加え、notを使った強い否定の強調。',
    concept:
      '強調構文（It is ... that）に加え、not only ... but also、never、at noなどの否定語を使った強調表現も学術英語でよく登場します。「単に〜だけではない」という強い主張を表すときに使われ、しばしば倒置を伴います。',
    rules: [{ title: 'not onlyの文頭倒置', explanation: 'Not onlyが文頭に来ると、その後は疑問文と同じ語順（助動詞+主語）になります。' }],
    examples: [
      {
        english: 'Not only did the treatment reduce symptoms, but it also improved overall quality of life.',
        japanese: 'その治療は症状を軽減しただけでなく、生活の質全体も改善しました。',
        explanation: 'Not onlyが文頭に来たことで、did the treatmentと倒置されている。',
      },
    ],
    keyPoints: ['but alsoは省略されることもある（but it improved...）', '強調構文（It is...that）と倒置による強調は別の構文だが、目的（強調）は共通している'],
    commonMistakes: ['Not onlyの後の倒置を忘れ、通常の語順のままにしてしまう。'],
    relatedTermIds: ['term-cleft-sentence', 'term-inversion', 'term-not-only-but-also'],
    miniCheck: [
      {
        question: '"Not only ___ effective, but it was also safe." に入る正しい形はどれですか。',
        choices: ['the drug was', 'was the drug', 'the drug is', 'is the drug'],
        correctIndex: 1,
        explanation: 'Not onlyが文頭に来ているので、was the drugと倒置します。',
      },
    ],
  },
  {
    id: 'theory-l3-17',
    level: 3,
    tag: '仮定法',
    title: '仮定法の応用（were to, if it were not for）',
    shortDescription: '未来の仮定や、「〜がなければ」という条件を表す仮定法表現。',
    concept:
      '仮定法には、were toを使った「万が一〜としたら」という未来の仮定や、if it were not for（現在）/ if it had not been for（過去）を使った「〜がなければ」という条件を表す表現があります。これらは学術論文の考察部分でもよく使われます。',
    rules: [
      { title: 'were toで極端な仮定', explanation: 'If S were to do ...は、実現の可能性が非常に低い未来の仮定を表します。' },
      { title: 'if it were not forで「〜がなければ」', explanation: 'if it were not for A（現在）、if it had not been for A（過去）で「Aがなければ（なかったら）」を表します。' },
    ],
    examples: [
      {
        english: 'If it were not for early diagnosis, the mortality rate would be much higher.',
        japanese: '早期診断がなければ、死亡率ははるかに高くなっているでしょう。',
        explanation: '「早期診断がなければ」という現在の事実に反する仮定。',
      },
    ],
    keyPoints: ['were toの後の主節はwould/could/might', '倒置形Were it not for ...もよく使われる'],
    commonMistakes: ['if it were not forとif it had not been forの時制（現在か過去か）を混同してしまう。'],
    relatedTermIds: ['term-subjunctive-past', 'term-subjunctive-past-perfect'],
    miniCheck: [
      {
        question: '「もし薬がなかったら、多くの人が苦しんでいるだろう」を正しく表すのはどれですか。',
        choices: [
          'If it were not for medicine, many people would suffer.',
          'If it is not for medicine, many people will suffer.',
          'If it had not been for medicine, many people would suffer.',
          'If it were not medicine, many people would suffer.',
        ],
        correctIndex: 0,
        explanation: '現在のことについての仮定なので、if it were not for ...を使います。',
      },
    ],
  },
  {
    id: 'theory-l3-18',
    level: 3,
    tag: '名詞構文',
    title: '名詞構文（動詞の抽象名詞化）',
    shortDescription: '動詞を名詞化して、フォーマルで簡潔な文を作る。',
    concept:
      '学術英語では、動詞を対応する抽象名詞に変えて使う「名詞構文」がよく使われます（increase→the increase of, analyze→the analysis of）。動詞のまま読もうとすると文が硬く感じられますが、「元の動詞は何か」を意識すると意味を素早くつかめます。',
    rules: [{ title: '動詞→名詞の対応を意識する', explanation: 'analysis（analyze）, reduction（reduce）, development（develop）のように、名詞の元になっている動詞を思い浮かべると理解が早まります。' }],
    examples: [
      {
        english: 'The analysis of the data revealed a significant reduction in symptoms.',
        japanese: 'データの分析により、症状の著しい減少が明らかになりました。',
        explanation: 'The analysis of the data = They analyzed the data、a reduction in symptoms = symptoms were reducedと動詞的に読み替えられる。',
      },
    ],
    keyPoints: ['名詞構文はof, in, byなどの前置詞を伴って「動詞の目的語・主語」に相当する情報を示す', '名詞構文を動詞に読み替える練習をすると読解速度が上がる'],
    commonMistakes: ['名詞構文をただの名詞として捉え、隠れた動作の主語・目的語の関係を見逃してしまう。'],
    relatedTermIds: ['term-noun'],
    miniCheck: [
      {
        question: '"the reduction of symptoms" を動詞的に言い換えるとどれが近いですか。',
        choices: ['symptoms reduce', 'symptoms are reduced', 'reduce symptoms fast', 'symptoms reduction'],
        correctIndex: 1,
        explanation: '名詞構文the reduction of symptomsは「症状が減少させられる」という受動的な意味に近いです。',
      },
    ],
  },
  {
    id: 'theory-l3-19',
    level: 3,
    tag: '無生物主語',
    title: '無生物主語構文',
    shortDescription: '人ではなく、ものや出来事を主語にする英語特有の表現。',
    concept:
      '英語では、日本語なら人を主語にするような内容でも、ものや出来事（研究、薬、環境など）を主語にすることがよくあります。これを「無生物主語構文」と呼びます。日本語に訳すときは「〜によって…」「〜のおかげで…」のように、原因・理由として訳すと自然になります。',
    rules: [{ title: '無生物主語は「原因・理由」として訳す', explanation: '無生物主語構文は、しばしば「Sのために」「Sによって」と副詞的に訳すと自然な日本語になります。' }],
    examples: [
      {
        english: 'This medication allows patients to manage their symptoms more effectively.',
        japanese: 'この薬のおかげで、患者はより効果的に症状を管理できます。',
        explanation: 'This medicationという無生物主語を、「この薬のおかげで」と理由のように訳すと自然。',
      },
    ],
    keyPoints: ['allow, enable, cause, lead to, preventなどの動詞が無生物主語とよく組み合わさる', '直訳（「この薬は患者に〜を許す」）より、意訳した方が自然な日本語になることが多い'],
    commonMistakes: ['無生物主語構文を無理に直訳し、不自然な日本語にしてしまう。'],
    relatedTermIds: ['term-svoc', 'term-causative-verb'],
    miniCheck: [
      {
        question: '"The rain prevented us from going out." の自然な訳し方はどれですか。',
        choices: ['雨が私たちを外出することから妨げた', '雨のせいで私たちは外出できなかった', '雨は外出を防いだ私たちから', '私たちは雨を妨げた'],
        correctIndex: 1,
        explanation: '無生物主語（The rain）を理由として訳すと自然な日本語になります。',
      },
    ],
  },
  {
    id: 'theory-l3-20',
    level: 3,
    tag: '多重修飾',
    title: '二重限定・多重修飾の読み方',
    shortDescription: '1つの名詞に複数の修飾語句が重なるときの整理の仕方。',
    concept:
      '学術英語の名詞句には、形容詞・前置詞句・分詞句・関係詞節など、複数の修飾要素が1つの名詞に同時にかかる「多重修飾」がよく見られます。それぞれの修飾語句がどの部分にかかっているかを、外側から内側へ、または重要度順に整理すると読みやすくなります。',
    rules: [{ title: '中心となる名詞をまず特定する', explanation: '長い名詞句では、まず中心となる名詞（ヘッドノード）を見つけ、その前後の修飾語句を1つずつ確認します。' }],
    examples: [
      {
        english: 'a large-scale, randomized, double-blind clinical trial conducted across multiple countries',
        japanese: '複数の国にわたって実施された大規模な無作為化二重盲検臨床試験',
        explanation: '中心の名詞trialに、前から3つの形容詞、後ろから分詞句が同時にかかっている。',
      },
    ],
    keyPoints: ['前置修飾（形容詞など）と後置修飾（分詞句、関係詞節など）を分けて整理する', '複数の形容詞が並ぶときは、コンマまたはandで区切られる'],
    commonMistakes: ['修飾語句が多すぎて、どれが中心の名詞かを見失ってしまう。'],
    relatedTermIds: ['term-adjective', 'term-participle', 'term-noun'],
    miniCheck: [
      {
        question: '上の例で、中心となる名詞（ヘッドノード）はどれですか。',
        choices: ['large-scale', 'randomized', 'trial', 'countries'],
        correctIndex: 2,
        explanation: 'trialが中心の名詞で、他の語句はすべてtrialを修飾しています。',
      },
    ],
  },
  {
    id: 'theory-l3-21',
    level: 3,
    tag: '強調表現',
    title: '強調のdoと再帰代名詞による強調',
    shortDescription: '動詞の前のdoや、-selfを使った強調表現。',
    concept:
      '一般動詞の前にdo/does/didを置くと、「本当に〜する」という強調になります。また、myself, himself, itselfなどの再帰代名詞を名詞や代名詞の直後（または文末）に置くと、「〜自身が」という強調になります。この2つは形は違いますが、どちらも「特に強調したい」という話し手の意図を表します。',
    rules: [
      { title: '強調のdo', explanation: '肯定文の一般動詞の前にdo/does/didを置くと、その動作を強調できます。' },
      { title: '再帰代名詞による強調', explanation: '名詞・代名詞の直後や文末に再帰代名詞を置くと、「他の誰でもなく〜自身が」という意味になります。' },
    ],
    examples: [
      {
        english: 'The director herself reviewed the final report.',
        japanese: '取締役自身が最終報告書を確認しました。',
        explanation: 'herselfがThe directorを強調している（他の誰でもなく取締役本人が）。',
      },
    ],
    keyPoints: ['強調のdoは疑問文・否定文のdoとは異なり、肯定文で使う', '再帰代名詞の強調用法は、文中のどこに置いても意味はほぼ同じ'],
    commonMistakes: ['再帰代名詞の強調用法と、動詞の目的語として使う再帰代名詞（wash oneselfなど）を混同してしまう。'],
    relatedTermIds: ['term-emphatic-do', 'term-pronoun'],
    miniCheck: [
      {
        question: '"She does understand the risks." のdoesの働きはどれですか。',
        choices: ['疑問文を作るdo', '否定文を作るdo', '動作を強調するdo', '過去を表すdo'],
        correctIndex: 2,
        explanation: '肯定文の中の一般動詞の前のdoesは、動作を強調する働きをしています。',
      },
    ],
  },
  {
    id: 'theory-l3-22',
    level: 3,
    tag: 'パラフレーズ',
    title: 'パラフレーズ（言い換え表現）の読み方',
    shortDescription: '同じ内容を別の語彙・構文で言い換える表現に慣れる。',
    concept:
      '英語の文章、特に学術的な文章では、同じ単語の繰り返しを避けるために、類義語や異なる構文で同じ内容を言い換える「パラフレーズ」が頻繁に使われます。前の文と後の文が実は同じ内容を指していることに気づけると、文章全体のつながりがぐっと理解しやすくなります。',
    rules: [{ title: '指示語・類義語のつながりに注目する', explanation: 'this finding, this phenomenon, such a resultのような指示語や、動詞の名詞形への言い換えに注目すると、パラフレーズを見抜きやすくなります。' }],
    examples: [
      {
        english: 'The drug reduced inflammation significantly. This anti-inflammatory effect was observed in nearly all participants.',
        japanese: 'その薬は炎症を著しく軽減しました。この抗炎症効果はほぼすべての参加者で観察されました。',
        explanation: '1文目の"reduced inflammation"が2文目で"this anti-inflammatory effect"に言い換えられている。',
      },
    ],
    keyPoints: ['同じ内容が違う語彙・構文で繰り返されていないか常に意識する', '言い換えに気づけないと、話が展開していると誤解してしまうことがある'],
    commonMistakes: ['パラフレーズを新しい情報だと誤解し、文章の論理構造を見失ってしまう。'],
    relatedTermIds: ['term-noun-clause'],
    miniCheck: [
      {
        question: '上の例文で"this anti-inflammatory effect"が指している内容はどれですか。',
        choices: ['薬の副作用', '炎症を軽減したこと', '参加者の人数', '観察の方法'],
        correctIndex: 1,
        explanation: '1文目の「炎症を著しく軽減した」ことを、2文目で言い換えて指しています。',
      },
    ],
  },
];
