import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDB } from 'idb';
import { DB_NAME, DB_VERSION } from '../src/db/types';
import { getDB } from '../src/db/indexedDB';
import { getAllReviewItems } from '../src/db/repositories/reviewRepository';
import { getAllSessions } from '../src/db/repositories/sessionRepository';
import { getAllTheoryProgress } from '../src/db/repositories/theoryProgressRepository';
import { getAllAnswerLog } from '../src/db/repositories/answerLogRepository';
import { getAllAssessments } from '../src/db/repositories/assessmentRepository';
import { importExportBundle } from '../src/services/exportImport';
import { getProgress } from '../src/db/repositories/progressRepository';

test('upgrading a v3 database to the current version keeps every record and maps old tag spellings', async () => {
  // A database as the previous version of the app left it.
  const old = await openDB(DB_NAME, 3, {
    upgrade(db) {
      const sessions = db.createObjectStore('sessions', { keyPath: 'id' });
      sessions.createIndex('by-date', 'date');
      sessions.createIndex('by-day', 'day');
      const review = db.createObjectStore('reviewItems', { keyPath: 'id' });
      review.createIndex('by-nextReviewDate', 'nextReviewDate');
      review.createIndex('by-category', 'category');
      review.createIndex('by-tag', 'tag');
      review.createIndex('by-level', 'level');
      db.createObjectStore('progress');
      db.createObjectStore('settings');
      db.createObjectStore('toeicResults', { keyPath: 'id' }).createIndex('by-date', 'date');
      db.createObjectStore('theoryProgress', { keyPath: 'id' });
    },
  });
  await old.put('reviewItems', {
    id: 'r1',
    category: 'grammar',
    refId: 'grammar_l1_001',
    promptText: 'q',
    answerText: 'a',
    nextReviewDate: '2026-09-01',
    interval: 2,
    correctCount: 3,
    incorrectCount: 1,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  });
  // Answered under the old spelling of the There is/are tag.
  await old.put('reviewItems', {
    id: 'r2',
    category: 'grammar',
    refId: 'grammar_l1_194',
    promptText: 'q',
    answerText: 'a',
    tag: 'There is/are',
    nextReviewDate: '2026-09-01',
    interval: 1,
    correctCount: 1,
    incorrectCount: 2,
    consecutiveCorrect: 1,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  });
  await old.put('sessions', { id: 'session-2026-09-01', date: '2026-09-01', day: 5 });
  await old.put('theoryProgress', { id: 'theory-l1-01', status: 'mastered', miniCheckCorrect: 3, miniCheckTotal: 3, updatedAt: '' });
  await old.put('progress', { currentLevel: 1, currentDay: 6, totalStudyDays: 5 }, 'main');
  old.close();

  const db = await getDB();
  assert.equal(db.version, DB_VERSION);
  assert.ok(db.objectStoreNames.contains('answerLog'));
  assert.ok(db.objectStoreNames.contains('assessments'));
  assert.ok(db.objectStoreNames.contains('assessmentDrafts'));

  const items = await getAllReviewItems();
  assert.equal(items.length, 2);
  const r1 = items.find((i) => i.id === 'r1')!;
  assert.equal(r1.correctCount, 3);
  assert.equal(r1.tag, undefined, 'records without a tag are left as they were');
  const r2 = items.find((i) => i.id === 'r2')!;
  assert.equal(r2.tag, 'there-is-are', 'old spelling mapped to the internal ID');
  assert.deepEqual(
    { correct: r2.correctCount, incorrect: r2.incorrectCount, streak: r2.consecutiveCorrect, interval: r2.interval },
    { correct: 1, incorrect: 2, streak: 1, interval: 1 },
    'history unchanged'
  );
  assert.equal((await getAllSessions()).length, 1);
  assert.equal((await getAllTheoryProgress()).length, 1);
  assert.equal((await getProgress()).totalStudyDays, 5);
  assert.deepEqual(await getAllAnswerLog(), []);
});

test('a v3 backup (no answer log / assessments) still imports', async () => {
  await importExportBundle(
    JSON.stringify({
      exportedAt: '2026-09-07',
      version: 3,
      sessions: [],
      reviewItems: [{ id: 'x', category: 'vocabulary', refId: 'vocabulary_l1_001', promptText: 'w', answerText: 'm', nextReviewDate: '2026-09-08', interval: 0, correctCount: 0, incorrectCount: 1, createdAt: '', updatedAt: '' }],
      progress: { currentLevel: 2 },
      settings: {},
      toeicResults: [],
      theoryProgress: [],
    })
  );
  assert.equal((await getAllReviewItems())[0].refId, 'vocabulary_l1_001');
  assert.deepEqual(await getAllAssessments(), []);
  assert.equal((await getProgress()).currentLevel, 2);
});
