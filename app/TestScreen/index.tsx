import { View, Text } from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import { mapFormToModel } from '@/hooks/utils/mapFormToModel';

const TestScreen = () => {
    const { responses} = useSurvey();
    const response = mapFormToModel(responses)
  return (
    <View>
      <Text>{JSON.stringify(responses,null,2)}</Text>
      <Text>{JSON.stringify(response,null,2)}</Text>
    </View>
  )
}

export default TestScreen