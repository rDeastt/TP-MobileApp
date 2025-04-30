import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Tools } from '@/constants/Routes'

const ToolsLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
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