import type { ExportBundle } from '../types';
import { getAllSessions, replaceAllSessions } from '../db/repositories/sessionRepository';
import { getAllReviewItems, replaceAllReviewItems } from '../db/repositories/reviewRepository';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';
import { getSettings, saveSettings } from '../db/repositories/settingsRepository';
import {
  getAllToeicResults,
  replaceAllToeicResults,
} from '../db/repositories/toeicResultRepository';
import { getAllTheoryProgress, replaceAllTheoryProgress } from '../db/repositories/theoryProgressRepository';
import { DEFAULT_PROGRESS } from '../db/repositories/progressRepository';
import { DEFAULT_SETTINGS } from '../db/repositories/settingsRepository';

const EXPORT_VERSION = 3;

export async function buildExportBundle(): Promise<ExportBundle> {
  const [sessions, reviewItems, progress, settings, toeicResults, theoryProgress] = await Promise.all([
    getAllSessions(),
    getAllReviewItems(),
    getProgress(),
    getSettings(),
    getAllToeicResults(),
    getAllTheoryProgress(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    version: EXPORT_VERSION,
    sessions,
    reviewItems,
    progress,
    settings,
    toeicResults,
    theoryProgress,
  };
}

export function downloadExportBundle(bundle: ExportBundle, filename = 'english-training-backup.json'): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export class ImportValidationError extends Error {}

function isExportBundle(value: unknown): value is ExportBundle {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.sessions) &&
    Array.isArray(v.reviewItems) &&
    typeof v.progress === 'object' &&
    typeof v.settings === 'object'
  );
}

export async function importExportBundle(raw: string): Promise<void> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ImportValidationError('ファイルの形式が正しくありません（JSONとして読み込めませんでした）。');
  }
  if (!isExportBundle(parsed)) {
    throw new ImportValidationError('学習データのバックアップファイルではないようです。');
  }

  // v1 backups predate `toeicResults`/`theoryProgress` and some UserProgress/AppSettings
  // fields — backfill defaults so old exports still import cleanly (no data loss on upgrade).
  const progress = { ...DEFAULT_PROGRESS, ...parsed.progress };
  const settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
  const toeicResults = Array.isArray(parsed.toeicResults) ? parsed.toeicResults : [];
  const theoryProgress = Array.isArray(parsed.theoryProgress) ? parsed.theoryProgress : [];

  await Promise.all([
    replaceAllSessions(parsed.sessions),
    replaceAllReviewItems(parsed.reviewItems),
    saveProgress(progress),
    saveSettings(settings),
    replaceAllToeicResults(toeicResults),
    replaceAllTheoryProgress(theoryProgress),
  ]);
}
