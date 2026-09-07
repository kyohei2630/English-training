import type { GrammarLesson, GrammarQuestion, Level } from '../../types';

export interface GrammarLevelData {
  lessons: GrammarLesson[];
  questions: GrammarQuestion[];
}

const cache = new Map<Level, GrammarLevelData>();
const pending = new Map<Level, Promise<GrammarLevelData>>();

async function importLevel(level: Level): Promise<GrammarLevelData> {
  switch (level) {
    case 1: {
      const m = await import('./level1');
      return { lessons: m.level1GrammarLessons, questions: m.level1GrammarQuestions };
    }
    case 2: {
      const m = await import('./level2');
      return { lessons: m.level2GrammarLessons, questions: m.level2GrammarQuestions };
    }
    case 3: {
      const m = await import('./level3');
      return { lessons: m.level3GrammarLessons, questions: m.level3GrammarQuestions };
    }
    case 4: {
      const m = await import('./level4');
      return { lessons: m.level4GrammarLessons, questions: m.level4GrammarQuestions };
    }
    case 5: {
      const m = await import('./level5');
      return { lessons: m.level5GrammarLessons, questions: m.level5GrammarQuestions };
    }
    case 6: {
      const m = await import('./level6');
      return { lessons: m.level6GrammarLessons, questions: m.level6GrammarQuestions };
    }
  }
}

export async function loadGrammarLevel(level: Level): Promise<GrammarLevelData> {
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

export function getCachedGrammarLevel(level: Level): GrammarLevelData | undefined {
  return cache.get(level);
}
