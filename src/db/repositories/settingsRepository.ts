import { getDB } from '../indexedDB';
import type { AppSettings } from '../../types';

const KEY = 'main';

export const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 'md',
  darkMode: false,
  dailyGoalMinutes: 30,
  currentLevel: 1,
  hasSeenOnboarding: false,
  freeStudyMode: false,
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const db = await getDB();
    const value = await db.get('settings', KEY);
    return value ? { ...DEFAULT_SETTINGS, ...value } : DEFAULT_SETTINGS;
  } catch (err) {
    console.error('Failed to read settings from IndexedDB', err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    const db = await getDB();
    await db.put('settings', settings, KEY);
  } catch (err) {
    console.error('Failed to save settings to IndexedDB', err);
  }
}
