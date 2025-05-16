import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Href, router } from 'expo-router'


interface ToolCardProps {
  name: string;
  route: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ name, route }) => {

  return (
    <View className="flex-row justify-between items-center bg-violet-200 px-4 py-3 rounded-full mb-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-base font-semibold text-gray-900">{name}</Text>
      </View>

      <Pressable
        onPress={() => route && router.push(route as Href)}
        className="bg-main px-4 py-2 rounded-full"
      >
        <Text className="text-white font-bold">Empezar ahora</Text>
      </Pressable>
    </View>
  );
};

export default ToolCard;
