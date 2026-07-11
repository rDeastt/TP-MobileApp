import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ProgressRing from '@/components/shared/ProgressRing';
import { SLEEP_CHECKLIST, SLEEP_GOAL } from '@/constants/sleepChecklist';
import { getLast7Days, getToday, toggleItem } from '@/services/sleepStore';
import { logCompletion } from '@/services/activityLog';

const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const SleepScreen = () => {
  const [checked, setChecked] = useState<string[]>([]);
  const [week, setWeek] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const [today, last7] = await Promise.all([getToday(), getLast7Days()]);
        if (!alive) return;
        setChecked(today);
        setWeek(last7);
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const onToggle = async (id: string) => {
    Haptics.selectionAsync();
    const updated = await toggleItem(id);
    setChecked(updated);
    setWeek(await getLast7Days());
    // Noche "completada" al alcanzar la meta
    if (updated.length === SLEEP_GOAL && !checked.includes(id)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logCompletion('sleep');
    }
  };

  const dayLetter = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    return DAY_LETTERS[d.getDay()];
  };

  const progress = checked.length / SLEEP_CHECKLIST.length;
  const goalReached = checked.length >= SLEEP_GOAL;

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-center mt-6 text-content dark:text-content-dark">
          Higiene del sueño
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-1 mb-4">
          🌙 Dormir bien es el factor que más protege contra el burnout 🌙
        </Text>

        {/* Progreso de hoy */}
        <View className="items-center my-2">
          <ProgressRing progress={progress} size={140} strokeWidth={10} color="#a78bfa">
            <Text className="text-2xl font-bold text-content dark:text-content-dark">
              {checked.length}/{SLEEP_CHECKLIST.length}
            </Text>
          </ProgressRing>
          <Text
            className={`mt-2 font-semibold ${
              goalReached ? 'text-main' : 'text-muted dark:text-muted-dark'
            }`}
          >
            {goalReached
              ? '✅ ¡Noche bien preparada!'
              : `Marca al menos ${SLEEP_GOAL} para completar la noche`}
          </Text>
        </View>

        {/* Checklist */}
        <View className="mt-4">
          {SLEEP_CHECKLIST.map((item) => {
            const isChecked = checked.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => onToggle(item.id)}
                className={`flex-row items-center p-4 mb-2 rounded-2xl border active:opacity-70 ${
                  isChecked
                    ? 'bg-main/15 border-main'
                    : 'bg-card dark:bg-card-dark border-transparent'
                }`}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isChecked ? '#4ADF86' : '#9BA1A6'}
                />
                <Text
                  className={`flex-1 ml-3 ${
                    isChecked
                      ? 'text-content dark:text-content-dark font-semibold'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.label}
                </Text>
                <Ionicons
                  name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={isChecked ? '#4ADF86' : '#9BA1A6'}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Últimos 7 días */}
        <Text className="text-lg font-bold mt-6 mb-3 text-content dark:text-content-dark">
          Tus últimas 7 noches
        </Text>
        <View className="flex-row items-end justify-between bg-card dark:bg-card-dark rounded-2xl p-4 h-32">
          {week.map((count, i) => {
            const h = Math.max(6, (count / SLEEP_CHECKLIST.length) * 80);
            const reached = count >= SLEEP_GOAL;
            return (
              <View key={i} className="items-center flex-1">
                <View
                  style={{ height: h }}
                  className={`w-4 rounded-full ${
                    reached ? 'bg-main' : 'bg-cards dark:bg-cards-dark'
                  }`}
                />
                <Text className="text-[10px] mt-1 text-muted dark:text-muted-dark">
                  {dayLetter(i)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default SleepScreen;
