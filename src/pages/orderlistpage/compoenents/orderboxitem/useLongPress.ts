import { useCallback, useRef } from 'react';

const DEFAULT_DELAY = 500;

export function useLongPress(
  onLongPress: () => void,
  options: { delay?: number; disabled?: boolean } = {},
) {
  const { delay = DEFAULT_DELAY, disabled = false } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedCallback = useRef(onLongPress);
  savedCallback.current = onLongPress;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (disabled) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      savedCallback.current();
    }, delay);
  }, [disabled, delay, clearTimer]);

  const end = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  return { onPointerDown: start, onPointerUp: end, onPointerLeave: end };
}
