import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSurvey } from '@/hooks/SurveyContext';
import { mapFormToModel } from '@/hooks/utils/mapFormToModel';
import urlContainer from '@/urlContainer';
import ThemedView from '@/components/shared/ThemedView';
import ThemedButton from '@/components/shared/ThemedButton';

import { printHistory, saveResult, clearHistory } from '@/components/shared/burnoutHistory';


const TestScreen = () => {
  const { responses }  = useSurvey();
  const mapped         = mapFormToModel(responses);
  const url            = urlContainer();

  const [loading, setLoading] = useState(true);
  const [result,  setResult]  = useState<number | null>(null);
  const [error,   setError]   = useState(false);

  /* -------- petición + guardado -------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(`${url}/predict`, mapped);
        setTimeout(async () => {
          const prob = data.probabilidad;          // 0-100
          setResult(prob);
          await saveResult(prob, responses);       // ← guarda fecha, prob y nombre
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.warn('Error al hacer la predicción', err);
        setTimeout(() => {
          setError(true);
          setLoading(false);
        }, 3000);
      }
    })();
  }, []);

  /* -------------- UI helpers -------------- */
  const getRiskInfo = (p: number) => {
    if (p < 30) return { title:'¡Buen trabajo!\nRiesgo bajo', emoji:'😊', color:'text-green-600',
      advice:'Mantén tus hábitos de autocuidado.' };
    if (p >= 50) return { title:'Riesgo alto de burnout', emoji:'😟', color:'text-red-500',
      advice:'Revisa tus rutinas y busca apoyo.' };
    return { title:'Riesgo moderado', emoji:'😐', color:'text-yellow-500',
      advice:'Aplica pequeñas mejoras para reducir el riesgo.' };
  };

  /* -------------- estados de carga / error -------------- */
  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ADF86" />
        <Text className="text-lg mt-4 text-gray-700">Calculando tu resultado…</Text>
      </View>
    );

  if (error || result === null)
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-2xl font-bold text-red-500">¡Oops! Hubo un error.</Text>
      </View>
    );

  /* -------------- resultado -------------- */
  const { title, emoji, color, advice } = getRiskInfo(result);

  return (
    <ThemedView margin className="flex-1 items-center justify-center">
      <Text className="text-center text-2xl font-bold whitespace-pre-line mb-6">{title}</Text>

      <Text className={`text-6xl font-extrabold ${color}`}>{Math.round(result)}%</Text>

      <Text style={{ fontSize: 56, lineHeight: 70 }} className="mt-4">
        {emoji}
      </Text>

      <Text className="text-center text-gray-600 mt-6 px-4 mb-6">{advice}</Text>
      <ThemedButton route='RecomendationsScreen'>
        Ver mis recomendaciones
      </ThemedButton>
    </ThemedView>
  );
};

export default TestScreen;
