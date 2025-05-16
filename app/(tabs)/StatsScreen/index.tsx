import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedView from '@/components/shared/ThemedView';
import { HistoryItem, STORAGE_KEY } from '@/components/shared/burnoutHistory';

const { width } = Dimensions.get('window');

// Mapeo de nombres legibles
const friendlyNames: Record<string, string> = {
  calidad_sueno: 'La calidad de tu sueño',
  comunicacion_familiar: 'La comunicación con tu familia',
  control_emociones: 'El control emocional',
  semestre: 'Tu semestre actual',
  edad: 'Tu edad',
  fumador: 'El hábito de fumar',
  situacion_laboral: 'Tu situación laboral',
  responsabilidades_familiares: 'Responsabilidades familiares',
  horas_ejercicio: 'La cantidad de ejercicio físico',
  carga_academica: 'Tu carga académica',
  satisfaccion_recompensas: 'Satisfacción con recompensas',
  frecuencia_ansioso: 'Frecuencia de ansiedad',
  frecuencia_deprimido: 'Frecuencia de tristeza',
};

const StatsScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [positiveFactors, setPositiveFactors] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: HistoryItem[] = JSON.parse(raw);
        setHistory(parsed);

        const last = parsed[parsed.length - 1];
        console.log('Último resultado:', last);
        if (last?.factores) {
          const factoresPositivos = last.factores
            .filter((f: any) => f.impacto_modelo > 0)
            .sort((a: any, b: any) => b.impacto_modelo - a.impacto_modelo)
            .map((f: any) => friendlyNames[f.variable] || f.variable);

          setPositiveFactors(factoresPositivos);
        }
      }
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

  const getEndColor = () => {
    if (maxValue < 30) return 'rgba(34,197,94,0.3)';
    if (maxValue < 50) return 'rgba(253,224,71,0.4)';
    return 'rgba(239,68,68,0.4)';
  };

  return (
    <ThemedView margin className="flex-1">
      <ScrollView contentContainerClassName="px-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-center my-4">Historial de Burnout</Text>

        {points.length >= 2 ? (
          <>
            <Text className="text-base text-gray-500 ml-2 mb-1">Porcentaje (%)</Text>

            <LineChart
              areaChart
              curved
              data={points}
              thickness={2}
              color="#3B82F6"
              startFillColor={getEndColor()}
              endFillColor="rgba(34,197,94,0.15)"
              hideRules
              hideDataPoints
              yAxisTextStyle={{ color: '#64748b' }}
              xAxisLabelTextStyle={{ color: '#64748b', fontSize: 10 }}
              height={220}
              width={width - 32}
              yAxisLabelWidth={40}
            />

            <Text className="text-sm text-center text-gray-500 mt-1">Fechas</Text>

            <View className="mt-6 bg-cards rounded-xl p-4">
              <Text className="font-semibold text-lg mb-2 text-blue-800">Resumen:</Text>
              <Text className="text-gray-700">Primer registro: {first}%</Text>
              <Text className="text-gray-700">Último registro: {last}%</Text>
              <Text className="mt-2 text-gray-500 text-sm">
                *Un porcentaje menor indica menor riesgo de burnout.
              </Text>
            </View>

            {positiveFactors.length > 0 && (
              <View className="mt-6 bg-cards rounded-xl p-4">
                <Text className="font-semibold text-lg mb-2 text-blue-800">
                  Lo que más te está afectando actualmente:
                </Text>
                {positiveFactors.map((item, idx) => (
                  <Text key={idx} className="text-gray-700">• {item}</Text>
                ))}
              </View>
            )}
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
