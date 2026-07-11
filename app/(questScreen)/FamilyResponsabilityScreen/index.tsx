import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import DoubleOptionPicker from '@/components/questions/DoubleOptionPicker';
import QuestHeader from '@/components/questions/QuestHeader';

const FamilyResponsabilityScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Estilo de vida y responsabilidades" subtitle="Completa los campos para poder ayudarte" />

        <View className='items-center justify-center flex-1 mb-10'>
          <SpeechBubble text="¿Tienes responsabilidades familiares?" source="Lina" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-7.png')} animate />

          {/* Input para nombre */}
          <DoubleOptionPicker
          option1={{
            label: 'Sí, cuido de familiares',
            image: require('../../../assets/avatars/avatar-7-1.png'),
            value: '1',
          }}
          option2={{
            label: 'No tengo',
            image: require('../../../assets/avatars/avatar-7-0.png'),
            value: '0',
          }}
          selectedValue={responses.responsabilidadesFamiliares.toString()}
          onSelect={(value) => updateResponse('responsabilidadesFamiliares', Number(value))}
        />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          route='ExerciseScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default FamilyResponsabilityScreen