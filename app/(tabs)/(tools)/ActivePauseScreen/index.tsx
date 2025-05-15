import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import ThemedView from '@/components/shared/ThemedView';
import { Pressable } from 'react-native';
import { router } from 'expo-router';

const ActivePauseScreen = () => {
  return (
    <ThemedView margin className="flex-1 bg-white">
      <ScrollView contentContainerClassName="items-center px-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-center mt-6">Pausa Activa</Text>
        <Text className="text-center text-gray-600 mt-1 mb-6">
          🧳 Relájate con estos ejercicios simples mientras escuchas música suave 🎵
        </Text>

        {/* Ejercicio 1 */}
        <Image
          source={require('../../../../assets/screenImages/acti-1.png')}
          className="w-64 h-64 mb-4 rounded-2xl"
          resizeMode="contain"
        />
        <Text className="text-center text-base text-black font-medium mb-6">
          1. Estiramiento lateral de brazos. {'\n'}
          <Text className="text-gray-700 font-normal">
            Mantén de 10 a 15 segundos por cada brazo!
          </Text>
        </Text>

        {/* Ejercicio 2 */}
        <Image
          source={require('../../../../assets/screenImages/acti-2.png')}
          className="w-64 h-64 mb-4 rounded-2xl"
          resizeMode="contain"
        />
        <Text className="text-center text-base text-black font-medium mb-6">
          2. Estiramiento de cuello {'\n'}
          <Text className="text-gray-700 font-normal">
            Inclina lentamente la cabeza hacia un lado, mantén por 10 segundos, y repite del otro lado. No te olvides de hacer giros suaves 👋
          </Text>
        </Text>

        {/* Ejercicio 3 */}
        <Image
          source={require('../../../../assets/screenImages/acti-3.png')}
          className="w-64 h-64 mb-4 rounded-2xl"
          resizeMode="contain"
        />
        <Text className="text-center text-base text-black font-medium mb-8">
          3. Rotación de hombros {'\n'}
          <Text className="text-gray-700 font-normal">
            Haz 10 círculos hacia atrás con los hombros, luego 10 hacia adelante. Inhala al levantar y exhala al bajar.
          </Text>
        </Text>

        <Pressable
          onPress={() => router.push('/ToolsScreen')}
          className="w-full py-4 rounded-full bg-[#4ADF86] active:opacity-80"
        >
          <Text className="text-white font-semibold text-lg text-center">Listo!</Text>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

export default ActivePauseScreen;
