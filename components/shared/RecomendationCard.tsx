import React from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends PressableProps {
  title: string;
  description?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  type: 'small' | 'large';
  color: string;
  iconColor?: string;
}

const RecommendationCard = ({
  title,
  description,
  iconName,
  type,
  color,
  iconColor = 'white',
  ...rest
}: Props) => {
  const baseColorStyle = `rounded-2xl ${color}`;

  return (
    <Pressable className="active:opacity-80" {...rest}>
      {type === 'small' ? (
        <View className={`w-32 h-32 items-center justify-center px-2 mx-2 ${baseColorStyle}`}>
          <Ionicons name={iconName} size={28} color={iconColor} className="mb-2" />
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            className="text-center text-sm font-medium text-white"
          >
            {title}
          </Text>
        </View>
      ) : (
        <View className={`w-full p-4 mb-4 ${baseColorStyle}`}>
          <View className="flex-row items-center mb-2">
            <Ionicons name={iconName} size={22} color={iconColor} className="mr-2" />
            <Text className="text-base font-semibold text-white">{title}</Text>
          </View>
          {description && (
            <Text className="text-sm text-white">{description}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default RecommendationCard;
