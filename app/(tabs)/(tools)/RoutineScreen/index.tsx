// src/screens/SimpleWorkoutScreen.tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useSurvey } from '@/hooks/SurveyContext';
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';

type Exercise = {
  id: string;
  name: string;
  image: any;           // require(...)
  duration: number;     // milisegundos
  cue: string;          // mensaje mindfulness
};

const routine: Exercise[] = [
  {
    id: 'march',
    name: 'Marcha suave en el lugar',
    image: require('../../../../assets/avatars/avatar-1.png'),
    duration: 30000,
    cue: 'Nota cómo se elevan tus rodillas y coordina la respiración con el ritmo.',
  },
  {
    id: 'squat',
    name: 'Sentadillas lentas',
    image: require('../../../../assets/avatars/avatar-12.png'),
    duration: 30000,
    cue: 'Siente el peso en tus talones y observa la tensión en los cuádriceps.',
  },
  {
    id: 'arm',
    name: 'Círculos de brazos',
    image: require('../../../../assets/avatars/avatar-3.png'),
    duration: 30000,
    cue: 'Inhala al llevar los brazos arriba y exhala al bajarlos, notando los hombros.',
  },
];

const RoutineScreen = () => {
  const { updateResponse } = useSurvey();

  const [idx, setIdx] = useState<number>(-1);      // -1 = no iniciado | 0..n
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRunning = idx >= 0 && idx < routine.length;

  /* ---------- helpers ---------- */
  const clearTimers = () => {
    if (interval.current) clearInterval(interval.current);
    if (timeout.current) clearTimeout(timeout.current);
    interval.current = null;
    timeout.current = null;
  };

  useEffect(() => clearTimers, []);

  const startExercise = (pos: number) => {
    clearTimers();
    setIdx(pos);
    const ex = routine[pos];
    setTimeLeft(ex.duration / 1000);

    interval.current = setInterval(
      () => setTimeLeft((t) => t - 1),
      1000
    );

    timeout.current = setTimeout(() => {
      clearTimers();
      if (pos < routine.length - 1) {
        /* 5 s de transición consciente */
        setTimeLeft(5);
        interval.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        timeout.current = setTimeout(() => startExercise(pos + 1), 5000);
      } else {
        /* rutina terminada */
        setIdx(routine.length);
        updateResponse('finishedSimpleWorkout' as any, true);
      }
    }, ex.duration);
  };

  const stopRoutine = () => {
    clearTimers();
    setIdx(-1);
    setTimeLeft(0);
  };

  /* ---------- UI ---------- */
  const Btn = ({
    text,
    onPress,
    color = 'bg-main',
  }: {
    text: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity onPress={onPress} className={`${color} px-6 py-3 rounded-full items-center w-full mb-5`}>
      <Text className="text-white font-semibold text-lg">{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView margin className="flex-1 justify-between">
      {/* Cabecera */}
      <View className="items-center mt-5 mb-4">
        <Text className="text-3xl font-bold">Rutina sencilla de ejercicio</Text>
        <Text className="text-base text-gray-400">Activa tu cuerpo en 3 minutos</Text>
      </View>

      {/* Contenido principal */}
      <View className="flex-1 items-center justify-center">
        {idx === -1 && (
          <>
            <SpeechBubble
              text="El movimiento consciente mejora el ánimo y reduce el estrés. ¡Vamos a comenzar!"
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-4.png')} animate />
          </>
        )}

        {isRunning && (
          <>
            <Text className="text-2xl font-bold mb-4">{routine[idx].name}</Text>
            <Image
              source={routine[idx].image}
              className="w-48 h-48 mb-6"
              resizeMode="contain"
            />
            <Text className="text-lg text-gray-600 mb-8">{timeLeft}s</Text>
            <Text className="text-center text-gray-700 italic px-6 text-lg">
              {routine[idx].cue}
            </Text>

            <View className="mt-12 w-56">
              <Btn text="Detener" onPress={stopRoutine} color="bg-red-500" />
            </View>
          </>
        )}

        {idx === routine.length && (
          <>
            <SpeechBubble
              text="¡Excelente! Ejercitarte brevemente aumenta tu energía y concentración."
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-6.png')} animate />
          </>
        )}
      </View>

      {/* Botones inferiores */}
      <View className="px-6 mb-6 space-y-5">
        {idx === -1 && <Btn text="Comenzar rutina" onPress={() => startExercise(0)} />}
        {idx === routine.length && (
          <>
            <Btn text="Repetir" onPress={() => startExercise(0)} />
            <Btn text="Regresar" onPress={stopRoutine} color="bg-red-500" />
          </>
        )}
      </View>
    </ThemedView>
  );
};

export default RoutineScreen;
