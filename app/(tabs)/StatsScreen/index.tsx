import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedView from '@/components/shared/ThemedView';
import { HistoryItem, STORAGE_KEY } from '@/components/shared/burnoutHistory';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    })();
  }, []);

  const points = history.map((h) => ({
    value: h.probability,
    label: new Date(h.date).toLocaleDateString().slice(0, 5),
  }));

  const values = points.map((p) => p.value);
  const first = values[0]?.toFixed(2) ?? '—';
  const last = values.at(-1)?.toFixed(2) ?? '—';
  const maxValue = Math.max(...values, 0);

  // Definir color final según gravedad del historial
  const getEndColor = () => {
    if (maxValue < 30) return 'rgba(34,197,94,0.3)'; // verde
    if (maxValue < 50) return 'rgba(253,224,71,0.4)'; // amarillo
    return 'rgba(239,68,68,0.4)'; // rojo
  };

  return (
    <ThemedView margin className="flex-1">
      <ScrollView contentContainerClassName="px-4 pb-8">
        <Text className="text-3xl font-bold text-center my-4">
          Historial de Burnout
        </Text>

        {points.length >= 2 ? (
          <>
            {/* Eje Y */}
            <Text className="text-base text-gray-500 ml-2 mb-1">Porcentaje (%)</Text>

            <LineChart
              areaChart
              curved
              data={points}
              thickness={2}
              color="#3B82F6"
              startFillColor={getEndColor()}  
              endFillColor="rgba(34,197,94,0.15)" // verde inicial
              hideRules
              hideDataPoints
              yAxisTextStyle={{ color: '#64748b' }}
              xAxisLabelTextStyle={{ color: '#64748b', fontSize: 10 }}
              height={220}
              width={width - 32}
              yAxisLabelWidth={40}
            />

            {/* Eje X */}
            <Text className="text-sm text-center text-gray-500 mt-1">Fechas</Text>

            {/* Resumen */}
            <View className="mt-6 bg-cards rounded-xl p-4">
              <Text className="font-semibold text-lg mb-2 text-blue-800">Resumen:</Text>
              <Text className="text-gray-700">Primer registro: {first}%</Text>
              <Text className="text-gray-700">Último registro: {last}%</Text>
              <Text className="mt-2 text-gray-500 text-sm">
                *Un porcentaje menor indica menor riesgo de burnout.
              </Text>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-500 text-center">
              Realiza al menos dos test para ver tu progreso.
            </Text>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default StatsScreen;