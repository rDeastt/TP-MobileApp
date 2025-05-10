import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import RecommendationCard from '@/components/shared/RecomendationCard';
import ThemedView from '@/components/shared/ThemedView';
import { recommendations as rawRecommendations, colorRecomendationPalette as colorPalette, BurnoutLevel } from '@/constants/recomendations';
import CardDescription from '@/components/shared/CardDescription';
import { clearHistory, getLastProbability, getLastUserName, getRiskInfo } from '@/components/shared/burnoutHistory';
import LastPredictionCard from '@/components/shared/LastPredictionCard';

const HomeScreen = () => {
  const [active, setActive] = useState<number | null>(null);
  const [risk,   setRisk]   = useState<BurnoutLevel>('moderate');
  const [percent, setPercent] = useState<number | null>(null);
  const [name, setName] = useState<string | null>("User");

  /* Obtener nivel y porcentaje solo una vez */
  useEffect(() => {
    (async () => {
      const [level, p, name] = await Promise.all([getRiskInfo(), getLastProbability(), getLastUserName()]);
      setRisk(level);
      setPercent(p);
      setName(name);
    })();
  }, []);

  const recommendations = rawRecommendations.filter((rec) => rec.level === risk);

  return (
    <ThemedView>
      {/* Tarjeta resumen de la última predicción */}
      <View className="px-4 mt-10 mb-2">
        <Text className="text-3xl font-bold text-black">Bienvenido {name}</Text>
        <Text className='my-2'> ✨ Cree en ti mismo y todo será posible ✨</Text>
        <LastPredictionCard
          percentage={percent}
          bgColor='bg-secondary'
        />

        <Text className="text-3xl font-bold text-black">Tus Recomendaciones</Text>
      </View>

      {/* Tarjetas pequeñas scroll horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-2"
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.id}
            title={rec.title}
            iconName={rec.iconName as any}
            type="small"
            onPress={() => setActive(index)}
            color={colorPalette[index % colorPalette.length]}
          />
        ))}
      </ScrollView>
      
      {/* Tarjeta modal superpuesta */}
      {active !== null && (
        <CardDescription
          visible={active !== null}
          title={recommendations[active].title}
          body={recommendations[active].body}
          iconName={recommendations[active].iconName}
          color={colorPalette[active % colorPalette.length]}
          onClose={() => setActive(null)}
        />
      )}

      <Pressable
        onPress={clearHistory}                       // ← imprime en consola
        className="bg-emerald-500 px-6 py-4 rounded-xl mt-10 w-full items-center"
      >
        <Text className="text-white font-semibold text-lg">
          Ver mis recomendaciones
        </Text>
      </Pressable>
    </ThemedView>
  );
};

export default HomeScreen;