import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, type AppDBSchema } from './types';
import { canonicalTag } from '../data/grammar/tagLabels';

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

        // --- v3: theoryProgress store (Grammar Theory learning state) ---
        // New store only; nothing else changes, so upgrading loses no existing data.
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains('theoryProgress')) {
            db.createObjectStore('theoryProgress', { keyPath: 'id' });
          }
        }

        // --- v4: answerLog + assessments stores ---
        // New stores only; existing records are untouched.
        if (oldVersion < 4) {
          if (!db.objectStoreNames.contains('answerLog')) {
            db.createObjectStore('answerLog', { keyPath: 'id' }).createIndex('by-date', 'date');
          }
          if (!db.objectStoreNames.contains('assessments')) {
            db.createObjectStore('assessments', { keyPath: 'id' }).createIndex('by-date', 'date');
          }
        }

        // --- v5: assessmentDrafts store + grammar tag IDs ---
        // Records saved with an old spelling of a tag (e.g. "There is/are") get the tag's
        // internal ID ("there-is-are"), so they group with newer answers. Only `tag` changes.
        if (oldVersion < 5) {
          if (!db.objectStoreNames.contains('assessmentDrafts')) {
            db.createObjectStore('assessmentDrafts', { keyPath: 'id' });
          }
          const migrateTags = async (storeName: 'reviewItems' | 'answerLog') => {
            let cursor = await tx.objectStore(storeName).openCursor();
            while (cursor) {
              const value = cursor.value;
              const tag = canonicalTag(value.tag);
              if (tag !== value.tag) await cursor.update({ ...value, tag });
              cursor = await cursor.continue();
            }
          };
          void migrateTags('reviewItems');
          void migrateTags('answerLog');
        }
      },
    });
  }
  return dbPromise;
}
