import { Text, Pressable } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSurvey } from '@/hooks/SurveyContext';
import { mapFormToModel } from '@/hooks/utils/mapFormToModel';
import urlContainer from '@/hooks/urlContainer';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import PulsingOrb from '@/components/shared/PulsingOrb';
import { getUserId } from '@/hooks/utils/userId';
import { saveResult } from '@/services/burnoutHistory';

const MAX_RETRIES = 3;
// Cambia a false cuando tu API real esté enciendida nuevamente
const USE_MOCK = true; 

const TestScreen = () => {
  const { responses } = useSurvey();
  const url = urlContainer();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* -------- función que hace la petición -------- */
  const fetchPrediction = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const user_id = await getUserId();
      const payload = { user_id, ...mapFormToModel(responses) };

      let data;

      if (USE_MOCK) {
        // Simula el tiempo de respuesta de la red (2 segundos)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Puedes alterar este valor para probar las diferentes vistas:
        // 0.20 -> Riesgo Bajo (Verde) | 0.45 -> Riesgo Moderado (Amarillo) | 0.75 -> Riesgo Alto (Rojo)
        data = {
          probabilidad_burnout: 0.65,
          factores: ['Carga laboral excesiva', 'Falta de descanso'],
        };
      } else {
        const res = await axios.post(`${url}/predict`, payload, { timeout: 30000 });
        data = res.data;
      }

      const prob = data.probabilidad_burnout * 100;
      await saveResult(prob, responses, data.factores ?? []);

      if (!mountedRef.current) return;
      setResult(prob);
      setLoading(false);
    } catch (err: any) {
      console.warn('Error al hacer la predicción', err?.message ?? err);
      if (!mountedRef.current) return;
      setErrorMsg(err?.response?.data?.detail ?? err?.message ?? 'Error de conexión');
      setRetryCount((prev) => prev + 1);
      setLoading(false);
    }
  }, [responses, url]);

  /* -------- llamada inicial -------- */
  useEffect(() => {
    fetchPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- helper del resultado -------- */
  const getRiskInfo = (p: number) => {
    if (p < 30) return { title: '¡Buen trabajo!\nRiesgo de burnout bajo', emoji: '😊', color: 'text-green-600', advice: 'Mantén tus hábitos de autocuidado.' };
    if (p >= 50) return { title: 'Riesgo alto de burnout', emoji: '😟', color: 'text-red-500', advice: 'Revisa tus rutinas y busca apoyo.' };
    return { title: 'Riesgo moderado de burnout', emoji: '😐', color: 'text-yellow-500', advice: 'Aplica pequeñas mejoras para reducir el riesgo.' };
  };

  /* -------- UI: cargando -------- */
  if (loading)
    return (
      <Screen className="justify-center items-center">
        <PulsingOrb size={140}>
          <Text style={{ fontSize: 56, lineHeight: 70 }}>🧠</Text>
        </PulsingOrb>
        <Text className="text-lg mt-8 text-muted dark:text-muted-dark">
          Calculando tu resultado…
        </Text>
      </Screen>
    );

  /* -------- UI: error -------- */
  if (result === null)
    return (
      <Screen className="justify-center items-center p-6">
        <Text className="text-2xl font-bold text-red-500">¡Oops! Hubo un error.</Text>
        {errorMsg && (
          <Text className="mt-4 text-muted dark:text-muted-dark text-sm text-center">
            {errorMsg}
          </Text>
        )}

        {retryCount < MAX_RETRIES ? (
          <Pressable
            onPress={fetchPrediction}
            className="mt-6 px-6 py-3 rounded-full bg-main active:opacity-80"
          >
            <Text className="text-white font-semibold">Intentar de nuevo</Text>
          </Pressable>
        ) : (
          <Text className="mt-6 text-content dark:text-content-dark text-center">
            Ya intentaste varias veces. Inténtalo de nuevo más tarde.
          </Text>
        )}
      </Screen>
    );

  /* -------- UI: resultado -------- */
  const { title, emoji, color, advice } = getRiskInfo(result);

  return (
    <Screen className="items-center justify-center px-4">
      <Text className="text-center text-2xl font-bold whitespace-pre-line mb-6 text-content dark:text-content-dark">
        {title}
      </Text>
      <Text className={`text-6xl font-extrabold ${color}`}>{Math.round(result)}%</Text>
      <Text style={{ fontSize: 56, lineHeight: 70 }} className="mt-4">{emoji}</Text>
      <Text className="text-center text-muted dark:text-muted-dark mt-6 px-4 mb-6">{advice}</Text>
      <ThemedButton route="RecomendationsScreen">
        Ver mis recomendaciones
      </ThemedButton>
    </Screen>
  );
};

export default TestScreen;