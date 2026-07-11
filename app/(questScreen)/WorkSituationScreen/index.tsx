import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedButton from '@/components/shared/ThemedButton';
import { useSurvey } from '@/hooks/SurveyContext';
import TripleOptionPicker from '@/components/questions/TripleOptionPicker';
import QuestHeader from '@/components/questions/QuestHeader';

const WorkSituationScreen = () => {
  const { responses, updateResponse } = useSurvey();

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Información Académica" subtitle="Completa los campos para poder ayudarte" />

        <View className='items-center justify-center flex-1'>
          <SpeechBubble text="¿Como te encuentras laboralmente?" source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-4.png')} animate />

          {/* Input para nombre */}
          <TripleOptionPicker
            option1={{
              label: 'Solo estudio',
              image: require('../../../assets/avatars/avatar-4-1.png'),
              value: '1',
            }}
            option2={{
              label: 'Trabajo Part-Time',
              image: require('../../../assets/avatars/avatar-4-2.png'),
              value: '2',
            }}
            option3={{
              label: 'Trabajo Full-Time',
              image: require('../../../assets/avatars/avatar-4-3.png'),
              value: '3',
            }}
            selectedValue={responses.situacionLaboral.toString()}
            onSelect={(value) => updateResponse('situacionLaboral', Number(value))}
          />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          disabled={responses.situacionLaboral === 0}
          route='SmokeScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

export default WorkSituationScreen