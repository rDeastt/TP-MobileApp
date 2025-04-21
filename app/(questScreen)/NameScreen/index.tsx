import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedButton from '@/components/shared/ThemedButton';
import ScaleSelector from '@/components/shared/ScaleSlector';
import ThemedAvatar from '@/components/questions/ThemedAvatar';

const NameScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <View className="p-4">
      <SpeechBubble text="¿Cómo te llamas?" source="Buno" />
      <ThemedAvatar source={require('../../../assets/avatars/avatar-14.png')} animate />

      {/* Input para nombre */}
      <TextInput
        className="border p-2 rounded-lg my-4"
        placeholder="Escribe tu nombre"
        value={responses.nombre}
        onChangeText={(text) => updateResponse('nombre', text)}
      />

      {/* Botón con texto personalizado */}
      <ThemedButton disabled={responses.nombre === ''}>
        Continuar
      </ThemedButton>

      {/* Ejemplo adicional (por si quieres mantenerlo)
      <ScaleSelector
        value={responses.calidadSueno}
        onValueChange={(value) => updateResponse('calidadSueno', value)}
        min={1}
        max={5}
        leftLabel="Muy poca"
        rightLabel="Bastante"
      /> */}
    </View>
  );
}

export default NameScreen