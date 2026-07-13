import React from 'react'
import { Stack } from 'expo-router'
import { questRoutes } from '@/constants/Routes'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors'

const QuestScreen = () => {
  const scheme = useColorScheme() ?? 'light';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors[scheme].background },
      }}
    >
    {
        questRoutes.map(route =>(
            <Stack.Screen
            key={route.name}
            name={route.name}
            options={{
                title: route.title
              }}
            />
        ))
    }
    </Stack>

  )
}

export default QuestScreen
