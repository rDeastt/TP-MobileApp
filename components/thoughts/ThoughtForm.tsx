import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Emotion, EMOTION_MAP, ThoughtItem } from './types';
import IntensitySlider from './IntensitySlider';

interface Props {
  onSave: (thought: ThoughtItem) => void;
}

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
            ? 'bg-main border-main'
            : 'border-gray-300 dark:border-gray-600 bg-card dark:bg-card-dark'
        }`}
        onPress={() => {
          Haptics.selectionAsync();
          onSelect(key as Emotion);
        }}
      >
        <Text
          className={`text-base ${
            selectedEmotion === key ? 'text-white' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {val.icon} {val.es}
        </Text>
      </Pressable>
    ))}
  </View>
);

const inputClass =
  'bg-card dark:bg-card-dark border border-gray-300 dark:border-gray-600 p-3 rounded-lg mb-3 text-content dark:text-content-dark';

const ThoughtForm = ({ onSave }: Props) => {
  const [situation, setSituation] = useState('');
  const [negativeThought, setNegativeThought] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(5);

  const isFormComplete =
    situation.trim() !== '' && negativeThought.trim() !== '' && selectedEmotion !== null;

  const handleSave = () => {
    if (!isFormComplete) return;
    onSave({
      id: Date.now().toString(),
      situation,
      negativeThought,
      emotion: selectedEmotion!,
      intensity,
      alternativeThought: '',
      completed: false,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View className="bg-gray-50 dark:bg-card-dark p-4 rounded-xl mb-6">
      <Text className="text-lg font-semibold mb-3 text-content dark:text-content-dark">
        Nuevo Pensamiento
      </Text>

      <Text className="text-gray-700 dark:text-gray-300 mb-1">Situación</Text>
      <TextInput
        value={situation}
        onChangeText={setSituation}
        placeholder="¿Qué ocurrió?"
        placeholderTextColor="#9BA1A6"
        className={inputClass}
      />

      <Text className="text-gray-700 dark:text-gray-300 mb-1">Pensamiento Negativo</Text>
      <TextInput
        value={negativeThought}
        onChangeText={setNegativeThought}
        placeholder="¿Qué pensaste?"
        placeholderTextColor="#9BA1A6"
        multiline
        numberOfLines={3}
        className={`${inputClass} h-20 text-base`}
      />

      <Text className="text-gray-700 dark:text-gray-300 mb-1">¿Qué emoción sentiste?</Text>
      <EmotionSelector selectedEmotion={selectedEmotion} onSelect={setSelectedEmotion} />
      <IntensitySlider intensity={intensity} onChange={setIntensity} />

      <Pressable
        onPress={handleSave}
        disabled={!isFormComplete}
        className={`w-full py-4 rounded-full mt-3 ${
          isFormComplete ? 'bg-main active:opacity-80' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <Text className="text-white font-semibold text-lg text-center">Guardar</Text>
      </Pressable>
    </View>
  );
};

export default ThoughtForm;
