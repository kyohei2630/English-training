import { getDB } from '../indexedDB';
import type { LearningSession } from '../../types';

export async function getSessionByDate(date: string): Promise<LearningSession | undefined> {
  try {
    const db = await getDB();
    const tx = db.transaction('sessions');
    const idx = tx.store.index('by-date');
    return await idx.get(date);
  } catch (err) {
    console.error('Failed to read session from IndexedDB', err);
    return undefined;
  }
}

export async function saveSession(session: LearningSession): Promise<void> {
  try {
    const db = await getDB();
    await db.put('sessions', session);
  } catch (err) {
    console.error('Failed to save session to IndexedDB', err);
  }
}

export async function getAllSessions(): Promise<LearningSession[]> {
  try {
    const db = await getDB();
    const all = await db.getAll('sessions');
    return all.sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error('Failed to read sessions from IndexedDB', err);
    return [];
  }
}

export async function deleteAllSessions(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('sessions');
  } catch (err) {
    console.error('Failed to clear sessions in IndexedDB', err);
  }
}

export async function replaceAllSessions(sessions: LearningSession[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('sessions', 'readwrite');
    await tx.store.clear();
    for (const s of sessions) await tx.store.put(s);
    await tx.done;
  } catch (err) {
    console.error('Failed to import sessions into IndexedDB', err);
  }
}
