import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ProgressRing from '@/components/shared/ProgressRing';
import PulsingOrb from '@/components/shared/PulsingOrb';
import { useCountdown } from '@/hooks/useCountdown';
import { formatTime } from '@/utils/formatTime';
import { describeWeather, getOutdoorInfo, OutdoorInfo } from '@/services/weather';
import { logCompletion } from '@/services/activityLog';

const WALK_MINUTES = 10;

const OutdoorScreen = () => {
  const [info, setInfo] = useState<OutdoorInfo | null>(null);
  const [error, setError] = useState(false);
  const [walking, setWalking] = useState(false);
  const [done, setDone] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setError(false);
    setInfo(null);
    try {
      const data = await getOutdoorInfo();
      if (mountedRef.current) setInfo(data);
    } catch {
      if (mountedRef.current) setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const countdown = useCountdown({
    onComplete: () => {
      setWalking(false);
      setDone(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logCompletion('outdoor');
    },
  });

  const startWalk = () => {
    setDone(false);
    setWalking(true);
    Haptics.selectionAsync();
    countdown.start(WALK_MINUTES * 60);
  };

  const cancelWalk = () => {
    countdown.stop();
    setWalking(false);
  };

  /* ---------- cargando ---------- */
  if (!info && !error) {
    return (
      <Screen className="justify-center items-center">
        <PulsingOrb size={120} color="#78B4FF">
          <Text style={{ fontSize: 44, lineHeight: 56 }}>🌍</Text>
        </PulsingOrb>
        <Text className="text-lg mt-8 text-muted dark:text-muted-dark">
          Consultando el clima cerca de ti…
        </Text>
      </Screen>
    );
  }

  /* ---------- error ---------- */
  if (error || !info) {
    return (
      <Screen className="justify-center items-center px-6">
        <Text style={{ fontSize: 44, lineHeight: 56 }}>📡</Text>
        <Text className="text-center text-content dark:text-content-dark text-lg font-semibold mt-2">
          No se pudo consultar el clima
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-1 mb-6">
          Igual puedes salir a estirar las piernas, o hacer una pausa dentro.
        </Text>
        <View className="w-full gap-3">
          <ThemedButton onPress={load}>Reintentar</ThemedButton>
          <ThemedButton variant="ghost" onPress={() => router.push('/ActivePauseScreen')}>
            Hacer pausa activa adentro
          </ThemedButton>
        </View>
      </Screen>
    );
  }

  const advice = describeWeather(info);

  /* ---------- caminando ---------- */
  if (walking) {
    return (
      <Screen className="justify-center items-center px-6">
        <Text className="text-2xl font-bold mb-2 text-content dark:text-content-dark">
          Caminata consciente
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mb-8">
          Deja el teléfono en el bolsillo. Observa lo que te rodea y respira.
        </Text>
        <ProgressRing progress={countdown.progress} size={240} strokeWidth={12} color="#0ea5e9">
          <Text
            className="text-4xl font-bold text-content dark:text-content-dark"
            style={{ fontFamily: 'SpaceMono' }}
          >
            {formatTime(countdown.secondsLeft)}
          </Text>
        </ProgressRing>
        <View className="w-56 mt-10">
          <ThemedButton variant="ghost" onPress={cancelWalk}>
            Detener
          </ThemedButton>
        </View>
      </Screen>
    );
  }

  /* ---------- clima + sugerencia ---------- */
  return (
    <Screen className="px-4 justify-between">
      <View className="items-center mt-6">
        <Text className="text-2xl font-bold text-content dark:text-content-dark">
          Pausa al aire libre
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-1">
          🚶 Diez minutos afuera resetean tu mente 🚶
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <View className="bg-card dark:bg-card-dark rounded-3xl p-6 w-full items-center">
          <Text style={{ fontSize: 64, lineHeight: 80 }}>{advice.emoji}</Text>
          <Text className="text-4xl font-bold mt-2 text-content dark:text-content-dark">
            {info.temperature}°C
          </Text>
          <Text className="text-lg text-muted dark:text-muted-dark">
            {advice.label}
            {info.city ? ` · ${info.city}` : ''}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark mt-1">
            Viento {info.windSpeed} km/h · ubicación aproximada
          </Text>
        </View>

        <View
          className={`mt-4 rounded-2xl p-4 w-full ${
            advice.goOutside ? 'bg-main/15 border border-main' : 'bg-cards dark:bg-cards-dark'
          }`}
        >
          <Text className="text-center text-content dark:text-content-dark font-medium">
            {done
              ? '🎉 ¡Caminata completada! Tu mente te lo agradece.'
              : advice.goOutside
              ? 'El clima acompaña: sal a caminar 10 minutos sin audífonos y observa 3 cosas que nunca habías notado.'
              : 'El clima no acompaña ahora mismo. Mejor haz una pausa activa bajo techo, o una respiración consciente.'}
          </Text>
        </View>
      </View>

      <View className="mb-8 gap-3">
        {advice.goOutside ? (
          <ThemedButton onPress={startWalk}>
            {done ? 'Caminar otros 10 min' : `Iniciar caminata de ${WALK_MINUTES} min`}
          </ThemedButton>
        ) : (
          <>
            <ThemedButton onPress={() => router.push('/ActivePauseScreen')}>
              Ir a Pausa Activa
            </ThemedButton>
            <ThemedButton variant="secondary" onPress={() => router.push('/BreatheScreen')}>
              Respiración consciente
            </ThemedButton>
          </>
        )}
        <ThemedButton variant="ghost" onPress={load}>
          Actualizar clima
        </ThemedButton>
      </View>
    </Screen>
  );
};

export default OutdoorScreen;
