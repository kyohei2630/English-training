import { useState } from 'react';
import type { ReadingMaterial, VocabularyItem, GrammarPoint } from '../../types';
import Card from '../common/Card';
import HighlightedParagraph from './HighlightedParagraph';
import VocabPopup from './VocabPopup';
import GrammarPanel from './GrammarPanel';

interface ReadingViewProps {
  material: ReadingMaterial;
}

const LEVEL_LABELS: Record<number, string> = {
  1: '基礎',
  2: '高校基礎',
  3: '一般英文',
  4: 'Medical/Science',
  5: 'Research',
  6: 'Academic',
};

export default function ReadingView({ material }: ReadingViewProps) {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarPoint | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Level {material.level} · {LEVEL_LABELS[material.level]}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {material.topic}
          </span>
          <span className="text-slate-400">📖 約{material.estimatedMinutes}分</span>
        </div>
        <h1 className="text-2xl font-bold">{material.title}</h1>
      </div>

      <Card className="flex flex-col gap-4">
        {material.content.map((paragraph, i) => (
          <HighlightedParagraph
            key={i}
            text={paragraph}
            vocabulary={material.vocabulary}
            onWordClick={setSelectedWord}
          />
        ))}
        <p className="text-xs text-slate-400">💡 青字の単語をタップすると意味が表示されます</p>
      </Card>

      {material.grammarPoints.length > 0 && (
        <Card>
          <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">重要文の文法解説</h2>
          <div className="flex flex-col gap-2">
            {material.grammarPoints.map((point, i) => (
              <button
                key={i}
                onClick={() => setSelectedGrammar(point)}
                className="tap-target rounded-xl border border-slate-200 px-4 py-3 text-left text-sm leading-relaxed hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {point.sentence}
              </button>
            ))}
          </div>
        </Card>
      )}

      <VocabPopup word={selectedWord} materialId={material.id} onClose={() => setSelectedWord(null)} />
      <GrammarPanel point={selectedGrammar} materialId={material.id} onClose={() => setSelectedGrammar(null)} />
    </div>
  );
}
