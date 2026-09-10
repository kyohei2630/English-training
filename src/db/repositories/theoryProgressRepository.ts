import { getDB } from '../indexedDB';
import type { TheoryProgress } from '../../types';

export async function getTheoryProgress(theoryId: string): Promise<TheoryProgress | undefined> {
  try {
    const db = await getDB();
    return await db.get('theoryProgress', theoryId);
  } catch (err) {
    console.error('Failed to read theory progress from IndexedDB', err);
    return undefined;
  }
}

export async function getAllTheoryProgress(): Promise<TheoryProgress[]> {
  try {
    const db = await getDB();
    return await db.getAll('theoryProgress');
  } catch (err) {
    console.error('Failed to read theory progress from IndexedDB', err);
    return [];
  }
}

export async function upsertTheoryProgress(item: TheoryProgress): Promise<void> {
  try {
    const db = await getDB();
    await db.put('theoryProgress', item);
  } catch (err) {
    console.error('Failed to save theory progress to IndexedDB', err);
  }
}

export async function deleteAllTheoryProgress(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('theoryProgress');
  } catch (err) {
    console.error('Failed to clear theory progress in IndexedDB', err);
  }
}

export async function replaceAllTheoryProgress(items: TheoryProgress[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('theoryProgress', 'readwrite');
    await tx.store.clear();
    for (const i of items) await tx.store.put(i);
    await tx.done;
  } catch (err) {
    console.error('Failed to import theory progress into IndexedDB', err);
  }
}
