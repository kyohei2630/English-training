import type { GrammarTerm } from '../../../types';

let cache: GrammarTerm[] | null = null;
let pending: Promise<GrammarTerm[]> | null = null;

async function importAll(): Promise<GrammarTerm[]> {
  const [basic, structure, points] = await Promise.all([
    import('./basicTerms'),
    import('./sentenceStructureTerms'),
    import('./grammarPointTerms'),
  ]);
  return [...basic.basicTerms, ...structure.sentenceStructureTerms, ...points.grammarPointTerms];
}

/** Terms are a flat dictionary (not level-partitioned), so this loads once and
 * caches — a single small extra chunk, not part of the main bundle. */
export async function loadGrammarTerms(): Promise<GrammarTerm[]> {
  if (cache) return cache;
  if (pending) return pending;
  pending = importAll().then((data) => {
    cache = data;
    pending = null;
    return data;
  });
  return pending;
}

export function getCachedGrammarTerms(): GrammarTerm[] | undefined {
  return cache ?? undefined;
}
