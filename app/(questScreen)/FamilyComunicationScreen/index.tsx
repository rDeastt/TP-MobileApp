import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import ScaleSelector from '@/components/shared/ScaleSlector';

const FamilyComunicationScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">4/6</Text>
          <Text className="text-3xl font-bold text-black">Dinámica y apoyo familiar</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='justify-center flex-1 mb-10'>
          <SpeechBubble text="¿Consideras que la comunicación en tu familia es efectiva y abierta?" source="Grace" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-9.png')} animate />
          
          <ScaleSelector
          value={responses.comunicacionFamiliar}
          onValueChange={(value) => updateResponse('comunicacionFamiliar', value)}
          min={1}
          max={3}
          leftLabel="Muy poca"
          rightLabel="Bastante"
          />

        </View>

      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.comunicacionFamiliar === 0}
          route='AcademicLoadScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default FamilyComunicationScreen