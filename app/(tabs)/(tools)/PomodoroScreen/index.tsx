import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Tomato from '@/components/pomodoro/Tomato';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedTextInput from '@/components/shared/ThemedTextInput';
import ProgressRing from '@/components/shared/ProgressRing';
import { useCountdown } from '@/hooks/useCountdown';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/constants/sounds';
import { formatTime } from '@/utils/formatTime';
import { logCompletion } from '@/services/activityLog';

// ====== CONFIG ======
const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const PomodoroScreen = () => {
  // null = pantalla de configuración
  const [reps, setReps] = useState<number | null>(null);
  const [repsInput, setRepsInput] = useState('');
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [currentRep, setCurrentRep] = useState(0); // trabajos completados
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);

  // Refs espejo para leer el estado vigente dentro de onComplete
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const repRef = useRef(currentRep);
  repRef.current = currentRep;
  const repsRef = useRef(reps);
  repsRef.current = reps;

  const workEndSound = useSound(SOUNDS.workEnd);
  const breakEndSound = useSound(SOUNDS.breakEnd);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
    });
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const countdown = useCountdown({
    onComplete: () => {
      triggerShake();
      if (phaseRef.current === 'work') {
        const done = repRef.current + 1;
        setCurrentRep(done);
        workEndSound.play(); // fin de bloque de trabajo
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        logCompletion('pomodoro');

        if (repsRef.current !== null && done >= repsRef.current) {
          setFinished(true);
          return;
        }
        setPhase('break');
        countdown.start(BREAK_DURATION);
      } else {
        breakEndSound.play(); // fin de descanso
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPhase('work');
        countdown.start(WORK_DURATION);
      }
    },
  });

  const startSession = () => {
    const num = Number(repsInput);
    if (!num || num <= 0) return;
    setReps(num);
    setCurrentRep(0);
    setPhase('work');
    setFinished(false);
    Haptics.selectionAsync();
    countdown.start(WORK_DURATION);
  };

  const resetAll = () => {
    countdown.stop();
    setReps(null);
    setRepsInput('');
    setCurrentRep(0);
    setPhase('work');
    setFinished(false);
  };

  /* Al salir de la pantalla se resetea la sesión (el countdown se detiene
     solo con stopOnBlur; en background el tiempo sigue corriendo por timestamp). */
  useFocusEffect(
    useCallback(() => {
      return () => {
        setReps(null);
        setRepsInput('');
        setCurrentRep(0);
        setPhase('work');
        setFinished(false);
      };
    }, []),
  );

  // ====== UI: configuración ======
  if (reps === null) {
    const valid = /^\d+$/.test(repsInput) && Number(repsInput) > 0;
    return (
      <Screen>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center items-center px-6"
        >
          <Text className="text-2xl font-bold mb-4 text-content dark:text-content-dark">
            Pomodoro
          </Text>
          <Text className="text-center text-content dark:text-content-dark">
            Es una forma de estudiar o trabajar por partes.
            Trabajas 25 minutos y descansas 5.
            Así te cansas menos y te concentras mejor. 🙌
          </Text>
          <Text className="text-base mt-2 mb-2 font-bold text-content dark:text-content-dark">
            ¿Cuántas repeticiones deseas hacer?
          </Text>

          {/* Selección rápida */}
          <View className="flex-row gap-3 mt-4 mb-2">
            {[2, 3, 4].map((n) => (
              <Text
                key={n}
                onPress={() => {
                  Haptics.selectionAsync();
                  setRepsInput(String(n));
                }}
                className={`px-6 py-3 rounded-full overflow-hidden font-bold text-lg ${
                  repsInput === String(n)
                    ? 'bg-main text-white'
                    : 'bg-card dark:bg-card-dark text-content dark:text-content-dark'
                }`}
              >
                {n}
              </Text>
            ))}
          </View>

          <ThemedTextInput
            className="w-32 h-14 text-center text-xl"
            keyboardType="numeric"
            maxLength={2}
            placeholder="Otro"
            value={repsInput}
            onChangeText={(txt) => setRepsInput(txt.replace(/[^0-9]/g, ''))}
          />

          <View className="w-56">
            <ThemedButton disabled={!valid} onPress={startSession}>
              Iniciar
            </ThemedButton>
          </View>
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  // ====== UI: sesión ======
  const isBreak = phase === 'break';
  const isRunning = countdown.status === 'running';

  return (
    <Screen className="justify-center items-center p-6">
      <Text className="text-3xl font-bold mb-6 text-content dark:text-content-dark">Pomodoro</Text>

      <ProgressRing
        progress={finished ? 1 : countdown.progress}
        size={240}
        strokeWidth={12}
        color={isBreak ? '#78B4FF' : '#4ADF86'}
      >
        <Tomato current={currentRep} total={reps} triggerShake={shake} />
      </ProgressRing>

      <Text
        className="text-4xl font-bold my-4 text-content dark:text-content-dark"
        style={{ fontFamily: 'SpaceMono' }}
      >
        {formatTime(countdown.secondsLeft)}
      </Text>
      <Text className="text-lg text-gray-800 dark:text-gray-200 mb-6">
        {finished
          ? '¡Has completado todas las sesiones!'
          : isBreak
          ? '¡Tómate un descanso!'
          : '¡Sigue concentrado, tú puedes!'}
      </Text>

      {finished ? (
        <View className="w-56">
          <ThemedButton variant="secondary" onPress={resetAll}>
            Reiniciar
          </ThemedButton>
        </View>
      ) : (
        <View className="w-56 gap-3">
          <ThemedButton
            onPress={countdown.status === 'paused' ? countdown.resume : countdown.pause}
          >
            {isRunning ? 'Pausar' : 'Reanudar'}
          </ThemedButton>
          <ThemedButton variant="ghost" onPress={resetAll}>
            Cancelar
          </ThemedButton>
        </View>
      )}
    </Screen>
  );
};

export default PomodoroScreen;
