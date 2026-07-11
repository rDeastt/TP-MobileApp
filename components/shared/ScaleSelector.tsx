import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

interface ScaleSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  value,
  onValueChange,
  min = 1,
  max = 5,
  leftLabel = 'Muy poca',
  rightLabel = 'Bastante',
}) => {
  return (
    <View className="mx-5 mt-2">
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={() => Haptics.selectionAsync()}
        onSlidingComplete={onValueChange}
        minimumTrackTintColor="#4ADF86"
        maximumTrackTintColor="#D8CFF5"
        thumbTintColor="#4ADF86"
      />

      <View className="flex-row justify-between mt-1">
        <Text className="text-sm text-muted dark:text-muted-dark">{leftLabel}</Text>
        <Text className="text-sm text-muted dark:text-muted-dark">{rightLabel}</Text>
      </View>

      <View className="self-center bg-main mt-3 px-4 py-1 rounded-xl">
        <Text className="text-white font-bold text-base">{value}</Text>
      </View>
    </View>
  );
};

export default ScaleSelector;
