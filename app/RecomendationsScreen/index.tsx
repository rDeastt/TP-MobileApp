import {Text, ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '@/components/shared/ThemedView';
import CardDescription from '@/components/shared/CardDescription';
import RecommendationCard from '@/components/shared/RecomendationCard';
import { recommendations as rawRecommendations, colorRecomendationPalette as colorPalette, BurnoutLevel } from '@/constants/recomendations';
import { getRiskInfo } from '@/components/shared/burnoutHistory';
import ThemedButton from '@/components/shared/ThemedButton';

const RecomendationsScreen = () => {
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
    <ThemedView className='flex-1 ustify-center'>
        <Text className="text-3xl font-bold text-center mt-4">Recomendaciones</Text>
        {/* Tarjetas grandes */}
        <ScrollView className="mt-4 px-4">
        {recommendations.map((rec, index) => (
            <RecommendationCard
            key={rec.id}
            title={rec.title}
            description={rec.summary}
            iconName={rec.iconName as any}
            type="large"
            color={colorPalette[index % colorPalette.length]}
            onPress={() => setActive(index)}
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
        <View className='mb-10 mx-5'>
            <ThemedButton route="/HomeScreen">
                Pagina Principal
            </ThemedButton>
        </View>
    </ThemedView>
);
  
}

export default RecomendationsScreen