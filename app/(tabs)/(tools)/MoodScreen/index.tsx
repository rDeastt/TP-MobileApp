import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedTextInput from '@/components/shared/ThemedTextInput';
import { getToday, getWeek, saveToday, MoodValue } from '@/services/moodStore';
import { logCompletion } from '@/services/activityLog';

const MOODS: { value: MoodValue; emoji: string; label: string; color: string }[] = [
  { value: 1, emoji: '😞', label: 'Muy mal', color: '#ef4444' },
  { value: 2, emoji: '🙁', label: 'Mal', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Normal', color: '#eab308' },
  { value: 4, emoji: '🙂', label: 'Bien', color: '#4ADF86' },
  { value: 5, emoji: '😄', label: 'Muy bien', color: '#10b981' },
];

const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const MoodScreen = () => {
  const [selected, setSelected] = useState<MoodValue | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [week, setWeek] = useState<(MoodValue | null)[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const [today, w] = await Promise.all([getToday(), getWeek()]);
        if (!alive) return;
        setWeek(w);
        if (today) {
          setSelected(today.mood);
          setNote(today.note ?? '');
          setSaved(true);
        } else {
          setSelected(null);
          setNote('');
          setSaved(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const save = async () => {
    if (!selected) return;
    await saveToday(selected, note);
    await logCompletion('mood');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
    setWeek(await getWeek());
  };

  const dayLetter = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    return DAY_LETTERS[d.getDay()];
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-center mt-6 text-content dark:text-content-dark">
          ¿Cómo te sientes hoy?
        </Text>
        <Text className="text-center text-muted dark:text-muted-dark mt-1 mb-6">
          💚 Reconocer tu ánimo a tiempo es la mejor forma de cuidarlo 💚
        </Text>

        {/* Selector de ánimo */}
        <View className="flex-row justify-between px-1">
          {MOODS.map((m) => {
            const isSelected = selected === m.value;
            return (
              <Pressable
                key={m.value}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelected(m.value);
                  setSaved(false);
                }}
                className={`items-center flex-1 py-3 mx-0.5 rounded-2xl border ${
                  isSelected
                    ? 'bg-main/15 border-main'
                    : 'bg-card dark:bg-card-dark border-transparent'
                }`}
              >
                <Text style={{ fontSize: 30, lineHeight: 38 }}>{m.emoji}</Text>
                <Text
                  className={`text-[10px] mt-1 ${
                    isSelected
                      ? 'text-content dark:text-content-dark font-bold'
                      : 'text-muted dark:text-muted-dark'
                  }`}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Nota opcional */}
        <ThemedTextInput
          className="w-full rounded-2xl mt-4"
          placeholder="¿Quieres contar por qué? (opcional)"
          value={note}
          onChangeText={(t) => {
            setNote(t);
            setSaved(false);
          }}
          multiline
        />

        <View className="mt-2">
          <ThemedButton disabled={!selected || saved} onPress={save}>
            {saved ? '✅ Registrado hoy' : 'Guardar'}
          </ThemedButton>
        </View>

        {/* Semana */}
        <Text className="text-lg font-bold mt-8 mb-3 text-content dark:text-content-dark">
          Tu semana
        </Text>
        <View className="flex-row items-end justify-between bg-card dark:bg-card-dark rounded-2xl p-4">
          {week.map((mood, i) => {
            const info = mood ? MOODS[mood - 1] : null;
            return (
              <View key={i} className="items-center flex-1">
                <Text style={{ fontSize: 22, lineHeight: 28 }}>{info ? info.emoji : '·'}</Text>
                <View
                  style={{
                    height: mood ? mood * 10 : 4,
                    backgroundColor: info ? info.color : '#9BA1A6',
                  }}
                  className="w-3 rounded-full mt-1"
                />
                <Text className="text-[10px] mt-1 text-muted dark:text-muted-dark">
                  {dayLetter(i)}
                </Text>
              </View>
            );
          })}
        </View>

        <Text className="text-xs text-muted dark:text-muted-dark text-center mt-3">
          Si notas varios días seguidos hacia abajo, prueba una herramienta de la app o habla con
          alguien de confianza.
        </Text>
      </ScrollView>
    </Screen>
  );
};

export default MoodScreen;
