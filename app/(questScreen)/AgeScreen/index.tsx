import { View, Text} from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedView from '@/components/shared/ThemedView';
import ThemedTextInput from '@/components/shared/ThemedTextInput';
import QuestHeader from '@/components/questions/QuestHeader';

const AgeScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Informacion Personal" subtitle="Completa los campos para poder ayudarte" />

        <View className='items-center justify-center flex-1 mb-5'>
          <SpeechBubble text="Genial, y ahora dime, ¿cuántos años tienes?" source="Buno" />
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