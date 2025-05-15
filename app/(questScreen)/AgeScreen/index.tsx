import { View, Text} from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedView from '@/components/shared/ThemedView';
import ThemedTextInput from '@/components/shared/ThemedTextInput';

const AgeScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">1/6</Text>
          <Text className="text-3xl font-bold text-black">Informacion Personal</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1 mb-5'>
          <SpeechBubble text="Acabo de nacer hoy, así que solo tengo unas horas de edad. ¿Y tú? ¿Cuántos años tienes?" source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-3.png')} animate />

          {/* Input para nombre */}
          <ThemedTextInput
            className="border border- p-2 rounded-2xl my-4 w-11/12"
            placeholder="Tipea tu edad 👻"
            value={responses.edad.toString()}
            keyboardType='numeric'
              onChangeText={(text) => {
                /** quita todo lo que no sea dígito */
                const onlyNums = text.replace(/[^0-9]/g, '');
                updateResponse('edad', Number(onlyNums));
              }}
          />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.edad === 0}
          route='SemesterScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default AgeScreen