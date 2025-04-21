import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { questRoutes } from '@/constants/Routes'

const QuestScreen = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
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