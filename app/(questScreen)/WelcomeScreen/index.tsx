import { View, Text, TextInput } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView'
import SpeechBubble from '@/components/questions/SpeechBubble'
import ThemedAvatar from '@/components/questions/ThemedAvatar'
import ThemedButton from '@/components/shared/ThemedButton'
import QuestHeader from '@/components/questions/QuestHeader';

const index = () => {
  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <QuestHeader title="Bienvenida" subtitle="BunoApp, la aplicacion de apoyo" />

        <View className='items-center justify-center flex-1 pb-10'>
          <SpeechBubble text="¡Bienvenido a esta increíble herramienta de apoyo! Mi nombre es Buno y estaré aquí para acompañarte. Espero que disfrutes tu experiencia por aquí." source="Buno" />
          <ThemedAvatar source={require('../../../assets/avatars/avatar-1.png')} animate />
        </View>
      </View>

      {/* Botón con texto personalizado al final de la pantalla */}
      <View className="mb-5">
        <ThemedButton 
          route='NameScreen'
        >
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  )
}

export default index