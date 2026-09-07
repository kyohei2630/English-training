import type { Level, VocabularyEntry } from '../../types';

const cache = new Map<Level, VocabularyEntry[]>();
const pending = new Map<Level, Promise<VocabularyEntry[]>>();

async function importLevel(level: Level): Promise<VocabularyEntry[]> {
  switch (level) {
    case 1: return (await import('./level1')).level1Vocabulary;
    case 2: return (await import('./level2')).level2Vocabulary;
    case 3: return (await import('./level3')).level3Vocabulary;
    case 4: return (await import('./level4')).level4Vocabulary;
    case 5: return (await import('./level5')).level5Vocabulary;
    case 6: return (await import('./level6')).level6Vocabulary;
  }
}

export async function loadVocabularyLevel(level: Level): Promise<VocabularyEntry[]> {
  const cached = cache.get(level);
  if (cached) return cached;
  const inFlight = pending.get(level);
  if (inFlight) return inFlight;
  const promise = importLevel(level).then((data) => {
    cache.set(level, data);
    pending.delete(level);
    return data;
  });
  pending.set(level, promise);
  return promise;
}

/** Loads every level. Used only when the learner explicitly searches across all
 * levels (VocabularyPage) — normal browsing/practice only ever loads one level. */
export async function loadAllVocabulary(): Promise<VocabularyEntry[]> {
  const all = await Promise.all(([1, 2, 3, 4, 5, 6] as const).map((l) => loadVocabularyLevel(l)));
  return all.flat();
}

export function getCachedVocabularyLevel(level: Level): VocabularyEntry[] | undefined {
  return cache.get(level);
}
