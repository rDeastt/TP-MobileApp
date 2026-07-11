import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedTextInput from '@/components/shared/ThemedTextInput';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import { backgroundColorMap, colorRecomendationPalette } from '@/constants/Colors';
import { getHistory, getToday, upsertToday, GratitudeEntry } from '@/services/gratitudeStore';
import { logCompletion } from '@/services/activityLog';

const PROMPTS = [
  'Algo bueno que pasó hoy…',
  'Alguien a quien agradeces…',
  'Algo pequeño que disfrutaste…',
];

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
};

const GratitudeScreen = () => {
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [history, setHistory] = useState<GratitudeEntry[]>([]);
  const [savedToday, setSavedToday] = useState(false);
  const [editing, setEditing] = useState(false);

  const reload = useCallback(async () => {
    const [today, all] = await Promise.all([getToday(), getHistory()]);
    setHistory(all);
    if (today) {
      setSavedToday(true);
      setItems([today.items[0] ?? '', today.items[1] ?? '', today.items[2] ?? '']);
    } else {
      setSavedToday(false);
      setItems(['', '', '']);
    }
    setEditing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const canSave = items.some((i) => i.trim() !== '');

  const save = async () => {
    if (!canSave) return;
    await upsertToday(items);
    await logCompletion('gratitude');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    reload();
  };

  const showForm = !savedToday || editing;

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-center mt-6 text-content dark:text-content-dark">
          Diario de gratitud
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-1 mb-4">
          🌱 Anotar lo bueno de cada día entrena a tu mente contra el burnout 🌱
        </Text>

        {showForm ? (
          <View className="bg-card dark:bg-card-dark rounded-2xl p-4">
            <Text className="font-semibold text-lg mb-2 text-content dark:text-content-dark">
              Hoy agradezco…
            </Text>
            {PROMPTS.map((prompt, i) => (
              <ThemedTextInput
                key={i}
                className="w-full my-2 rounded-xl"
                placeholder={prompt}
                value={items[i]}
                onChangeText={(txt) => {
                  const next = [...items];
                  next[i] = txt;
                  setItems(next);
                }}
              />
            ))}
            <Text className="text-xs text-muted dark:text-muted-dark mb-3">
              Con una basta, pero si anotas tres, mejor ✨
            </Text>
            <ThemedButton disabled={!canSave} onPress={save}>
              {savedToday ? 'Actualizar' : 'Guardar'}
            </ThemedButton>
          </View>
        ) : (
          <View className="bg-main/15 border border-main rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold text-lg text-content dark:text-content-dark">
                ✅ Hoy ya agradeciste
              </Text>
              <Pressable onPress={() => setEditing(true)} className="p-1 active:opacity-60">
                <Ionicons name="pencil" size={18} color="#4ADF86" />
              </Pressable>
            </View>
            {items
              .filter((i) => i.trim() !== '')
              .map((item, i) => (
                <Text key={i} className="text-content dark:text-content-dark my-0.5">
                  • {item}
                </Text>
              ))}
          </View>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <>
            <Text className="text-lg font-bold mt-6 mb-2 text-content dark:text-content-dark">
              Tu historial
            </Text>
            {history.map((entry, idx) => {
              const color =
                backgroundColorMap[
                  colorRecomendationPalette[idx % colorRecomendationPalette.length]
                ];
              return (
                <View
                  key={entry.id}
                  style={{ borderLeftColor: color, borderLeftWidth: 4 }}
                  className="bg-card dark:bg-card-dark rounded-xl p-3 mb-3"
                >
                  <Text className="text-xs font-semibold text-muted dark:text-muted-dark mb-1 capitalize">
                    {formatDate(entry.date)}
                  </Text>
                  {entry.items.map((item, i) => (
                    <Text key={i} className="text-content dark:text-content-dark">
                      • {item}
                    </Text>
                  ))}
                </View>
              );
            })}
          </>
        )}

        {history.length === 0 && !showForm && (
          <View className="items-center mt-8">
            <SpeechBubble
              text="Cada día trae algo bueno, aunque sea pequeño. ¡Empecemos a coleccionarlos!"
              source="Buno"
            />
            <ThemedAvatar source={require('../../../../assets/avatars/avatar-1.png')} animate />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

export default GratitudeScreen;
