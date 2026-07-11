import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';


const TabsLayout = () => {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  useEffect(() => {
    // Cambia el color de la barra de navegación inferior en Android
    NavigationBar.setBackgroundColorAsync(palette.tabBar);

    // Asegura contraste suficiente
    NavigationBar.setButtonStyleAsync(scheme === 'dark' ? 'light' : 'dark');
  }, [scheme, palette.tabBar]);

  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: scheme === 'dark' ? palette.tint : 'white',
            tabBarInactiveTintColor: scheme === 'dark' ? palette.tabIconDefault : '#E7F0FF',
            tabBarStyle: {
              backgroundColor: palette.tabBar,
              borderTopWidth: 0,
            },
        }}
      >

        <Tabs.Screen
            name="HomeScreen/index"
            options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <Ionicons size={28} name="home-outline" color={color} />
            ),
            }}
        />

        <Tabs.Screen
        name="(tools)"
        options={{
          title: 'Herramientas',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="construct-outline" color={color} />
          ),
        }}
        />
        <Tabs.Screen
            name="StatsScreen/index"
            options={{
            title: 'Historico',
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <Ionicons size={28} name="stats-chart-outline" color={color} />
            ),
            }}
        />
    </Tabs>
  )
}

export default TabsLayout
