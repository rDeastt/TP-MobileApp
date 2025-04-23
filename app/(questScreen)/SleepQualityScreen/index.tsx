import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import ScaleSelector from '@/components/shared/ScaleSlector';

const SleepQualityScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">6/6</Text>
          <Text className="text-3xl font-bold text-black text-center">Bienestar emocional y psicológico</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='justify-center flex-1 mb-10'>
          <SpeechBubble text="¿ Cómo consideras tu calidad de sueño ?" 
          source="Ventu" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-12.png')} animate />
          
          <ScaleSelector
          value={responses.calidadSueno}
          onValueChange={(value) => updateResponse('calidadSueno', value)}
          min={1}
          max={5}
          leftLabel="Baja"
          rightLabel="Muy Buena"
          />

        </View>

      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.calidadSueno === 0}
          route='AnxietyFrecuencyScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default SleepQualityScreen