import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import ToolCard from '@/components/shared/ToolCard';
import ThemedView from '@/components/shared/ThemedView';
import { Href } from 'expo-router';
import { Tools } from '@/constants/Routes';


const ToolsScreen = () => {

  const ToolsFilter = Tools.filter((tool) => tool.name !== 'ToolsScreen/index')


  return (
    <ThemedView margin>
      <Text className="mt-5 text-2xl font-semibold text-gray-900">
        Herramientas
      </Text>
      <ScrollView className='mt-2'>
      {ToolsFilter.map((tool) => (
        <ToolCard
          key={tool.title}
          name={tool.title}
          route={tool.name.split('/')[0]}
        />
      ))}
    </ScrollView>
    </ThemedView>
  );
}

export default ToolsScreen