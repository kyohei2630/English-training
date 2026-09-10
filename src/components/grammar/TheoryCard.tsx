import type { GrammarTerm, GrammarTheory } from '../../types';
import Card from '../common/Card';
import SentenceStructureView from '../reading/SentenceStructureView';

interface TheoryCardProps {
  theory: GrammarTheory;
  /** used to resolve relatedTermIds into readable names */
  terms?: GrammarTerm[];
  onTermClick?: (term: GrammarTerm) => void;
}

export default function TheoryCard({ theory, terms = [], onTermClick }: TheoryCardProps) {
  const relatedTerms = (theory.relatedTermIds ?? [])
    .map((id) => terms.find((t) => t.id === id))
    .filter((t): t is GrammarTerm => !!t);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <span className="mb-2 inline-block w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {theory.tag}
        </span>
        <h2 className="text-xl font-bold">{theory.title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{theory.shortDescription}</p>
      </div>

      <div>
        <p className="mb-1 text-xs font-bold text-slate-400">この文法は何？</p>
        <p className="whitespace-pre-line text-sm leading-relaxed">{theory.concept}</p>
      </div>

      {theory.basicForm && (
        <div>
          <p className="mb-1 text-xs font-bold text-slate-400">基本の形</p>
          <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm dark:bg-slate-800">{theory.basicForm}</p>
        </div>
      )}

      {theory.rules.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">なぜこの形になるのか</p>
          <div className="flex flex-col gap-2">
            {theory.rules.map((rule, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <p className="mb-1 text-sm font-bold">{rule.title}</p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{rule.explanation}</p>
                {rule.formula && (
                  <p className="mt-2 rounded bg-slate-50 px-2 py-1 font-mono text-xs dark:bg-slate-800">{rule.formula}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {theory.examples.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">例文と文の構造</p>
          <div className="flex flex-col gap-3">
            {theory.examples.map((ex, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                {ex.structureBreakdown ? (
                  <SentenceStructureView structure={ex.structureBreakdown} />
                ) : (
                  <>
                    <p className="text-sm font-medium leading-relaxed">{ex.english}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ex.japanese}</p>
                  </>
                )}
                {ex.explanation && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ex.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {theory.keyPoints.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-bold text-slate-400">注意点・ポイント</p>
          <ul className="list-disc pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {theory.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {theory.commonMistakes && theory.commonMistakes.length > 0 && (
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
          <p className="mb-1 text-xs font-bold text-red-700 dark:text-red-400">よくある間違い</p>
          <ul className="list-disc pl-5 text-sm leading-relaxed text-red-800 dark:text-red-300">
            {theory.commonMistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {relatedTerms.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">関連する文法用語</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedTerms.map((term) => (
              <button
                key={term.id}
                onClick={() => onTermClick?.(term)}
                disabled={!onTermClick}
                className="tap-target rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 disabled:opacity-70 dark:bg-blue-950 dark:text-blue-300"
              >
                {term.term}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
