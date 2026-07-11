import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import ScaleSelector from '@/components/shared/ScaleSelector';
import QuestHeader from '@/components/questions/QuestHeader';

const AnxietyFrecuencyScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Bienestar emocional y psicológico" subtitle="Completa los campos para poder ayudarte" />

        <View className='justify-center flex-1 mb-10'>
          <SpeechBubble text="¿Con qué frecuencia haz experimentado el sentirse nervioso, ansioso o al borde?" 
          source="Ventu" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-13.png')} animate />
          
          <ScaleSelector
          value={responses.frecuenciaAnsiedad}
          onValueChange={(value) => updateResponse('frecuenciaAnsiedad', value)}
          min={1}
          max={5}
          leftLabel="Nunca"
          rightLabel="Muy constante"
          />

        </View>

      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.frecuenciaAnsiedad === 0}
          route='DepressionFrecuencyScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default AnxietyFrecuencyScreen