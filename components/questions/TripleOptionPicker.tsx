import React from 'react';
import { View, Text, Image, Pressable, ImageSourcePropType } from 'react-native';

interface Option {
  label: string;
  image: ImageSourcePropType;
  value: string;
}

interface Props {
  option1: Option;
  option2: Option;
  option3: Option;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const TripleOptionPicker = ({ option1, option2, option3, selectedValue, onSelect }: Props) => {
  const renderOption = (option: Option) => {
    const isSelected = selectedValue === option.value;

    return (
      <Pressable
        onPress={() => onSelect(option.value)}
        className={`items-center mx-2 p-2 rounded-xl ${
          isSelected ? 'border-2 border-green-500' : 'border border-transparent'
        }`}
      >
        <Image
          source={option.image}
          className="w-20 h-20 rounded-full"
          resizeMode="contain"
        />
        <Text className="text-base mt-2 text-gray-700 font-semibold">{option.label}</Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-row justify-center mt-4">
      {renderOption(option1)}
      {renderOption(option2)}
      {renderOption(option3)}
    </View>
  );
};

export default TripleOptionPicker;
