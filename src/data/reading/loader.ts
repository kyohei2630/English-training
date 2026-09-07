import type { Level, ReadingMaterial, UnderstandingQuestion } from '../../types';

export interface ReadingLevelData {
  materials: ReadingMaterial[];
  questions: UnderstandingQuestion[];
}

const cache = new Map<Level, ReadingLevelData>();
const pending = new Map<Level, Promise<ReadingLevelData>>();

async function importLevel(level: Level): Promise<ReadingLevelData> {
  switch (level) {
    case 1: {
      const [m, q] = await Promise.all([import('../materials/level1'), import('../questions/level1')]);
      return { materials: m.level1Materials, questions: q.level1Questions };
    }
    case 2: {
      const [m, q] = await Promise.all([import('../materials/level2'), import('../questions/level2')]);
      return { materials: m.level2Materials, questions: q.level2Questions };
    }
    case 3: {
      const [m, q] = await Promise.all([import('../materials/level3'), import('../questions/level3')]);
      return { materials: m.level3Materials, questions: q.level3Questions };
    }
    case 4: {
      const [m, q] = await Promise.all([import('../materials/level4'), import('../questions/level4')]);
      return { materials: m.level4Materials, questions: q.level4Questions };
    }
    case 5: {
      const [m, q] = await Promise.all([import('../materials/level5'), import('../questions/level5')]);
      return { materials: m.level5Materials, questions: q.level5Questions };
    }
    case 6: {
      const [m, q] = await Promise.all([import('../materials/level6'), import('../questions/level6')]);
      return { materials: m.level6Materials, questions: q.level6Questions };
    }
  }
}

/** Loads (and caches) one level's Reading materials + comprehension questions.
 * Each level lives in its own chunk (see vite build output), so opening Level 1
 * never pulls Level 4-6 content into memory. */
export async function loadReadingLevel(level: Level): Promise<ReadingLevelData> {
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

/** Level is encoded in every material id ("l4-001" -> level 4), so a single
 * material can be looked up without loading every level. */
export function parseLevelFromMaterialId(materialId: string): Level | null {
  const match = /^l(\d)-/.exec(materialId);
  if (!match) return null;
  const level = Number(match[1]);
  return level >= 1 && level <= 6 ? (level as Level) : null;
}

export async function loadMaterialById(materialId: string): Promise<ReadingMaterial | undefined> {
  const level = parseLevelFromMaterialId(materialId);
  if (!level) return undefined;
  const { materials } = await loadReadingLevel(level);
  return materials.find((m) => m.id === materialId);
}

export async function loadQuestionsForMaterial(materialId: string): Promise<UnderstandingQuestion[]> {
  const level = parseLevelFromMaterialId(materialId);
  if (!level) return [];
  const { questions } = await loadReadingLevel(level);
  return questions.filter((q) => q.materialId === materialId);
}

export function getCachedReadingLevel(level: Level): ReadingLevelData | undefined {
  return cache.get(level);
}
