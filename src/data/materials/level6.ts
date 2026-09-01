import type { ReadingMaterial } from '../../types';

export const level6Materials: ReadingMaterial[] = [
  {
    id: 'l6-001',
    level: 6,
    category: 'academic-writing',
    title: 'How to Write a Strong Abstract',
    topic: 'Academic Writing',
    estimatedMinutes: 8,
    content: [
      'A strong abstract answers four questions in a small number of sentences: What problem did you study? How did you study it? What did you find? Why does it matter? Reviewers and readers often decide whether to read the full paper based on the abstract alone, so clarity is more important than sophisticated vocabulary.',
      'Many effective abstracts follow a predictable structure. The first one or two sentences establish the background or problem, often using present tense, as in "Coronary stents are widely used to treat arterial stenosis." The next sentences describe the methods, typically in past tense: "We used computational fluid dynamics to simulate blood flow."',
      'Results are then reported, again in past tense, using precise and specific language rather than vague statements: instead of writing "the results were interesting," it is far more useful to write exactly what was found, such as "thicker struts were associated with larger regions of low wall shear stress."',
      'Finally, the abstract closes with a brief conclusion, often signaled by phrases such as "these findings suggest" or "in conclusion." Writers with limited English experience should not try to make their abstract sound impressive; a simple, precise abstract is almost always stronger than a complicated one.',
    ],
    vocabulary: [
      { word: 'sophisticated', partOfSpeech: 'adjective', meaningJa: '高度な、洗練された', example: 'Clarity matters more than sophisticated vocabulary.' },
      { word: 'establish', partOfSpeech: 'verb', meaningJa: '確立する、示す', example: 'The first sentence establishes the background.' },
      { word: 'vague', partOfSpeech: 'adjective', meaningJa: '曖昧な', example: 'Avoid vague statements in your results.' },
      { word: 'precise', partOfSpeech: 'adjective', meaningJa: '正確な', example: 'Use precise language to describe your findings.' },
    ],
    grammarPoints: [
      {
        sentence: 'Reviewers and readers often decide whether to read the full paper based on the abstract alone, so clarity is more important than sophisticated vocabulary.',
        translationJa: '査読者や読者は要旨だけを見て論文全体を読むかどうかを決めることが多いため、明快さは高度な語彙よりも重要である。',
        subject: 'clarity',
        verb: 'is',
        modifiers: ['more important than sophisticated vocabulary'],
        notes: ['so 〜 は前文の結果・結論を導く接続詞', '学術ライティングでは明快さが最優先される'],
      },
    ],
  },
  {
    id: 'l6-002',
    level: 6,
    category: 'academic-writing',
    title: 'Sentence Patterns for Reporting Results',
    topic: 'Academic Writing',
    estimatedMinutes: 8,
    content: [
      'When describing results, non-native English writers often rely too heavily on the verb "was/were" and simple sentence structures. While clarity should always come first, learning a small set of flexible patterns can make writing more precise and natural.',
      'To describe a relationship between two variables, useful patterns include: "X was significantly higher in group A than in group B," "X increased with an increase in Y," and "there was a significant correlation between X and Y (r = 0.82, p < 0.01)."',
      'To describe a comparison between conditions, writers can use patterns such as: "No significant difference was found between X and Y," or "X was comparable to Y under the tested conditions." To highlight an unexpected result, phrases like "unexpectedly" or "notably" can be placed at the beginning of a sentence.',
      'Practicing these patterns with your own data, rather than only reading about them, is the fastest way to make them feel natural. Try rewriting a results sentence from your own research using at least two of the patterns above.',
    ],
    vocabulary: [
      { word: 'correlation', partOfSpeech: 'noun', meaningJa: '相関', example: 'There was a significant correlation between X and Y.' },
      { word: 'comparable', partOfSpeech: 'adjective', meaningJa: '匹敵する、同程度の', example: 'X was comparable to Y under the tested conditions.' },
      { word: 'notably', partOfSpeech: 'adverb', meaningJa: '注目すべきことに', example: 'Notably, the effect disappeared at higher temperatures.' },
      { word: 'unexpectedly', partOfSpeech: 'adverb', meaningJa: '予想外に', example: 'Unexpectedly, the two groups showed similar results.' },
    ],
    grammarPoints: [
      {
        sentence: 'X was significantly higher in group A than in group B.',
        translationJa: 'Xはグループ AにおいてグループBよりも有意に高かった。',
        subject: 'X',
        verb: 'was',
        modifiers: ['significantly higher', 'in group A than in group B'],
        notes: ['結果報告における最重要パターンの一つ。significantly は統計的有意性を示す副詞'],
      },
    ],
  },
  {
    id: 'l6-003',
    level: 6,
    category: 'academic-writing',
    title: 'Describing Your Own Research in Simple English',
    topic: 'Academic Writing',
    estimatedMinutes: 8,
    content: [
      'Researchers who are not native English speakers sometimes believe they must write complex sentences to sound academic. In reality, most experienced scientific writers value short, clear sentences far more than long, complicated ones.',
      'A helpful strategy is to describe your research the same way you would explain it to a colleague from a different field: one idea per sentence, in a logical order. For example, instead of writing one long sentence packed with multiple ideas, it is often clearer to split it into two: "We measured blood flow in a model artery. We compared the results between three stent designs."',
      'When you are ready to combine ideas, connecting words such as "because," "although," "in order to," and "as a result" allow you to show the relationship between ideas without losing clarity. Reading your own sentences aloud is a simple but effective way to catch sentences that have become too long or unclear.',
      'As you continue studying, try to summarize your own research topic in three simple sentences: what you study, how you study it, and why it matters. This short exercise is often the foundation of a strong abstract.',
    ],
    vocabulary: [
      { word: 'colleague', partOfSpeech: 'noun', meaningJa: '同僚', example: 'Explain your research to a colleague from a different field.' },
      { word: 'logical order', partOfSpeech: 'phrase', meaningJa: '論理的な順序', example: 'Present your ideas in a logical order.' },
      { word: 'as a result', partOfSpeech: 'phrase', meaningJa: '結果として', example: 'As a result, flow resistance increased.' },
      { word: 'foundation', partOfSpeech: 'noun', meaningJa: '基礎、土台', example: 'This exercise is the foundation of a strong abstract.' },
    ],
    grammarPoints: [
      {
        sentence: 'A helpful strategy is to describe your research the same way you would explain it to a colleague from a different field.',
        translationJa: '役立つ戦略は、専門分野の異なる同僚に説明するのと同じように自分の研究を説明することである。',
        subject: 'A helpful strategy',
        verb: 'is',
        object: 'to describe your research the same way you would explain it to a colleague from a different field',
        notes: ['不定詞 to describe ... が補語になる文型', 'the same way (that) 〜 は「〜と同じように」'],
      },
    ],
  },
];
