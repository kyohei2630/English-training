import { getDB } from '../indexedDB';
import type { AssessmentDraft, AssessmentResult } from '../../types';

export async function saveAssessment(result: AssessmentResult): Promise<void> {
  try {
    const db = await getDB();
    await db.put('assessments', result);
  } catch (err) {
    console.error('Failed to save assessment to IndexedDB', err);
  }
}

/** Oldest first. */
export async function getAllAssessments(): Promise<AssessmentResult[]> {
  try {
    const db = await getDB();
    const all = await db.getAll('assessments');
    return all.sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  } catch (err) {
    console.error('Failed to read assessments from IndexedDB', err);
    return [];
  }
}

export async function replaceAllAssessments(items: AssessmentResult[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('assessments', 'readwrite');
    await tx.store.clear();
    for (const i of items) await tx.store.put(i);
    await tx.done;
  } catch (err) {
    console.error('Failed to import assessments into IndexedDB', err);
  }
}

const DRAFT_KEY = 'current';

/** The assessment in progress, if any. */
export async function getAssessmentDraft(): Promise<AssessmentDraft | undefined> {
  try {
    const db = await getDB();
    return await db.get('assessmentDrafts', DRAFT_KEY);
  } catch (err) {
    console.error('Failed to read assessment draft from IndexedDB', err);
    return undefined;
  }
}

export async function saveAssessmentDraft(draft: AssessmentDraft): Promise<void> {
  try {
    const db = await getDB();
    await db.put('assessmentDrafts', draft);
  } catch (err) {
    console.error('Failed to save assessment draft to IndexedDB', err);
  }
}

export async function deleteAssessmentDraft(): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('assessmentDrafts', DRAFT_KEY);
  } catch (err) {
    console.error('Failed to delete assessment draft from IndexedDB', err);
  }
}
