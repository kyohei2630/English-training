import type { GrammarTheory } from '../../../types';

export const level4GrammarTheory: GrammarTheory[] = [
  {
    id: 'theory-l4-01',
    level: 4,
    tag: '受動態（医学）',
    title: '医学英語における受動態',
    shortDescription: '「誰が」より「何がどうされたか」に焦点を当てる医学英語の書き方。',
    concept:
      '医療・科学英語では、動作主（誰がしたか）よりも、処置や検査の対象（患者・組織・データ）に焦点を当てるため、受動態が非常に高い頻度で使われます。「The doctor treated the patient.」よりも「The patient was treated.」という言い回しが好まれる場面が多いことを意識しましょう。',
    rules: [{ title: '動作主は省略されることが多い', explanation: '「誰が治療したか」が自明・重要でない場合、by ...は省略されます。' }],
    examples: [
      {
        english: 'The tumor was surgically removed, and the patient was monitored for complications.',
        japanese: '腫瘍は外科的に摘出され、患者は合併症について経過観察されました。',
        structureBreakdown: {
          sentence: 'The tumor was surgically removed, and the patient was monitored for complications.',
          translationJa: '腫瘍は外科的に摘出され、患者は合併症について経過観察されました。',
          segments: [
            { text: 'The tumor', role: 'S（処置の対象）' },
            { text: 'was surgically removed', role: 'V（受動態）' },
            { text: 'the patient', role: 'S（処置の対象）' },
            { text: 'was monitored for complications', role: 'V（受動態）+修飾語' },
          ],
        },
      },
    ],
    keyPoints: ['動作主を示す必要があるときだけby ...を加える', '複数の処置が続くとき、それぞれ受動態で淡々と列挙されることが多い'],
    commonMistakes: ['受動態の文を無理に能動態に訳そうとして、不自然な日本語になってしまう。'],
    relatedTermIds: ['term-passive-voice'],
    miniCheck: [
      {
        question: '医学論文で受動態が好まれる主な理由はどれですか。',
        choices: ['文を長くするため', '処置や結果に焦点を当てるため', '動作主を強調するため', '文法的に簡単だから'],
        correctIndex: 1,
        explanation: '医学英語では「誰が」よりも「何がどうされたか」に焦点を当てるため受動態が好まれます。',
      },
    ],
  },
  {
    id: 'theory-l4-02',
    level: 4,
    tag: '症状の関係詞修飾',
    title: '症状・所見を説明する関係詞節',
    shortDescription: '患者や症状を表す名詞を、関係詞節で詳しく説明する。',
    concept:
      '医学英語では、患者・症状・所見を表す名詞に関係詞節を付けて、詳しい臨床情報を加えることがよくあります。特にwho（患者）、which（症状・検査結果）、that（両方）が頻出し、1つの名詞に複数の関係詞節が続くこともあります。',
    rules: [{ title: '先行詞が「人」か「もの」かを確認', explanation: '患者（patients）にはwho、症状や数値（symptoms, levelsなど）にはwhichを使います。' }],
    examples: [
      {
        english: 'Patients who present with chest pain that radiates to the left arm should be evaluated for cardiac causes.',
        japanese: '左腕に放散する胸痛を呈する患者は、心臓が原因である可能性を評価されるべきです。',
        explanation: 'who present with chest painがPatientsを、that radiates to the left armがchest painを修飾している。',
      },
    ],
    keyPoints: ['present with（〜の症状を呈する）は医学英語の頻出表現', '関係詞節が連続する文は、それぞれの先行詞を丁寧に確認する'],
    commonMistakes: ['先行詞が人か物かを確認せず、whoとwhichを取り違えてしまう。'],
    relatedTermIds: ['term-relative-pronoun', 'term-adjective-clause'],
    miniCheck: [
      {
        question: '"the symptoms ___ the patient reported" に入る正しい語はどれですか。',
        choices: ['who', 'which', 'where', 'whose'],
        correctIndex: 1,
        explanation: '先行詞the symptomsは物なので、whichを使います。',
      },
    ],
  },
  {
    id: 'theory-l4-03',
    level: 4,
    tag: '医学的因果表現',
    title: '医学英語の因果表現（due to, result in, caused by）',
    shortDescription: '原因と結果を結び付ける、医学英語特有の頻出表現。',
    concept:
      '医学英語では、病態や治療効果の因果関係を示す表現が多用されます。due to（〜が原因で）、result in（〜という結果になる）、be caused by（〜によって引き起こされる）、lead to（〜につながる）は、それぞれ原因と結果のどちらが主語に来るかが異なるので注意が必要です。',
    rules: [
      { title: '原因が主語ならresult in / lead to', explanation: '原因を主語にする場合は、"原因 + results in/leads to + 結果" の順になります。' },
      { title: '結果が主語ならbe caused by / be due to', explanation: '結果を主語にする場合は、"結果 + is caused by/is due to + 原因" の順になります。' },
    ],
    examples: [
      {
        english: 'Chronic inflammation can result in tissue damage over time.',
        japanese: '慢性的な炎症は、時間の経過とともに組織損傷を引き起こすことがあります。',
        explanation: '原因（inflammation）が主語で、result inが「結果になる」ことを表している。',
      },
    ],
    keyPoints: ['due toは本来形容詞的だが、現在は"because of"と同じように使われることが多い', 'be attributed to（〜に起因すると考えられる）も同じ因果関係の表現'],
    commonMistakes: ['result inとresult fromの主語・目的語の向きを逆にしてしまう（result fromは結果が主語）。'],
    relatedTermIds: ['term-causal-connector', 'term-passive-voice'],
    miniCheck: [
      {
        question: '"The infection ___ contaminated water." で「感染は汚染された水が原因だった」を表す正しい語はどれですか。',
        choices: ['resulted in', 'was caused by', 'led to', 'resulted from'],
        correctIndex: 1,
        explanation: '結果（The infection）が主語なので、be caused byを使います（was resulted fromでも近い意味になりますが、caused byがより自然です）。',
      },
    ],
  },
  {
    id: 'theory-l4-04',
    level: 4,
    tag: '数値比較',
    title: '数値を比較する表現',
    shortDescription: '医学データの増減・比較を表す表現。',
    concept:
      '医学・科学英語では、数値の増減を比較する表現が頻出します。increase/decrease by（〜だけ増減する）、increase/decrease to（〜まで増減する）、higher/lower than（〜より高い/低い）の違いを正確に理解することが、データを正しく読み取る鍵になります。',
    rules: [
      { title: 'byは変化量、toは到達値', explanation: '"increased by 10%"は「10%分増えた」、"increased to 10%"は「10%まで増えた」という全く違う意味になります。' },
    ],
    examples: [
      {
        english: 'The dosage was increased by 50 mg, reaching a total of 200 mg.',
        japanese: '用量は50mg増やされ、合計200mgに達しました。',
        explanation: 'increased by 50 mgは「50mg分増加した」という変化量を表す。',
      },
    ],
    keyPoints: ['compared with/compared toは「〜と比較して」という基準を示す', '数値のfrom A to Bは「AからBへ」という範囲・変化を表す'],
    commonMistakes: ['increase byとincrease toの意味を混同し、変化量と到達値を取り違えてしまう。'],
    relatedTermIds: ['term-comparative'],
    miniCheck: [
      {
        question: '"Blood pressure decreased by 20 mmHg." の正しい意味はどれですか。',
        choices: ['血圧が20mmHgまで下がった', '血圧が20mmHg分下がった', '血圧が20%下がった', '血圧が20mmHg以上あった'],
        correctIndex: 1,
        explanation: 'decreased by 20 mmHgは「20mmHg分減少した」という変化量を表します。',
      },
    ],
  },
  {
    id: 'theory-l4-05',
    level: 4,
    tag: '手順の分詞構文',
    title: '検査・治療手順を表す分詞構文',
    shortDescription: '「〜した後、〜して」と、処置の手順を分詞構文でつなぐ。',
    concept:
      '医療英語では、検査や処置の手順を説明するとき、接続詞を使わず分詞構文で簡潔につなぐことがよくあります。「Aを行い、続いてBを行った」という一連の流れを、分詞構文を使ってテンポよく表現します。',
    rules: [{ title: '手順の順序は分詞構文の位置で判断', explanation: '文頭の分詞構文は先に行われたこと、文末の分詞構文はその後に続いて行われたことを表すことが多いです。' }],
    examples: [
      {
        english: 'The catheter was inserted, allowing continuous monitoring of blood pressure.',
        japanese: 'カテーテルが挿入され、それにより血圧の継続的なモニタリングが可能になりました。',
        explanation: 'allowing以下は、カテーテル挿入の結果として起きたことを表す分詞構文。',
      },
    ],
    keyPoints: ['文末のallowing, enabling, resultingなどは「その結果〜を可能にする/引き起こす」という意味になりやすい', '手順を表す文章では、受動態＋分詞構文の組み合わせが多い'],
    commonMistakes: ['分詞構文の意味上の主語を誤り、文全体の主語と混同してしまう。'],
    relatedTermIds: ['term-participial-construction'],
    miniCheck: [
      {
        question: '"The sample was frozen, preserving its cellular structure." のpreserving以下の意味はどれですか。',
        choices: ['凍結する前の状態', '凍結した理由', '凍結の結果として保存されたこと', '凍結を妨げたこと'],
        correctIndex: 2,
        explanation: '文末の分詞構文は「その結果〜が保存された」という結果を表しています。',
      },
    ],
  },
  {
    id: 'theory-l4-06',
    level: 4,
    tag: '複合名詞',
    title: '専門用語の複合名詞',
    shortDescription: '複数の名詞が連なって1つの専門用語を作る医学英語特有の表現。',
    concept:
      '医学・科学英語では、blood pressure（血圧）、heart rate monitor（心拍数モニター）のように、複数の名詞が連なって1つの専門用語（複合名詞）を作ることが非常に多くあります。複合名詞は基本的に後ろの名詞が中心（ヘッド）で、前の名詞がそれを修飾する形です。',
    rules: [{ title: '後ろの名詞が中心', explanation: 'A B（A+B）という複合名詞では、Bが中心の意味を持ち、Aがそれを修飾します（blood pressure＝pressure of blood）。' }],
    examples: [
      {
        english: 'The intensive care unit uses a continuous blood glucose monitoring system.',
        japanese: '集中治療室は継続的な血糖モニタリングシステムを使用しています。',
        explanation: 'blood glucose monitoring systemは「血糖（を）モニタリングするシステム」という複合名詞。',
      },
    ],
    keyPoints: ['3語以上の複合名詞は、後ろから前に向かって訳すと理解しやすいことが多い', 'ハイフンでつながれることもある（well-known, long-term）'],
    commonMistakes: ['複合名詞をすべて別々の単語として読み、専門用語としてのまとまりを見逃してしまう。'],
    relatedTermIds: ['term-noun'],
    miniCheck: [
      {
        question: '"blood glucose monitoring system" の中心となる語はどれですか。',
        choices: ['blood', 'glucose', 'monitoring', 'system'],
        correctIndex: 3,
        explanation: '複合名詞では最後の語systemが中心の意味を持ち、他の語がそれを修飾しています。',
      },
    ],
  },
  {
    id: 'theory-l4-07',
    level: 4,
    tag: '略語と同格',
    title: '医学略語と同格表現',
    shortDescription: '正式名称の直後に略語をかっこで示す、医学英語特有の同格。',
    concept:
      '医学英語では、専門用語を正式名称で書いた直後に、かっこで略語を示す形がよく使われます（magnetic resonance imaging (MRI)）。これも広い意味での同格表現で、一度定義された略語は、以降の文章でその略語だけが使われます。',
    rules: [{ title: '初出で定義、以降は略語のみ', explanation: '専門用語は最初に正式名称＋略語で示され、以降の文ではその略語だけが使われるのが一般的なルールです。' }],
    examples: [
      {
        english: 'The patient underwent magnetic resonance imaging (MRI), and the MRI revealed no abnormalities.',
        japanese: '患者はMRI（磁気共鳴画像法）検査を受け、MRIでは異常は見られませんでした。',
        explanation: '最初にmagnetic resonance imaging (MRI)と定義し、2回目以降はMRIだけを使っている。',
      },
    ],
    keyPoints: ['略語が何度も登場する文章では、最初の定義を読み飛ばさないことが重要', '同じ略語が別の意味で使われることもあるので文脈に注意する'],
    commonMistakes: ['略語の初出の定義を見逃し、後で出てくる略語の意味が分からなくなってしまう。'],
    relatedTermIds: ['term-apposition'],
    miniCheck: [
      {
        question: '医学英語で専門用語の略語が初めて登場するときの一般的な示し方はどれですか。',
        choices: ['略語だけをいきなり使う', '正式名称の後にかっこで略語を示す', '略語の後にかっこで正式名称を示す', '脚注で説明する'],
        correctIndex: 1,
        explanation: '正式名称の直後にかっこで略語を示すのが一般的な同格の示し方です。',
      },
    ],
  },
  {
    id: 'theory-l4-08',
    level: 4,
    tag: '医学的条件文',
    title: '臨床上の条件文（if / should / in case of）',
    shortDescription: '「もし患者が〜の場合」という臨床上の条件を示す表現。',
    concept:
      '医療英語では、特定の症状や状況が起きた場合の対応を示すために条件文がよく使われます。if（もし〜なら）に加え、should（万一〜なら、やや硬い表現）、in the event of / in case of（〜の場合には）といった表現もガイドラインや添付文書で頻出します。',
    rules: [{ title: 'shouldを使った条件文', explanation: 'If節のIfを省略し、Should + 主語 + 動詞の原形で「万一〜の場合」という硬い条件文を作れます。' }],
    examples: [
      {
        english: 'Should symptoms persist for more than 48 hours, patients should seek medical attention.',
        japanese: '万一症状が48時間以上続く場合は、患者は医療機関を受診すべきです。',
        explanation: 'If symptoms should persist...のIfが省略され、Shouldが文頭に出ている。',
      },
    ],
    keyPoints: ['in case of + 名詞は「〜の場合には」という簡潔な条件の示し方', 'ガイドライン特有の硬い文体では条件文が多用される'],
    commonMistakes: ['Shouldで始まる条件文を疑問文だと誤解してしまう。'],
    relatedTermIds: ['term-inversion', 'term-subordinating-conjunction'],
    miniCheck: [
      {
        question: '"Should the patient develop a fever, notify the physician immediately." のShouldの働きはどれですか。',
        choices: ['疑問文を作る', '義務を表す助動詞', '条件文のIfの代わり', '提案を表す'],
        correctIndex: 2,
        explanation: 'If the patient should develop...のIfが省略された条件文の倒置形です。',
      },
    ],
  },
  {
    id: 'theory-l4-09',
    level: 4,
    tag: '医学的使役表現',
    title: '検査・診断における使役・知覚表現',
    shortDescription: '「検査により〜が明らかになる/発見される」という表現パターン。',
    concept:
      '医学英語では、検査や観察によって何かが「明らかになる」「発見される」ことを表す表現が頻出します。reveal（明らかにする）、show（示す）、indicate（示唆する）、be found to be（〜であることが分かる）などの動詞と、無生物主語（検査、画像など）の組み合わせに慣れましょう。',
    rules: [{ title: '無生物主語+reveal/show/indicate', explanation: '"The scan revealed ..."のように、検査そのものを主語にする文がよく使われます。' }],
    examples: [
      {
        english: 'The biopsy revealed no signs of malignancy.',
        japanese: '生検の結果、悪性の兆候は見られませんでした。',
        explanation: 'The biopsyという無生物主語がrevealedの主語になっている。',
      },
    ],
    keyPoints: ['be found to be / be shown to doは「〜であることが分かった/示された」', 'これらの表現は受動態と組み合わされることも多い'],
    commonMistakes: ['無生物主語構文を直訳し、「生検は明らかにした」のような不自然な日本語にしてしまう。'],
    relatedTermIds: ['term-perception-verb', 'term-passive-voice'],
    miniCheck: [
      {
        question: '"The test ___ that the levels were within normal range." に入る自然な動詞はどれですか。',
        choices: ['said', 'indicated', 'talked', 'told'],
        correctIndex: 1,
        explanation: '検査結果が「示す」という意味には、indicated（示唆した）が自然です。',
      },
    ],
  },
  {
    id: 'theory-l4-10',
    level: 4,
    tag: '程度頻度表現',
    title: '程度・頻度を表す医学英語表現',
    shortDescription: 'mild, moderate, severe や、rarely, commonlyなどの程度・頻度表現。',
    concept:
      '医学英語では、症状や副作用の程度（mild軽度、moderate中等度、severe重度）や頻度（rarely稀に、occasionally時々、commonly/frequently頻繁に）を表す形容詞・副詞が、診断や治療方針を左右する重要な情報として使われます。これらのニュアンスの違いを正確に読み取ることが大切です。',
    rules: [{ title: '程度と頻度は別の軸', explanation: '「重症度（mild/moderate/severe）」と「頻度（rare/common）」は別々の情報なので、混同しないようにします。' }],
    examples: [
      {
        english: 'Nausea is a common but usually mild side effect of this medication.',
        japanese: '吐き気はこの薬のよくある副作用ですが、通常は軽度です。',
        explanation: 'common（頻度）とmild（程度）という2つの異なる軸の情報が含まれている。',
      },
    ],
    keyPoints: ['rarely, seldomは頻度の低さを表す否定的な意味の副詞', '程度・頻度を表す語の組み合わせで副作用のリスクが判断される'],
    commonMistakes: ['頻度（common）を重症度（severe）と同じ意味だと勘違いしてしまう。'],
    relatedTermIds: ['term-adverb', 'term-adjective'],
    miniCheck: [
      {
        question: '"a mild but common side effect" のmildが表すのはどれですか。',
        choices: ['頻度の低さ', '症状の軽さ（程度）', '発生の速さ', '治療の必要性'],
        correctIndex: 1,
        explanation: 'mildは症状の程度（軽度）を表す語です。',
      },
    ],
  },
  {
    id: 'theory-l4-11',
    level: 4,
    tag: '比較対照表現',
    title: '比較対照研究の表現（compared with, versus）',
    shortDescription: '2つの治療法・群を比較するときに使う表現。',
    concept:
      '臨床研究では、2つの治療法や患者群を比較する表現が頻出します。compared with/to（〜と比較して）、versus（vs., 〜対〜）、relative to（〜と比べて）などがあり、どちらが基準でどちらが比較対象かを正確に読み取る必要があります。',
    rules: [{ title: 'A versus B（A vs. B）の読み方', explanation: 'A versus Bは「AとBを比較する」という意味で、通常Aが主に注目されている群、Bが対照群であることが多いです。' }],
    examples: [
      {
        english: 'The new drug showed a higher response rate compared with the standard treatment.',
        japanese: '新薬は標準治療と比較して高い奏効率を示しました。',
        explanation: 'compared with the standard treatmentが比較の基準を示している。',
      },
    ],
    keyPoints: ['relative toはcompared withとほぼ同じ意味で使われる', '比較の基準（何と比べているか）を必ず確認する'],
    commonMistakes: ['どちらの群が比較の基準かを取り違え、結果の解釈を逆にしてしまう。'],
    relatedTermIds: ['term-comparative'],
    miniCheck: [
      {
        question: '"Group A had fewer complications compared with Group B." で比較の基準になっているのはどれですか。',
        choices: ['Group A', 'Group B', 'complications', 'fewer'],
        correctIndex: 1,
        explanation: 'compared with Group Bとあるので、Group Bが比較の基準です。',
      },
    ],
  },
  {
    id: 'theory-l4-12',
    level: 4,
    tag: '動作主省略の受動態',
    title: '動作主が省略された受動態の解釈',
    shortDescription: 'by ...がない受動態から、誰が・何がその動作をしたかを推測する。',
    concept:
      '医学英語の受動態では、動作主（by ...）が省略されることが非常に多くあります。多くの場合、動作主は「医療従事者」「研究者」「この研究で用いられた装置」など文脈から推測可能であり、あえて省略することで文をすっきりさせています。動作主が誰かを意識しながら読むと、内容の理解が深まります。',
    rules: [{ title: '文脈から動作主を補って理解する', explanation: '受動態の動作主が省略されていても、周辺の文脈（誰が実験をしているか等）から補って理解する習慣をつけます。' }],
    examples: [
      {
        english: 'Blood samples were collected at baseline and analyzed for inflammatory markers.',
        japanese: '血液サンプルはベースライン時に採取され、炎症マーカーについて分析されました。',
        explanation: 'collected, analyzedの動作主（研究者・医療スタッフ）は明示されていないが、文脈から推測できる。',
      },
    ],
    keyPoints: ['動作主が省略された受動態は、方法（Methods）セクションで特に多い', '動作主が重要な場合（特定の専門家、特定の機器など）は明示される'],
    commonMistakes: ['動作主が省略されていることに気づかず、誰が行ったのか分からないまま読み進めてしまう。'],
    relatedTermIds: ['term-passive-voice'],
    miniCheck: [
      {
        question: '医学論文の方法（Methods）セクションで動作主が省略される主な理由はどれですか。',
        choices: ['文法的に必須だから', '動作主が自明・重要でないことが多いから', '受動態には動作主を書けないから', '読者を混乱させるため'],
        correctIndex: 1,
        explanation: '動作主（研究者・医療スタッフ）が自明・重要でないため、簡潔にするために省略されます。',
      },
    ],
  },
  {
    id: 'theory-l4-13',
    level: 4,
    tag: '研究状況の時制',
    title: '研究・症例報告における時制の使い分け',
    shortDescription: '過去形（症例の経過）と現在完了形（現在まで続く知見）の使い分け。',
    concept:
      '症例報告や医学論文では、患者の経過や実験の手順には過去形を、現在まで通用する知見や一般的な事実には現在形・現在完了形を使うという時制の使い分けがあります。この違いに注目すると、「その情報が特定の症例のことなのか、一般的な知見なのか」を見分けられます。',
    rules: [
      { title: '症例の経過は過去形', explanation: '特定の患者・実験で起きた具体的な出来事は過去形で書かれます。' },
      { title: '一般的な知見は現在形・現在完了形', explanation: '広く受け入れられている知見や、現在まで蓄積されている研究の傾向には現在形や現在完了形が使われます。' },
    ],
    examples: [
      {
        english: 'The patient presented with fever and was admitted to the hospital. Fever is a common early sign of infection.',
        japanese: 'その患者は発熱を呈し、入院しました。発熱は感染症の一般的な初期徴候です。',
        explanation: '1文目（presented, was admitted）は特定の症例の過去の経過、2文目（is）は一般的な知見。',
      },
    ],
    keyPoints: ['時制の切り替わりに注目すると、「個別の症例」と「一般論」を区別できる', '研究の背景（Introduction）では現在完了形で「これまでの研究の蓄積」を示すことが多い'],
    commonMistakes: ['過去形の症例の記述と、現在形の一般論を同じレベルの情報として扱ってしまう。'],
    relatedTermIds: ['term-present-perfect', 'term-past-tense'],
    miniCheck: [
      {
        question: '症例報告で、特定の患者に起きた出来事を書くときに使われる時制はどれですか。',
        choices: ['現在形', '過去形', '未来形', '仮定法'],
        correctIndex: 1,
        explanation: '特定の患者・症例の具体的な経過は過去形で記述されます。',
      },
    ],
  },
];
