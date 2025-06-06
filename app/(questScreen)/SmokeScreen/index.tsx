import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import DoubleOptionPicker from '@/components/questions/DoubleOptionPicker';

const SmokeScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">3/6</Text>
          <Text className="text-3xl font-bold text-black text-center">Estilo de vida y responsabilidades</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1 mb-10'>
          <SpeechBubble text="Se honesto, ¿fumas bastante?" source="Lina" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-6.png')} animate />

          {/* Input para nombre */}
          <DoubleOptionPicker
          option1={{
            label: 'Bastante',
            image: require('../../../assets/avatars/avatar-6-1.png'),
            value: '1',
          }}
          option2={{
            label: 'El aire es mejor',
            image: require('../../../assets/avatars/avatar-6-0.png'),
            value: '0',
          }}
          selectedValue={responses.fumador.toString()}
          onSelect={(value) => updateResponse('fumador', Number(value))}
        />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton
          route='FamilyResponsabilityScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default SmokeScreen