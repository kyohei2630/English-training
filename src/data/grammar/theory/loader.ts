import type { GrammarTheory, Level } from '../../../types';

const cache = new Map<Level, GrammarTheory[]>();
const pending = new Map<Level, Promise<GrammarTheory[]>>();

async function importLevel(level: Level): Promise<GrammarTheory[]> {
  switch (level) {
    case 1: return (await import('./level1')).level1GrammarTheory;
    case 2: return (await import('./level2')).level2GrammarTheory;
    case 3: return (await import('./level3')).level3GrammarTheory;
    case 4: return (await import('./level4')).level4GrammarTheory;
    case 5: return (await import('./level5')).level5GrammarTheory;
    // Level 6 (TOEIC) has no dedicated theory content — it reuses L1-L3 grammar
    // structures in a business context, so there is nothing new to teach here.
    case 6: return [];
  }
}

export async function loadGrammarTheoryLevel(level: Level): Promise<GrammarTheory[]> {
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

export function getCachedGrammarTheoryLevel(level: Level): GrammarTheory[] | undefined {
  return cache.get(level);
}
