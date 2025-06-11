import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import ThemedView from '@/components/shared/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Emotion = 'sadness' | 'anxiety' | 'anger' | 'frustration' | 'fear';

type ThoughtItem = {
  id: string;
  situation: string;
  negativeThought: string;
  emotion: Emotion;
  intensity: number;
  alternativeThought: string;
  newIntensity?: number;
  completed: boolean;
};

/* ---------- Utilidades ---------- */
const EMOTION_MAP: Record<
  Emotion,
  { icon: string; es: string }
> = {
  sadness: { icon: '😔', es: 'Tristeza' },
  anxiety: { icon: '😰', es: 'Ansiedad' },
  anger: { icon: '😠', es: 'Enojo' },
  frustration: { icon: '😤', es: 'Frustración' },
  fear: { icon: '😨', es: 'Miedo' },
};

const STORAGE_KEY = '@thoughts_data';

/* ---------- Selectores / Inputs ---------- */
const EmotionSelector = ({
  selectedEmotion,
  onSelect,
}: {
  selectedEmotion: Emotion | null;
  onSelect: (emotion: Emotion) => void;
}) => (
  <View className="flex-row flex-wrap justify-center gap-2 my-3">
    {Object.entries(EMOTION_MAP).map(([key, val]) => (
      <Pressable
        key={key}
        className={`py-2 px-4 rounded-full border ${
          selectedEmotion === key
            ? 'bg-[#4ADF86] border-[#4ADF86]'
            : 'border-gray-300 bg-white'
        }`}
        onPress={() => onSelect(key as Emotion)}
      >
        <Text
          className={`text-base ${
            selectedEmotion === key ? 'text-white' : 'text-gray-700'
          }`}
        >
          {val.icon} {val.es}
        </Text>
      </Pressable>
    ))}
  </View>
);

const IntensitySlider = ({
  intensity,
  onChange,
}: {
  intensity: number;
  onChange: (value: number) => void;
}) => (
  <View className="w-full my-3">
    <Text className="text-gray-700 mb-2">Intensidad: {intensity}/10</Text>
    <View className="flex-row justify-between w-full h-8 items-center">
      {[...Array(10)].map((_, idx) => {
        const value = idx + 1;
        return (
          <Pressable
            key={value}
            className={`h-8 w-8 rounded-full justify-center items-center ${
              value <= intensity ? 'bg-[#4ADF86]' : 'bg-gray-200'
            }`}
            onPress={() => onChange(value)}
          >
            <Text
              className={
                value <= intensity ? 'text-white' : 'text-gray-500'
              }
            >
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const TabSelector = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'in-progress', label: 'En Proceso' },
    { id: 'completed', label: 'Transformados' },
  ];
  return (
    <View className="flex-row border-b border-gray-200 mb-4">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          className={`flex-1 py-3 ${
            activeTab === tab.id ? 'border-b-2 border-[#4ADF86]' : ''
          }`}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            className={`text-center ${
              activeTab === tab.id
                ? 'text-[#4ADF86] font-semibold'
                : 'text-gray-600'
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

/* ---------- Pantalla principal ---------- */
const ThoughtsScreen = () => {
  /* estados UI y datos */
  const [activeTab, setActiveTab] = useState('all');
  const [showNewThought, setShowNewThought] = useState(false);

  const [situation, setSituation] = useState('');
  const [negativeThought, setNegativeThought] = useState('');
  const [selectedEmotion, setSelectedEmotion] =
    useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(5);

  const [thoughts, setThoughts] = useState<ThoughtItem[]>([]);

  /* modal transformación */
  const [showTransformModal, setShowTransformModal] = useState(false);
  const [selectedThoughtId, setSelectedThoughtId] =
    useState<string | null>(null);
  const [newAlternativeText, setNewAlternativeText] = useState('');

  /* ---------- Persistencia ---------- */
  const loadThoughts = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setThoughts(JSON.parse(data));
    } catch (_) {
      /* fallo silencioso */
    }
  };

  const saveThoughts = async (list: ThoughtItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      console.log("Pensamiento guardado \n" + JSON.stringify(list,null,2))
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    loadThoughts();
  }, []);

  /* ---------- Helpers ---------- */
  const isFormComplete =
    situation.trim() !== '' &&
    negativeThought.trim() !== '' &&
    selectedEmotion !== null;

  const filteredThoughts = () => {
    switch (activeTab) {
      case 'in-progress':
        return thoughts.filter((t) => !t.completed);
      case 'completed':
        return thoughts.filter((t) => t.completed);
      default:
        return thoughts;
    }
  };

  /* ---------- Acciones ---------- */
  const handleAddThought = () => {
    if (!isFormComplete) return;

    const newThought: ThoughtItem = {
      id: Date.now().toString(),
      situation,
      negativeThought,
      emotion: selectedEmotion!,
      intensity,
      alternativeThought: '',
      completed: false,
    };

    const updated = [newThought, ...thoughts];
    setThoughts(updated);
    saveThoughts(updated);

    setShowNewThought(false);
    setSituation('');
    setNegativeThought('');
    setSelectedEmotion(null);
    setIntensity(5);
  };

  const handleTransformThought = (id: string) => {
    setSelectedThoughtId(id);
    setNewAlternativeText('');
    setShowTransformModal(true);
  };

  const confirmTransformation = () => {
    if (!selectedThoughtId || !newAlternativeText.trim()) return;

    const updated = thoughts.map((t) =>
      t.id === selectedThoughtId
        ? {
            ...t,
            alternativeThought: newAlternativeText,
            completed: true,
            newIntensity: Math.max(0, t.intensity - 3),
          }
        : t,
    );
    setThoughts(updated);
    saveThoughts(updated);

    setShowTransformModal(false);
    setSelectedThoughtId(null);
    setNewAlternativeText('');
  };

  /* ---------- Render ---------- */
  return (
    <ThemedView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-4 pb-10">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-6 mb-4">
          <Text className="text-2xl font-bold">Pensamientos</Text>
          <Pressable
            onPress={() => setShowNewThought(!showNewThought)}
            className="w-10 h-10 rounded-full bg-[#4ADF86] justify-center items-center"
          >
            <Text className="text-white text-xl font-bold">
              {showNewThought ? '×' : '+'}
            </Text>
          </Pressable>
        </View>

        <Text className="text-center text-gray-600 mb-6">
          🧠 Identifica tus pensamientos negativos y transfórmalos en
          positivos 💭
        </Text>

        {/* Formulario Nuevo Pensamiento */}
        {showNewThought ? (
          <View className="bg-gray-50 p-4 rounded-xl mb-6">
            <Text className="text-lg font-semibold mb-3">
              Nuevo Pensamiento
            </Text>

            <Text className="text-gray-700 mb-1">Situación</Text>
            <TextInput
              value={situation}
              onChangeText={setSituation}
              placeholder="¿Qué ocurrió?"
              className="bg-white border border-gray-300 p-3 rounded-lg mb-3"
            />

            <Text className="text-gray-700 mb-1">
              Pensamiento Negativo
            </Text>
            <TextInput
              value={negativeThought}
              onChangeText={setNegativeThought}
              placeholder="¿Qué pensaste?"
              multiline
              numberOfLines={3}
              className="bg-white border border-gray-300 p-3 rounded-lg mb-3 h-20 text-base"
            />

            <Text className="text-gray-700 mb-1">
              ¿Qué emoción sentiste?
            </Text>
            <EmotionSelector
              selectedEmotion={selectedEmotion}
              onSelect={setSelectedEmotion}
            />
            <IntensitySlider
              intensity={intensity}
              onChange={setIntensity}
            />

            <Pressable
              onPress={handleAddThought}
              disabled={!isFormComplete}
              className={`w-full py-4 rounded-full mt-3 ${
                isFormComplete ? 'bg-[#4ADF86]' : 'bg-gray-300'
              }`}
            >
              <Text className="text-white font-semibold text-lg text-center">
                Guardar
              </Text>
            </Pressable>
          </View>
        ) : (
          /* --------- Lista de Pensamientos --------- */
          <>
            <TabSelector
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {filteredThoughts().length > 0 ? (
              filteredThoughts().map((thought) => (
                <View
                  key={thought.id}
                  className={`w-full p-4 mb-4 rounded-xl border ${
                    thought.intensity <= 3
                      ? 'bg-green-100 border-green-200'
                      : thought.intensity <= 6
                      ? 'bg-yellow-100 border-yellow-200'
                      : 'bg-red-100 border-red-200'
                  }`}
                >
                  <Text className="text-lg font-semibold text-gray-800">
                    {thought.situation}
                  </Text>

                  <Text className="text-gray-700 mt-1 italic">
                    “{thought.negativeThought}”
                  </Text>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-base">
                      {EMOTION_MAP[thought.emotion].icon}
                    </Text>
                    <Text className="text-sm text-gray-600 ml-1">
                      {EMOTION_MAP[thought.emotion].es} · Intensidad:{' '}
                      {thought.intensity}
                    </Text>
                  </View>

                  {thought.completed ? (
                    <View className="mt-3 bg-green-50 p-2 rounded-lg">
                      <Text className="text-green-700 font-medium">
                        ✅ Transformado:
                      </Text>
                      <Text className="text-gray-800 mt-1 italic">
                        {thought.alternativeThought}
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => handleTransformThought(thought.id)}
                      className="mt-4 bg-[#4ADF86] rounded-full py-2 px-4"
                    >
                      <Text className="text-white text-center font-semibold">
                        Transformar pensamiento
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-10">
                <Image
                  source={require('../../../../assets/screenImages/acti-1.png')}
                  className="w-40 h-40 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-gray-500 text-center">
                  No hay pensamientos{' '}
                  {activeTab === 'completed'
                    ? 'transformados'
                    : 'registrados'}
                  .
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* --------- Modal de Transformación --------- */}
      {showTransformModal && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-5 shadow-lg">
            <Text className="text-lg font-semibold text-black mb-3">
              Transformar pensamiento
            </Text>
            <Text className="text-sm text-gray-600 mb-2">
              ¿Qué podrías pensar en lugar de ese pensamiento negativo?
            </Text>
            <TextInput
              value={newAlternativeText}
              onChangeText={setNewAlternativeText}
              placeholder="Ej: Este error no me define; puedo mejorar..."
              multiline
              className="border border-gray-300 rounded-xl p-3 text-base text-black bg-white h-28"
            />
            <View className="flex-row justify-end mt-4 space-x-3">
              <Pressable
                className='bg-gray-500 rounded-full px-4 py-2 mr-2'
                onPress={() => setShowTransformModal(false)}
              >
                <Text className="text-white font-medium">Cancelar</Text>
              </Pressable>
              <Pressable 
                className='bg-main rounded-full px-4 py-2'
                onPress={confirmTransformation}>
                <Text className="text-white font-semibold">
                  Guardar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

export default ThoughtsScreen;
