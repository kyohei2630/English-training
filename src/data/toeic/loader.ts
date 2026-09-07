import type { ToeicPart, ToeicQuestion } from '../../types';

const cache = new Map<ToeicPart, ToeicQuestion[]>();
const pending = new Map<ToeicPart, Promise<ToeicQuestion[]>>();

async function importPart(part: ToeicPart): Promise<ToeicQuestion[]> {
  switch (part) {
    case 1: return (await import('./part1')).toeicPart1Questions;
    case 2: return (await import('./part2')).toeicPart2Questions;
    case 3: return (await import('./part3')).toeicPart3Questions;
    case 4: return (await import('./part4')).toeicPart4Questions;
    case 5: return (await import('./part5')).toeicPart5Questions;
    case 6: return (await import('./part6')).toeicPart6Questions;
    case 7: return (await import('./part7')).toeicPart7Questions;
  }
}

export async function loadToeicPart(part: ToeicPart): Promise<ToeicQuestion[]> {
  const cached = cache.get(part);
  if (cached) return cached;
  const inFlight = pending.get(part);
  if (inFlight) return inFlight;
  const promise = importPart(part).then((data) => {
    cache.set(part, data);
    pending.delete(part);
    return data;
  });
  pending.set(part, promise);
  return promise;
}

/** Used only when starting a mock test (needs a sample from every part). */
export async function loadAllToeicParts(): Promise<Record<ToeicPart, ToeicQuestion[]>> {
  const parts: ToeicPart[] = [1, 2, 3, 4, 5, 6, 7];
  const results = await Promise.all(parts.map((p) => loadToeicPart(p)));
  return {
    1: results[0], 2: results[1], 3: results[2], 4: results[3],
    5: results[4], 6: results[5], 7: results[6],
  };
}

export function getCachedToeicPart(part: ToeicPart): ToeicQuestion[] | undefined {
  return cache.get(part);
}
