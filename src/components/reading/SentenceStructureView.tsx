import type { SentenceStructure } from '../../types';

interface SentenceStructureViewProps {
  structure: SentenceStructure;
}

/** Visualizes an English sentence broken into role-labeled segments (subject, verb,
 * relative clause, etc.), stacked top-to-bottom so the structure reads like a diagram
 * instead of a single dense line. */
export default function SentenceStructureView({ structure }: SentenceStructureViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-medium leading-relaxed">{structure.sentence}</p>
      <div className="flex flex-col gap-1.5 border-l-2 border-blue-300 pl-3 dark:border-blue-700">
        {structure.segments.map((seg, i) => (
          <div key={i} className="flex items-baseline gap-2 text-sm">
            <span className="w-24 shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-center text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {seg.role}
            </span>
            <span className="leading-relaxed">{seg.text}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">{structure.translationJa}</p>
    </div>
  );
}
