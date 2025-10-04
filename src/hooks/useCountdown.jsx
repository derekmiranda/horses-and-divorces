import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useCountdown hook
 * @param {number} initialSeconds - starting seconds for the countdown
 * @param {object} options - { autoStart=true, interval=1000, onExpire }
 * @returns {{ secondsLeft: number, isRunning: boolean, start: ()=>void, pause: ()=>void, reset: (n?:number)=>void }}
 */
export default function useCountdown(initialSeconds = 30, options = {}) {
  const { autoStart = true, interval = 1000, onExpire } = options;

  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.floor(initialSeconds)));
  const [isRunning, setIsRunning] = useState(autoStart);

  const timerRef = useRef(null);
  const secondsRef = useRef(secondsLeft);

  // keep ref in sync for callbacks
  useEffect(() => {
    secondsRef.current = secondsLeft;
  }, [secondsLeft]);

  const tick = useCallback(() => {
    setSecondsLeft((s) => {
      if (s <= 1) {
        // will reach zero
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRunning(false);
        if (typeof onExpire === "function") onExpire();
        return 0;
      }
      return s - 1;
    });
  }, [onExpire]);

  useEffect(() => {
    if (isRunning && timerRef.current == null) {
      timerRef.current = setInterval(tick, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, tick, interval]);

  const start = useCallback(() => {
    if (secondsRef.current <= 0) return; // nothing to start
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(
    (newSeconds = initialSeconds) => {
      const n = Math.max(0, Math.floor(newSeconds));
      setSecondsLeft(n);
      secondsRef.current = n;
      setIsRunning(Boolean(autoStart));
    },
    [initialSeconds, autoStart]
  );

  // clear on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { secondsLeft, isRunning, start, pause, reset };
}
