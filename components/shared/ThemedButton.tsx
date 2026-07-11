import { Text, Pressable, PressableProps, GestureResponderEvent } from 'react-native'
import React from 'react'
import { Href, router } from 'expo-router'
import * as Haptics from 'expo-haptics'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends PressableProps{
    disabled?:boolean
    children:string
    route?: string
    variant?: Variant
    className?: string
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: { container: 'bg-main active:opacity-80', text: 'text-white' },
  secondary: { container: 'bg-secondary dark:bg-secondary-dark active:opacity-80', text: 'text-white' },
  ghost: { container: 'bg-transparent border-2 border-main active:opacity-60', text: 'text-main' },
}

const ThemedButton = ({ onPress, route, disabled = false, variant = 'primary', className = '', children, ...rest}:Props) => {
  const styles = variantStyles[variant]

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return
    Haptics.selectionAsync()
    if (route) router.push(route as Href)
    onPress?.(event)
  }

  return (
    <Pressable
      onPress={handlePress}
      className={`py-4 rounded-full ${className.includes('flex-1') ? '' : 'w-full'} ${
        disabled ? 'bg-gray-300 dark:bg-gray-700' : styles.container
      } ${className}`}
      disabled={disabled}
      {...rest}
      >
        <Text className={`text-center font-bold text-lg ${disabled ? 'text-white' : styles.text}`}>
        {children}
      </Text>
    </Pressable>
  )
}

export default ThemedButton
