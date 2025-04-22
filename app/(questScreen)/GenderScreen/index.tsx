import { View, Text, TextInput } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import DoubleOptionPicker from '@/components/questions/DoubleOptionPicker';

const GenderScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">1/6</Text>
          <Text className="text-3xl font-bold text-black">Informacion Personal</Text>
          <Text className="text-base text-gray-400">Completa los campos para poder ayudarte</Text>
        </View>

        <View className='items-center justify-center flex-1'>
          <SpeechBubble text="Ahora dime, eres un chico o una chica?. Si me preguntas a mi soy un imagen asi que no tengo genero xd" source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-14.png')} animate />

          {/* Input para nombre */}
          <DoubleOptionPicker
          option1={{
            label: 'Mujer',
            image: require('../../../assets/avatars/avatar-2-2.png'),
            value: 'mujer',
          }}
          option2={{
            label: 'Hombre',
            image: require('../../../assets/avatars/avatar-2-1.png'),
            value: 'hombre',
          }}
          selectedValue={responses.genero}
          onSelect={(value) => updateResponse('genero', value)}
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
  // return (
  //   <View>
  //     <Text>GenderScreen</Text>
      
  //     Ejemplo adicional (por si quieres mantenerlo)
  //     <ScaleSelector
  //       value={responses.calidadSueno}
  //       onValueChange={(value) => updateResponse('calidadSueno', value)}
  //       min={1}
  //       max={5}
  //       leftLabel="Muy poca"
  //       rightLabel="Bastante"
  //     />
  //   </View>
    
  // )
}

export default GenderScreen