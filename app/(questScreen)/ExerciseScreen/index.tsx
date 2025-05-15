import { View, Text } from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedView from '@/components/shared/ThemedView';
import ThemedTextInput from '@/components/shared/ThemedTextInput';

const ExerciseScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text numberOfLines={2} className="font-semibold text-lg text-gray-500">3/6</Text>
          <Text className="text-3xl font-bold text-black text-center">Estilo de vida y responsabilidades</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1 mb-10'>
          <SpeechBubble text="¿En promedio, cuántas horas de ejercicio has realizado en la semana?" source="Lina" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-8.png')} animate />

          {/* Input para nombre */}
          <ThemedTextInput
            className="border border- p-2 rounded-2xl my-4 w-11/12"
            placeholder="Escribe las horas"
            value={responses.horasEjercicio.toString()}
            keyboardType='numeric'
            onChangeText={(text) => {
              /** quita todo lo que no sea dígito */
              const onlyNums = text.replace(/[^0-9]/g, '');
              updateResponse('horasEjercicio', Number(onlyNums));
            }}            
          />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.horasEjercicio < 0 }
          route='FamilyComunicationScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default ExerciseScreen