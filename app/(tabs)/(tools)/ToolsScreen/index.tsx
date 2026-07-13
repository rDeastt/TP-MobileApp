import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ToolCard from '@/components/shared/ToolCard';
import Screen from '@/components/shared/Screen';
import { Tools } from '@/constants/Routes';
import { getStreak, getTodayTools, getWeekActivity, ToolId } from '@/services/activityLog';

/** Mapa pantalla → id de actividad en el registro local. */
const TOOL_IDS: Record<string, ToolId> = {
  PomodoroScreen: 'pomodoro',
  RoutineScreen: 'routine',
  BreatheScreen: 'breathe',
  MeditationScreen: 'meditation',
  ThoughtsScreen: 'thoughts',
  ActivePauseScreen: 'activePause',
  GratitudeScreen: 'gratitude',
  SleepScreen: 'sleep',
  PetBreakScreen: 'petBreak',
  OutdoorScreen: 'outdoor',
  MoodScreen: 'mood',
};

const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const ToolsScreen = () => {
  const [streak, setStreak] = useState(0);
  const [week, setWeek] = useState<boolean[]>([]);
  const [today, setToday] = useState<ToolId[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const [s, w, t] = await Promise.all([getStreak(), getWeekActivity(), getTodayTools()]);
        if (!alive) return;
        setStreak(s);
        setWeek(w);
        setToday(t);
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const tools = Tools.filter((tool) => tool.name !== 'ToolsScreen/index');

  const dayLetter = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    return DAY_LETTERS[d.getDay()];
  };

  return (
    <Screen className="px-3">
      <Text className="mt-5 text-2xl font-bold text-content dark:text-content-dark">
        Herramientas
      </Text>

      {/* Racha de actividades */}
      <View className="flex-row items-center justify-between bg-card dark:bg-card-dark rounded-2xl p-4 mt-3">
        <View className="flex-row items-center">
          <Ionicons name="flame" size={28} color={streak > 0 ? '#f97316' : '#9BA1A6'} />
          <View className="ml-2">
            <Text className="text-xl font-bold text-content dark:text-content-dark">
              {streak} {streak === 1 ? 'día' : 'días'}
            </Text>
            <Text className="text-xs text-muted dark:text-muted-dark">de racha</Text>
          </View>
        </View>
        <View className="flex-row">
          {week.map((done, i) => (
            <View key={i} className="items-center mx-1">
              <View
                className={`w-3.5 h-3.5 rounded-full ${
                  done ? 'bg-main' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
              <Text className="text-[10px] mt-1 text-muted dark:text-muted-dark">
                {dayLetter(i)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
        {tools.map((tool) => {
          const screenName = tool.name.split('/')[0];
          const id = TOOL_IDS[screenName];
          return (
            <ToolCard
              key={tool.title}
              name={tool.title}
              route={screenName}
              icon={tool.icon}
              color={tool.color}
              done={id ? today.includes(id) : false}
            />
          );
        })}
      </ScrollView>
    </Screen>
  );
}

export default ToolsScreen
