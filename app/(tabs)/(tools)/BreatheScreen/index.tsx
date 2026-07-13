import { View, Text } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import { useCountdown } from '@/hooks/useCountdown';
import { logCompletion } from '@/services/activityLog';

/* ---- Fases y técnicas (máquina declarativa) ---- */
type PhaseId = 'prepare' | 'inhale' | 'hold' | 'exhale' | 'pause';

interface Phase {
  id: PhaseId;
  seconds: number;
  /** Escala objetivo del círculo al final de la fase. */
  scaleTo: number;
  /** Ciclo al que pertenece (0 = preparación). */
  cycle: number;
}

interface Technique {
  id: string;
  name: string;
  description: string;
  benefits: string;
  /** Duración por fase en segundos (0 = se omite). */
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
}

const techniques: Technique[] = [
  {
    id: 'box',
    name: 'Respiración Cuadrada',
    description: 'Inhala 4s, mantén 4s, exhala 4s, espera 4s',
    benefits: 'Calma la mente y reduce la ansiedad.',
    inhale: 4, hold: 4, exhale: 4, pause: 4,
  },
  {
    id: '478',
    name: 'Técnica 4-7-8',
    description: 'Inhala 4s, mantén 7s, exhala 8s',
    benefits: 'Induce relajación y mejora el sueño.',
    inhale: 4, hold: 7, exhale: 8, pause: 0,
  },
  {
    id: 'diaphragmatic',
    name: 'Respiración Diafragmática',
    description: 'Inhala 5s, exhala 5s',
    benefits: 'Reduce el cortisol y activa la relajación.',
    inhale: 5, hold: 0, exhale: 5, pause: 0,
  },
];

const TOTAL_CYCLES = 3;

const PHASE_LABEL: Record<PhaseId, string> = {
  prepare: 'Prepárate',
  inhale: 'Inhala',
  hold: 'Mantén',
  exhale: 'Exhala',
  pause: 'Pausa',
};

/** Construye la secuencia completa de una sesión: preparación + 3 ciclos. */
const buildSteps = (t: Technique): Phase[] => {
  const steps: Phase[] = [{ id: 'prepare', seconds: 3, scaleTo: 1, cycle: 0 }];
  for (let c = 1; c <= TOTAL_CYCLES; c++) {
    steps.push({ id: 'inhale', seconds: t.inhale, scaleTo: 1.4, cycle: c });
    if (t.hold > 0) steps.push({ id: 'hold', seconds: t.hold, scaleTo: 1.4, cycle: c });
    steps.push({ id: 'exhale', seconds: t.exhale, scaleTo: 1, cycle: c });
    if (t.pause > 0) steps.push({ id: 'pause', seconds: t.pause, scaleTo: 1, cycle: c });
  }
  return steps;
};

/** Feedback háptico por fase. */
const phaseHaptic = (id: PhaseId) => {
  if (id === 'inhale') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (id === 'exhale') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else if (id === 'hold') Haptics.selectionAsync();
};

const BreatheScreen = () => {
  const [mode, setMode] = useState<'choose' | 'session' | 'complete'>('choose');
  const [tech, setTech] = useState<Technique>(techniques[0]);
  const [stepIdx, setStepIdx] = useState(0);

  const stepsRef = useRef<Phase[]>([]);
  const stepIdxRef = useRef(0);
  const scale = useSharedValue(1);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
    phaseHaptic(step.id);
    scale.value = withTiming(step.scaleTo, {
      duration: step.seconds * 1000,
      easing: Easing.inOut(Easing.ease),
    });
    countdown.start(step.seconds);
  };

  const startSession = () => {
    stepsRef.current = buildSteps(tech);
    scale.value = 1;
    setMode('session');
    runStep(0);
  };

  const finish = () => {
    setMode('complete');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logCompletion('breathe');
  };

  const backToChoose = () => {
    countdown.stop();
    scale.value = 1;
    setMode('choose');
  };

  /* Si el usuario navega fuera a mitad de sesión, volver al inicio (el
     countdown ya se detiene solo con stopOnBlur). */
  useFocusEffect(
    useCallback(() => {
      return () => {
        scale.value = 1;
        setMode('choose');
        setStepIdx(0);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const step = stepsRef.current[stepIdx];

  return (
    <Screen className="px-3 justify-between">
      {/* cabecera */}
      <View className="items-center mt-5 mb-4">
        <Text className="text-3xl font-bold text-content dark:text-content-dark">
          Ejercicio de Respiración
        </Text>
        <Text className="text-base text-muted dark:text-muted-dark">
          Tómate un momento para relajarte
        </Text>
      </View>

      {/* cuerpo */}
      <View className="flex-1 items-center">
        {mode === 'choose' && (
          <>
            <SpeechBubble
              text="La respiración consciente reduce el estrés y la ansiedad. ¡Vamos a practicar juntos!"
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-3.png')} animate />
            <Text className="text-lg font-semibold mt-6 text-content dark:text-content-dark">
              Elige una técnica:
            </Text>
            <View className="flex-row flex-wrap justify-center mt-2 mb-4">
              {techniques.map((t) => {
                const sel = t.id === tech.id;
                return (
                  <Text
                    key={t.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setTech(t);
                    }}
                    className={`px-4 py-2 mx-1 mb-2 rounded-full overflow-hidden font-semibold ${
                      sel
                        ? 'bg-secondary dark:bg-secondary-dark text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {t.name}
                  </Text>
                );
              })}
            </View>
            <View className="bg-card dark:bg-card-dark p-4 rounded-xl mb-4 w-11/12">
              <Text className="font-bold text-center text-lg mb-1 text-content dark:text-content-dark">
                {tech.name}
              </Text>
              <Text className="text-center text-gray-700 dark:text-gray-300 mb-1">
                {tech.description}
              </Text>
              <Text className="text-center text-gray-700 dark:text-gray-300 italic">
                {tech.benefits}
              </Text>
            </View>
          </>
        )}

        {mode === 'session' && step && (
          <View className="items-center">
            <Text className="text-2xl font-bold mb-2 text-content dark:text-content-dark">
              {PHASE_LABEL[step.id]}
            </Text>

            {/* Dots de progreso por ciclo */}
            <View className="flex-row mb-10">
              {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                <View
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full mx-1 ${
                    i < step.cycle ? 'bg-main' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </View>

            {/* Círculo de respiración: halo + gradiente + contador */}
            <Animated.View
              style={[
                {
                  width: 210,
                  height: 210,
                  borderRadius: 105,
                  padding: 15,
                  backgroundColor: 'rgba(120,180,255,0.18)',
                },
                circleStyle,
              ]}
            >
              <LinearGradient
                colors={['#78B4FF', '#4ADF86']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  borderRadius: 90,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="text-white font-bold text-5xl" style={{ fontFamily: 'SpaceMono' }}>
                  {countdown.secondsLeft}
                </Text>
                <Text className="text-white/90 font-semibold text-base mt-1">
                  {PHASE_LABEL[step.id]}
                </Text>
              </LinearGradient>
            </Animated.View>

            <View className="mt-12 w-56">
              <ThemedButton variant="ghost" onPress={backToChoose}>
                Detener
              </ThemedButton>
            </View>
          </View>
        )}

        {mode === 'complete' && (
          <>
            <SpeechBubble
              text="¡Excelente! La práctica regular de la respiración consciente fortalece tu capacidad para manejar el estrés."
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-3.png')} animate />
          </>
        )}
      </View>

      {/* pie */}
      <View className="px-6 mb-6">
        {mode === 'choose' && <ThemedButton onPress={startSession}>Iniciar</ThemedButton>}
        {mode === 'complete' && (
          <View className="gap-3">
            <ThemedButton variant="secondary" onPress={startSession}>
              Practicar de nuevo
            </ThemedButton>
            <ThemedButton onPress={backToChoose}>Volver</ThemedButton>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default BreatheScreen;
