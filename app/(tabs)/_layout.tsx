import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as NavigationBar from 'expo-navigation-bar';


const TabsLayout = () => {

  useEffect(() => {
    // Cambia el color de la barra de navegación inferior en Android
    NavigationBar.setBackgroundColorAsync('#78B4FF');

    // Asegura contraste suficiente
    NavigationBar.setButtonStyleAsync('dark'); // o 'light' si el fondo es oscuro
  }, []);

  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: 'white',
            // headerShown: false,
            tabBarStyle: {
              backgroundColor: '#78B4FF',
            },
            // tabBarActiveBackgroundColor: 'red',
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
            <Ionicons size={28} name="person-add-outline" color={color} />
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