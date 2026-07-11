import React, { useCallback, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ProgressRing from '@/components/shared/ProgressRing';
import { useCountdown } from '@/hooks/useCountdown';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/constants/sounds';
import { formatTime } from '@/utils/formatTime';
import { logCompletion } from '@/services/activityLog';

type Mode = 'menu' | 'short' | 'medium';

const DURATIONS: Record<Exclude<Mode, 'menu'>, number> = {
  short: 5 * 60,
  medium: 10 * 60,
};

const MeditationScreen = () => {
  const [mode, setMode] = useState<Mode>('menu');
  const gong = useSound(SOUNDS.success);

  const countdown = useCountdown({
    onComplete: () => {
      gong.play();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logCompletion('meditation');
    },
  });

  const begin = (m: Exclude<Mode, 'menu'>) => {
    setMode(m);
    countdown.start(DURATIONS[m]);
  };

  const reset = () => {
    countdown.stop();
    setMode('menu');
  };

  /* Al salir de la pantalla el countdown se detiene solo (stopOnBlur);
     aquí solo reseteamos la vista. */
  useFocusEffect(
    useCallback(() => {
      return () => setMode('menu');
    }, []),
  );

  if (mode === 'menu') {
    return (
      <Screen className="items-center px-6">
        <View className="items-center mt-10 w-full">
          <Text className="text-3xl font-bold mb-2 text-content dark:text-content-dark">
            Meditación
          </Text>
          <Text className="text-lg font-semibold text-center mb-6 text-content dark:text-content-dark">
            ✨ Encuentra calma en minutos ✨
          </Text>
          <Text className="text-muted dark:text-muted-dark text-center mb-8">
            Elige una de las actividades guiadas para reducir el estrés y volver al presente.
          </Text>

          <View className="w-full gap-4">
            <ThemedButton onPress={() => begin('short')}>Meditación breve (5 min)</ThemedButton>
            <ThemedButton onPress={() => begin('medium')}>Meditación media (10 min)</ThemedButton>
          </View>
        </View>
      </Screen>
    );
  }

  const image =
    mode === 'short'
      ? require('../../../../assets/screenImages/meditation-1.png')
      : require('../../../../assets/screenImages/meditation-2.png');

  const done = countdown.status === 'done';

  return (
    <Screen className="items-center px-6">
      <View className="items-center mt-10 w-full">
        <Text className="text-2xl font-bold mb-2 text-content dark:text-content-dark">
          {mode === 'short' ? 'Meditación breve' : 'Meditación media'}
        </Text>
        <Text className="text-center text-gray-700 dark:text-gray-300 mb-6">
          {done ? '🌟 ¡Sesión completada! 🌟' : '🌿 Concéntrate en tu respiración 🌿'}
        </Text>

        <ProgressRing progress={done ? 1 : countdown.progress} size={260} strokeWidth={10}>
          <Image source={image} className="w-48 h-48" resizeMode="contain" />
        </ProgressRing>

        <Text
          className="text-5xl font-bold text-center my-6 text-content dark:text-content-dark"
          style={{ fontFamily: 'SpaceMono' }}
        >
          {formatTime(countdown.secondsLeft)}
        </Text>

        {done ? (
          <View className="w-full gap-3">
            <ThemedButton onPress={() => begin(mode)}>Meditar de nuevo</ThemedButton>
            <ThemedButton variant="ghost" onPress={reset}>
              Volver
            </ThemedButton>
          </View>
        ) : (
          <View className="flex-row gap-3">
            {countdown.status === 'paused' ? (
              <ThemedButton className="flex-1" onPress={countdown.resume}>
                Reanudar
              </ThemedButton>
            ) : (
              <ThemedButton className="flex-1" onPress={countdown.pause}>
                Pausar
              </ThemedButton>
            )}
            <ThemedButton className="flex-1" variant="ghost" onPress={reset}>
              Detener
            </ThemedButton>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default MeditationScreen;
