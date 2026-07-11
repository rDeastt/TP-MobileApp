import { View, Text, Image } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ProgressRing from '@/components/shared/ProgressRing';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import { useCountdown } from '@/hooks/useCountdown';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/constants/sounds';
import { logCompletion } from '@/services/activityLog';

type Exercise = {
  id: string;
  name: string;
  image: any;
  cue: string;
};

const routine: Exercise[] = [
  {
    id: 'march',
    name: 'Marcha suave en el lugar',
    image: require('../../../../assets/workout/marcha.gif'),
    cue: 'Nota cómo se elevan tus rodillas y coordina la respiración con el ritmo.',
  },
  {
    id: 'squat',
    name: 'Sentadillas lentas',
    image: require('../../../../assets/avatars/sentadilla.png'),
    cue: 'Siente el peso en tus talones y observa la tensión en los cuádriceps.',
  },
  {
    id: 'arm',
    name: 'Círculos de brazos',
    image: require('../../../../assets/avatars/brazos-circulo.png'),
    cue: 'Inhala al llevar los brazos arriba y exhala al bajarlos, notando los hombros.',
  },
];

const EXERCISE_SECONDS = 30;
const REST_SECONDS = 5;
const PREPARE_SECONDS = 5;

type Step =
  | { kind: 'prepare'; seconds: number }
  | { kind: 'exercise'; seconds: number; exercise: Exercise; number: number }
  | { kind: 'rest'; seconds: number };

const buildSteps = (): Step[] => {
  const steps: Step[] = [{ kind: 'prepare', seconds: PREPARE_SECONDS }];
  routine.forEach((exercise, i) => {
    steps.push({ kind: 'exercise', seconds: EXERCISE_SECONDS, exercise, number: i + 1 });
    if (i < routine.length - 1) steps.push({ kind: 'rest', seconds: REST_SECONDS });
  });
  return steps;
};

const RoutineScreen = () => {
  const [mode, setMode] = useState<'intro' | 'session' | 'done'>('intro');
  const [stepIdx, setStepIdx] = useState(0);

  const stepsRef = useRef<Step[]>([]);
  const stepIdxRef = useRef(0);

  const transitionSound = useSound(SOUNDS.timer);
  const successSound = useSound(SOUNDS.success);

  const countdown = useCountdown({
    onComplete: () => {
      const next = stepIdxRef.current + 1;
      if (next < stepsRef.current.length) {
        runStep(next);
      } else {
        finish();
      }
    },
  });

  const runStep = (idx: number) => {
    const step = stepsRef.current[idx];
    stepIdxRef.current = idx;
    setStepIdx(idx);
    if (step.kind !== 'exercise') transitionSound.play();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    countdown.start(step.seconds);
  };

  const startRoutine = () => {
    stepsRef.current = buildSteps();
    setMode('session');
    runStep(0);
  };

  const finish = () => {
    setMode('done');
    successSound.play();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logCompletion('routine');
  };

  const stopRoutine = () => {
    countdown.stop();
    setMode('intro');
    setStepIdx(0);
  };

  /* Al salir de la pantalla, volver al inicio (countdown y sonidos se
     limpian solos con stopOnBlur/useSound). */
  useFocusEffect(
    useCallback(() => {
      return () => {
        setMode('intro');
        setStepIdx(0);
      };
    }, []),
  );

  const step = stepsRef.current[stepIdx];

  return (
    <Screen className="px-3 justify-between">
      {/* Cabecera */}
      <View className="items-center mt-5 mb-4">
        <Text className="text-3xl font-bold text-content dark:text-content-dark">
          Rutina sencilla de ejercicio
        </Text>
        <Text className="text-base text-muted dark:text-muted-dark">
          Activa tu cuerpo en minutos
        </Text>
      </View>

      {/* Contenido principal */}
      <View className="flex-1 items-center justify-center">
        {mode === 'intro' && (
          <>
            <SpeechBubble
              text="El movimiento consciente mejora el ánimo y reduce el estrés. ¡Vamos a comenzar!"
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-4.png')} animate />
          </>
        )}

        {mode === 'session' && step?.kind === 'prepare' && (
          <>
            <Text className="text-2xl font-bold mb-4 text-center text-content dark:text-content-dark">
              🧘 Prepárate
            </Text>
            <Text className="text-lg text-muted dark:text-muted-dark mb-4">
              {countdown.secondsLeft}s
            </Text>
            <Text className="text-center text-gray-700 dark:text-gray-300 italic px-6 text-lg">
              Vamos a comenzar con movimiento consciente. Mantente presente.
            </Text>
          </>
        )}

        {mode === 'session' && step?.kind === 'exercise' && (
          <>
            <Text className="text-xl font-bold mb-1 text-content dark:text-content-dark">
              {step.exercise.name}
            </Text>
            <Text className="text-sm text-muted dark:text-muted-dark mb-4">
              Ejercicio {step.number}/{routine.length}
            </Text>
            <ProgressRing progress={countdown.progress} size={220} strokeWidth={8}>
              <Image source={step.exercise.image} className="w-44 h-44" resizeMode="contain" />
            </ProgressRing>
            <Text className="text-lg text-muted dark:text-muted-dark my-4">
              {countdown.secondsLeft}s
            </Text>
            <Text className="text-center text-gray-700 dark:text-gray-300 italic px-6">
              {step.exercise.cue}
            </Text>
            <View className="mt-6 w-56">
              <ThemedButton variant="ghost" onPress={stopRoutine}>
                Detener
              </ThemedButton>
            </View>
          </>
        )}

        {mode === 'session' && step?.kind === 'rest' && (
          <>
            <Text className="text-2xl font-bold mb-4 text-center text-content dark:text-content-dark">
              🧘 Respira profundamente
            </Text>
            <Text className="text-lg text-muted dark:text-muted-dark mb-4">
              {countdown.secondsLeft}s
            </Text>
            <Text className="text-center text-gray-700 dark:text-gray-300 italic px-6 text-lg">
              Prepara tu cuerpo y mente para el siguiente ejercicio.
            </Text>
          </>
        )}

        {mode === 'done' && (
          <>
            <SpeechBubble
              text="¡Excelente! Ejercitarte brevemente aumenta tu energía y concentración."
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-1.png')} animate />
          </>
        )}
      </View>

      {/* Botones inferiores */}
      <View className="px-6 mb-6">
        {mode === 'intro' && <ThemedButton onPress={startRoutine}>Comenzar rutina</ThemedButton>}
        {mode === 'done' && (
          <View className="gap-3">
            <ThemedButton onPress={startRoutine}>Repetir</ThemedButton>
            <ThemedButton variant="ghost" onPress={stopRoutine}>
              Regresar
            </ThemedButton>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default RoutineScreen;
