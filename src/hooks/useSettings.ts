import { useCallback, useEffect, useState } from 'react';
import type { AppSettings } from '../types';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../db/repositories/settingsRepository';

function applySettingsToDocument(settings: AppSettings) {
  const root = document.documentElement;
  root.classList.toggle('dark', settings.darkMode);
  root.dataset.fontSize = settings.fontSize;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await getSettings();
      setSettings(s);
      applySettingsToDocument(s);
      setLoading(false);
    })();
  }, []);

  const update = useCallback(async (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applySettingsToDocument(next);
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, loading, update };
}
