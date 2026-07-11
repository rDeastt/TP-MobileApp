import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import DoubleOptionPicker from '@/components/questions/DoubleOptionPicker';
import QuestHeader from '@/components/questions/QuestHeader';

const SmokeScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Estilo de vida y responsabilidades" subtitle="Completa los campos para poder ayudarte" />

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