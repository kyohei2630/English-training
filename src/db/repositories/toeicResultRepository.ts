import { getDB } from '../indexedDB';
import type { ToeicResult } from '../../types';

export async function getAllToeicResults(): Promise<ToeicResult[]> {
  try {
    const db = await getDB();
    const all = await db.getAll('toeicResults');
    return all.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  } catch (err) {
    console.error('Failed to read TOEIC results from IndexedDB', err);
    return [];
  }
}

export async function saveToeicResult(result: ToeicResult): Promise<void> {
  try {
    const db = await getDB();
    await db.put('toeicResults', result);
  } catch (err) {
    console.error('Failed to save TOEIC result to IndexedDB', err);
  }
}

export async function deleteAllToeicResults(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('toeicResults');
  } catch (err) {
    console.error('Failed to clear TOEIC results in IndexedDB', err);
  }
}

export async function replaceAllToeicResults(results: ToeicResult[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('toeicResults', 'readwrite');
    await tx.store.clear();
    for (const r of results) await tx.store.put(r);
    await tx.done;
  } catch (err) {
    console.error('Failed to import TOEIC results into IndexedDB', err);
  }
}
