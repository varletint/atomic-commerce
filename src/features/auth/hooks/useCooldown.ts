import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'cooldown_';

/**
 * Reusable cooldown timer hook.
 * Persists the expiry timestamp in sessionStorage so it survives page refreshes.
 *
 * @param id - Unique key (e.g. 'resend-verification', 'forgot-password')
 */
export function useCooldown(id: string) {
  const storageKey = `${STORAGE_PREFIX}${id}`;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getRemaining = useCallback((): number => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return 0;
    const expiresAt = parseInt(raw, 10);
    const diff = Math.ceil((expiresAt - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }, [storageKey]);

  const [remainingSeconds, setRemainingSeconds] = useState(getRemaining);

  // Tick every second while cooling down
  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      sessionStorage.removeItem(storageKey);
      return;
    }

    intervalRef.current = setInterval(() => {
      const remaining = getRemaining();
      setRemainingSeconds(remaining);
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        sessionStorage.removeItem(storageKey);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [remainingSeconds, getRemaining, storageKey]);

  const startCooldown = useCallback(
    (seconds: number) => {
      const expiresAt = Date.now() + seconds * 1000;
      sessionStorage.setItem(storageKey, expiresAt.toString());
      setRemainingSeconds(seconds);
    },
    [storageKey]
  );

  return {
    remainingSeconds,
    isCoolingDown: remainingSeconds > 0,
    startCooldown,
  };
}
