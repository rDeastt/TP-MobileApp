import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Pressable, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const meditationModes = {
  menu: 'menu',
  short: 'short',
  medium: 'medium',
} as const;

type Mode = keyof typeof meditationModes;

const TICK_MS = 250; // intervalo liviano para refrescar UI en foreground

const MeditationScreen = () => {
  const [mode, setMode] = useState<Mode>('menu');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [paused, setPaused] = useState(false);

  // Momento absoluto en el que debe terminar el conteo (ms desde epoch)
  const endAtRef = useRef<number | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  // Calcula segundos restantes en base a endAt y actualiza estado
  const syncRemaining = useCallback(() => {
    if (!endAtRef.current) return;
    const remainingMs = Math.max(0, endAtRef.current - Date.now());
    const remainingSec = Math.ceil(remainingMs / 1000);
    setSecondsLeft(remainingSec);
    if (remainingSec <= 0) {
      // terminó
      endAtRef.current = null;
      clearTick();
      setPaused(false);
    }
  }, []);

  // Arranca el refresco de UI solo en foreground y si no está pausado
  const startTickIfNeeded = useCallback(() => {
    if (tickRef.current || paused || !endAtRef.current) return;
    tickRef.current = setInterval(syncRemaining, TICK_MS);
  }, [paused, syncRemaining]);

  const stopTick = useCallback(() => {
    clearTick();
  }, []);

  const startTimer = (durationSec: number) => {
    // Define el objetivo absoluto
    endAtRef.current = Date.now() + durationSec * 1000;
    setPaused(false);
    syncRemaining();      // actualiza inmediatamente
    startTickIfNeeded();  // refresco en foreground
  };

  const pauseTimer = () => {
    // Congela el restante actual
    syncRemaining();
    setPaused(true);
    stopTick();
    endAtRef.current = null; // limpiamos objetivo mientras está en pausa
  };

  const resumeTimer = () => {
    if (secondsLeft > 0) {
      setPaused(false);
      endAtRef.current = Date.now() + secondsLeft * 1000;
      syncRemaining();
      startTickIfNeeded();
    }
  };

  const reset = () => {
    setMode('menu');
    setPaused(false);
    stopTick();
    endAtRef.current = null;
    setSecondsLeft(0);
  };

  // Manejo de cambios de estado de la app (foreground/background)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const prev = appState.current;
      appState.current = nextState;

      // Al volver a 'active', sincronizamos el tiempo restante
      if (prev.match(/inactive|background/) && nextState === 'active') {
        syncRemaining();      // recalcula en base a endAt
        startTickIfNeeded();  // reanima el refresco del UI si corresponde
      }

      // Al ir a background, paramos el refresco del UI (el tiempo sigue corriendo por endAt)
      if (nextState.match(/inactive|background/)) {
        stopTick();
      }
    });

    return () => sub.remove();
  }, [startTickIfNeeded, stopTick, syncRemaining]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      stopTick();
      endAtRef.current = null;
    };
  }, [stopTick]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderContent = () => {
    if (mode === 'menu') {
      return (
        <View className="items-center px-6 mt-10 w-full">
          <Text className="text-3xl font-bold mb-2">Meditación</Text>
          <Text className="text-lg font-semibold text-center mb-6">✨ Encuentra calma en minutos ✨</Text>
          <Text className="text-gray-500 text-center mb-8">
            Elige una de las actividades guiadas para reducir el estrés y volver al presente.
          </Text>

          <Pressable
            onPress={() => { setMode('short'); startTimer(5 * 60); }}
            className="w-full py-4 rounded-full bg-[#4ADF86] active:opacity-80 mb-4"
          >
            <Text className="text-white text-center font-bold text-lg">Meditación breve (5 min)</Text>
          </Pressable>

          <Pressable
            onPress={() => { setMode('medium'); startTimer(10 * 60); }}
            className="w-full py-4 rounded-full bg-[#4ADF86] active:opacity-80"
          >
            <Text className="text-white text-center font-bold text-lg">Meditación media (10 min)</Text>
          </Pressable>
        </View>
      );
    }

    const image =
      mode === 'short'
        ? require('../../../../assets/screenImages/meditation-1.png')
        : require('../../../../assets/screenImages/meditation-2.png');

    return (
      <View className="items-center px-6 mt-10">
        <Text className="text-2xl font-bold mb-2">
          {mode === 'short' ? 'Meditación breve' : 'Meditación media'}
        </Text>
        <Text className="text-center text-gray-700 mb-6">🌿 Concéntrate en tu respiración 🌿</Text>

        <Image source={image} className="w-60 h-60 mb-8" resizeMode="contain" />

        <Text className="text-5xl font-bold text-center mb-6">{formatTime(secondsLeft)}</Text>

        <View className="flex-row space-x-4">
          {paused ? (
            <Pressable onPress={resumeTimer} className="py-3 px-6 rounded-full bg-[#4ADF86] active:opacity-80">
              <Text className="text-white font-semibold text-lg">Reanudar</Text>
            </Pressable>
          ) : (
            <Pressable onPress={pauseTimer} className="py-3 px-6 rounded-full bg-main active:opacity-80">
              <Text className="text-white font-semibold text-lg">Pausar</Text>
            </Pressable>
          )}

          <Pressable onPress={reset} className="py-3 px-6 rounded-full bg-[#f472b6] active:opacity-80 ml-2">
            <Text className="text-white font-semibold text-lg">Detener</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return <SafeAreaView className="flex-1 bg-[#F3F3F3]">{renderContent()}</SafeAreaView>;
};

export default MeditationScreen;
