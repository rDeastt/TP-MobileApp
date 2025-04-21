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
  selectedValue: string;
  onSelect: (value: string) => void;
}

const DoubleOptionPicker = ({ option1, option2, selectedValue, onSelect }: Props) => {
  const renderOption = (option: Option) => {
    const isSelected = selectedValue === option.value;

    return (
      <Pressable
        onPress={() => onSelect(option.value)}
        className={`items-center mx-3 p-2 rounded-xl ${
          isSelected ? 'border-2 border-[#4ADF86]' : 'border border-transparent'
        }`}
      >
        <Image
          source={option.image}
          className="w-24 h-24 rounded-full"
          resizeMode="contain"
        />
        <Text className="text-lg mt-2 text-gray-700 font-semibold">{option.label}</Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-row justify-center mt-4">
      {renderOption(option1)}
      {renderOption(option2)}
    </View>
  );
};

export default DoubleOptionPicker;
