import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import TripleOptionPicker from '@/components/questions/TripleOptionPicker';

const MaritalStatusScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">1/6</Text>
          <Text className="text-3xl font-bold text-black">Informacion Peronsal</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1'>
          <SpeechBubble text="Ahora dime, eres un chico o una chica?. Si me preguntas a mi soy un imagen asi que no tengo genero xd" source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-14.png')} animate />

          {/* Input para nombre */}
          <TripleOptionPicker
            option1={{
              label: 'Soltero',
              image: require('../../../assets/avatars/avatar-4-1.png'),
              value: '1',
            }}
            option2={{
              label: 'Casado o en una realcion',
              image: require('../../../assets/avatars/avatar-4-2.png'),
              value: '2',
            }}
            option3={{
              label: 'Otro',
              image: require('../../../assets/avatars/avatar-4-3.png'),
              value: '3',
            }}
            selectedValue={responses.estadoCivil}
            onSelect={(value) => updateResponse('estadoCivil', value)}
          />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.genero === ''}
          route='AgeScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default MaritalStatusScreen