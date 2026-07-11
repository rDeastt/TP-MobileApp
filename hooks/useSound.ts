import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackSource } from 'expo-av';
import { useFocusEffect } from 'expo-router';

interface UseSoundOptions {
  loop?: boolean;
  volume?: number;
}

/**
 * Reproductor con carga perezosa y descarga garantizada:
 * el sonido se libera (unloadAsync) al desmontar Y al salir de la pantalla.
 */
export function useSound(source: AVPlaybackSource, options: UseSoundOptions = {}) {
  const { loop = false, volume = 1 } = options;
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const unload = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    setIsPlaying(false);
    if (sound) {
      try {
        await sound.stopAsync();
      } catch {}
      try {
        await sound.unloadAsync();
      } catch {}
    }
  }, []);

  const play = useCallback(async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(source, {
          isLooping: loop,
          volume,
        });
        if (!loop) {
          sound.setOnPlaybackStatusUpdate((st) => {
            if (st.isLoaded && st.didJustFinish) setIsPlaying(false);
          });
        }
        soundRef.current = sound;
      }
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
      setIsPlaying(true);
    } catch {}
  }, [source, loop, volume]);

  const stop = useCallback(async () => {
    const sound = soundRef.current;
    if (sound) {
      try {
        await sound.stopAsync();
      } catch {}
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        unload();
      };
    }, [unload]),
  );

  return { play, stop, isPlaying };
}
