import type { GrammarTheory } from '../../../types';

export const level5GrammarTheory: GrammarTheory[] = [
  {
    id: 'theory-l5-01',
    level: 5,
    tag: 'ハイジング表現',
    title: 'ハイジング表現（断定を避ける言い方）',
    shortDescription: 'may, appear to, suggestなど、断定を避けて控えめに述べる表現。',
    concept:
      '研究論文では、まだ100%証明されていないことを断定的に述べることを避けるため、「ハイジング（hedging）」と呼ばれる控えめな表現が多用されます。may, might, could, appear to, seem to, suggest, tend toなどがその代表例で、これらは「弱気だから」ではなく、科学的に誠実な書き方として使われています。',
    rules: [{ title: '断定と推量の書き分け', explanation: '確実なこと（is）と、可能性・示唆にとどまること（may suggest, appears to）を書き分けることが、研究英語の誠実さの表れです。' }],
    examples: [
      {
        english: 'These findings may suggest a link between diet and disease risk, although further research is needed.',
        japanese: 'これらの知見は食事と疾病リスクの関連を示唆しているかもしれないが、さらなる研究が必要である。',
        explanation: 'may suggestという二重のハイジングで、断定を避けている。',
      },
    ],
    keyPoints: ['ハイジングが使われている箇所は、著者自身がまだ確信を持てていない部分', 'It is possible that ..., There is some evidence that ...も同じ働きをする'],
    commonMistakes: ['ハイジング表現を見落とし、示唆・可能性にすぎない内容を確定した事実として読んでしまう。'],
    relatedTermIds: [],
    miniCheck: [
      {
        question: '"The results may indicate a causal relationship." の読み方として適切なのはどれですか。',
        choices: ['因果関係が完全に証明された', '因果関係の可能性が示唆されている程度', '因果関係は存在しない', '著者は自信がない'],
        correctIndex: 1,
        explanation: 'may indicateは断定を避けたハイジング表現で、「〜の可能性を示唆している」程度の意味です。',
      },
    ],
  },
  {
    id: 'theory-l5-02',
    level: 5,
    tag: '主張動詞+that節',
    title: '主張動詞＋that節の構文',
    shortDescription: 'suggest that, indicate that, argue thatなど、研究の主張を導く動詞。',
    concept:
      '研究論文では、「著者やデータが何を主張しているか」を示すために、suggest that, indicate that, demonstrate that, argue that, claim thatなどの動詞がthat節を伴って使われます。それぞれの動詞が持つ「主張の強さ」のニュアンスの違いを意識すると、著者の確信度を読み取れます。',
    rules: [{ title: '動詞によって主張の強さが違う', explanation: 'demonstrate/show（強い、確定的）> indicate（やや強い）> suggest（控えめ）という強さの違いがあります。' }],
    examples: [
      {
        english: 'The data clearly demonstrate that the intervention reduced hospital readmission rates.',
        japanese: 'データはその介入が再入院率を減少させたことを明確に示している。',
        explanation: 'demonstrateは強い確信を持った主張を表す動詞。',
      },
    ],
    keyPoints: ['claim thatは「主張する（が、必ずしも証明されていない）」という中立〜やや懐疑的なニュアンスを持つことがある', '動詞の強さのグラデーションを覚えておくと、著者の立場が見えてくる'],
    commonMistakes: ['suggestとdemonstrateを同じ強さの動詞だと捉えてしまう。'],
    relatedTermIds: ['term-noun-clause'],
    miniCheck: [
      {
        question: 'suggest, indicate, demonstrateのうち、最も強い確信を表す動詞はどれですか。',
        choices: ['suggest', 'indicate', 'demonstrate', 'すべて同じ強さ'],
        correctIndex: 2,
        explanation: 'demonstrateは「実証する」という強い確信を伴う動詞です。',
      },
    ],
  },
  {
    id: 'theory-l5-03',
    level: 5,
    tag: '研究英語の長い名詞句',
    title: '研究データを記述する長い名詞句',
    shortDescription: '複数の修飾語が重なった、研究論文特有の長い名詞句。',
    concept:
      '研究論文の結果（Results）セクションでは、統計量や研究条件を正確に示すために、非常に長い名詞句がよく使われます。「a statistically significant reduction in the mean systolic blood pressure of the intervention group」のような句を、中心の名詞（reduction）から逆算して読み解く力が求められます。',
    rules: [{ title: '中心の名詞を先に見つける', explanation: '長い名詞句では、まず中心となる名詞（この例ではreduction）を見つけ、その前後の修飾要素を整理します。' }],
    examples: [
      {
        english: 'A statistically significant reduction in the mean systolic blood pressure of the intervention group was observed.',
        japanese: '介入群の平均収縮期血圧における統計的に有意な減少が観察された。',
        explanation: '中心の名詞reductionに、a statistically significant（程度）、in the mean systolic blood pressure（何の減少か）、of the intervention group（誰の）という複数の修飾がかかっている。',
      },
    ],
    keyPoints: ['長い名詞句は文の主語（または目的語）になっていることが多い', '中心の名詞を見つけたら、前後の修飾語を1つずつ「その名詞にかかる情報」として整理する'],
    commonMistakes: ['長い名詞句の途中で読むのをやめてしまい、文全体の主語・動詞を見失う。'],
    relatedTermIds: ['term-noun', 'term-phrase'],
    miniCheck: [
      {
        question: '上の例文で、文全体の主語の中心となる名詞はどれですか。',
        choices: ['significant', 'reduction', 'blood pressure', 'group'],
        correctIndex: 1,
        explanation: 'reductionが中心の名詞で、他の語句はすべてこれを修飾しています。',
      },
    ],
  },
  {
    id: 'theory-l5-04',
    level: 5,
    tag: '方法論の前置詞句',
    title: '方法論を記述する前置詞句の連続',
    shortDescription: '実験手順を詳細に説明するため、前置詞句が連続する文。',
    concept:
      '方法（Methods）セクションでは、実験条件や手順を正確に伝えるために、前置詞句が連続することがよくあります。それぞれの前置詞句がどの情報（対象、期間、方法、場所）を表しているかを整理しながら読むと、実験デザインが正確に理解できます。',
    rules: [{ title: '前置詞句ごとに情報の種類を分類する', explanation: 'with, for, over, using, at などの前置詞ごとに、それが手段・期間・場所のどれを表しているかを意識します。' }],
    examples: [
      {
        english: 'Participants were monitored for six months using wearable devices at three research centers.',
        japanese: '参加者は3つの研究センターでウェアラブル端末を用いて6ヶ月間モニタリングされた。',
        structureBreakdown: {
          sentence: 'Participants were monitored for six months using wearable devices at three research centers.',
          translationJa: '参加者は3つの研究センターでウェアラブル端末を用いて6ヶ月間モニタリングされた。',
          segments: [
            { text: 'Participants were monitored', role: 'S+V（受動態）' },
            { text: 'for six months', role: '前置詞句（期間）' },
            { text: 'using wearable devices', role: '分詞構文（手段）' },
            { text: 'at three research centers', role: '前置詞句（場所）' },
          ],
        },
      },
    ],
    keyPoints: ['usingは前置詞的に「〜を用いて」という手段を表すことが多い', '複数の前置詞句がある場合、それぞれ異なる種類の情報を担っていることが多い'],
    commonMistakes: ['前置詞句の情報の種類（期間・場所・手段）を混同し、実験デザインを誤解してしまう。'],
    relatedTermIds: ['term-preposition'],
    miniCheck: [
      {
        question: '上の例文で"at three research centers"が表す情報の種類はどれですか。',
        choices: ['期間', '手段', '場所', '対象人数'],
        correctIndex: 2,
        explanation: '"at three research centers"はモニタリングが行われた場所を表しています。',
      },
    ],
  },
  {
    id: 'theory-l5-05',
    level: 5,
    tag: '統計比較表現',
    title: '統計結果を比較する表現',
    shortDescription: 'significantly higher/lower, compared withなど、統計的比較の定型表現。',
    concept:
      '研究論文の結果セクションでは、統計的な比較を示す定型表現がよく使われます。significantly higher/lower than（〜より有意に高い/低い）、no significant difference（有意差なし）、p < 0.05（統計的有意性の基準）などの表現に慣れておくと、結果を素早く正確に読み取れます。',
    rules: [{ title: 'significantは「大きい」ではなく「統計的に有意」', explanation: '日常語のsignificant（重要な）と違い、統計用語としてのsignificantは「偶然とは考えにくい」という統計的な意味を持ちます。' }],
    examples: [
      {
        english: 'The treatment group showed significantly lower pain scores compared with the control group (p < 0.001).',
        japanese: '治療群は対照群と比較して統計的に有意に低い痛みスコアを示した（p < 0.001）。',
        explanation: 'significantly lowerとp < 0.001が統計的有意性を示している。',
      },
    ],
    keyPoints: ['p値が小さいほど、偶然による結果である可能性が低いことを示す', 'no significant differenceは「差がなかった」という否定的な結果を表す重要な表現'],
    commonMistakes: ['statistically significant（統計的に有意）を日常的な意味の「重要」と同じだと誤解してしまう。'],
    relatedTermIds: ['term-comparative'],
    miniCheck: [
      {
        question: '"There was no significant difference between the two groups." の意味はどれですか。',
        choices: ['2群にわずかな差があった', '2群に統計的に意味のある差はなかった', '2群は完全に同一だった', '差は測定されなかった'],
        correctIndex: 1,
        explanation: 'no significant differenceは「統計的に意味のある差は見られなかった」という意味です。',
      },
    ],
  },
  {
    id: 'theory-l5-06',
    level: 5,
    tag: '研究英語の関係詞',
    title: '研究英語における関係詞の使い分け',
    shortDescription: '制限用法と非制限用法を正確に読み分け、必須情報と補足情報を区別する。',
    concept:
      '研究論文では、関係詞節が「その名詞を特定するために必須の情報」（制限用法）なのか、「すでに特定された名詞に補足情報を加えているだけ」（非制限用法）なのかを区別することが、正確な理解に直結します。コンマの有無がこの2つを見分ける最大の手がかりです。',
    rules: [{ title: 'コンマの有無で判断', explanation: 'コンマがあれば非制限用法（補足情報、なくても文意は変わらない）、なければ制限用法（必須情報、先行詞を限定する）です。' }],
    examples: [
      {
        english: 'Participants who withdrew from the study were excluded from the final analysis.',
        japanese: '研究から離脱した参加者は最終分析から除外された。',
        explanation: 'コンマがないので制限用法。「離脱した参加者」だけが除外対象と特定されている。',
      },
    ],
    keyPoints: ['制限用法は「その名詞のうち、条件に合うものだけ」を指す', '非制限用法は先行詞全体についての補足情報を加えているだけ'],
    commonMistakes: ['制限用法と非制限用法を読み間違え、「除外された人」の範囲を誤解してしまう。'],
    relatedTermIds: ['term-restrictive-relative', 'term-non-restrictive-relative'],
    miniCheck: [
      {
        question: '"Participants, who all provided informed consent, completed the survey." の関係詞節の働きはどれですか。',
        choices: ['参加者の一部だけを限定している', 'すべての参加者について補足情報を加えている', '参加者を除外する条件を示している', '文法的に不要な情報'],
        correctIndex: 1,
        explanation: 'コンマがあるので非制限用法で、すべての参加者について「全員が同意を提供した」という補足情報を加えています。',
      },
    ],
  },
  {
    id: 'theory-l5-07',
    level: 5,
    tag: '研究英語の分詞構文',
    title: '研究結果・手法を示す分詞構文',
    shortDescription: '「〜という結果になり」「〜を用いて」など、結果や手法をつなぐ分詞構文。',
    concept:
      '研究論文の結果・考察セクションでは、分詞構文が「その結果として〜になった」（resulting in, leading to）、「〜を示しながら」（showing, indicating）という形で、前の内容を受けて補足情報を加えるためによく使われます。文末に置かれることが特に多いパターンです。',
    rules: [{ title: '文末の分詞構文は「そしてその結果」', explanation: '結果を報告する文の末尾に置かれた分詞構文は、前の内容の帰結や、それに伴う追加情報を表すことが多いです。' }],
    examples: [
      {
        english: 'The intervention reduced symptom severity, suggesting a potential therapeutic benefit.',
        japanese: 'その介入は症状の重症度を軽減し、潜在的な治療上の利益を示唆した。',
        explanation: 'suggesting以下は、前の内容（症状軽減）がもたらす解釈上の帰結。',
      },
    ],
    keyPoints: ['showing, indicating, suggestingは「その結果として何が示されるか」を表す頻出パターン', '分詞構文の主語は、通常その前の文全体（内容）である'],
    commonMistakes: ['文末の分詞構文を、直前の名詞だけを修飾していると誤解してしまう。'],
    relatedTermIds: ['term-participial-construction'],
    miniCheck: [
      {
        question: '"The drug lowered cholesterol levels, reducing cardiovascular risk." のreducing以下は何を修飾していますか。',
        choices: ['drugという単語だけ', 'cholesterol levelsという単語だけ', '前の文全体の内容', '何も修飾していない'],
        correctIndex: 2,
        explanation: '文末の分詞構文は、前の文全体の内容（コレステロールを下げたこと）を受けて、その結果を表しています。',
      },
    ],
  },
  {
    id: 'theory-l5-08',
    level: 5,
    tag: '研究英語の倒置',
    title: '研究論文における倒置構文',
    shortDescription: '否定語や強調のための倒置が、考察部分でよく使われる。',
    concept:
      '研究論文の考察（Discussion）では、Not only ..., but also ...のような強調構文とともに倒置がよく使われ、著者の主張を際立たせます。また、条件文のIfを省略した倒置（Were this hypothesis correct, ...）も、フォーマルな考察でよく見られます。',
    rules: [{ title: '倒置が使われる典型的な場面', explanation: '否定語の強調、条件文のIf省略、比較のnorに続く文などで倒置が起こります。' }],
    examples: [
      {
        english: 'Not only did the treatment reduce symptoms, but it also improved long-term outcomes.',
        japanese: 'その治療は症状を軽減しただけでなく、長期的な転帰も改善した。',
        explanation: 'Not onlyが文頭に来たことで、did the treatmentと倒置されている。',
      },
    ],
    keyPoints: ['倒置文は通常の語順に戻して意味を取ると理解しやすい', '倒置は強い主張・対比を示す文でよく使われる'],
    commonMistakes: ['倒置文を疑問文だと誤解し、文の意味を取り違えてしまう。'],
    relatedTermIds: ['term-inversion', 'term-not-only-but-also'],
    miniCheck: [
      {
        question: '研究論文の考察部分で倒置が使われる主な目的はどれですか。',
        choices: ['文を長くするため', '主張を強調するため', '文法規則を守るため', '読みにくくするため'],
        correctIndex: 1,
        explanation: '倒置は著者の主張や対比を際立たせるために使われます。',
      },
    ],
  },
  {
    id: 'theory-l5-09',
    level: 5,
    tag: '考察の仮定法',
    title: '考察における仮定法（反実仮想）',
    shortDescription: '「もし〜だったら」と、研究の限界や別の可能性を考察する表現。',
    concept:
      '研究論文の考察（Discussion）や限界（Limitations）セクションでは、「もし異なる条件だったら結果はどうなっていたか」という反実仮想を仮定法で表現することがよくあります。これにより、著者は研究の限界を認識していることを示したり、今後の研究の方向性を示唆したりします。',
    rules: [{ title: '仮定法過去完了で「もし〜していたら」', explanation: '実際には行わなかった条件を仮定するときは、仮定法過去完了（Had we included..., the results might have differed.）を使います。' }],
    examples: [
      {
        english: 'Had a larger sample size been used, the results might have reached statistical significance.',
        japanese: 'もしより大きなサンプルサイズが用いられていたら、結果は統計的有意性に達していたかもしれない。',
        explanation: '実際には大きなサンプルサイズを使わなかったという過去の事実に反する仮定。',
      },
    ],
    keyPoints: ['考察での仮定法は、研究の限界に対する著者の自覚を示す', 'Ifを省略した倒置形（Had ...）がフォーマルな文章でよく使われる'],
    commonMistakes: ['考察の仮定法を、実際に起きたことだと誤解してしまう。'],
    relatedTermIds: ['term-subjunctive-past-perfect', 'term-inversion'],
    miniCheck: [
      {
        question: '"Had the study included a control group, the findings would have been more conclusive." から分かることはどれですか。',
        choices: ['実際に対照群が含まれていた', '実際には対照群が含まれていなかった', '対照群の必要はなかった', '結論はすでに確定的だった'],
        correctIndex: 1,
        explanation: '仮定法過去完了は過去の事実に反する仮定を表すため、実際には対照群が含まれていなかったことが分かります。',
      },
    ],
  },
  {
    id: 'theory-l5-10',
    level: 5,
    tag: '研究の対比表現',
    title: '先行研究との対比を示す表現',
    shortDescription: 'in contrast to, unlike previous studiesなど、自分の研究を位置づける表現。',
    concept:
      '研究論文では、自分の研究結果を先行研究と対比させることで、新規性や意義を示すことがよくあります。in contrast to / unlike previous studies（先行研究とは異なり）、consistent with（〜と一致して）、in line with（〜に沿って）などの表現で、自分の研究と既存の知見との関係を位置づけます。',
    rules: [{ title: '一致か対比かを見極める', explanation: 'consistent with/in line withは「先行研究と一致」、in contrast to/unlike は「先行研究と相違」を示すという逆の関係を表します。' }],
    examples: [
      {
        english: 'In contrast to previous studies, our results did not show a significant association between the two variables.',
        japanese: '先行研究とは対照的に、我々の結果は2つの変数間に有意な関連を示さなかった。',
        explanation: 'In contrast toが、先行研究と自分の研究の結果が異なることを示している。',
      },
    ],
    keyPoints: ['これらの表現は論文の新規性・独自性を主張する重要な部分に登場する', '一致か対比かで、その研究が「知見を補強するもの」か「疑問を投げかけるもの」かが分かる'],
    commonMistakes: ['in contrast toとconsistent withの意味を逆に覚えてしまう。'],
    relatedTermIds: ['term-contrast-connector'],
    miniCheck: [
      {
        question: '"Our findings are consistent with earlier reports." が示す関係はどれですか。',
        choices: ['先行研究と一致している', '先行研究と矛盾している', '先行研究を否定している', '先行研究とは無関係'],
        correctIndex: 0,
        explanation: 'consistent withは「〜と一致している」という意味です。',
      },
    ],
  },
  {
    id: 'theory-l5-11',
    level: 5,
    tag: '引用表現',
    title: '先行研究を引用する表現',
    shortDescription: 'According to, as reported by, previous studies have shownなど。',
    concept:
      '研究論文では、先行研究の知見を引用するための定型表現が多く使われます。According to X（Xによると）、As reported by X（Xが報告したように）、Previous studies have shown that ...（先行研究は〜を示している）などの表現に慣れておくと、「誰の主張か」を正確に把握できます。',
    rules: [{ title: '引用元を示す語句に注目', explanation: 'According to, as X argues, X reported thatのような表現の直後には、必ず引用元（研究者名や研究）が続きます。' }],
    examples: [
      {
        english: 'As reported by Smith et al. (2020), similar interventions have shown comparable efficacy in adult populations.',
        japanese: 'Smithら（2020年）が報告したように、類似の介入は成人集団において同等の有効性を示している。',
        explanation: 'As reported byの後にSmith et al. (2020)という引用元が示されている。',
      },
    ],
    keyPoints: ['et al.は「その他」を意味し、著者が複数いることを示す', '引用は著者自身の主張と先行研究の主張を区別するために重要'],
    commonMistakes: ['引用された先行研究の主張を、論文の著者自身の主張だと誤解してしまう。'],
    relatedTermIds: [],
    miniCheck: [
      {
        question: '"According to Johnson (2019), the mechanism remains unclear." の主張は誰のものですか。',
        choices: ['論文の著者自身', 'Johnson (2019)', '読者', '不明'],
        correctIndex: 1,
        explanation: 'According to Johnson (2019)とあるので、この主張はJohnsonという研究者によるものです。',
      },
    ],
  },
  {
    id: 'theory-l5-12',
    level: 5,
    tag: '数量表現',
    title: '研究英語の数量表現',
    shortDescription: 'a majority of, a substantial proportion ofなど、割合・数量を示す表現。',
    concept:
      '研究論文では、単純な数値だけでなく、a majority of（大部分の）、a substantial proportion of（かなりの割合の）、a small minority of（ごく一部の）のような、割合のニュアンスを持つ数量表現が頻繁に使われます。これらの表現のおおよその「割合感覚」を持っておくと、データを素早く解釈できます。',
    rules: [{ title: '数量表現のニュアンスの強さ', explanation: 'the majority of（過半数）> a substantial proportion of（かなりの割合）> a small number of（少数）というように、おおよその強弱があります。' }],
    examples: [
      {
        english: 'A substantial proportion of participants reported mild gastrointestinal symptoms.',
        japanese: 'かなりの割合の参加者が軽度の消化器症状を報告した。',
        explanation: 'A substantial proportion ofは「かなりの割合」という、半数に近いか、それ以上を示唆する表現。',
      },
    ],
    keyPoints: ['a handful of, a small number ofは「少数」を表す', 'nearly all, the vast majority ofは「ほぼ全員」に近い割合を表す'],
    commonMistakes: ['a majority ofとa minority ofを混同し、割合の大小を逆に理解してしまう。'],
    relatedTermIds: [],
    miniCheck: [
      {
        question: '"Only a small minority of patients experienced severe side effects." の意味はどれですか。',
        choices: ['ほとんどの患者が重い副作用を経験した', 'ごく一部の患者だけが重い副作用を経験した', '副作用は誰にも起きなかった', '副作用の程度は不明'],
        correctIndex: 1,
        explanation: 'a small minority ofは「ごく一部」という少数を表す表現です。',
      },
    ],
  },
  {
    id: 'theory-l5-13',
    level: 5,
    tag: 'limitationsの表現',
    title: '研究の限界（Limitations）を記述する表現',
    shortDescription: 'should be interpreted with caution, one limitation isなど、限界を示す定型表現。',
    concept:
      '誠実な研究論文には必ず限界（Limitations）についての記述があります。One limitation of this study is ...（本研究の限界の一つは〜である）、should be interpreted with caution（慎重に解釈されるべきである）、further research is needed（さらなる研究が必要である）といった表現は、その研究が示す結論の「適用範囲」を教えてくれる重要な手がかりです。',
    rules: [{ title: 'この部分は結論の適用範囲を狭める', explanation: 'Limitationsセクションの内容は、その研究の結論をそのまま一般化してはいけない理由を示しています。' }],
    examples: [
      {
        english: 'One limitation of this study is the relatively short follow-up period, and the long-term effects remain unknown.',
        japanese: '本研究の限界の一つは比較的短い追跡期間であり、長期的な効果は依然として不明である。',
        explanation: 'この文により、「長期的な効果については、この研究の結論を適用できない」ということが分かる。',
      },
    ],
    keyPoints: ['limitationsを読むことで、その研究の結論をどこまで信頼してよいかが分かる', 'further research is neededは「まだ結論が確定していない」ことを示すサイン'],
    commonMistakes: ['limitationsセクションを読み飛ばし、研究の結論を無条件に一般化して受け取ってしまう。'],
    relatedTermIds: [],
    miniCheck: [
      {
        question: '研究論文のLimitationsセクションを読む意義は何ですか。',
        choices: ['著者への批判を探すため', '結論をどこまで信頼してよいかを判断するため', '文法を学ぶため', '単に形式的な部分だから'],
        correctIndex: 1,
        explanation: 'Limitationsセクションは、結論の適用範囲や信頼性を正しく判断するために重要です。',
      },
    ],
  },
];
