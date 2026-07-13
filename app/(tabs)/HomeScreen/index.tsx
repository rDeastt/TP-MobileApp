import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Href, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RecommendationCard from '@/components/shared/RecomendationCard';
import Screen from '@/components/shared/Screen';
import { recommendations as rawRecommendations, BurnoutLevel } from '@/constants/recomendations';
import CardDescription from '@/components/shared/CardDescription';
import { getLastProbability, getLastUserName, getRiskInfo } from '@/services/burnoutHistory';
import { getStreak, getTodayTools, getWeekActivity, ToolId } from '@/services/activityLog';
import LastPredictionCard from '@/components/shared/LastPredictionCard';
import { colorRecomendationPalette } from '@/constants/Colors';
import { Tools } from '@/constants/Routes';
import phrases from '@/constants/motivationalPhrases';

/* Herramientas del hub (sin la pantalla índice) */
const toolEntries = Tools.filter((t) => t.name !== 'ToolsScreen/index');

/* Herramienta sugerida del día: determinística por fecha */
const suggestedTool = toolEntries[new Date().getDate() % toolEntries.length];

/* Accesos rápidos fijos: las 4 más usadas */
const quickTools = toolEntries.slice(0, 4);

const HomeScreen = () => {
  const [phrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);
  const [active, setActive] = useState<number | null>(null);
  const [risk, setRisk] = useState<BurnoutLevel>('moderate');
  const [percent, setPercent] = useState<number | null>(null);
  const [name, setName] = useState<string | null>('User');
  const [streak, setStreak] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [week, setWeek] = useState<boolean[]>([]);

  /* Refresca datos cada vez que la pantalla gana foco */
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const [level, p, lastName, s, today, w] = await Promise.all([
          getRiskInfo(),
          getLastProbability(),
          getLastUserName(),
          getStreak(),
          getTodayTools(),
          getWeekActivity(),
        ]);
        if (!alive) return;
        setRisk(level);
        setPercent(p);
        setName(lastName);
        setStreak(s);
        setTodayCount(today.length);
        setWeek(w);
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const recs = rawRecommendations.filter((rec) => rec.level === risk);

  const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const dayLetter = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    return DAY_LETTERS[d.getDay()];
  };

  return (
    <Screen scroll className="pb-8">
      <View className="px-4 mt-6 mb-2">
        {/* Saludo + racha */}
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

        {/* Tu día de hoy */}
        <View className="bg-card dark:bg-card-dark rounded-3xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-bold text-lg text-content dark:text-content-dark">
                Tu día de hoy
              </Text>
              <Text className="text-sm text-muted dark:text-muted-dark">
                {todayCount > 0
                  ? `${todayCount} actividad${todayCount === 1 ? '' : 'es'} completada${
                      todayCount === 1 ? '' : 's'
                    } 💪`
                  : 'Aún no completas actividades hoy'}
              </Text>
            </View>
            <View className="flex-row">
              {week.map((done, i) => (
                <View key={i} className="items-center mx-0.5">
                  <View
                    className={`w-3 h-3 rounded-full ${
                      done ? 'bg-main' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  <Text className="text-[9px] mt-0.5 text-muted dark:text-muted-dark">
                    {dayLetter(i)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Accesos rápidos */}
          <View className="flex-row justify-between mt-4">
            {quickTools.map((tool) => {
              const screenName = tool.name.split('/')[0];
              return (
                <Pressable
                  key={tool.name}
                  onPress={() => router.push(`/${screenName}` as Href)}
                  className="items-center flex-1 active:opacity-60"
                >
                  <View
                    style={{ backgroundColor: tool.color ?? '#4ADF86' }}
                    className="w-12 h-12 rounded-full items-center justify-center"
                  >
                    <Ionicons name={tool.icon} size={22} color="white" />
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-[10px] mt-1 text-muted dark:text-muted-dark max-w-[70px] text-center"
                  >
                    {tool.title.split(' ')[0]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Sugerencia del día */}
        <Pressable
          onPress={() => router.push(`/${suggestedTool.name.split('/')[0]}` as Href)}
          className="active:opacity-80 mb-4"
        >
          <LinearGradient
            colors={['#78B4FF', '#4ADF86']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, padding: 16 }}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-white/25 items-center justify-center mr-3">
                <Ionicons name={suggestedTool.icon} size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/80 text-xs font-semibold uppercase">
                  Sugerencia de hoy
                </Text>
                <Text className="text-white font-bold text-lg">{suggestedTool.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="white" />
            </View>
          </LinearGradient>
        </Pressable>

        <Text className="text-2xl font-bold text-content dark:text-content-dark">
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

      {/* Frase del día */}
      <View className="mx-4 mt-8 mb-6 bg-cards dark:bg-cards-dark rounded-3xl p-5">
        <Text className="text-center text-2xl mb-1">💬</Text>
        <Text className="text-center text-content dark:text-content-dark italic text-lg">
          {phrase}
        </Text>
      </View>
    </Screen>
  );
};

export default HomeScreen;
