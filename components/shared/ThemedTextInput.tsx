import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  className?: string; // opcional, si usas NativeWind
}

const ThemedTextInput = ({ className, keyboardType = 'default', ...rest }: Props) => {
  return (
    <TextInput
      className={`border p-2 rounded-full my-4 w-11/12 bg-white ${className ?? ''}`}
      keyboardType={keyboardType} // ← usa el que venga
      {...rest}                   // ← pasa el resto (placeholder, value, onChangeText, etc.)
    />
  );
};

export default ThemedTextInput;
