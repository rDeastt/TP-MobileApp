import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import Tomato from '@/components/pomodoro/Tomato';

import zap1 from '../../../../assets/sounds/zap1.mp3';
import zap2 from '../../../../assets/sounds/zap2.mp3';

const WORK_DURATION  = 5; // 20*60 en producción
const BREAK_DURATION = 3; // 5*60 en producción

/* ------- helper sonido -------- */
const playSound = async (file: any) => {
  const { sound } = await Audio.Sound.createAsync(file);
  await sound.playAsync();
};

const PomodoroScreen = () => {
  /* ① reps = cantidad final   | repsInput = texto que escribe el usuario */
  const [reps, setReps] = useState<number | null>(null);
  const [repsInput, setRepsInput] = useState('');

  const [currentRep, setCurrentRep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak]   = useState(false);
  const [shake, setShake]       = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ------- temporizador principal -------- */
  useEffect(() => {
    if (!isRunning || reps === null || currentRep >= reps) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setShake(true);

          (async () => {
            if (!isBreak) {
              if (currentRep + 1 < reps) {
                await playSound(zap1); // fin trabajo
                setIsBreak(true);
                setSecondsLeft(BREAK_DURATION);
              } else {
                await playSound(zap1); // último ciclo
                setCurrentRep((r) => r + 1);
              }
            } else {
              await playSound(zap2);   // fin descanso
              setCurrentRep((r) => r + 1);
              setIsBreak(false);
              setSecondsLeft(WORK_DURATION);
            }
            setShake(false);
            setIsRunning(false);
          })();

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, currentRep, reps, isBreak]);

  /* ------- helpers -------- */
  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60)
      .toString()
      .padStart(2, '0')}`;

  const startSession = () => {
    const num = Number(repsInput);
    if (num > 0) {
      setReps(num);
      setCurrentRep(0);
      setSecondsLeft(WORK_DURATION);
      setIsRunning(true);
    }
  };

  const resetAll = () => {
    setReps(null);
    setRepsInput('');
    setCurrentRep(0);
    setSecondsLeft(WORK_DURATION);
    setIsRunning(false);
    setIsBreak(false);
    setShake(false);
  };

  const finished = reps !== null && currentRep >= reps;

  /* ------- Pantalla de ingreso de repeticiones -------- */
  if (reps === null) {
    const valid = /^\d+$/.test(repsInput) && Number(repsInput) > 0;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center bg-[#F3F3F3] px-6"
      >
        <Text className="text-2xl font-bold mb-4">Pomodoro</Text>
        <Text className="text-base mb-2">
          ¿Cuántas repeticiones deseas hacer?
        </Text>

        <TextInput
          className="w-32 h-12 text-center text-xl border border-gray-400 rounded-full mb-6 bg-white"
          keyboardType="numeric"
          maxLength={2}
          value={repsInput}
          onChangeText={(txt) => setRepsInput(txt.replace(/[^0-9]/g, ''))}
        />

        <Pressable
          onPress={startSession}
          disabled={!valid}
          className={`px-6 py-3 rounded-full ${
            valid ? 'bg-main active:opacity-80' : 'bg-gray-400'
          }`}
        >
          <Text className="text-white text-center font-bold text-lg">Iniciar</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }

  /* ------- Pantalla principal Pomodoro -------- */
  return (
    <View className="flex-1 justify-center items-center bg-[#F3F3F3] p-6">
      <Text className="text-3xl font-bold mb-3">Pomodoro</Text>

      <Tomato current={currentRep} total={reps} triggerShake={shake} />

      <Text className="text-4xl font-bold mb-2">{formatTime(secondsLeft)}</Text>
      <Text className="text-lg text-gray-800 mb-6">
        {isBreak
          ? '¡Tómate un descanso!'
          : finished
          ? '¡Has completado todas las sesiones!'
          : 'Estudia lo que puedas con calma!'}
      </Text>

      {finished ? (
        <Pressable
          onPress={resetAll}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Reiniciar</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => setIsRunning((p) => !p)}
          className="bg-green-400 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default PomodoroScreen;
