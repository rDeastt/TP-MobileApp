import React from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  className?: string;
  /** Envuelve el contenido en un ScrollView vertical. */
  scroll?: boolean;
}

/**
 * Contenedor base de pantalla: SafeArea + fondo temático (claro/oscuro).
 * Único lugar donde vive el color de fondo de las pantallas.
 */
const Screen = ({ children, className = '', scroll = false, ...rest }: Props) => {
  const content = scroll ? (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View className={className} {...rest}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`} {...rest}>
      {children}
    </View>
  );

  return <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">{content}</SafeAreaView>;
};

export default Screen;
