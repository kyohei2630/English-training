import type { ExportBundle } from '../types';
import { getAllSessions, replaceAllSessions } from '../db/repositories/sessionRepository';
import { getAllReviewItems, replaceAllReviewItems } from '../db/repositories/reviewRepository';
import { getProgress, saveProgress } from '../db/repositories/progressRepository';
import { getSettings, saveSettings } from '../db/repositories/settingsRepository';

const EXPORT_VERSION = 1;

export async function buildExportBundle(): Promise<ExportBundle> {
  const [sessions, reviewItems, progress, settings] = await Promise.all([
    getAllSessions(),
    getAllReviewItems(),
    getProgress(),
    getSettings(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    version: EXPORT_VERSION,
    sessions,
    reviewItems,
    progress,
    settings,
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

  await Promise.all([
    replaceAllSessions(parsed.sessions),
    replaceAllReviewItems(parsed.reviewItems),
    saveProgress(parsed.progress),
    saveSettings(parsed.settings),
  ]);
}
