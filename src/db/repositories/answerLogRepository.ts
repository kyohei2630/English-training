import { getDB } from '../indexedDB';
import type { AnswerLogEntry } from '../../types';

export async function addAnswerLog(entry: AnswerLogEntry): Promise<void> {
  try {
    const db = await getDB();
    await db.put('answerLog', entry);
  } catch (err) {
    console.error('Failed to save answer log to IndexedDB', err);
  }
}

/** Entries with fromDate <= date <= toDate (YYYY-MM-DD, inclusive). */
export async function getAnswerLogBetween(fromDate: string, toDate: string): Promise<AnswerLogEntry[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('answerLog', 'by-date', IDBKeyRange.bound(fromDate, toDate));
  } catch (err) {
    console.error('Failed to read answer log from IndexedDB', err);
    return [];
  }
}

export async function getAllAnswerLog(): Promise<AnswerLogEntry[]> {
  try {
    const db = await getDB();
    return await db.getAll('answerLog');
  } catch (err) {
    console.error('Failed to read answer log from IndexedDB', err);
    return [];
  }
}

export async function replaceAllAnswerLog(entries: AnswerLogEntry[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('answerLog', 'readwrite');
    await tx.store.clear();
    for (const e of entries) await tx.store.put(e);
    await tx.done;
  } catch (err) {
    console.error('Failed to import answer log into IndexedDB', err);
  }
}
