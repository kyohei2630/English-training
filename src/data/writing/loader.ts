import type { Level, WritingExercise } from '../../types';

const cache = new Map<Level, WritingExercise[]>();
const pending = new Map<Level, Promise<WritingExercise[]>>();

async function importLevel(level: Level): Promise<WritingExercise[]> {
  switch (level) {
    case 1: return (await import('./level1')).level1Writing;
    case 2: return (await import('./level2')).level2Writing;
    case 3: return (await import('./level3')).level3Writing;
    case 4: return (await import('./level4')).level4Writing;
    case 5: return (await import('./level5')).level5Writing;
    case 6: return (await import('./level6')).level6Writing;
  }
}

export async function loadWritingLevel(level: Level): Promise<WritingExercise[]> {
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

export function parseLevelFromWritingId(id: string): Level | null {
  const match = /^w-l(\d)-/.exec(id);
  if (!match) return null;
  const level = Number(match[1]);
  return level >= 1 && level <= 6 ? (level as Level) : null;
}

export async function loadWritingById(id: string): Promise<WritingExercise | undefined> {
  const level = parseLevelFromWritingId(id);
  if (!level) return undefined;
  const exercises = await loadWritingLevel(level);
  return exercises.find((w) => w.id === id);
}

export function getCachedWritingLevel(level: Level): WritingExercise[] | undefined {
  return cache.get(level);
}
