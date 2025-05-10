import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import { getDaysUntilNextPrediction } from './burnoutHistory';

interface Props extends PressableProps {
    percentage: number | null;      // ← puede ser null
    bgColor?: string;
  }

const LastPredictionCard = ({ percentage, bgColor = 'bg-sky-400', ...rest }: Props) => {
  const [remain, setRemain] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const r = await getDaysUntilNextPrediction();
      setRemain(r);
    })();
  }, []);

  const disabled = remain > 0;
  
  return (
    <View className={`w-full rounded-3xl p-5 ${bgColor} mb-4`}>
      <Text className="text-lg font-semibold text-white mb-2">Tu última predicción</Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-5xl font-extrabold text-white">
          {percentage !== null ? `${percentage}%` : '—'}
        </Text>

        <Pressable
          disabled={disabled}
          className={`rounded-xl px-6 py-4 ${
            disabled ? 'bg-gray-300' : 'bg-emerald-500 active:opacity-80'
          }`}
          {...rest}
        >
          <Text className="text-white font-semibold text-base">
            {disabled ? `${remain} día${remain === 1 ? '' : 's'} restantes` : 'Intentar de nuevo'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};


export default LastPredictionCard;
