import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Tomato from '@/components/pomodoro/Tomato';

const WORK_DURATION = 5; // 20 * 60;
const BREAK_DURATION = 2; // 5 * 60;

const PomodoroScreen = () => {
  const [reps, setReps] = useState<number | null>(null);
  const [currentRep, setCurrentRep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && reps !== null && currentRep < reps) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setShake(true);

            if (!isBreak) {
              // Fin de sesión de trabajo
              if (currentRep + 1 < reps) {
                // Aún hay más sesiones → descanso
                setTimeout(() => {
                  setIsBreak(true);
                  setSecondsLeft(BREAK_DURATION);
                  setShake(false);
                  setIsRunning(false); // Pausa automática
                }, 100);
              } else {
                // Última sesión → terminar
                setTimeout(() => {
                  setCurrentRep((r) => r + 1);
                  setShake(false);
                  setIsRunning(false);
                }, 100);
              }
            } else {
              // Fin de descanso → próxima sesión
              setTimeout(() => {
                setCurrentRep((r) => r + 1);
                setIsBreak(false);
                setSecondsLeft(WORK_DURATION);
                setShake(false);
                setIsRunning(false); // Pausa automática
              }, 100);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, currentRep, reps, isBreak]);

  const startTimer = () => {
    if (reps && reps > 0) {
      setIsRunning(true);
    }
  };

  const resetAll = () => {
    setReps(null);
    setCurrentRep(0);
    setSecondsLeft(WORK_DURATION);
    setIsRunning(false);
    setIsBreak(false);
    setShake(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (reps === null) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center bg-[#F3F3F3] px-6"
      >
        <Text className="text-2xl font-bold mb-4">Pomodoro</Text>
        <Text className="text-base mb-2">¿Cuántas repeticiones deseas hacer?</Text>
        <TextInput
          className="w-32 h-12 text-center text-xl border border-gray-400 rounded-lg mb-6"
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => setReps(Number(text))}
        />
        <Pressable
          onPress={startTimer}
          className="bg-green-400 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Iniciar</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }

  const hasFinishedAll = currentRep >= reps;

  return (
    <View className="flex-1 justify-center items-center bg-[#F3F3F3] p-6">
      <Text className="text-3xl font-bold mb-3">Pomodoro</Text>

      <Tomato current={currentRep} total={reps} triggerShake={shake} />

      <Text className="text-4xl font-bold text-black mb-2">{formatTime(secondsLeft)}</Text>
      <Text className="text-lg text-gray-800 mb-6">
        {isBreak
          ? '¡Tómate un descanso!'
          : hasFinishedAll
          ? '¡Has completado todas las sesiones!'
          : 'Estudia lo que puedas con calma!'}
      </Text>

      {hasFinishedAll ? (
        <Pressable onPress={resetAll} className="bg-blue-500 px-6 py-3 rounded-full">
          <Text className="text-white font-bold">Reiniciar</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => setIsRunning((prev) => !prev)}
          className="bg-green-400 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">{isRunning ? 'Pausar' : 'Iniciar'}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default PomodoroScreen;
