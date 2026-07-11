import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import ScaleSelector from '@/components/shared/ScaleSelector';
import QuestHeader from '@/components/questions/QuestHeader';

const AcademicLoadScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Vida académica y percepción del entorno educativo" subtitle="Completa los campos para poder ayudarte" />

        <View className='justify-center flex-1 mb-10'>
          <SpeechBubble text="¿Cuál es tu percepción en la carga académica?" source="Guasa" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-10.png')} animate />
          
          <ScaleSelector
          value={responses.cargaAcademica}
          onValueChange={(value) => updateResponse('cargaAcademica', value)}
          min={1}
          max={3}
          leftLabel="Baja"
          rightLabel="Alta"
          />

        </View>

      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.cargaAcademica === 0}
          route='SatisfactionRewardsScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default AcademicLoadScreen