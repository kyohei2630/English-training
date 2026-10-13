import type { ResearchUnit } from '../../types';

let cache: ResearchUnit[] | null = null;

export async function loadResearchUnits(): Promise<ResearchUnit[]> {
  if (!cache) cache = (await import('./units')).RESEARCH_UNITS;
  return cache;
}
