import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useFocusEffect } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '@/components/shared/Screen';
import { HistoryItem, STORAGE_KEY, RETAKE_INTERVAL_DAYS, getDaysUntilNextPrediction } from '@/services/burnoutHistory';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

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

const riskColor = (p: number) =>
  p < 30 ? 'text-green-600' : p >= 50 ? 'text-red-500' : 'text-yellow-500';

const riskLabel = (p: number) => (p < 30 ? 'Riesgo bajo' : p >= 50 ? 'Riesgo alto' : 'Riesgo moderado');

const StatsScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [positiveFactors, setPositiveFactors] = useState<string[]>([]);
  const [daysLeft, setDaysLeft] = useState(0);
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const [raw, remaining] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          getDaysUntilNextPrediction(),
        ]);
        if (!alive) return;
        setDaysLeft(remaining);
        if (!raw) return;
        const parsed: HistoryItem[] = JSON.parse(raw);
        setHistory(parsed);

        const last = parsed[parsed.length - 1];
        if (last?.factores) {
          const factoresPositivos = last.factores
            .filter((f) => f.impacto_modelo > 0)
            .sort((a, b) => b.impacto_modelo - a.impacto_modelo)
            .map((f) => friendlyNames[f.variable] || f.variable);

          setPositiveFactors(factoresPositivos);
        }
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const points = history.map((h) => ({
    value: h.probability,
    label: new Date(h.date).toLocaleDateString().slice(0, 5),
  }));

  const values = points.map((p) => p.value);
  const count = values.length;
  const lastVal = values.at(-1) ?? null;
  const firstVal = values[0] ?? null;
  const delta = count >= 2 && lastVal !== null && firstVal !== null ? lastVal - firstVal : null;
  const maxValue = Math.max(...values, 0);

  const getEndColor = () => {
    if (maxValue < 30) return 'rgba(34,197,94,0.3)';
    if (maxValue < 50) return 'rgba(253,224,71,0.4)';
    return 'rgba(239,68,68,0.4)';
  };

  /* ---------- sin registros ---------- */
  if (count === 0) {
    return (
      <Screen className="items-center justify-center px-8">
        <Text style={{ fontSize: 56, lineHeight: 70 }}>📈</Text>
        <Text className="text-xl font-bold text-center mt-4 text-content dark:text-content-dark">
          Aún no tienes predicciones
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-2">
          Completa el test de burnout desde la pantalla principal y aquí verás tu evolución.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-center my-4 text-content dark:text-content-dark">
          Historial de Burnout
        </Text>

        {/* Tiles de resumen */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-card dark:bg-card-dark rounded-2xl p-4 items-center">
            <Text className="text-xs text-muted dark:text-muted-dark mb-1">Última</Text>
            <Text className={`text-2xl font-extrabold ${riskColor(lastVal!)}`}>
              {Math.round(lastVal!)}%
            </Text>
            <Text className="text-[10px] text-muted dark:text-muted-dark mt-0.5">
              {riskLabel(lastVal!)}
            </Text>
          </View>

          <View className="flex-1 bg-card dark:bg-card-dark rounded-2xl p-4 items-center">
            <Text className="text-xs text-muted dark:text-muted-dark mb-1">Cambio</Text>
            {delta !== null ? (
              <>
                <Text
                  className={`text-2xl font-extrabold ${
                    delta < 0 ? 'text-green-600' : delta > 0 ? 'text-red-500' : 'text-muted'
                  }`}
                >
                  {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {Math.abs(Math.round(delta))}%
                </Text>
                <Text className="text-[10px] text-muted dark:text-muted-dark mt-0.5">
                  {delta < 0 ? 'mejorando' : delta > 0 ? 'atención' : 'estable'}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-2xl font-extrabold text-muted dark:text-muted-dark">—</Text>
                <Text className="text-[10px] text-muted dark:text-muted-dark mt-0.5">
                  desde el 2º test
                </Text>
              </>
            )}
          </View>

          <View className="flex-1 bg-card dark:bg-card-dark rounded-2xl p-4 items-center">
            <Text className="text-xs text-muted dark:text-muted-dark mb-1">Tests</Text>
            <Text className="text-2xl font-extrabold text-content dark:text-content-dark">
              {count}
            </Text>
            <Text className="text-[10px] text-muted dark:text-muted-dark mt-0.5">
              realizado{count === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        {count >= 2 ? (
          <>
            <Text className="text-base text-muted dark:text-muted-dark ml-2 mb-1">
              Porcentaje (%)
            </Text>

            <LineChart
              areaChart
              curved
              data={points}
              thickness={2}
              color={palette.chartLine}
              startFillColor={getEndColor()}
              endFillColor="rgba(34,197,94,0.15)"
              hideRules
              hideDataPoints
              yAxisTextStyle={{ color: palette.chartAxis }}
              xAxisLabelTextStyle={{ color: palette.chartAxis, fontSize: 10 }}
              height={220}
              width={width - 32}
              yAxisLabelWidth={40}
            />

            <Text className="text-sm text-center text-muted dark:text-muted-dark mt-1">
              Fechas
            </Text>
          </>
        ) : (
          /* ---------- un solo registro ---------- */
          <View className="bg-cards dark:bg-cards-dark rounded-2xl p-5 items-center">
            <Text className="text-content dark:text-content-dark font-semibold text-base mb-1">
              Tu primer registro 🎉
            </Text>
            <Text className="text-muted dark:text-muted-dark text-sm mb-2">
              {new Date(history[0].date).toLocaleDateString('es', {
                day: 'numeric',
                month: 'long',
              })}
            </Text>
            <Text className="text-center text-gray-700 dark:text-gray-300 text-sm">
              {daysLeft > 0
                ? `El gráfico de evolución aparecerá con tu segundo test, disponible en ${daysLeft} día${
                    daysLeft === 1 ? '' : 's'
                  }.`
                : `¡Ya puedes hacer tu segundo test! Con él verás tu gráfico de evolución (intervalo de ${RETAKE_INTERVAL_DAYS} días).`}
            </Text>
          </View>
        )}

        {positiveFactors.length > 0 && (
          <View className="mt-6 bg-cards dark:bg-cards-dark rounded-xl p-4">
            <Text className="font-semibold text-lg mb-2 text-blue-800 dark:text-blue-300">
              Lo que más te está afectando actualmente:
            </Text>
            {positiveFactors.map((item, idx) => (
              <Text key={idx} className="text-gray-700 dark:text-gray-300">• {item}</Text>
            ))}
          </View>
        )}

        <Text className="text-xs text-muted dark:text-muted-dark text-center mt-6">
          *Un porcentaje menor indica menor riesgo de burnout.
        </Text>
      </ScrollView>
    </Screen>
  );
};

export default StatsScreen;
