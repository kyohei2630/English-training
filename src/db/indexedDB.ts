import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, type AppDBSchema } from './types';

let dbPromise: Promise<IDBPDatabase<AppDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<AppDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<AppDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, tx) {
        // --- v1: base stores (fresh install, or upgrading from nothing) ---
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' });
          store.createIndex('by-date', 'date');
          store.createIndex('by-day', 'day');
        }
        if (!db.objectStoreNames.contains('reviewItems')) {
          const store = db.createObjectStore('reviewItems', { keyPath: 'id' });
          store.createIndex('by-nextReviewDate', 'nextReviewDate');
          store.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }

        // --- v2: toeicResults store + reviewItems tag/level indexes ---
        // Existing sessions/reviewItems/progress/settings records are left untouched;
        // ReviewItem's new fields (tag, level, consecutiveCorrect) are optional and
        // default at read time in the service layer, so no data rewrite is needed.
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('toeicResults')) {
            const store = db.createObjectStore('toeicResults', { keyPath: 'id' });
            store.createIndex('by-date', 'date');
          }
          const reviewStore = tx.objectStore('reviewItems');
          if (!reviewStore.indexNames.contains('by-tag')) {
            reviewStore.createIndex('by-tag', 'tag');
          }
          if (!reviewStore.indexNames.contains('by-level')) {
            reviewStore.createIndex('by-level', 'level');
          }
        }
      },
    });
  }
  return dbPromise;
}
