/**
 * Reinforcement for grammar questions whose explanation was a single short sentence (audit
 * 2026-10, explanations under 25 characters). Each entry is APPENDED to the existing
 * explanation, so the original wording is kept. Where a choice question had no reasons for its
 * wrong options, `whyOthersWrong` is added in the same format as the rest of the bank ('(正解)'
 * at the correct position). `choices` replaces a distractor that was also grammatical English.
 *
 * Applied to the data files with: npx tsx scripts/apply-explanation-patches.ts
 */
export interface ExplanationPatch {
  add: string;
  whyOthersWrong?: string[];
  choices?: string[];
}

const OK = '(正解)';

export const EXPLANATION_PATCHES: Record<string, ExplanationPatch> = {
  // ------------------------------------------------------------------ Level 1
  grammar_l1_013: { add: 'goed とはしません。規則動詞の -ed を付けない不規則動詞（go-went, come-came, see-saw）は形ごと覚えます。yesterday など過去を表す語が目印です。' },
  grammar_l1_022: { add: '時刻・時点は at（at nine, at noon）、曜日・日付は on、月・年・季節は in と、時間の「幅」が広がる順に at → on → in と覚えます。' },
  grammar_l1_023: { add: '月（in May）・季節（in winter）も in です。日付まで言うと on（on May 5, 1990）に変わる点に注意します。' },
  grammar_l1_025: { add: 'so の前には原因、後ろには結果が来ます。同じ内容は I went to bed early because I was tired. と because（後ろに原因）でも書けます。' },
  grammar_l1_028: { add: '疑問詞は「何を尋ねるか」で選びます。答えが in Kita-ku のような場所になる質問なら Where です。' },
  grammar_l1_031: { add: '主語と be動詞の組み合わせは I → am、you・複数 → are、三人称単数（he, she, it, 名詞1つ）→ is の3通りです。' },
  grammar_l1_036: { add: '「同じクラスです」は「同じクラスにいる」と考えて in the same class とします。We are the same class. とすると「私たち＝クラス」になってしまいます。' },
  grammar_l1_038: {
    add: 'be動詞は主語に合わせて形を選びます。you は単数でも複数でも are です。',
    whyOthersWrong: ['You is: is は三人称単数用です。', OK, 'You am: am は主語が I のときだけです。', 'You be: be は原形で、助動詞や命令文の後で使います。'],
  },
  grammar_l1_044: { add: '三単現の -s が付くのは主語が he / she / it など三人称単数のときだけです（He studies English.）。' },
  grammar_l1_048: {
    add: '主語が複数（we, they, 複数名詞）なら動詞は原形のままです。',
    whyOthersWrong: ['We knows: -s は三人称単数の主語のときだけ付けます。', OK, 'We knowing: -ing 形だけでは文の動詞になりません。', 'We is know: be動詞と一般動詞を並べることはできません。'],
  },
  grammar_l1_049: { add: '主語が I・you・複数のときは -s を付けません。She needs ... なら -s が付きます。' },
  grammar_l1_060: { add: 'have は一般動詞なので否定は don\'t have です（We haven\'t time. は一般的ではありません）。主語が三人称単数なら doesn\'t have です。' },
  grammar_l1_066: { add: '一般動詞なら Do you ...? ですが、be動詞の文（You are a doctor.）は are を前に出すだけです。答え方は Yes, I am. / No, I\'m not.' },
  grammar_l1_068: {
    add: 'Does / Did を使う疑問文では、-s や -ed は Does / Did が引き受けるので、動詞は必ず原形に戻します。',
    whyOthersWrong: ['Does he has: Does の後に has（-s 形）を重ねることはできません。', OK, 'Do he: 主語が三人称単数なので Does です。', 'Is he have: 一般動詞の疑問文に be動詞は使いません。'],
  },
  grammar_l1_084: { add: '規則動詞のように -ed を付けた goed は誤りです。go-went-gone の3つの形をセットで覚えます。' },
  grammar_l1_085: { add: 'last night は過去なので Did を使います。Did の後の動詞は原形（sleep）です。Do / Does は現在、Are は be動詞の文に使います。' },
  grammar_l1_088: {
    add: 'see-saw-seen と変化します。過去の1回の出来事は過去形 saw だけで表します。',
    whyOthersWrong: ['was seen: be動詞＋過去分詞は受け身（「見られた」）になり意味が変わります。', OK, 'seed: see は不規則動詞なので -ed は付けません。', 'seen: 過去分詞だけでは文の動詞になりません（have seen なら可）。'],
  },
  grammar_l1_089: { add: 'didn\'t の後は原形なので didn\'t finished とはしません。過去を表すのは did の1か所だけです。' },
  grammar_l1_096: { add: 'will・can・must などの助動詞の後は、主語が三人称単数でも -s を付けません。' },
  grammar_l1_097: { add: '「〜になる」は become です。I will be a nurse next year. も自然です。予定が決まっていることを強調するなら I am going to become ... も使えます。' },
  grammar_l1_100: { add: '時刻表のように決まった予定なら The meeting starts at ten tomorrow. と現在形でも表せます。' },
  grammar_l1_102: { add: 'are を使うなら are going to move の形が必要です。do は未来を表さず、did は過去です。' },
  grammar_l1_111: { add: '命令文には主語を置かず、動詞の原形から始めます。Please を付けると丁寧になります（Please wear your seatbelt.）。' },
  grammar_l1_112: { add: '形容詞（quiet, careful, late）を使う命令文は、be動詞の原形 Be で始めます。Are quiet. や Is quiet. とはしません。' },
  grammar_l1_113: { add: 'please は文頭か文末（..., please.）に置きます。after meals（食後に）のような時を表す語句は文の最後に置きます。' },
  grammar_l1_114: { add: 'Not で命令文を始めることはできません。Do not touch ... と書いても正解です（掲示では Do not がよく使われます）。' },
  grammar_l1_117: {
    add: '否定の命令文は主語を置かず Don\'t で始めます。',
    whyOthersWrong: [OK, 'Not worry: Not から命令文は作れません。', 'Doesn\'t worry: 命令文に doesn\'t は使いません。', 'You don\'t worry ..., please: 主語のある普通の文になり、命令の意味になりません。'],
  },
  grammar_l1_118: { add: 'careful は形容詞なので、動詞の Be が必要です。Careful when you cross the street. と be を省くと文になりません。' },
  grammar_l1_119: { add: 'be動詞の命令文でも否定は Don\'t を前に置き、Don\'t be の形にします。Be not late. とはしません。' },
  grammar_l1_120: { add: '「たくさんの水」は数えられない名詞なので a lot of water（much water）です。many water とはしません。' },
  grammar_l1_122: { add: 'can の後は原形です（I can speak）。can の否定は cannot / can\'t です。' },
  grammar_l1_124: { add: 'can が「できる」を表すので、後ろの動詞は原形 play に戻します。楽器の前には the を付けるのが一般的です（play the violin）。' },
  grammar_l1_125: { add: 'must は話し手が課す義務です。have to でも書けます（You have to finish ...）。「〜してはいけない」は must not です。' },
  grammar_l1_127: {
    add: 'should・must・can などの助動詞の後には to を付けず、原形を置きます（ought to だけは to が付きます）。',
    whyOthersWrong: ['should to rest: 助動詞の後に to は付けません。', OK, 'should resting: 助動詞の後は原形です。', 'shoulds: 助動詞に -s は付きません。'],
  },
  grammar_l1_132: { add: 'on は「接して」いれば上でなくても使えます（a picture on the wall）。in は中、at はある地点です。' },
  grammar_l1_133: { add: 'by 7 p.m. は「7時までに（済ませる）」という期限の意味になり、「7時に」とは意味が違います。' },
  grammar_l1_134: { add: '月だけなら in August、日付まで言うと on August 5 です。' },
  grammar_l1_135: { add: 'on は曜日・日付に使います（on Monday）。時刻は at nine o\'clock です。' },
  grammar_l1_136: { add: '存在を表すので「主語＋be動詞＋場所」の形です。There is a cat under the bed. でも同じ内容を表せます。' },
  grammar_l1_137: { add: 'in the park は「公園の中で」歩いたという意味になり、「通り抜けて」学校へ行く意味にはなりません。across は「横切って」です。' },
  grammar_l1_139: {
    add: '住んでいる都市・国には in を使います（live in Japan）。番地など具体的な地点なら at も使われます。',
    whyOthersWrong: [OK, 'at Tokyo: 都市のような広い場所には通常 in を使います。', 'on Tokyo: on は表面に接しているときなどに使います。', 'to Tokyo: to は方向・移動先を表します（go to Tokyo）。'],
  },
  grammar_l1_140: { add: '3つ以上のものの間は among を使います（among the trees）。between A and B の形で覚えます。' },
  grammar_l1_142: { add: 'from three to five の代わりに from three until five も使えます。「〜まで続く」は last ... until でも表せます。' },
  grammar_l1_148: { add: 'because の後ろには理由の文（主語＋動詞）が来ます。Because I was hungry, I ate a sandwich. と前に置くときはコンマを付けます。' },
  grammar_l1_150: { add: '選択疑問文は A or B の形です。答えは Yes / No ではなく Tea, please. のように選んだものを答えます。' },
  grammar_l1_153: { add: 'There is の後ろの名詞（a problem）が文の主語にあたるので、複数なら There are problems ... になります。with this device は「この機器に関して」です。' },
  grammar_l1_161: { add: '日付・時を尋ねる基本は When です（What is your birthday? も口語では使われます）。Where は場所、Who は人を尋ねます。' },
  grammar_l1_162: { add: '人の名前や関係を尋ねるのは Who、職業を尋ねるなら What does he do? を使います。' },
  grammar_l1_164: { add: 'How は手段・方法・状態を尋ねます。答えは By train. / I walk. のようになります。' },
  grammar_l1_166: { add: '数えられる物の数は How many ...? です。値段を尋ねるときは数えられない「金額」として How much を使います。' },
  grammar_l1_167: { add: 'What time ...? は時刻を尋ねます。答えは It\'s ten thirty. のように It を主語にします。' },
  grammar_l1_170: { add: '限られた選択肢の中から選ぶときは Which、選択肢が決まっていなければ What を使います（What color do you like?）。' },
  // ------------------------------------------------------------------ Level 2
  grammar_l2_040: { add: 'decide・want・hope・plan など「これからすること」を表す動詞は to 不定詞をとります。' },
  grammar_l2_041: { add: 'want to be a doctor でも同じ意味です。want の後は不定詞で、want becoming とはしません。' },
  grammar_l2_043: {
    add: 'surprised・glad・sad など感情の形容詞の後の to 不定詞は「〜して（驚いた）」と感情の原因を表します。',
    whyOthersWrong: ['hear: 形容詞の直後に動詞の原形は置けません。', 'hearing: surprised at hearing なら可能ですが、前置詞なしでは使えません。', OK, 'heard: 過去形をここに置くことはできません。'],
  },
  grammar_l2_047: { add: '「〜するために」は to 不定詞で表します。目的をはっきりさせたいときは in order to pass でも書けます。' },
  grammar_l2_051: {
    add: 'finish・enjoy・avoid・mind・give up は動名詞（-ing）だけを目的語にとります。',
    whyOthersWrong: ['write: 動詞の後に原形を続けることはできません。', 'to write: finish は不定詞を目的語にとりません。', OK, 'wrote: 過去形を目的語にすることはできません。'],
  },
  grammar_l2_052: { add: 'good at, interested in, before, after などの前置詞の後に動詞を置くときは、必ず -ing 形にします（to solve は不可）。' },
  grammar_l2_054: { add: 'avoid は「すでにある・今している行為を避ける」ので動名詞をとります。avoid to do とはしません。' },
  grammar_l2_055: { add: 'My hobby is to take pictures. も文法的には正しいですが、趣味のように習慣的な行為は動名詞で表すのが自然です。' },
  grammar_l2_058: {
    add: 'enjoy は動名詞だけを目的語にとります。',
    whyOthersWrong: ['enjoy to read: enjoy は不定詞をとりません。', OK, 'enjoy read: 動詞の後に原形を続けられません。', 'enjoy reads: 動詞を2つ並べることはできません。'],
  },
  grammar_l2_059: { add: '動名詞の主語は単数扱いなので、動詞は is になります。To smoke is ... も可能ですが、掲示や一般論では動名詞が自然です。' },
  grammar_l2_060: {
    add: 'give up（やめる・あきらめる）は句動詞で、動名詞をとります。',
    whyOthersWrong: ['try: 原形は続けられません。', 'to try: give up は不定詞をとりません。', OK, 'tried: 過去形は目的語になりません。'],
  },
  grammar_l2_072: { add: '比較級は than とセットで使います。2音節以上の多くの語は more ＋原級（more quickly）になります。' },
  grammar_l2_073: { add: '最上級には the を付け、範囲を in ＋場所・集団（in town）、of ＋複数（of the three）で表します。' },
  grammar_l2_075: { add: 'as と as の間は原級（interesting）のままです。否定 not as ... as は「…ほど〜ない」になります。that one は that book の book を繰り返さないための代名詞です。' },
  grammar_l2_077: {
    add: 'important のような長い形容詞は -er を付けず more important にします。',
    whyOthersWrong: [OK, 'most: 最上級なので than とは使いません。', 'much: much は比較級を強める語で、much more important の形なら可。', 'very: very は than と一緒に使えません。'],
  },
  grammar_l2_080: { add: '最上級には the を付けます。範囲は in Japan（場所・集団）です。high-higher-highest と変化します。' },
  grammar_l2_082: {
    add: '手紙は「書かれた」側なので受け身です。in 1965 から過去なので was を使います。',
    whyOthersWrong: ['wrote: 能動態では「手紙が書いた」になってしまいます。', OK, 'is written: in 1965 があるので現在形は合いません。', 'writes: 能動態・現在形で、意味も時制も合いません。'],
  },
  grammar_l2_086: { add: 'sing-sang-sung と変化します。動作主（people）が一般の人々なので by ... は省略します。all over the world でも同じ意味です。' },
  grammar_l2_088: {
    add: '荷物は「配達される」側なので受け身にします。tomorrow なので will be delivered です。',
    choices: ['will', 'will be', 'has been', 'was'],
    whyOthersWrong: ['will: will delivered では受け身になりません（will be delivered）。', OK, 'has been: 現在完了は tomorrow と一緒に使えません。', 'was: 過去形は tomorrow と合いません。'],
  },
  grammar_l2_089: {
    add: '受け身は be動詞＋過去分詞の両方が必要です。',
    whyOthersWrong: [OK, 'The cake made by her: be動詞がないので文になりません（名詞句「彼女が作ったケーキ」）。', 'was make: be動詞の後は過去分詞 made です。', 'is made ... yesterday: yesterday と現在形は合いません。'],
  },
  grammar_l2_090: { add: '助動詞の後は原形なので be を置き、その後に過去分詞 taken を続けます（should be taken）。薬の説明書でよく見る形です。' },
  grammar_l2_091: {
    add: '仕事は機械に「置き換えられる」側です。in the future なので will be replaced です。',
    whyOthersWrong: ['will: will replaced では受け身になりません。', OK, 'are: 現在形は in the future と合いません。', 'were: 過去形は in the future と合いません。'],
  },
  grammar_l2_097: { add: 'This is the book I was looking for. と目的格の関係代名詞は省略できます。物なら which も使えます。look for の for を落とさないようにします。' },
  grammar_l2_108: { add: 'please の後の動詞は原形です（please feel free to ask）。if 節は条件、主節は依頼の命令文という組み立てです。' },
  grammar_l2_110: { add: '時・条件を表す if / when の節では、未来のことでも現在形を使います。主節の will はそのままです。' },
  grammar_l2_114: { add: 'if 節は過去形（knew）でも、意味は現在の事実と違う仮定です。would の代わりに could / might も使えます。' },
  grammar_l2_117: { add: '形は If ＋主語＋過去形, 主語＋would＋原形。実際は時間がないという気持ちを表します。If I have more time, I will travel more. は「時間ができたら旅行する」という実現可能な条件になります。' },
  grammar_l2_145: {
    add: '動名詞の主語は単数扱いなので、動詞は is です。',
    whyOthersWrong: [OK, 'Exercise: 名詞としては使えますが、後ろに regularly（副詞）を続けられません（Regular exercise なら可）。', 'Exercised: 過去形・過去分詞は主語になりません。', 'To exercising: to の後は原形です（To exercise なら可）。'],
  },
  grammar_l2_149: {
    add: 'Would you mind -ing? は「〜していただけますか」という丁寧な依頼です。答えの No, not at all. は「いいですよ」の意味です。',
    whyOthersWrong: [OK, 'close: mind の後に原形は置けません。', 'to close: mind は不定詞をとりません。', 'closed: 過去形・過去分詞は目的語になりません。'],
  },
  grammar_l2_150: { add: 'be interested in ＋名詞・動名詞の形で覚えます。interested to study とは通常言いません。' },
  grammar_l2_151: {
    add: 'decide は未来に向かう行為を表すので to 不定詞をとります。',
    whyOthersWrong: [OK, 'starting: decide は動名詞をとりません。', 'start: 動詞の後に原形を続けられません。', 'started: 過去形は目的語になりません。'],
  },
  grammar_l2_155: {
    add: 'be surprised to do で「〜して驚く」。感情の原因は at ＋名詞でも表せます（surprised at the news）。',
    whyOthersWrong: [OK, 'hearing: 前置詞なしで動名詞は続けられません。', 'hear: 原形は続けられません。', 'heard: 過去形は続けられません。'],
  },
  grammar_l2_164: { add: '主語 the city は「見られる」側なので過去分詞 Seen です。Seeing from the plane, ... とすると街が見ていることになります。' },
  grammar_l2_167: {
    add: '分詞構文は Because she felt tired, ... を短くした形です。主語 she が「感じる」側なので現在分詞です。',
    whyOthersWrong: [OK, 'Feel: 原形で始めると命令文になります。', 'Felt: 過去分詞で始めると「感じられた」という受け身の意味になります。', 'Feels: 主語のない -s 形は使えません。'],
  },
  grammar_l2_170: { add: 'build-built-built と変化します。in 1990 があるので過去の受け身 was built です。' },
  grammar_l2_171: {
    add: '英語は「話される」側です。一般的な事実なので現在形 is spoken を使います。',
    whyOthersWrong: [OK, 'speaks: 能動態では「英語が話す」になります。', 'spoke: 過去形・能動態で意味が合いません。', 'spoken: be動詞がないと文の動詞になりません。'],
  },
  grammar_l2_174: { add: 'The book is read by many students. の read は過去分詞（発音は /red/）です。動作主が重要でなければ by ... は省きます。' },
  grammar_l2_175: {
    add: 'never は have と過去分詞の間に置きます。経験を表す現在完了で、eat-ate-eaten と変化します。',
    whyOthersWrong: [OK, 'ate: have の後に過去形は置けません。', 'eat: have の後に原形は置けません。', 'eating: have eating という形はありません。'],
  },
  // ------------------------------------------------------------------ Level 3
  grammar_l3_020: { add: 'While listening to music, he studied. や He studied while listening to music. と書くと「〜しながら」がよりはっきりします。主語は主節と同じ he です。' },
  grammar_l3_026: { add: 'When she read the letter, ... の When と主語を省いた形です。began to cry は began crying でも同じ意味です。' },
  grammar_l3_032: { add: '過去の事実（実際は雨が降った）と逆の仮定は If ＋had＋過去分詞, would have＋過去分詞 です。否定は had not rained です。' },
  grammar_l3_044: { add: '否定語が文頭に出ると、疑問文と同じ語順（have I heard）になります。普通の語順なら I have never heard such a story. です。' },
  grammar_l3_047: { add: '普通の語順では We little knew ... です。Little を前に出すと did we know と疑問文の語順になり、「〜とは少しも知らなかった」と強く否定します。' },
  grammar_l3_050: { add: 'It is / was と that の間に強調したい語句を入れ、残りを that 以下に置きます。強調部分を外すと The new policy caused the confusion. に戻ります。' },
  grammar_l3_056: { add: '強調する語句が人なら who、物なら that / which も使えます。that は人・物どちらにも使えます。' },
  grammar_l3_063: { add: 'As a result は前の文を原因として結果を述べます。Therefore / Consequently も同じ働きです。文頭に置いてコンマで区切ります。' },
  grammar_l3_071: {
    add: '「原因 lead to 結果」の順になります。',
    whyOthersWrong: [OK, 'leads from: lead from という因果表現はありません。', 'results of: 動詞が必要です（results in なら「〜という結果になる」で可）。', 'causes from: cause は他動詞なので from は不要です（causes better sleep なら可）。'],
  },
  grammar_l3_075: {
    add: 'be due to ＋名詞で「〜による・〜が原因で」。because of と同じく後ろに名詞を置きます。',
    whyOthersWrong: [OK, 'depend on: was の後に動詞の原形は置けません（depended on なら意味も変わります）。', 'leads to: was の後に leads は置けず、方向も逆（原因 → 結果）です。', 'result to: result from（〜から生じる）が正しい形で、was の後にも置けません。'],
  },
  grammar_l3_081: { add: '例: The results of the study that we conducted last year were surprising. では、動詞 were を見つけると、その前全体が主語だとわかります。' },
  grammar_l3_095: {
    add: 'years of neglect は名詞句なので前置詞の because of を使います。',
    whyOthersWrong: [OK, 'because: 接続詞なので後ろに主語＋動詞が必要です。', 'so: 結果を導く接続詞で、ここでは意味も形も合いません。', 'therefore: 副詞なので名詞を後ろに置けません。'],
  },
  grammar_l3_098: { add: 'Because he was sick, he was absent from work. と because 節を前に置くこともできます。be absent from は「〜を欠席する」です。' },
  grammar_l3_112: { add: '普通の語順は She is not only smart but also kind. です。Not only を文頭に出すと is she と疑問文の語順になります。' },
  grammar_l3_123: {
    add: 'Because she was tired, ... を短くした形です。Being は省略して Tired from the long flight, ... と書くこともできます。',
    whyOthersWrong: [OK, 'Be: 原形で始めると命令文になります。', 'Been: 過去分詞 been だけで分詞構文は作れません（Having been なら可）。', 'To be: 不定詞では理由の意味になりません。'],
  },
  grammar_l3_131: {
    add: '非制限用法は先行詞に「補足情報」を加えるだけなので、コンマで区切り、that は使いません。',
    whyOthersWrong: [OK, 'periods: ピリオドは文を終わらせます。', 'colons: コロンは説明や列挙を導きます。', 'semicolons: セミコロンは2つの文をつなぎます。'],
  },
  // ------------------------------------------------------------------ Level 4
  grammar_l4_009: { add: '120/80 は「収縮期血圧/拡張期血圧」の順です。論文では 120/80 mmHg のように数字と単位の間にスペースを入れます。' },
  grammar_l4_015: { add: 'every five minutes で「5分ごとに」。Methods では誰が測ったかより何をしたかが重要なので、受動態で書くのが一般的です。' },
  grammar_l4_016: {
    add: '結果は「発表される」側で、next year なので未来の受け身です。',
    whyOthersWrong: ['will: will published では受け身になりません。', OK, 'are: 現在形では next year と合いません。', 'were: 過去形は next year と合いません。'],
  },
  grammar_l4_018: { add: 'should の後は原形 be、その後に過去分詞 adjusted です。according to body weight は「体重に応じて」です。' },
  grammar_l4_019: {
    add: '受け身は be動詞＋過去分詞で、時制は be動詞で表します。',
    whyOthersWrong: ['was detect: be動詞の後は過去分詞 detected です。', OK, 'The tumor detected by the scan: be動詞がないので文になりません（名詞句）。', 'is detect ... yesterday: 過去分詞でなく、yesterday とも合いません。'],
  },
  grammar_l4_021: {
    add: '比較する2つのグループを in the treatment group than in the control group と前置詞をそろえて並べます。',
    whyOthersWrong: ['high: than があるので原級は使えません。', OK, 'highest: 最上級は than と使いません。', 'more high: 1音節の形容詞は -er を付けます。'],
  },
  grammar_l4_025: { add: 'that one は that medicine の言い換えです。効果が劣るなら not as effective as、上回るなら more effective than です。' },
  grammar_l4_028: { add: '比較の対象は in the narrowed segment と in the normal segment で、前置詞をそろえて比べます。' },
  grammar_l4_036: { add: '非制限用法の関係詞節は補足情報なので、外しても文が成り立ちます（The device is now widely used.）。非制限用法では that は使いません。' },
  grammar_l4_039: { add: 'can lead to は「（場合によっては）〜につながりうる」と可能性を示します。論文では断定を避ける言い方としてよく使われます。' },
  grammar_l4_041: { add: 'contribute to は「〜の一因となる」で、唯一の原因とは言わない表現です。' },
  grammar_l4_042: { add: 'can は「〜することがある」という可能性を表します。cause の代わりに lead to も使えます（Dehydration can lead to fatigue.）。' },
  grammar_l4_047: { add: '単位の記号には s を付けず（3 cm）、ピリオドも打ちません。in diameter は「直径で」です。' },
  grammar_l4_068: { add: 'lack of ＋名詞で「〜の不足」。can lead to で「〜につながる可能性がある」と控えめに述べています。' },
  grammar_l4_074: {
    add: 'common のような2音節以上の形容詞は the most ＋原級で最上級にします。',
    whyOthersWrong: [OK, 'more: 比較級なので than が必要です。', 'much: 比較級を強める語で、単独では最上級になりません。', 'very: the very common は文脈に合わず、最上級になりません。'],
  },
  grammar_l4_075: { add: 'those は patients の言い換えです（those in the control group）。名詞の繰り返しを避ける論文の定番の書き方です。' },
  grammar_l4_086: { add: '主語 results が複数なので were です。peer-reviewed は「査読付きの」で、Results や Introduction でよく見る語です。' },
  // ------------------------------------------------------------------ Level 5
  grammar_l5_012: { add: '研究はすでに終わっているので、目的も過去形で書くことが多いです（The aim of this study was to ...）。' },
  grammar_l5_015: { add: 'The aim of this study was to ... / This study aimed to ... も同じ働きをします。不定詞の後には evaluate, examine, investigate などがよく続きます。' },
  grammar_l5_016: {
    add: '自分たちの研究結果は終わった出来事として過去形で報告します。一般的な事実として述べる部分は現在形も使われます。',
    whyOthersWrong: ['find: 結果の報告と時制がそろいません（that 節内の improved と不一致）。', OK, 'finds: 主語 We に -s は付きません。', 'finding: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l5_018: { add: 'There was a ... correlation between A and B の形で覚えます。強さは strong / moderate / weak、向きは positive / negative で表します。' },
  grammar_l5_033: {
    add: 'may で断定を避ける書き方（hedging）は、Discussion の limitation でよく使われます。',
    whyOthersWrong: [OK, 'do: 助動詞 do の後の be は通常使いません。', 'is: is be のように be動詞を重ねられません。', 'are: 主語 generalizability は単数で、be も重ねられません。'],
  },
  grammar_l5_035: { add: 'correlation between A and B の形で使います。correlation があっても因果関係があるとは限らない点に注意します。' },
  grammar_l5_039: {
    add: '主語 standard deviation は単数です。自分の研究の方法として書くなら The standard deviation was used ... と過去形にします。',
    whyOthersWrong: [OK, 'are: 主語は単数です。', 'was: 方法の記述なら可能ですが、この文は一般的な定義を述べています。', 'were: 主語が単数で、時制も合いません。'],
  },
  grammar_l5_041: { add: '前の文が原因、As a result 以下が結果です。Consequently / Therefore も同じ位置で使えます。' },
  grammar_l5_048: { add: 'illustrate の代わりに show / present / depict も使えます。図表は現在形で説明するのが一般的です。' },
  grammar_l5_055: {
    add: 'address は「（問題・限界に）取り組む」という意味で、論文の今後の課題でよく使われます。',
    whyOthersWrong: [OK, 'addresses: 助動詞の後に -s は付きません。', 'addressed: 助動詞の後は原形です。', 'addressing: 助動詞の後は原形です。'],
  },
  grammar_l5_061: {
    add: 'be likely due to で「おそらく〜によるものである」と控えめに原因を推定します。',
    whyOthersWrong: [OK, 'cause: is likely cause to とは言えません（caused by なら可）。', 'result: result from（〜から生じる）なら可能ですが、to とは結びつきません。', 'factor: 名詞で、ここでは文法的に入りません。'],
  },
  grammar_l5_089: {
    add: '終わった実験の結果は showed と過去形で報告するのが基本です。論文の内容を一般化して述べるときは The results show that ... と現在形も使われます。',
    choices: ['showed', 'shows', 'showing', 'shown'],
    whyOthersWrong: [OK, 'shows: 主語 results は複数なので -s は付きません。', 'showing: -ing 形だけでは文の動詞になりません。', 'shown: 過去分詞だけでは文の動詞になりません（have shown なら可）。'],
  },
  grammar_l5_100: { add: 'There was no significant difference between the two groups. と同じ意味です。observed（観察された）は Results の定番の動詞です。' },
  // ------------------------------------------------------------------ Level 6 (TOEIC)
  grammar_l6_018: {
    add: 'システムは「導入される」側で、next month なので未来の受け身です。',
    whyOthersWrong: ['installs: 能動態では「システムが導入する」になります。', 'installed: 過去形は next month と合いません。', OK, 'is install: be動詞の後は過去分詞 installed です。'],
  },
  grammar_l6_022: { add: 'must の後は原形 be、その後に過去分詞です。by Friday は「金曜日までに」という期限です。' },
  grammar_l6_023: {
    add: '方針は「説明される」側です。at the meeting から過去の出来事です。',
    whyOthersWrong: ['explained: 能動態では「方針が説明した」になります。', OK, 'explains: 能動態・現在形で、意味も時制も合いません。', 'explaining: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l6_025: { add: 'sign-signed-signed。by both companies が動作主です。TOEIC では契約・承認の受け身（was approved, was signed）がよく出ます。' },
  grammar_l6_026: {
    add: 'within ＋期間で「〜以内に」。by ＋時点（by Friday）、until ＋時点（「〜までずっと」）と区別します。',
    whyOthersWrong: [OK, 'until: 継続の終点（〜までずっと）を表し、期間の長さとは使いません。', 'by: 期限の時点を表し、30 days のような期間とは使いません。', 'since: 「〜以来」で、過去の起点を表します。'],
  },
  grammar_l6_029: { add: '受け身の動作主は by ＋人・組織です。on the board は「取締役会の一員として」の意味になってしまいます。' },
  grammar_l6_035: { add: 'due to は後ろに名詞を置きます。文を続けるなら because the weather was bad です。because of bad weather でも同じ意味です。' },
  grammar_l6_040: {
    add: '後ろに主語＋動詞（we finish）があるので接続詞が必要です。',
    whyOthersWrong: [OK, 'Because of: 前置詞句なので、後ろに文は置けません。', 'Despite: 前置詞なので後ろに文は置けません。', 'During: 前置詞で「〜の間」を表し、文は置けません。'],
  },
  grammar_l6_043: {
    add: '「予算が限られていた」と「期限通りに完了した」は逆の内容なので、譲歩の Although / Though を使います。',
    whyOthersWrong: [OK, 'Because: 理由になり、前後の意味がつながりません。', 'So: So は前の文を受けて結果を述べるので、文頭の従属節には使えません。', 'Therefore: 副詞なので2つの文を1文につなげません。'],
  },
  grammar_l6_048: {
    add: 'send A to B（A を B に送る）の受け身です。to は送り先を示します。',
    whyOthersWrong: [OK, 'at: 地点を表し、送り先には使いません。', 'in: 内部を表し、送り先には使いません。', 'on: 接触・曜日を表し、送り先には使いません。'],
  },
};
