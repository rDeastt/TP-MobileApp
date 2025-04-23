import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedView from '@/components/shared/ThemedView';

const NameScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">1/6</Text>
          <Text className="text-3xl font-bold text-black">Informacion Personal</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1 pb-10'>
          <SpeechBubble text="Como dije antes mi nombre es Buno, ¿Cómo te llamas tu?" source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-1.png')} animate />

          {/* Input para nombre */}
          <TextInput
            className="border p-2 rounded-2xl my-4 w-11/12"
            placeholder="Escribe tu nombre"
            value={responses.nombre}
            onChangeText={(text) => updateResponse('nombre', text)}
          />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.nombre === ''}
          route='GenderScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default NameScreen