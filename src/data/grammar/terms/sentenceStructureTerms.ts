import type { GrammarTerm } from '../../../types';

export const sentenceStructureTerms: GrammarTerm[] = [
  {
    id: 'term-five-patterns',
    term: '5文型',
    category: 'sentence-structure',
    oneLiner: '英語の文は主語・動詞・目的語・補語の組み合わせで5つに分類できるという考え方。',
    explanation:
      '英語の文はどんなに長く複雑に見えても、主語(S)・動詞(V)・目的語(O)・補語(C)の並び方によって、SV・SVC・SVO・SVOO・SVOCの5つの基本パターン（文型）のいずれかに分類できます。動詞の直後に何が続くかを見れば、文型と文の意味関係を素早く判断できます。',
    example: {
      english: 'The medicine made her feel better.',
      japanese: 'その薬は彼女の気分を良くしました。',
      breakdown: ['The medicine = S', 'made = V', 'her = O', 'feel better = C（her = feeling betterの関係、SVOC）'],
    },
    relatedTermIds: ['term-sv', 'term-svc', 'term-svo', 'term-svoo', 'term-svoc'],
  },
  {
    id: 'term-sv',
    term: 'SV（第1文型）',
    category: 'sentence-structure',
    oneLiner: '主語＋動詞だけで意味が完成する文型。',
    explanation:
      'SV（第1文型）は主語(S)と動詞(V)だけで文の意味が成立する文型です。The baby sleeps.のように、動詞の後に目的語や補語がなくても意味が通じます。場所や時間を表す修飾語が付くことはよくありますが、それらは文型の判定には含めません。',
    example: {
      english: 'The baby sleeps peacefully.',
      japanese: '赤ちゃんは穏やかに眠っています。',
      breakdown: ['The baby = S', 'sleeps = V', 'peacefully = 修飾語（文型には含まない）'],
    },
    relatedTermIds: ['term-five-patterns', 'term-svc'],
  },
  {
    id: 'term-svc',
    term: 'SVC（第2文型）',
    category: 'sentence-structure',
    oneLiner: '主語＝補語の関係が成り立つ文型。',
    explanation:
      'SVC（第2文型）は主語(S)と補語(C)がイコールの関係になる文型です。be動詞のほか、become, look, seem, soundなどの動詞もこの文型を作ります。「Cは何か」ではなく「S＝C」という関係が成り立つかどうかで判定します。',
    example: {
      english: 'She looks tired today.',
      japanese: '彼女は今日、疲れているように見えます。',
      breakdown: ['She = S', 'looks = V', 'tired = C（She = tiredの関係）'],
    },
    relatedTermIds: ['term-sv', 'term-svo', 'term-complement'],
  },
  {
    id: 'term-svo',
    term: 'SVO（第3文型）',
    category: 'sentence-structure',
    oneLiner: '主語＋動詞＋目的語からなる、最も一般的な文型。',
    explanation:
      'SVO（第3文型）は主語(S)の動作が目的語(O)に向かう、英語で最も頻出する文型です。主語＝目的語の関係ではなく、動詞の動作を目的語が「受ける」関係になっている点がSVCとの違いです。',
    example: {
      english: 'The doctor examined the patient.',
      japanese: 'その医師は患者を診察しました。',
      breakdown: ['The doctor = S', 'examined = V', 'the patient = O（The doctor ≠ the patient）'],
    },
    relatedTermIds: ['term-svc', 'term-svoo', 'term-object'],
  },
  {
    id: 'term-svoo',
    term: 'SVOO（第4文型）',
    category: 'sentence-structure',
    oneLiner: '「人に物を〜する」のように、目的語が2つ続く文型。',
    explanation:
      'SVOO（第4文型）は動詞の後ろに「人（〜に）」と「もの（〜を）」という2つの目的語が続く文型です。give, tell, show, teach, sendなど「与える・伝える」意味の動詞でよく使われ、O1 O2 を「O1に O2を」の順で読みます。多くはgive O2 to O1のようにto/forを使った書き換えができます。',
    example: {
      english: 'The teacher gave the students a handout.',
      japanese: 'その先生は生徒たちにプリントを配りました。',
      breakdown: ['The teacher = S', 'gave = V', 'the students = O1（人）', 'a handout = O2（もの）'],
    },
    relatedTermIds: ['term-svo', 'term-svoc'],
  },
  {
    id: 'term-svoc',
    term: 'SVOC（第5文型）',
    category: 'sentence-structure',
    oneLiner: '目的語＝補語の関係が成り立つ文型。',
    explanation:
      'SVOC（第5文型）は目的語(O)と補語(C)の間にイコールの関係が成り立つ文型です。make, call, name, keep, findなどの動詞が使われ、「OをCにする／と呼ぶ／のままにする」のように、OとCの関係を軸に意味を組み立てます。',
    example: {
      english: 'They named the baby Emma.',
      japanese: '彼らはその赤ちゃんをエマと名付けました。',
      breakdown: ['They = S', 'named = V', 'the baby = O', 'Emma = C（the baby = Emmaの関係）'],
    },
    relatedTermIds: ['term-svoo', 'term-complement'],
  },
];
