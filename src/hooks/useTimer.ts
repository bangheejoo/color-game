import { useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  onTick: (remaining: number) => void;
  onExpire: () => void;
}

export function useTimer({ initialSeconds, onTick, onExpire }: UseTimerOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(initialSeconds);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((seconds: number) => {
    stop();
    remainingRef.current = seconds;
    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1;
      onTick(remainingRef.current);
      if (remainingRef.current <= 0) {
        stop();
        onExpire();
      }
    }, 1000);
  }, [stop, onTick, onExpire]);

  // 언마운트 시 정리
  useEffect(() => () => stop(), [stop]);

  return { start, stop };
}
