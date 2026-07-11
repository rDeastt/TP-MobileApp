import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { EMOTION_MAP, ThoughtItem } from './types';

interface Props {
  thought: ThoughtItem;
  onTransform: (id: string) => void;
}

const ThoughtCard = ({ thought, onTransform }: Props) => (
  <View
    className={`w-full p-4 mb-4 rounded-xl border ${
      thought.intensity <= 3
        ? 'bg-green-100 dark:bg-green-950 border-green-200 dark:border-green-800'
        : thought.intensity <= 6
        ? 'bg-yellow-100 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
        : 'bg-red-100 dark:bg-red-950 border-red-200 dark:border-red-800'
    }`}
  >
    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
      {thought.situation}
    </Text>

    <Text className="text-gray-700 dark:text-gray-300 mt-1 italic">
      “{thought.negativeThought}”
    </Text>

    <View className="flex-row items-center mt-1">
      <Text className="text-base">{EMOTION_MAP[thought.emotion].icon}</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
        {EMOTION_MAP[thought.emotion].es} · Intensidad: {thought.intensity}
        {thought.completed && thought.newIntensity !== undefined
          ? ` → ${thought.newIntensity}`
          : ''}
      </Text>
    </View>

    {thought.completed ? (
      <View className="mt-3 bg-green-50 dark:bg-green-900 p-2 rounded-lg">
        <View className="flex-row items-center justify-between">
          <Text className="text-green-700 dark:text-green-300 font-medium">✅ Transformado:</Text>
          {thought.newIntensity !== undefined && (
            <Text className="text-green-700 dark:text-green-300 font-bold">
              {thought.intensity} → {thought.newIntensity}
            </Text>
          )}
        </View>
        <Text className="text-gray-800 dark:text-gray-200 mt-1 italic">
          {thought.alternativeThought}
        </Text>
      </View>
    ) : (
      <Pressable
        onPress={() => onTransform(thought.id)}
        className="mt-4 bg-main rounded-full py-2 px-4 active:opacity-80"
      >
        <Text className="text-white text-center font-semibold">Transformar pensamiento</Text>
      </Pressable>
    )}
  </View>
);

export default ThoughtCard;
