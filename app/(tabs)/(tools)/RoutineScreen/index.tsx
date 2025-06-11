import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useSurvey } from '@/hooks/SurveyContext';
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';

type Exercise = {
  id: string;
  name: string;
  image: any;
  duration: number;
  cue: string;
};

const routine: Exercise[] = [
  {
    id: 'march',
    name: 'Marcha suave en el lugar',
    image: require('../../../../assets/avatars/marcha.png'),
    duration: 3000,
    cue: 'Nota cómo se elevan tus rodillas y coordina la respiración con el ritmo.',
  },
  {
    id: 'squat',
    name: 'Sentadillas lentas',
    image: require('../../../../assets/avatars/sentadilla.png'),
    duration: 3000,
    cue: 'Siente el peso en tus talones y observa la tensión en los cuádriceps.',
  },
  {
    id: 'arm',
    name: 'Círculos de brazos',
    image: require('../../../../assets/avatars/brazos-circulo.png'),
    duration: 3000,
    cue: 'Inhala al llevar los brazos arriba y exhala al bajarlos, notando los hombros.',
  },
];

const RoutineScreen = () => {
  const { updateResponse } = useSurvey();

  const [idx, setIdx] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRunning = idx >= 0 && idx < routine.length;

  const clearTimers = () => {
    if (interval.current) clearInterval(interval.current);
    if (timeout.current) clearTimeout(timeout.current);
    interval.current = null;
    timeout.current = null;
  };

  const playSound = async (source: any) => {
    const { sound } = await Audio.Sound.createAsync(source);
    await sound.playAsync();
    // Liberar recursos al terminar
    sound.setOnPlaybackStatusUpdate((status) => {
      if ((status as any).didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  useEffect(() => clearTimers, []);

  const startExercise = (pos: number) => {
    clearTimers();
    setIsResting(false);
    setIdx(pos);
    const ex = routine[pos];
    setTimeLeft(ex.duration / 1000);

    interval.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);

    timeout.current = setTimeout(() => {
      clearTimers();
      if (pos < routine.length - 1) {
        setIsResting(true);
        setTimeLeft(5);
        playSound(require('../../../../assets/sounds/timer.mp3'));
        interval.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        timeout.current = setTimeout(() => {
          setIsResting(false);
          startExercise(pos + 1);
        }, 5000);
      } else {
        setIdx(routine.length);
        updateResponse('finishedSimpleWorkout' as any, true);
        playSound(require('../../../../assets/sounds/success.mp3'));
      }
    }, ex.duration);
  };

  const stopRoutine = () => {
    clearTimers();
    setIdx(-1);
    setTimeLeft(0);
    setIsResting(false);
    setIsStarting(false);
  };

  const Btn = ({
    text,
    onPress,
    color = 'bg-main',
  }: {
    text: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`${color} px-6 py-3 rounded-full items-center w-full mb-5`}
    >
      <Text className="text-white font-semibold text-lg">{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView margin className="flex-1 justify-between">
      {/* Cabecera */}
      <View className="items-center mt-5 mb-4">
        <Text className="text-3xl font-bold">Rutina sencilla de ejercicio</Text>
        <Text className="text-base text-gray-400">Activa tu cuerpo en minutos</Text>
      </View>

      {/* Contenido principal */}
      <View className="flex-1 items-center justify-center">
        {idx === -1 && !isStarting && (
          <>
            <SpeechBubble
              text="El movimiento consciente mejora el ánimo y reduce el estrés. ¡Vamos a comenzar!"
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-4.png')} animate />
          </>
        )}

        {isStarting && (
          <>
            <Text className="text-2xl font-bold mb-4 text-center">🧘 Prepárate</Text>
            <Text className="text-lg text-gray-600 mb-4">{timeLeft}s</Text>
            <Text className="text-center text-gray-700 italic px-6 text-lg">
              Vamos a comenzar con movimiento consciente. Mantente presente.
            </Text>
          </>
        )}

        {isRunning && !isResting && (
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
              <Btn text="Detener" onPress={stopRoutine} color="bg-[#f472b6]" />
            </View>
          </>
        )}

        {isResting && (
          <>
            <Text className="text-2xl font-bold mb-4 text-center">🧘 Respira profundamente</Text>
            <Text className="text-lg text-gray-600 mb-4">{timeLeft}s</Text>
            <Text className="text-center text-gray-700 italic px-6 text-lg">
              Prepara tu cuerpo y mente para el siguiente ejercicio.
            </Text>
          </>
        )}

        {idx === routine.length && (
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
      <View className="px-6 mb-6 space-y-5">
        {idx === -1 && !isStarting && (
          <Btn
            text="Comenzar rutina"
            onPress={() => {
              setIsStarting(true);
              setTimeLeft(5);
              playSound(require('../../../../assets/sounds/timer.mp3'));
              interval.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
              timeout.current = setTimeout(() => {
                clearTimers();
                setIsStarting(false);
                startExercise(0);
              }, 5000);
            }}
          />
        )}
        {idx === routine.length && (
          <>
            <Btn text="Repetir" onPress={() => startExercise(0)} />
            <Btn text="Regresar" onPress={stopRoutine} color="bg-[#f472b6]" />
          </>
        )}
      </View>
    </ThemedView>
  );
};

export default RoutineScreen;
