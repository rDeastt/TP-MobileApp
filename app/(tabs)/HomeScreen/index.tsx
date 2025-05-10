import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import RecommendationCard from '@/components/shared/RecomendationCard';
import ThemedView from '@/components/shared/ThemedView';
import { recommendations as rawRecommendations, colorRecomendationPalette as colorPalette, BurnoutLevel } from '@/constants/recomendations';
import CardDescription from '@/components/shared/CardDescription';
import { getRiskInfo } from '@/components/shared/burnoutHistory';


const HomeScreen = () => {
  const [active, setActive] = useState<null | number>(null);
  const [risk, setRisk] = useState<BurnoutLevel>('moderate');   // valor por defecto

    /* ── Obtener nivel una sola vez ── */
    useEffect(() => {
      (async () => {
        const level = await getRiskInfo();   // 'low' | 'moderate' | 'high'
        setRisk(level);
      })();
    }, []);
    const recommendations = rawRecommendations.filter(rec => rec.level === risk);
    
  return (
    <ThemedView>
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
    </ThemedView>
  );
};

export default HomeScreen;
