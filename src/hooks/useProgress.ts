import { useCallback, useEffect, useState } from 'react';
import type { UserProgress } from '../types';
import { getProgress, DEFAULT_PROGRESS } from '../db/repositories/progressRepository';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const p = await getProgress();
    setProgress(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { progress, loading, refresh };
}
