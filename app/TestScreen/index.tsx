import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSurvey } from '@/hooks/SurveyContext';
import { mapFormToModel } from '@/hooks/utils/mapFormToModel';
import urlContainer from '@/hooks/urlContainer';
import ThemedView from '@/components/shared/ThemedView';
import ThemedButton from '@/components/shared/ThemedButton';
import { getUserId } from '@/hooks/utils/userId';
import { saveResult } from '@/components/shared/burnoutHistory';

const TestScreen = () => {
  const { responses } = useSurvey();
  const mapped = mapFormToModel(responses);
  const url = urlContainer();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // 👈 nuevo estado

  /* -------- función que hace la petición -------- */
  const fetchPrediction = async () => {
    if (retryCount >= 3) return; // 👈 evita nuevas peticiones

    setLoading(true);
    setError(false);
    setErrorMsg(null);

    try {
      const user_id = await getUserId();
      const payload = { user_id, ...mapped };
      console.log("Formulario API \n" + JSON.stringify(mapped, null, 2));
      const start = performance.now();

      const { data } = await axios.post(`${url}/predict`, payload);

      const end = performance.now();
      const timeMs = end - start;
      console.log(`⏳ Tiempo de respuesta API: ${timeMs.toFixed(2)} ms`);

      setTimeout(async () => {
        const prob = data.probabilidad_burnout * 100;
        console.log("Respuesta API \n" + JSON.stringify(data, null, 2));
        setResult(prob);
        await saveResult(prob, responses, data.factores);
        setLoading(false);
      }, 3000);
    } catch (err: any) {
      console.warn('Error al hacer la predicción', err);
      setErrorMsg(JSON.stringify(err?.response?.data || err?.message || err, null, 2));
      setTimeout(() => {
        setRetryCount((prev) => prev + 1); // 👈 aumenta contador
        setError(true);
        setLoading(false);
      }, 3000);
    }
  };

  /* -------- llamada inicial -------- */
  useEffect(() => {
    fetchPrediction();
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
      <View className="flex-1 justify-center items-center bg-[#F3F3F3]">
        <ActivityIndicator size="large" color="#4ADF86" />
        <Text className="text-lg mt-4 text-gray-700">Calculando tu resultado…</Text>
      </View>
    );

  /* -------- UI: error -------- */
  if (error || result === null)
    return (
      <View className="flex-1 justify-center items-center bg-[#F3F3F3] p-6">
        <Text className="text-2xl font-bold text-red-500">¡Oops! Hubo un error.</Text>
        {errorMsg && (
          <Text className="mt-4 text-gray-600 text-sm text-center">{errorMsg}</Text>
        )}

        {retryCount < 3 ? (
          <Pressable
            onPress={fetchPrediction}
            className="mt-6 px-6 py-3 rounded-full bg-main"
          >
            <Text className="text-white font-semibold">Intentar de nuevo</Text>
          </Pressable>
        ) : (
          <Text className="mt-6 text-gray-700 text-center">
            Ya intentaste varias veces. Inténtalo de nuevo más tarde.
          </Text>
        )}
      </View>
    );

  /* -------- UI: resultado -------- */
  const { title, emoji, color, advice } = getRiskInfo(result);

  return (
    <ThemedView margin className="flex-1 items-center justify-center">
      <Text className="text-center text-2xl font-bold whitespace-pre-line mb-6">{title}</Text>
      <Text className={`text-6xl font-extrabold ${color}`}>{Math.round(result)}%</Text>
      <Text style={{ fontSize: 56, lineHeight: 70 }} className="mt-4">{emoji}</Text>
      <Text className="text-center text-gray-600 mt-6 px-4 mb-6">{advice}</Text>
      <ThemedButton route='RecomendationsScreen'>
        Ver mis recomendaciones
      </ThemedButton>
    </ThemedView>
  );
};

export default TestScreen;
