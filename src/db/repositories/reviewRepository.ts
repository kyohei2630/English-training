import { getDB } from '../indexedDB';
import type { ReviewItem } from '../../types';

export async function getDueReviewItems(today: string): Promise<ReviewItem[]> {
  try {
    const db = await getDB();
    const all = await db.getAll('reviewItems');
    return all
      .filter((item) => item.nextReviewDate <= today)
      .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  } catch (err) {
    console.error('Failed to read review items from IndexedDB', err);
    return [];
  }
}

export async function getAllReviewItems(): Promise<ReviewItem[]> {
  try {
    const db = await getDB();
    return await db.getAll('reviewItems');
  } catch (err) {
    console.error('Failed to read review items from IndexedDB', err);
    return [];
  }
}

export async function upsertReviewItem(item: ReviewItem): Promise<void> {
  try {
    const db = await getDB();
    await db.put('reviewItems', item);
  } catch (err) {
    console.error('Failed to save review item to IndexedDB', err);
  }
}

export async function getReviewItemByRef(refId: string): Promise<ReviewItem | undefined> {
  try {
    const db = await getDB();
    const all = await db.getAll('reviewItems');
    return all.find((i) => i.refId === refId);
  } catch (err) {
    console.error('Failed to look up review item in IndexedDB', err);
    return undefined;
  }
}

export async function getReviewItemsByCategory(category: ReviewItem['category']): Promise<ReviewItem[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('reviewItems', 'by-category', category);
  } catch (err) {
    console.error('Failed to read review items by category from IndexedDB', err);
    return [];
  }
}

export async function deleteAllReviewItems(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('reviewItems');
  } catch (err) {
    console.error('Failed to clear review items in IndexedDB', err);
  }
}

export async function replaceAllReviewItems(items: ReviewItem[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('reviewItems', 'readwrite');
    await tx.store.clear();
    for (const i of items) await tx.store.put(i);
    await tx.done;
  } catch (err) {
    console.error('Failed to import review items into IndexedDB', err);
  }
}
