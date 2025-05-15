import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const meditationModes = {
  menu: 'menu',
  short: 'short',
  medium: 'medium',
} as const;

type Mode = keyof typeof meditationModes;

const MeditationScreen = () => {
  const [mode, setMode] = useState<Mode>('menu');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (duration: number) => {
    clearIntervalIfRunning();
    setSecondsLeft(duration);
    setPaused(false);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearIntervalIfRunning();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearIntervalIfRunning = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const pauseTimer = () => {
    setPaused(true);
    clearIntervalIfRunning();
  };

  const resumeTimer = () => {
    if (!intervalRef.current && secondsLeft > 0) {
      setPaused(false);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearIntervalIfRunning();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const reset = () => {
    setMode('menu');
    clearIntervalIfRunning();
    setSecondsLeft(0);
    setPaused(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderContent = () => {
    if (mode === 'menu') {
      return (
        <View className="items-center px-6 mt-10 w-full">
          <Text className="text-3xl font-bold mb-2">Mindfulness</Text>
          <Text className="text-lg font-semibold text-center mb-6">✨ Encuentra calma en minutos ✨</Text>
          <Text className="text-gray-500 text-center mb-8">Elige una de las actividades guiadas para reducir el estrés y volver al presente.</Text>

          <Pressable
            onPress={() => {
              setMode('short');
              startTimer(5 * 60);
            }}
            className="w-full py-4 rounded-full bg-[#4ADF86] active:opacity-80 mb-4"
          >
            <Text className="text-white text-center font-bold text-lg">Meditación breve (5 min)</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMode('medium');
              startTimer(10 * 60);
            }}
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
            <Pressable
              onPress={resumeTimer}
              className="py-3 px-6 rounded-full bg-[#4ADF86] active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">Reanudar</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={pauseTimer}
              className="py-3 px-6 rounded-full bg-yellow-400 active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">Pausar</Text>
            </Pressable>
          )}

          <Pressable
            onPress={reset}
            className="py-3 px-6 rounded-full bg-red-500 active:opacity-80 ml-2"
          >
            <Text className="text-white font-semibold text-lg">Detener</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return <SafeAreaView className="flex-1 bg-[#F3F3F3]">{renderContent()}</SafeAreaView>;
};

export default MeditationScreen;
