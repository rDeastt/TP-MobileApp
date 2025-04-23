import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';


import "../global.css"
import { SurveyProvider } from '@/hooks/SurveyContext';
import { Test } from '@/constants/Routes';
import { StatusBar } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SurveyProvider>
        <StatusBar backgroundColor="#F3F3F3" />
          <Stack screenOptions={{headerShown:false}}>
                {
                    Test.map(route =>(
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
      </SurveyProvider>
    </GestureHandlerRootView>
    

  );
}
