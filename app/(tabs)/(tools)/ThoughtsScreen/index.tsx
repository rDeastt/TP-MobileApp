import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '@/components/shared/Screen';
import ThoughtForm from '@/components/thoughts/ThoughtForm';
import ThoughtCard from '@/components/thoughts/ThoughtCard';
import TransformModal from '@/components/thoughts/TransformModal';
import { ThoughtItem, THOUGHTS_STORAGE_KEY } from '@/components/thoughts/types';
import { logCompletion } from '@/services/activityLog';

type Tab = 'all' | 'in-progress' | 'completed';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'in-progress', label: 'En Proceso' },
  { id: 'completed', label: 'Transformados' },
];

const ThoughtsScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showNewThought, setShowNewThought] = useState(false);
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([]);
  const [transformingId, setTransformingId] = useState<string | null>(null);

  /* ---------- Persistencia ---------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(THOUGHTS_STORAGE_KEY);
        if (data) setThoughts(JSON.parse(data));
      } catch {
        /* fallo silencioso */
      }
    })();
  }, []);

  const persist = async (list: ThoughtItem[]) => {
    setThoughts(list);
    try {
      await AsyncStorage.setItem(THOUGHTS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* fallo silencioso */
    }
  };

  /* ---------- Acciones ---------- */
  const handleAddThought = (thought: ThoughtItem) => {
    persist([thought, ...thoughts]);
    setShowNewThought(false);
  };

  const confirmTransformation = (alternativeThought: string, newIntensity: number) => {
    if (!transformingId) return;
    const updated = thoughts.map((t) =>
      t.id === transformingId
        ? { ...t, alternativeThought, completed: true, newIntensity }
        : t,
    );
    persist(updated);
    setTransformingId(null);
    logCompletion('thoughts');
  };

  const filteredThoughts = thoughts.filter((t) => {
    if (activeTab === 'in-progress') return !t.completed;
    if (activeTab === 'completed') return t.completed;
    return true;
  });

  const transformingThought = thoughts.find((t) => t.id === transformingId);

  /* ---------- Render ---------- */
  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-10">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-6 mb-4">
          <Text className="text-2xl font-bold text-content dark:text-content-dark">
            Pensamientos
          </Text>
          <Pressable
            onPress={() => setShowNewThought(!showNewThought)}
            className="w-10 h-10 rounded-full bg-main justify-center items-center active:opacity-80"
          >
            <Text className="text-white text-xl font-bold">{showNewThought ? '×' : '+'}</Text>
          </Pressable>
        </View>

        <Text className="text-center text-muted dark:text-muted-dark mb-6">
          🧠 Identifica tus pensamientos negativos y transfórmalos en positivos 💭
        </Text>

        {showNewThought ? (
          <ThoughtForm onSave={handleAddThought} />
        ) : (
          <>
            {/* Tabs */}
            <View className="flex-row border-b border-gray-200 dark:border-gray-700 mb-4">
              {TABS.map((tab) => (
                <Pressable
                  key={tab.id}
                  className={`flex-1 py-3 ${
                    activeTab === tab.id ? 'border-b-2 border-main' : ''
                  }`}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    className={`text-center ${
                      activeTab === tab.id
                        ? 'text-main font-semibold'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {filteredThoughts.length > 0 ? (
              filteredThoughts.map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  onTransform={setTransformingId}
                />
              ))
            ) : (
              <View className="items-center justify-center py-10">
                <Image
                  source={require('../../../../assets/screenImages/acti-1.png')}
                  className="w-40 h-40 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-muted dark:text-muted-dark text-center">
                  No hay pensamientos{' '}
                  {activeTab === 'completed' ? 'transformados' : 'registrados'}.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal de transformación */}
      {transformingThought && (
        <TransformModal
          thought={transformingThought}
          onConfirm={confirmTransformation}
          onClose={() => setTransformingId(null)}
        />
      )}
    </Screen>
  );
};

export default ThoughtsScreen;
