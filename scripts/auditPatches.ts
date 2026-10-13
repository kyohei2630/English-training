/**
 * Content audit of explanations (2026-10, all grammar and reading questions read and judged on:
 * reason for the answer / grammatical basis / common mistakes / clear for beginners / accuracy).
 * Only questions that failed a criterion are listed; adequate explanations were left as they are.
 *
 * Fields: `add` appends to the explanation; `explanation` replaces it (only where the old text
 * was inaccurate); `question` / `choices` / `correctAnswer` fix questions with more than one
 * acceptable answer or a broken stem (ids are kept, so learning history stays attached).
 * `reason` records why. Applied with: npx tsx scripts/apply-explanation-patches.ts
 */
export interface AuditPatch {
  reason: string;
  add?: string;
  explanation?: string;
  question?: string;
  choices?: string[];
  correctAnswer?: string;
  translationJa?: string;
  whyOthersWrong?: string[];
  /** reading questions: [old text, new text] inside the explanation (e.g. a misquotation) */
  replaceInExplanation?: [string, string];
}

const OK = '(正解)';

export const GRAMMAR_AUDIT_PATCHES: Record<string, AuditPatch> = {
  // ------------------------------------------------------------------ Level 1
  grammar_l1_014: {
    reason: '誤答の理由がない',
    whyOthersWrong: ['Did you finished: did の後の動詞は原形です。', OK, 'Do you finished: 過去の疑問文は Did を使い、動詞は原形です。', 'Does you finish: 主語 you に Does は使わず、過去の文なので Did です。'],
  },
  grammar_l1_058: {
    reason: '誤答の理由がない',
    whyOthersWrong: [OK, 'I not am: not は be動詞の後に置きます。', "I amn't: amn't は標準英語では使いません（I'm not を使います）。", "I don't a doctor: be動詞の文に don't は使えません。"],
  },
  grammar_l1_059: {
    reason: '正解が複数（The store doesn\'t open on Mondays. も正しい）',
    question: 'The store ___ closed on Mondays.',
    explanation: 'closed（閉まっている）は形容詞として使われているので、be動詞の否定 isn\'t を使います。主語 The store は単数です。',
    translationJa: 'その店は月曜日は閉まっています。',
    whyOthersWrong: ["don't: 一般動詞の否定に使い、形容詞 closed の前には置けません。", "doesn't: 一般動詞用です（The store doesn't open ... なら open が動詞なので可）。", OK, "aren't: 主語 The store は単数です。"],
  },
  grammar_l1_078: {
    reason: '誤答の理由がない',
    whyOthersWrong: ['washs: sh で終わる語には -es を付けます。', OK, 'wash: 主語 He なので三単現の -es が必要です。', 'washing: be動詞なしの -ing 形は文の動詞になりません。'],
  },
  grammar_l1_090: {
    reason: '時の手がかりがなく feels も成り立つ',
    question: 'The patient ___ better after the treatment yesterday.',
    explanation: 'yesterday（昨日）があるので過去形にします。feel の過去形は不規則変化の felt です。',
    translationJa: '患者は昨日、治療の後で気分が良くなった。',
    whyOthersWrong: ['feel: yesterday と現在形は合いません。', 'feels: yesterday と現在形は合いません。', OK, 'feeling: be動詞なしでは文の動詞になりません。'],
  },
  grammar_l1_101: {
    reason: '誤答の理由がない',
    whyOthersWrong: [OK, 'going call: going の後に to が必要です。', 'I going to: be動詞（am）が抜けています。', 'am go to: be going to の going が必要です。'],
  },
  grammar_l1_109: {
    reason: '誤答の理由がない',
    whyOthersWrong: ['swiming: 短母音＋子音字で終わる swim は m を重ねます。', OK, 'swimmming: 重ねる m は1つです。', 'We is: 主語 We には are を使います。'],
  },
  grammar_l1_128: {
    reason: '誤答の理由が不正確（Am I open ... は「不自然」ではなく誤り）',
    whyOthersWrong: [OK, 'Do: Do I open ...? は手順を確認する文になり、許可を求める表現になりません。', 'Am: be動詞の疑問文になり、動詞 open を続けられません。', 'Does: 主語 I に Does は使いません。'],
  },
  grammar_l1_131: {
    reason: '正解が複数（at the corner も標準的）',
    choices: ['on', 'in', 'to', 'for'],
    add: '（at the corner of ... も同じ意味で使われます）',
    whyOthersWrong: [OK, 'in: in the corner は部屋などの内側の隅を表し、通りの角には使いません。', 'to: 方向を表します。', 'for: 目的・対象を表し、場所には使いません。'],
  },
  grammar_l1_155: {
    reason: '誤答の理由が不正確（Do there は「不自然」ではなく誤り）',
    whyOthersWrong: ['Is there: questions が複数なので Are を使います。', OK, 'Is it: 存在を尋ねる文になりません。', 'Do there: there 構文の疑問文は be動詞を前に出します（Are there ...?）。Do は使いません。'],
  },
  grammar_l1_158: {
    reason: '誤答の理由がない',
    whyOthersWrong: ['There are a cat: a cat は単数なので is です。', OK, 'There cat is: There is の語順にします。', 'A cat there is: 語順が誤りです。'],
  },
  grammar_l1_159: {
    reason: '過去の手がかりがなく There are も成り立つ',
    question: '___ (be) a lot of people at the concert last night.',
    explanation: 'last night があるので過去形、a lot of people は複数なので There were になります。There is / are の be動詞は、後ろの名詞の数と時制に合わせます。',
    translationJa: '昨夜のコンサートにはたくさんの人がいました。',
  },
  grammar_l1_168: {
    reason: '誤答の理由がない',
    whyOthersWrong: [OK, 'Which bus go: Which bus は三人称単数なので goes です。', 'Which bus does go: 疑問詞が主語の疑問文では do / does を使わず、肯定文の語順のままです。', 'Which bus is go: be動詞と一般動詞を並べられません。'],
  },
  grammar_l1_175: {
    reason: '誤答の理由がない',
    whyOthersWrong: ['She is kind: SVC（第2文型）です。', OK, 'The train arrived: SV（第1文型）です。', 'We call him Tom: SVOC（第5文型）です。'],
  },
  grammar_l1_176: {
    reason: '正解が誤り（working は stopped の目的語なので第3文型）',
    correctAnswer: '第3文型 (SVO)',
    explanation: 'working（動名詞）は stopped の目的語「動くこと」なので、S（The device）＋V（stopped）＋O（working）の第3文型です。stop to do（〜するために立ち止まる）とは意味が違う点にも注意します。',
  },
  grammar_l1_181: {
    reason: '誤答の理由がない',
    whyOthersWrong: ['I bought a book: SVO（第3文型）です。', OK, 'They play tennis: SVO（第3文型）です。', 'He wrote a letter: SVO（第3文型）です。'],
  },
  grammar_l1_189: {
    reason: '正解が複数（She plays piano. もアメリカ英語で標準的）',
    choices: ['She plays a piano.', 'She play the piano.', 'She plays the piano.', 'She plays an piano.'],
    add: '（アメリカ英語では She plays piano. と冠詞なしでも言います）',
    whyOthersWrong: ['plays a piano: 楽器の演奏には通常 the を付けます（a piano は「ピアノ1台」）。', 'She play: 主語 She なので plays です。', OK, 'an piano: piano は子音で始まるので an は使いません。'],
  },
  // ------------------------------------------------------------------ Level 2
  grammar_l2_032: {
    reason: '正解が複数（Have you already finished ...? も正しい）／Have you yet finished は不自然',
    question: 'Have you finished the report ___?',
    choices: ['yet', 'ago', 'still', 'ever'],
    explanation: '疑問文で「もう〜しましたか」と尋ねるときは、文末に yet を置きます。驚きを込めて「もう終わったの？」と言うときは already も使われます。',
    whyOthersWrong: [OK, 'ago: 「〜前に」で過去形と使い、現在完了とは使いません。', 'still: 「まだ」の意味で、この位置には通常置きません。', 'ever: 「今までに」で、経験を尋ねるときに過去分詞の前に置きます。'],
  },
  grammar_l2_035: {
    reason: '問題文が壊れている（正解 moved を入れると moved moved になる）',
    question: 'They ___ to a new office last week.',
    choices: ['have moved', 'has moved', 'had moved', 'moved'],
    correctAnswer: 'moved',
    explanation: 'last week（先週）は過去の特定の時点を表すので、現在完了ではなく過去形 moved を使います。',
    whyOthersWrong: ['have moved: 現在完了は last week のような過去の時点とは使えません。', 'has moved: 主語 They にも合わず、last week とも使えません。', 'had moved: 過去完了は「過去のある時点より前」を表すときに使います。', OK],
  },
  grammar_l2_044: {
    reason: '誤答の理由がない（something to write の意味の違い）',
    whyOthersWrong: ['something to write: 「書く内容（手紙など）」の意味になります。', OK, 'something writing: 「書くための何か」という意味になりません。', 'for write: for の後に動詞の原形は置けません。'],
  },
  grammar_l2_050: {
    reason: '誤答しやすい点（remember -ing との違い）の説明がない',
    whyOthersWrong: ['lock: remembers の後に原形は置けません。', 'locking: remember -ing は「（過去に）〜したことを覚えている」で、出かける前に毎回することには合いません。', OK, 'locked: 過去形は目的語になりません。'],
  },
  grammar_l2_119: {
    reason: '誤答しやすい点（must have は推量）の説明がない',
    whyOthersWrong: [OK, 'can: can have called は使われず、後悔の意味になりません。', 'must: must have called は「電話したに違いない」という推量で、後悔の意味になりません。', 'will: will have called は未来完了で文意に合いません。'],
  },
  grammar_l2_121: {
    reason: '正解が複数（must have finished も成り立つ）',
    question: 'You ___ have finished by now, but you are still working on it.',
    explanation: 'should have＋過去分詞は「（本来なら）もう〜しているはずだ（のに）」という期待を表します。まだ作業中なので、確信の must have（〜したに違いない）は合いません。',
    whyOthersWrong: [OK, 'must: must have finished は「終えたに違いない」で、まだ作業中という後半と矛盾します。', 'may: may have finished は「終えたかもしれない」で、後半と合いません。', "can: can have finished は通常使いません（否定の can't have なら可）。"],
  },
  grammar_l2_141: {
    reason: '誤答の理由がない',
    whyOthersWrong: [OK, 'will have: 仮定法過去完了の主節は would have です。', 'would: would passed という形はありません。', 'has: has passed は現在完了で、仮定の意味になりません。'],
  },
  grammar_l2_143: {
    reason: '誤答しやすい点（unless は否定を含む）の説明がない',
    whyOthersWrong: [OK, 'would: unless の文は現実の条件なので will を使います。', "won't: unless は「〜しない限り」と否定を含むので、won't では意味が逆になります。", "wouldn't: 仮定法ではなく、意味も逆になります。"],
  },
  grammar_l2_147: {
    reason: '誤答しやすい点（remember to do との違い）の説明がない',
    whyOthersWrong: [OK, 'to meet: remember to do は「（これから）〜するのを忘れない」で、last year と合いません。', 'meet: remember の後に原形は置けません。', 'met: 過去形は目的語になりません。'],
  },
  grammar_l2_157: {
    reason: '誤答の理由がない',
    whyOthersWrong: [OK, 'can: can have called は使われず、後悔の意味になりません。', 'may: may have called は「電話したかもしれない」という推量です。', 'will: will have called は未来完了です。'],
  },
  grammar_l2_159: {
    reason: '正解が複数（It should rain later. も成り立つ）',
    choices: ['might', 'must', 'ought', 'need'],
    whyOthersWrong: [OK, 'must: 「〜に違いない」という強い確信で、傘を勧める文脈と合いません。', 'ought: ought は ought to の形で使います。', 'need: need rain という形はありません。'],
  },
  grammar_l2_161: {
    reason: '誤答の理由がない',
    whyOthersWrong: [OK, 'Do: Do I open ...? は手順を確認する文になり、許可を求める表現ではありません。', 'Am: be動詞の疑問文で、open を続けられません。', 'Will: Will I open ...? は自分の未来を尋ねる文になります。'],
  },
  grammar_l2_163: {
    reason: '正解が複数（The falling leaves も成り立つ）',
    choices: ['fallen', 'fall', 'falls', 'fell'],
    explanation: '「落ちてしまった葉（落ち葉）」は完了の意味の過去分詞 fallen で名詞を修飾します（The falling leaves なら「舞い落ちている葉」）。',
    whyOthersWrong: [OK, 'fall: 動詞の原形は名詞を修飾できません。', 'falls: 三単現の形は名詞を修飾できません。', 'fell: 過去形は名詞を修飾できません。'],
  },
  grammar_l2_193: {
    reason: '正解が複数（as if he knows も使われる）',
    choices: ['knew', 'know', 'known', 'knowing'],
    add: '現実と違うと話し手が考えるときに過去形を使います（本当にそうかもしれない場合は as if he knows も使われます）。',
    whyOthersWrong: [OK, 'know: 主語 he に合わず、仮定の意味にもなりません。', 'known: 過去分詞だけでは文の動詞になりません。', 'knowing: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l2_198: {
    reason: '正解が複数（She went to Paris three times. も正しい）',
    question: 'She ___ to Paris three times so far.',
    explanation: 'so far（これまでに）と回数 three times は「経験」を表すので、現在完了 has been to（〜に行ったことがある）を使います。',
    whyOthersWrong: [OK, 'was: was to Paris という形はなく、so far とも合いません。', 'is: is to Paris は「パリへ行く予定」の意味になり、so far と合いません。', 'went: 過去形は so far（今までに）と一緒に使いません。'],
  },
  // ------------------------------------------------------------------ Level 3
  grammar_l3_022: {
    reason: '問題文が壊れている（Time time permitting になる）／Weather permitting も成り立つ',
    question: '___ permitting, we will visit the museum too.',
    choices: ['Time', 'Times', 'Timing', 'Timed'],
    explanation: 'Time permitting は「時間が許せば」という独立分詞構文の定型表現です（= If time permits）。Weather permitting（天気が許せば）も同じ形です。',
    whyOthersWrong: [OK, 'Times: 複数形にはしません。', 'Timing: 「タイミング」で、定型表現になりません。', 'Timed: 過去分詞で、この位置の主語になりません。'],
  },
  grammar_l3_036: {
    reason: '誤答しやすい点（It is time ＋過去形）の説明がない',
    whyOthersWrong: ['go: It is time の後に主語を続けるときは過去形にします（It is time to go. なら可）。', OK, 'have gone: 現在完了は使いません。', 'will go: will は使いません。'],
  },
  grammar_l3_038: {
    reason: '正解が複数（イギリス英語では gets / should get も使われる）',
    choices: ['to get', 'get', 'got', 'getting'],
    add: '（イギリス英語では should get も使われます）',
    whyOthersWrong: ['to get: that 節の中は主語＋動詞の形にします。', OK, 'got: 過去形にはしません（原形を使います）。', 'getting: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l3_049: {
    reason: '誤答しやすい点（when との違い）の説明がない',
    whyOthersWrong: ['when: 口語では見られますが、強調構文の基本は that です。', OK, 'which: 時を表す語句の強調には使いません。', 'where: 場所の強調にも that を使うのが基本です。'],
  },
  grammar_l3_055: {
    reason: '問題文が壊れている（正解 do を入れると I do do appreciate になり、選択肢 really が正しくなる）',
    question: 'I ___ appreciate your help.',
    choices: ['do', 'am', 'was', 'have'],
    explanation: '一般動詞の前に do / does / did を置くと、動詞の意味を強めます（I do appreciate = 本当に感謝しています）。',
    whyOthersWrong: [OK, 'am: be動詞の後に動詞の原形は置けません。', 'was: be動詞の後に動詞の原形は置けません。', 'have: have の後は過去分詞（have appreciated）です。'],
  },
  grammar_l3_078: {
    reason: '正解が不正確（what は疑問詞ではなく先行詞を含む関係代名詞）',
    choices: ['名詞節（主語）', '関係代名詞節（修飾語）', '感嘆文', '命令文'],
    correctAnswer: '名詞節（主語）',
    explanation: 'What she said の what は「〜すること・もの」という先行詞を含む関係代名詞で、What she said 全体が名詞節として文の主語になっています（動詞は made）。',
  },
  grammar_l3_079: {
    reason: '模範解答が不自然な英語（is unknown to anyone）',
    correctAnswer: 'Why he did it is a mystery to everyone.',
    explanation: 'Why he did it（彼がなぜそれをしたのか）という名詞節が主語です。「誰にも分からない」は is a mystery to everyone や is unknown で表せます（Nobody knows why he did it. も自然です）。',
  },
  grammar_l3_109: {
    reason: '誤答しやすい点（when との違い）の説明がない',
    whyOthersWrong: [OK, 'when: 口語では見られますが、強調構文の基本は that です。', 'which: 時の強調には使いません。', 'who: 人を強調するときに使います。'],
  },
  grammar_l3_134: {
    reason: '並べ替えの答えにコンマがなく、非制限用法の書き方が伝わらない',
    add: '書くときは Tokyo, which is the capital of Japan, is a huge city. とコンマで区切ります。',
  },
  // ------------------------------------------------------------------ Level 4
  grammar_l4_020: {
    reason: '時の手がかりがなく is も成り立つ',
    question: "The infection in last year's outbreak ___ likely transmitted through contaminated water.",
    explanation: "last year's outbreak（昨年の流行）のことなので過去の受動態 was transmitted です（likely は「おそらく」）。",
    whyOthersWrong: ['is: 昨年の出来事なので現在形は合いません。', OK, 'has: has transmitted は能動態で、感染が「媒介した」ことになります。', 'do: do の後に過去分詞は置けません。'],
  },
  grammar_l4_045: {
    reason: 'ヒント (result from) が正解 the result of と合わず誤解を招く',
    question: 'The side effect was ___ (result) an allergic reaction.',
    explanation: '「〜の結果」は the result of ＋名詞です。動詞で書くなら The side effect resulted from an allergic reaction. となります（was result from とはしません）。',
  },
  grammar_l4_050: {
    reason: '解説の誤字（milll iters）',
    explanation: '数値＋単位で2以上のときは、単位を複数形 milliliters にします（50 milliliters）。',
    whyOthersWrong: ['milliliter: 2以上の数には複数形を使います。', OK, "milliliter's: 所有格で、単位には使いません。", 'millilitre: イギリス式つづりの単数形で、複数形になっていません。'],
  },
  grammar_l4_061: {
    reason: '問題文の誤り（a bacteria：bacteria は複数形）',
    question: 'The infection was caused ___ (by) bacteria.',
    add: '（bacteria は複数形で、単数は bacterium です）',
  },
  grammar_l4_070: {
    reason: '解説の誤字（fewe）',
    explanation: '比較級 fewer を修飾するので、副詞 significantly の形にします。',
  },
  // ------------------------------------------------------------------ Level 5
  grammar_l5_001: {
    reason: '正解が複数（Introduction では is も標準。同じ問題集の l5_070 などとも矛盾）',
    choices: ['are', 'was', 'be', 'were'],
    add: '（Introduction で目的を示すときは The purpose of this study is to ... と現在形も使います）',
    whyOthersWrong: ['are: 主語 The purpose は単数です。', OK, 'be: 原形は文の動詞として使えません。', 'were: 主語 The purpose は単数です。'],
  },
  grammar_l5_002: {
    reason: '正解が複数（The results show that ... も論文で標準的）',
    choices: ['shown', 'shows', 'showed', 'showing'],
    add: '（論文では The results show that ... と現在形も使われます）',
    whyOthersWrong: ['shown: 過去分詞だけでは文の動詞になりません。', 'shows: 主語 The results は複数なので -s は付きません。', OK, 'showing: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l5_010: {
    reason: '正解が複数（demonstrates も結論で標準的。l5_024 と矛盾）',
    choices: ['demonstrate', 'have demonstrated', 'demonstrated', 'demonstrating'],
    add: '（結論を一般化して This study demonstrates that ... と現在形で書くこともあります）',
    whyOthersWrong: ['demonstrate: 主語 study は三人称単数なので -s が必要です。', 'have demonstrated: 主語 study は単数なので has demonstrated になります。', OK, 'demonstrating: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l5_011: {
    reason: '正解が複数（This study aims to ... も標準的。l5_071 と矛盾）',
    choices: ['aim', 'have aimed', 'aimed', 'aiming'],
    add: '（This study aims to ... と現在形も使われます）',
    whyOthersWrong: ['aim: 主語 This study は三人称単数なので -s が必要です。', 'have aimed: 主語 study は単数なので has aimed になります。', OK, 'aiming: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l5_022: {
    reason: '正解が複数（data を単数扱いする was も広く使われる）',
    choices: ['were', 'is', 'has', 'been'],
    explanation: 'Methods では行った分析を過去形で書きます。data は伝統的に複数扱い（datum の複数形）なので were です（単数扱いの was も広く見られます）。',
    whyOthersWrong: [OK, 'is: 現在形で、行った分析の報告に合いません。', 'has: has analyzed は能動態で、データが分析したことになります。', 'been: been だけでは文の動詞になりません。'],
  },
  grammar_l5_023: {
    reason: '正解が複数（suggested も文法的に成り立つ）',
    choices: ['suggest', 'suggests', 'suggestion', 'suggesting'],
    whyOthersWrong: [OK, 'suggests: 主語 findings は複数です。', 'suggestion: 名詞なので動詞の位置に置けません。', 'suggesting: -ing 形だけでは文の動詞になりません。'],
  },
  grammar_l5_026: {
    reason: '解説が初学者に分かりにくい',
    explanation: 'Further research is needed は「さらなる研究が必要とされている」という受動態（is ＋過去分詞 needed）です。need / needs は is の後に置けず、needing では「〜を必要としている」となり文意に合いません。',
  },
  grammar_l5_038: {
    reason: '内容が不正確（p値を「結果が偶然である確率」とする誤解を正しいとしていた）',
    question: 'p < 0.05 は「帰無仮説が正しいと仮定したとき、観察された以上に極端な結果が偶然得られる確率が5%未満」であることを示す。',
    explanation: 'p値は「帰無仮説（差や効果がない）が正しいと仮定したときに、今回以上に極端な結果が得られる確率」です。「結果が偶然である確率」や「仮説が正しい確率」ではない点に注意します。',
  },
  grammar_l5_040: {
    reason: '正解が複数（in contrast with も正しい）',
    choices: ['by', 'to', 'from', 'of'],
    add: '（in contrast with も同じ意味で使われます）',
    whyOthersWrong: ['by: in contrast by という形はありません。', OK, 'from: in contrast from という形はありません。', 'of: in contrast of という形はありません。'],
  },
  grammar_l5_046: {
    reason: '正解が複数（summarized も文法的に成り立つ）',
    choices: ['summarize', 'summarizes', 'summarizing', 'summary'],
    whyOthersWrong: ['summarize: 主語 Table 1 は単数なので -s が必要です。', OK, 'summarizing: -ing 形だけでは文の動詞になりません。', 'summary: 名詞なので動詞の位置に置けません。'],
  },
  grammar_l5_052: {
    reason: '正解が複数（is designed も成り立つ）',
    choices: ['are', 'was', 'has', 'do'],
    add: '（研究計画の説明では is designed と現在形も使われます）',
    whyOthersWrong: ['are: 主語 investigation は単数です。', OK, 'has: has designed は能動態で、研究が設計したことになります。', 'do: do の後に過去分詞は置けません。'],
  },
  grammar_l5_056: {
    reason: '正解が複数（contributed も成り立つ）',
    choices: ['contributes', 'contribute', 'contributing', 'contribution'],
    whyOthersWrong: [OK, 'contribute: 主語 Air pollution は三人称単数です。', 'contributing: -ing 形だけでは文の動詞になりません。', 'contribution: 名詞なので動詞の位置に置けません。'],
  },
  grammar_l5_065: {
    reason: '正解が複数（indicated も成り立つ）',
    choices: ['indicate', 'indicates', 'indicating', 'indicative'],
    whyOthersWrong: [OK, 'indicates: 主語 results は複数です。', 'indicating: -ing 形だけでは文の動詞になりません。', 'indicative: 形容詞なので動詞の位置に置けません（are indicative of なら可）。'],
  },
  grammar_l5_068: {
    reason: '正解が複数（cast light on / throw light on も正しい）',
    choices: ['shed', 'make', 'give', 'take'],
    add: '（cast light on / throw light on も同じ意味で使われます）',
    whyOthersWrong: [OK, 'make: make light of は「〜を軽んじる」で意味が違います。', 'give: give light on という表現はありません。', 'take: take light on という表現はありません。'],
  },
  grammar_l5_075: {
    reason: '正解が複数（is も成り立つ）',
    choices: ['was', 'be', 'are', 'were'],
    add: '（Introduction では The objective of this study is ... と現在形も使われます）',
    whyOthersWrong: [OK, 'be: 原形は文の動詞として使えません。', 'are: 主語 The objective は単数です。', 'were: 主語 The objective は単数です。'],
  },
  grammar_l5_077: {
    reason: '正解が複数（increases も成り立つ）',
    choices: ['increased', 'increase', 'increasing', 'risen'],
    add: '（図の傾向を一般的に述べる場合は increases と現在形も使われます）',
    whyOthersWrong: [OK, 'increase: 主語 the rate は単数で、時制も合いません。', 'increasing: -ing 形だけでは文の動詞になりません。', 'risen: 過去分詞だけでは文の動詞になりません。'],
  },
  grammar_l5_093: {
    reason: '正解が複数（The data reveal ... も成り立つ）',
    choices: ['revealed', 'revealing', 'revelation', 'reveal of'],
    whyOthersWrong: [OK, 'revealing: -ing 形だけでは文の動詞になりません。', 'revelation: 名詞なので動詞の位置に置けません。', 'reveal of: reveal は他動詞なので of は不要です。'],
  },
  // ------------------------------------------------------------------ Level 6
  grammar_l6_003: {
    reason: '正解が複数（決まった予定は takes effect next month も標準的）',
    choices: ['taking', 'took', 'will take', 'has taken'],
    add: '（The new policy takes effect next month. のように、決まった予定は現在形でも表せます）',
    whyOthersWrong: ['taking: -ing 形だけでは文の動詞になりません。', 'took: next month と合いません。', OK, 'has taken: 現在完了は未来のことに使いません。'],
  },
  grammar_l6_038: {
    reason: '正解が複数（staff を単数扱いする was もアメリカ英語で標準的）',
    question: 'The staff members ___ notified of the schedule change via email.',
    explanation: '主語 The staff members は複数なので were を使います（staff だけなら、アメリカ英語では単数扱いの was も使われます）。',
    whyOthersWrong: ['was: 主語 members は複数です。', OK, 'is: 主語は複数で、時制も合いません。', 'has: has notified は能動態になります。'],
  },
};

export const READING_AUDIT_PATCHES: Record<string, AuditPatch> = {
  'q-l1-024-4': {
    reason: '正解が本文と合わない（本文は taste was too strong で、spicy とは書かれていない）',
    choices: ['It was too salty', 'The taste was too strong', 'It was too thick', 'It was too cold'],
    add: 'taste was too strong（味が濃すぎた）とあり、辛い・しょっぱいなど具体的な味は書かれていません。',
  },
  'q-l3-003-7': {
    reason: '引用だけで、正解との結びつきが説明されていない',
    add: 'a larger problem は、前の段落で述べた「歴史的な町の過密（overcrowding）」を指しています。',
  },
  'q-l3-004-7': {
    reason: '本文と選択肢の言い換えの説明がない',
    add: 'rarely see（めったに目にしない）を、選択肢では rarely think about（めったに考えない）と言い換えています。',
  },
  'q-l6-117-6': {
    reason: '引用だけで、口調の判断根拠が説明されていない',
    add: 'I apologize（おわび）と Thank you for your understanding（感謝）から、丁寧でおわびを含む口調だと分かります。',
  },
  'q-l5-002-1': {
    reason: '引用が本文どおりでない',
    replaceInExplanation: ['Traditional ECG monitoring ... typically', 'Traditional electrocardiogram (ECG) monitoring, however, typically'],
  },
  'q-l6-001-4': {
    reason: '引用が本文どおりでない（本文は rather than）',
    replaceInExplanation: ['instead of vague statements', 'rather than vague statements'],
  },
};
