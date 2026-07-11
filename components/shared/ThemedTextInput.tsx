import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  className?: string; // opcional, si usas NativeWind
}

const ThemedTextInput = ({ className, keyboardType = 'default', ...rest }: Props) => {
  return (
    <TextInput
      className={`border border-gray-300 dark:border-gray-600 p-3 rounded-full my-4 w-11/12 bg-card dark:bg-card-dark text-content dark:text-content-dark ${className ?? ''}`}
      placeholderTextColor="#9BA1A6"
      keyboardType={keyboardType} // ← usa el que venga
      {...rest}                   // ← pasa el resto (placeholder, value, onChangeText, etc.)
    />
  );
};

export default ThemedTextInput;
