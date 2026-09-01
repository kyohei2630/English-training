import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, type AppDBSchema } from './types';

let dbPromise: Promise<IDBPDatabase<AppDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<AppDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<AppDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
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
      },
    });
  }
  return dbPromise;
}
