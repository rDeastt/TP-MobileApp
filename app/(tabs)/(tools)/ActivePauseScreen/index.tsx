import { View, Text, Image, Pressable } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ProgressRing from '@/components/shared/ProgressRing';
import { useCountdown } from '@/hooks/useCountdown';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/constants/sounds';
import { logCompletion } from '@/services/activityLog';

type Stretch = {
  title: string;
  detail: string;
  image: any;
};

const stretches: Stretch[] = [
  {
    title: 'Estiramiento lateral de brazos',
    detail: 'Mantén de 10 a 15 segundos por cada brazo.',
    image: require('../../../../assets/screenImages/acti-1.png'),
  },
  {
    title: 'Estiramiento de cuello',
    detail:
      'Inclina lentamente la cabeza hacia un lado, mantén por 10 segundos, y repite del otro lado. No te olvides de hacer giros suaves 👋',
    image: require('../../../../assets/screenImages/acti-2.png'),
  },
  {
    title: 'Rotación de hombros',
    detail:
      'Haz 10 círculos hacia atrás con los hombros, luego 10 hacia adelante. Inhala al levantar y exhala al bajar.',
    image: require('../../../../assets/screenImages/acti-3.png'),
  },
];

const STEP_SECONDS = 30;

const ActivePauseScreen = () => {
  const [mode, setMode] = useState<'intro' | 'session' | 'done'>('intro');
  const [stepIdx, setStepIdx] = useState(0);
  const stepIdxRef = useRef(0);

  const music = useSound(SOUNDS.activePause, { loop: true });

  const countdown = useCountdown({
    onComplete: () => nextStep(),
  });

  const runStep = (idx: number) => {
    stepIdxRef.current = idx;
    setStepIdx(idx);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    countdown.start(STEP_SECONDS);
  };

  const nextStep = () => {
    const next = stepIdxRef.current + 1;
    if (next < stretches.length) {
      runStep(next);
    } else {
      finish();
    }
  };

  const start = () => {
    music.play();
    setMode('session');
    runStep(0);
  };

  const finish = () => {
    countdown.stop();
    music.stop();
    setMode('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logCompletion('activePause');
  };

  /* Al salir de la pantalla se corta música y timer (useSound/useCountdown)
     y la vista vuelve al inicio. */
  useFocusEffect(
    useCallback(() => {
      return () => {
        setMode('intro');
        setStepIdx(0);
      };
    }, []),
  );

  const stretch = stretches[stepIdx];

  return (
    <Screen className="px-4 justify-between">
      <View className="items-center mt-6">
        <Text className="text-2xl font-bold text-center text-content dark:text-content-dark">
          Pausa Activa
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-1">
          🧳 Relájate con estos ejercicios simples mientras escuchas música suave 🎵
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        {mode === 'intro' && (
          <>
            <Image
              source={stretches[0].image}
              style={{ width: 230, height: 230, borderRadius: 115 }}
              resizeMode="cover"
            />
            <Text className="text-center text-gray-700 dark:text-gray-300 px-6">
              Te guiaré por {stretches.length} estiramientos de {STEP_SECONDS} segundos cada uno.
              Solo sigue las instrucciones y respira.
            </Text>
          </>
        )}

        {mode === 'session' && (
          <>
            <View className="flex-row items-center mb-2">
              <Text className="text-sm text-muted dark:text-muted-dark">
                Estiramiento {stepIdx + 1}/{stretches.length}
              </Text>
              <Pressable
                onPress={() => (music.isPlaying ? music.stop() : music.play())}
                className="ml-3 w-8 h-8 bg-card dark:bg-card-dark rounded-full items-center justify-center"
              >
                <Ionicons
                  name={music.isPlaying ? 'volume-high' : 'volume-mute'}
                  size={18}
                  color="#9BA1A6"
                />
              </Pressable>
            </View>
            <Text className="text-xl font-bold mb-4 text-center text-content dark:text-content-dark">
              {stretch.title}
            </Text>
            <ProgressRing progress={countdown.progress} size={230} strokeWidth={8} color="#0ea5e9">
              <Image
                source={stretch.image}
                style={{ width: 198, height: 198, borderRadius: 99 }}
                resizeMode="cover"
              />
            </ProgressRing>
            <Text className="text-lg text-muted dark:text-muted-dark my-3">
              {countdown.secondsLeft}s
            </Text>
            <Text className="text-center text-gray-700 dark:text-gray-300 px-6">
              {stretch.detail}
            </Text>
            <View className="mt-4 w-56">
              <ThemedButton variant="ghost" onPress={nextStep}>
                Saltar
              </ThemedButton>
            </View>
          </>
        )}

        {mode === 'done' && (
          <>
            <Text style={{ fontSize: 64, lineHeight: 80 }}>🎉</Text>
            <Text className="text-2xl font-bold text-center mt-4 text-content dark:text-content-dark">
              ¡Pausa completada!
            </Text>
            <Text className="text-center text-muted dark:text-muted-dark mt-2 px-8">
              Tu cuerpo te lo agradece. Pequeñas pausas como esta previenen la fatiga acumulada.
            </Text>
          </>
        )}
      </View>

      <View className="mb-8">
        {mode === 'intro' && <ThemedButton onPress={start}>Comenzar</ThemedButton>}
        {mode === 'done' && (
          <View className="gap-3">
            <ThemedButton variant="secondary" onPress={start}>
              Repetir
            </ThemedButton>
            <ThemedButton onPress={() => router.push('/ToolsScreen')}>Listo!</ThemedButton>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default ActivePauseScreen;
