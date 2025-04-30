import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import ThemedAvatar from '@/components/questions/ThemedAvatar'
import SpeechBubble from '@/components/questions/SpeechBubble'
import ThemedButton from '@/components/shared/ThemedButton'
import { useSurvey } from '@/hooks/SurveyContext'
import { Redirect } from 'expo-router'

const BunnoApp = () => {


    return (
      <Redirect href='./HomeScreen'/>
      //<Redirect href='./ControlEmotionsScreen'/>
      //<Redirect href='./NameScreen'/> //este es el que debe estar default
    );
}

export default BunnoApp