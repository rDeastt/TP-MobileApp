import { View, Text } from 'react-native';
import React from 'react';
import { usePathname } from 'expo-router';
import { questRoutes } from '@/constants/Routes';

interface Props {
  title: string;
  subtitle?: string;
}

/**
 * Cabecera del cuestionario con barra de progreso real:
 * la posición se deriva del route actual dentro de questRoutes
 * (reemplaza los contadores "1/6" hardcodeados).
 */
const QuestHeader = ({ title, subtitle }: Props) => {
  const pathname = usePathname();
  const names = questRoutes.map((r) => '/' + r.name.split('/')[0]);
  const idx = Math.max(0, names.indexOf(pathname));
  const progress = names.length > 1 ? idx / (names.length - 1) : 0;

  return (
    <View className="items-center mb-2 px-2">
      <View className="w-full h-2 rounded-full bg-cards dark:bg-cards-dark overflow-hidden mb-3">
        <View
          style={{ width: `${Math.max(4, progress * 100)}%` }}
          className="h-2 rounded-full bg-main"
        />
      </View>
      <Text className="text-3xl font-bold text-content dark:text-content-dark text-center">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-base text-muted dark:text-muted-dark text-center">{subtitle}</Text>
      ) : null}
    </View>
  );
};

export default QuestHeader;
