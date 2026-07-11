import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Href, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ToolCardProps {
  name: string;
  route: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Color del círculo del icono. */
  color?: string;
  /** Ya completada hoy (muestra check). */
  done?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  name,
  route,
  icon = 'sparkles-outline',
  color = '#4ADF86',
  done = false,
}) => {
  return (
    <Pressable
      onPress={() => route && router.push(route as Href)}
      className="flex-row items-center bg-card dark:bg-card-dark px-4 py-4 rounded-2xl mb-3 active:opacity-70"
    >
      <View
        style={{ backgroundColor: color }}
        className="w-11 h-11 rounded-full items-center justify-center mr-3"
      >
        <Ionicons name={icon} size={22} color="white" />
      </View>

      <Text className="flex-1 text-base font-semibold text-content dark:text-content-dark">
        {name}
      </Text>

      {done ? (
        <Ionicons name="checkmark-circle" size={24} color="#4ADF86" />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
      )}
    </Pressable>
  );
};

export default ToolCard;
