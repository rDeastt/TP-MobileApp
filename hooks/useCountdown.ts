import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';

export type CountdownStatus = 'idle' | 'running' | 'paused' | 'done';

export interface UseCountdownOptions {
  /** Intervalo de refresco de UI en foreground (ms). */
  tickMs?: number;
  /** Se dispara una sola vez cuando el contador llega a 0. */
  onComplete?: () => void;
  /** Detiene y limpia el contador al salir de la pantalla (default true). */
  stopOnBlur?: boolean;
}

export interface Countdown {
  secondsLeft: number;
  totalSeconds: number;
  /** Fracción transcurrida 0→1 (para anillos de progreso). */
  progress: number;
  status: CountdownStatus;
  start: (durationSec: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

/**
 * Contador regresivo basado en timestamp absoluto (endAt), resistente a
 * background: el tick solo refresca la UI, el tiempo real se calcula
 * contra Date.now(). Patrón extraído de MeditationScreen.
 */
export function useCountdown(options: UseCountdownOptions = {}): Countdown {
  const { tickMs = 250, onComplete, stopOnBlur = true } = options;

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [status, setStatus] = useState<CountdownStatus>('idle');

  const endAtRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const sync = useCallback(() => {
    if (!endAtRef.current) return;
    const remainingMs = Math.max(0, endAtRef.current - Date.now());
    setSecondsLeft(Math.ceil(remainingMs / 1000));
    if (remainingMs <= 0) {
      endAtRef.current = null;
      clearTick();
      setStatus('done');
      onCompleteRef.current?.();
    }
  }, [clearTick]);

  const startTick = useCallback(() => {
    if (tickRef.current || !endAtRef.current) return;
    tickRef.current = setInterval(sync, tickMs);
  }, [sync, tickMs]);

  const start = useCallback(
    (durationSec: number) => {
      clearTick();
      setTotalSeconds(durationSec);
      setSecondsLeft(durationSec);
      endAtRef.current = Date.now() + durationSec * 1000;
      setStatus('running');
      startTick();
    },
    [clearTick, startTick],
  );

  const pause = useCallback(() => {
    if (statusRef.current !== 'running' || !endAtRef.current) return;
    const remainingMs = Math.max(0, endAtRef.current - Date.now());
    pausedRemainingRef.current = remainingMs;
    endAtRef.current = null;
    clearTick();
    setSecondsLeft(Math.ceil(remainingMs / 1000));
    setStatus('paused');
  }, [clearTick]);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused' || pausedRemainingRef.current <= 0) return;
    endAtRef.current = Date.now() + pausedRemainingRef.current;
    pausedRemainingRef.current = 0;
    setStatus('running');
    sync();
    startTick();
  }, [startTick, sync]);

  const stop = useCallback(() => {
    clearTick();
    endAtRef.current = null;
    pausedRemainingRef.current = 0;
    setStatus('idle');
    setSecondsLeft(0);
    setTotalSeconds(0);
  }, [clearTick]);

  // Foreground/background: el tick solo vive en foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') {
        sync();
        if (statusRef.current === 'running') startTick();
      } else if (next.match(/inactive|background/)) {
        clearTick();
      }
    });
    return () => sub.remove();
  }, [sync, startTick, clearTick]);

  // Limpieza al desmontar
  useEffect(() => clearTick, [clearTick]);

  // Detener al salir de la pantalla (evita timers/sonidos fantasma)
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (stopOnBlur) stop();
      };
    }, [stopOnBlur, stop]),
  );

  const progress =
    totalSeconds > 0 ? Math.min(1, Math.max(0, (totalSeconds - secondsLeft) / totalSeconds)) : 0;

  return { secondsLeft, totalSeconds, progress, status, start, pause, resume, stop };
}
