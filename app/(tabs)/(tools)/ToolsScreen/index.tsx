import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import ToolCard from '@/components/shared/ToolCard';
import ThemedView from '@/components/shared/ThemedView';

const tools = [
  { name: 'Pomodoro', route: 'PomodoroScreen' },
  { name: 'Rutina sencilla', route: 'RoutineScreen' },
  { name: 'Respiración consciente', route: 'BreatheScreen' },
  { name: 'Mandalas', route: 'MandalasScreen' },
  { name: 'Meditacion', route: 'MeditationScreen' },
];

const ToolsScreen = () => {
  return (
    <ThemedView margin>
      <Text className="mt-5 text-2xl font-semibold text-gray-900">
        Herramientas
      </Text>
      <ScrollView className='mt-2'>
      {tools.map((tool) => (
        <ToolCard
          key={tool.name}
          name={tool.name}
          route={tool.route}
        />
      ))}
    </ScrollView>
    </ThemedView>
  );
}

export default ToolsScreen