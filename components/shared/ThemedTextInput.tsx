import { View, Text, TextInput, TextInputProps, KeyboardTypeOptions } from 'react-native'
import React from 'react'

interface Props extends TextInputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

const ThemedTextInput = ({type = 'default', placeholder, value, onChangeText}:Props) => {
  return (
        <TextInput
            className="border border- p-2 rounded-2xl my-4 w-11/12 "
            placeholder={placeholder}
            value={value}
            keyboardType={type as KeyboardTypeOptions}
            onChangeText={onChangeText}
        />
  )
}

export default ThemedTextInput