import React from 'react';
import { View, Text, Image, Pressable, ImageSourcePropType } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface PickerOption {
  label: string;
  image: ImageSourcePropType;
  value: string;
}

interface Props {
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

/** Selector de opciones con imagen (unifica Double/TripleOptionPicker). */
const OptionPicker = ({ options, selectedValue, onSelect }: Props) => {
  const compact = options.length >= 3;

  return (
    <View className="flex-row justify-center mt-4">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(option.value);
            }}
            className={`items-center p-2 rounded-2xl ${compact ? 'mx-2' : 'mx-3'} ${
              isSelected ? 'border-2 border-main bg-main/10' : 'border border-transparent'
            }`}
          >
            <Image
              source={option.image}
              className={compact ? 'w-20 h-20' : 'w-24 h-24'}
              resizeMode="contain"
            />
            <Text
              numberOfLines={2}
              className={`mt-2 font-semibold text-center text-content dark:text-content-dark ${
                compact ? 'text-base max-w-[80px]' : 'text-lg max-w-[100px]'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default OptionPicker;
