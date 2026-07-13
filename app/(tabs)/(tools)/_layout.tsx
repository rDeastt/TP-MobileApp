import React from 'react'
import { Stack } from 'expo-router'
import { Tools } from '@/constants/Routes'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors'

/* Garantiza que la lista de herramientas sea la base del stack aunque
   se navegue directo a una herramienta desde la Home. */
export const unstable_settings = {
  initialRouteName: 'ToolsScreen/index',
};

const ToolsLayout = () => {
  const scheme = useColorScheme() ?? 'light';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors[scheme].background },
      }}
    >
      {
        Tools.map(route =>(
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

export default ToolsLayout
