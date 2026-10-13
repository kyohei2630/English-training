import type { SentenceBuildDrill } from '../../types';

let cache: SentenceBuildDrill[] | null = null;

export async function loadSentenceBuildDrills(): Promise<SentenceBuildDrill[]> {
  if (!cache) cache = (await import('./drills')).SENTENCE_BUILD_DRILLS;
  return cache;
}
