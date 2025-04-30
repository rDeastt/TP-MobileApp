import { View, Text, ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSurvey } from '@/hooks/SurveyContext';
import { mapFormToModel } from '@/hooks/utils/mapFormToModel';
import urlContainer from '@/urlContainer';
import ThemedButton from '@/components/shared/ThemedButton';

const TestScreen = () => {
  const { responses } = useSurvey();
  const mappedResponses = mapFormToModel(responses);
  const url = urlContainer()
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState(false);
  console.log(url);
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.post(`${url}/predict`, mappedResponses);
        // Simulamos 3 segundos de espera
        setTimeout(() => {
          setResult(res.data.probabilidad);
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.error('Error al hacer la predicción', err);
        setTimeout(() => {
          setError(true);
          setLoading(false);
        }, 3000);
      }
    };

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ADF86" />
        <Text className="text-lg mt-4 text-gray-700">Calculando tu resultado...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-2xl font-bold text-red-500">¡Oops! Hubo un error.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-3xl font-bold text-green-500 mb-4">¡Resultado!</Text>
      <Text className="text-2xl text-gray-800">Tu probabilidad de burnout es:</Text>
      <Text className="text-4xl font-bold text-green-600 mt-4">{result?.toFixed(2)}%</Text>
      <ThemedButton route='HomeScreen'>
        Ver mis recomendaciones
      </ThemedButton>
    </View>
  );
};

export default TestScreen;
