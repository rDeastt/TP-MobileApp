import { View, Text, TextInput } from 'react-native'
import React from 'react'
import ThemedView from '@/components/shared/ThemedView'
import SpeechBubble from '@/components/questions/SpeechBubble'
import ThemedAvatar from '@/components/questions/ThemedAvatar'
import ThemedButton from '@/components/shared/ThemedButton'

const index = () => {
  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="text-3xl font-bold text-black">Bienvenida</Text>
          <Text className="text-base text-gray-400">BunoApp, la aplicacion de apoyo</Text>
        </View>

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