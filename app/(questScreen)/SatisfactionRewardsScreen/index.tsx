import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import ScaleSelector from '@/components/shared/ScaleSelector';
import QuestHeader from '@/components/questions/QuestHeader';

const SatisfactionRewardsScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Vida académica y percepción del entorno educativo" subtitle="Completa los campos para poder ayudarte" />

        <View className='justify-center flex-1 mb-10'>
          <SpeechBubble text="¿Estás satisfecho con las recompensas (por ejemplo, reconocimiento académico, calificaciones) que recibes por tu esfuerzo?" 
          source="Guasa" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-11.png')} animate />
          
          <ScaleSelector
          value={responses.satisfaccionRecompensas}
          onValueChange={(value) => updateResponse('satisfaccionRecompensas', value)}
          min={1}
          max={5}
          leftLabel="No tanto"
          rightLabel="SI, mucho"
          />

        </View>

      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.satisfaccionRecompensas === 0}
          route='SleepQualityScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default SatisfactionRewardsScreen