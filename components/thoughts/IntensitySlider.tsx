import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  intensity: number;
  onChange: (value: number) => void;
  label?: string;
}

const IntensitySlider = ({ intensity, onChange, label = 'Intensidad' }: Props) => (
  <View className="w-full my-3">
    <Text className="text-gray-700 dark:text-gray-300 mb-2">
      {label}: {intensity}/10
    </Text>
    <View className="flex-row justify-between w-full h-8 items-center">
      {[...Array(10)].map((_, idx) => {
        const value = idx + 1;
        return (
          <Pressable
            key={value}
            className={`h-8 w-8 rounded-full justify-center items-center ${
              value <= intensity ? 'bg-main' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(value);
            }}
          >
            <Text className={value <= intensity ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default IntensitySlider;
