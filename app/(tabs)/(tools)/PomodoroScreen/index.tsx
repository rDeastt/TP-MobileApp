// PomodoroScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  AppState,
  AppStateStatus,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import Tomato from '@/components/pomodoro/Tomato';

import zap1 from '../../../../assets/sounds/zap1.mp3'; // fin de trabajo
import zap2 from '../../../../assets/sounds/zap2.mp3'; // fin de descanso

// ====== CONFIG ======
const WORK_DURATION  = 25 * 60; // 25*60 en producción
const BREAK_DURATION = 5 * 60; // 5*60 en producción

// Claves de storage
const KEY_START    = 'pomodoro:sessionStart';
const KEY_PHASES   = 'pomodoro:phases';
const KEY_ELAPSED  = 'pomodoro:lastElapsed';
const KEY_PAUSEDAT = 'pomodoro:pausedAt';

// ====== TIPOS ======
type Phase = { type: 'work' | 'break'; durationSec: number };

// ====== UTILES ======
const buildPhases = (reps: number): Phase[] => {
  const arr: Phase[] = [];
  for (let i = 0; i < reps; i++) {
    arr.push({ type: 'work', durationSec: WORK_DURATION });
    if (i < reps - 1) arr.push({ type: 'break', durationSec: BREAK_DURATION });
  }
  return arr;
};

const formatTime = (sec: number) =>
  `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60)
    .toString()
    .padStart(2, '0')}`;

const playSound = async (file: any) => {
  const { sound } = await Audio.Sound.createAsync(file);
  await sound.playAsync();
};

const locatePhase = (phases: Phase[], elapsed: number) => {
  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    const len = phases[i].durationSec;
    if (elapsed < acc + len) {
      const remaining = acc + len - elapsed;
      const completedWorks = phases.slice(0, i).filter(p => p.type === 'work').length;
      return {
        phaseIndex: i,
        remaining,
        isBreak: phases[i].type === 'break',
        currentRepFromWorksCompleted: completedWorks,
        finished: false,
      };
    }
    acc += len;
  }
  return {
    phaseIndex: phases.length,
    remaining: 0,
    isBreak: false,
    currentRepFromWorksCompleted: phases.filter(p => p.type === 'work').length,
    finished: true,
  };
};

const soundsForBoundaries = (phases: Phase[], prevElapsed: number, nowElapsed: number) => {
  const files: any[] = [];
  if (nowElapsed <= prevElapsed) return files;

  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    acc += phases[i].durationSec;
    if (prevElapsed < acc && nowElapsed >= acc) {
      files.push(phases[i].type === 'work' ? zap1 : zap2);
    }
  }
  return files;
};

const PomodoroScreen = () => {
  const navigation = useNavigation();
  // ====== ESTADO UI ======
  const [reps, setReps] = useState<number | null>(null);
  const [repsInput, setRepsInput] = useState('');

  const [currentRep, setCurrentRep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [shake, setShake] = useState(false);

  // Refs
  const uiTickRef = useRef<NodeJS.Timeout | null>(null);
  const lastElapsedRef = useRef<number>(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // ====== AUDIO ======
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
    });
  }, []);

  // ====== RESET AL SALIR (para que al volver pida repeticiones) ======
  // Este cleanup se ejecuta en cada blur/unfocus de la pantalla.
  useFocusEffect(
    React.useCallback(() => {
      // Al enfocar no hacemos nada especial.
      return () => {
        // Al perder foco (navegar atrás o a otra pantalla), limpiamos sesión.
        // Esto reproduce el comportamiento "antiguo": regresar → al entrar, pedir repeticiones.
        (async () => {
          await AsyncStorage.multiRemove([KEY_START, KEY_PHASES, KEY_ELAPSED, KEY_PAUSEDAT]);
        })();
        // También reseteamos estado local para que si el componente no se desmonta inmediatamente,
        // igual se vea la pantalla de selección al volver a enfocarse.
        setReps(null);
        setRepsInput('');
        setCurrentRep(0);
        setSecondsLeft(WORK_DURATION);
        setIsRunning(false);
        setIsBreak(false);
        setShake(false);
        lastElapsedRef.current = 0;
      };
    }, [])
  );

  // ====== RE-CÁLCULO CENTRAL ======
  const recalcFromNow = async (shouldPlaySingleOnResume = false) => {
    const [startPair, phasesPair, lastElPair, pausedPair] = await AsyncStorage.multiGet([
      KEY_START,
      KEY_PHASES,
      KEY_ELAPSED,
      KEY_PAUSEDAT,
    ]);
    const start = Number(startPair?.[1] ?? 0);
    const phases: Phase[] = JSON.parse(phasesPair?.[1] ?? '[]');
    const pausedAt = pausedPair?.[1] ? Number(pausedPair[1]) : null;

    if (!start || phases.length === 0) return;

    const effectiveNowMs = pausedAt ? pausedAt : Date.now();
    const nowElapsed = Math.floor((effectiveNowMs - start) / 1000);
    const prevElapsed = Number(lastElPair?.[1] ?? lastElapsedRef.current ?? 0);

    const located = locatePhase(phases, nowElapsed);

    if (shouldPlaySingleOnResume && !pausedAt) {
      const crossed = nowElapsed > prevElapsed
        ? soundsForBoundaries(phases, prevElapsed, nowElapsed).length
        : 0;
      if (crossed > 0 && !located.finished) {
        await playSound(located.isBreak ? zap1 : zap2);
      }
    }

    setReps(phases.filter(p => p.type === 'work').length);
    setCurrentRep(located.currentRepFromWorksCompleted);
    setIsBreak(located.isBreak);
    setSecondsLeft(located.remaining);
    setIsRunning(!located.finished && !pausedAt);
    setShake(false);

    lastElapsedRef.current = nowElapsed;
    await AsyncStorage.setItem(KEY_ELAPSED, String(nowElapsed));
  };

  // ====== HANDLERS ======
  const startSession = async () => {
    const num = Number(repsInput);
    if (!num || num <= 0) return;

    const phases = buildPhases(num);
    const sessionStart = Date.now();

    await AsyncStorage.multiSet([
      [KEY_START, String(sessionStart)],
      [KEY_PHASES, JSON.stringify(phases)],
      [KEY_ELAPSED, '0'],
    ]);
    await AsyncStorage.removeItem(KEY_PAUSEDAT);

    setReps(num);
    setCurrentRep(0);
    setIsBreak(false);
    setSecondsLeft(WORK_DURATION);
    setIsRunning(true);
    setShake(false);

    lastElapsedRef.current = 0;
  };

  const resetAll = async () => {
    await AsyncStorage.multiRemove([KEY_START, KEY_PHASES, KEY_ELAPSED, KEY_PAUSEDAT]);
    setReps(null);
    setRepsInput('');
    setCurrentRep(0);
    setSecondsLeft(WORK_DURATION);
    setIsRunning(false);
    setIsBreak(false);
    setShake(false);
    lastElapsedRef.current = 0;
  };

  const togglePause = async () => {
    const startStr = await AsyncStorage.getItem(KEY_START);
    if (!startStr) return;
    const start = Number(startStr);

    const pausedStr = await AsyncStorage.getItem(KEY_PAUSEDAT);
    const pausedAt = pausedStr ? Number(pausedStr) : null;

    if (!pausedAt) {
      // PAUSAR
      const now = Date.now();
      await AsyncStorage.setItem(KEY_PAUSEDAT, String(now));
      const nowElapsed = Math.floor((now - start) / 1000);
      lastElapsedRef.current = nowElapsed;
      await AsyncStorage.setItem(KEY_ELAPSED, String(nowElapsed));
      setIsRunning(false);
      await recalcFromNow(false);
    } else {
      // REANUDAR (descontar la pausa del inicio)
      const delta = Date.now() - pausedAt;
      const newStart = start + delta;
      await AsyncStorage.multiSet([
        [KEY_START, String(newStart)],
        [KEY_ELAPSED, String(lastElapsedRef.current)],
      ]);
      await AsyncStorage.removeItem(KEY_PAUSEDAT);
      setIsRunning(true);
      await recalcFromNow(false);
    }
  };

  // ====== TICK UI EN FOREGROUND ======
  useEffect(() => {
    if (!isRunning || reps === null) return;
    uiTickRef.current = setInterval(async () => {
      setSecondsLeft((s) => {
        const nxt = s - 1;
        if (nxt <= 0) {
          (async () => {
            const [startStr, phasesStr, pausedStr] = await AsyncStorage.multiGet([
              KEY_START, KEY_PHASES, KEY_PAUSEDAT,
            ]);
            const start = Number(startStr?.[1] ?? 0);
            const phases: Phase[] = JSON.parse(phasesStr?.[1] ?? '[]');
            const pausedAt = pausedStr?.[1] ? Number(pausedStr[1]) : null;
            if (!start || phases.length === 0 || pausedAt) return;

            const nowElapsed = Math.floor((Date.now() - start) / 1000);
            const prevElapsed = lastElapsedRef.current;

            const files = soundsForBoundaries(phases, prevElapsed, nowElapsed);
            for (const f of files) await playSound(f);

            await recalcFromNow(false);
          })();
          return 0;
        }
        return nxt;
      });
    }, 1000);
    return () => {
      if (uiTickRef.current) clearInterval(uiTickRef.current);
    };
  }, [isRunning, reps]);

  // ====== APPSTATE ======
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (prev === 'active' && (nextState === 'inactive' || nextState === 'background')) {
        const [startStr, pausedStr] = await AsyncStorage.multiGet([KEY_START, KEY_PAUSEDAT]);
        const start = Number(startStr?.[1] ?? 0);
        const pausedAt = pausedStr?.[1] ? Number(pausedStr[1]) : null;
        if (start && !pausedAt) {
          const nowElapsed = Math.floor((Date.now() - start) / 1000);
          lastElapsedRef.current = nowElapsed;
          await AsyncStorage.setItem(KEY_ELAPSED, String(nowElapsed));
        }
      }

      if ((prev === 'inactive' || prev === 'background') && nextState === 'active') {
        const pausedStr = await AsyncStorage.getItem(KEY_PAUSEDAT);
        const isPaused = !!pausedStr;
        await recalcFromNow(!isPaused);
      }
    });
    return () => sub.remove();
  }, []);

  // ====== RETOMAR SESIÓN SI EXISTE ======
  useEffect(() => {
    (async () => {
      const startStr = await AsyncStorage.getItem(KEY_START);
      const phasesStr = await AsyncStorage.getItem(KEY_PHASES);
      if (startStr && phasesStr) {
        await recalcFromNow(false);
      }
    })();
  }, []);

  const finished = reps !== null && currentRep >= (reps ?? 0) && !isRunning;

  // ====== UI ======
  if (reps === null) {
    const valid = /^\d+$/.test(repsInput) && Number(repsInput) > 0;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center bg-[#F3F3F3] px-6"
      >
        <Text className="text-2xl font-bold mb-4">Pomodoro</Text>
        <Text className="text-center">
          Es una forma de estudiar o trabajar por partes.
          Trabajas 25 minutos y descansas 5.
          Así te cansas menos y te concentras mejor. 🙌
        </Text>
        <Text className="text-base mt-2 mb-2 font-bold">
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
          className={`px-6 py-3 rounded-full ${valid ? 'bg-main active:opacity-80' : 'bg-gray-400'}`}
        >
          <Text className="text-white text-center font-bold text-lg">Iniciar</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }

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
          : '¡Sigue concentrado, tú puedes!'}
      </Text>

      {finished ? (
        <Pressable onPress={resetAll} className="bg-blue-500 px-6 py-3 rounded-full">
          <Text className="text-white font-bold">Reiniciar</Text>
        </Pressable>
      ) : (
        <Pressable onPress={togglePause} className="bg-green-400 px-6 py-3 rounded-full">
          <Text className="text-white font-bold">
            {isRunning ? 'Pausar' : 'Reanudar'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default PomodoroScreen;
