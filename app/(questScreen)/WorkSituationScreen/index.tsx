import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import TripleOptionPicker from '@/components/questions/TripleOptionPicker';

const WorkSituationScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">2/6</Text>
          <Text className="text-3xl font-bold text-black">Información Académica</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1'>
          <SpeechBubble text="Como te encuentras laboralmente?" source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-4.png')} animate />

          {/* Input para nombre */}
          <TripleOptionPicker
            option1={{
              label: 'Solo estudio',
              image: require('../../../assets/avatars/avatar-4-1.png'),
              value: '1',
            }}
            option2={{
              label: 'Trabajo Part-Time',
              image: require('../../../assets/avatars/avatar-4-2.png'),
              value: '2',
            }}
            option3={{
              label: 'Trabajo Full-Time',
              image: require('../../../assets/avatars/avatar-4-3.png'),
              value: '3',
            }}
            selectedValue={responses.situacionLaboral.toString()}
            onSelect={(value) => updateResponse('situacionLaboral', Number(value))}
          />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.situacionLaboral === 0}
          route='SmokeScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default WorkSituationScreen