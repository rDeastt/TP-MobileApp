import { View, Text, Pressable, PressableProps } from 'react-native'
import React from 'react'
import { Href, router } from 'expo-router'

interface Props extends PressableProps{
    disabled?:boolean
    children:string
    route?: string
}

const ThemedButton = ({ onPress, route, disabled = false, children, ...rest}:Props) => {

  return (
    <Pressable
    onPress={disabled ? null : ()=>{
      route && router.push(route as Href)
      onPress? onPress : null
    }}
      className={`w-full py-4 rounded-full ${
        disabled ? 'bg-gray-300' : 'bg-[#4ADF86] active:opacity-80'
      }`}
      disabled={disabled}
      {...rest}
      >
        <Text className="text-white text-center font-bold text-lg">
        {children}
      </Text>
    </Pressable>
  )
}

export default ThemedButton