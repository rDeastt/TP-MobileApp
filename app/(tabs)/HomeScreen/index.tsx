import { View, Text, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RecommendationCard from '@/components/shared/RecomendationCard';
import Screen from '@/components/shared/Screen';
import { recommendations as rawRecommendations, BurnoutLevel } from '@/constants/recomendations';
import CardDescription from '@/components/shared/CardDescription';
import { getLastProbability, getLastUserName, getRiskInfo } from '@/services/burnoutHistory';
import { getStreak } from '@/services/activityLog';
import LastPredictionCard from '@/components/shared/LastPredictionCard';
import { colorRecomendationPalette } from '@/constants/Colors';
import phrases from '@/constants/motivationalPhrases';

const HomeScreen = () => {
  const [phrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);
  const [active, setActive] = useState<number | null>(null);
  const [risk, setRisk] = useState<BurnoutLevel>('moderate');
  const [percent, setPercent] = useState<number | null>(null);
  const [name, setName] = useState<string | null>('User');
  const [streak, setStreak] = useState(0);

  /* Refresca datos cada vez que la pantalla gana foco */
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const [level, p, lastName, s] = await Promise.all([
          getRiskInfo(),
          getLastProbability(),
          getLastUserName(),
          getStreak(),
        ]);
        if (!alive) return;
        setRisk(level);
        setPercent(p);
        setName(lastName);
        setStreak(s);
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const recs = rawRecommendations.filter((rec) => rec.level === risk);

  return (
    <Screen scroll className="pb-8">
      <View className="px-4 mt-6 mb-2">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-3xl font-bold text-content dark:text-content-dark">
            Hola, {name} 👋
          </Text>
          {streak > 0 && (
            <View className="flex-row items-center bg-orange-100 dark:bg-orange-950 px-3 py-1.5 rounded-full">
              <Ionicons name="flame" size={18} color="#f97316" />
              <Text className="ml-1 font-bold text-orange-500">{streak}</Text>
            </View>
          )}
        </View>
        <Text className="my-2 text-muted dark:text-muted-dark">
          ✨ Cree en ti mismo y todo será posible ✨
        </Text>

        <LastPredictionCard percentage={percent} />

        <Text className="text-2xl font-bold text-content dark:text-content-dark mt-2">
          Tus recomendaciones
        </Text>
      </View>

      {/* Tarjetas pequeñas scroll horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-2"
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {recs.map((rec, idx) => (
          <RecommendationCard
            key={rec.id}
            title={rec.title}
            iconName={rec.iconName}
            type="small"
            color={colorRecomendationPalette[idx % colorRecomendationPalette.length]}
            onPress={() => setActive(idx)}
          />
        ))}
      </ScrollView>

      {active !== null && (
        <CardDescription
          visible
          title={recs[active].title}
          body={recs[active].body}
          iconName={recs[active].iconName}
          color={colorRecomendationPalette[active % colorRecomendationPalette.length]}
          onClose={() => setActive(null)}
        />
      )}

      <View className="items-center mt-10 mb-6 px-6">
        <Text className="text-center text-muted dark:text-muted-dark italic text-xl">{phrase}</Text>
      </View>
    </Screen>
  );
};

export default HomeScreen;
