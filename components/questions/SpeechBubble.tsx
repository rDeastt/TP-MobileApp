import { View, Text } from 'react-native';
import React from 'react'

interface Props{
    text: string,
    source: string
}

const SpeechBubble = ({ text, source }:Props) => {
    return (
      <View className="px-4 py-8 w-full">
        <View className="bg-card dark:bg-card-dark rounded-2xl px-4 py-3 border-2 border-secondary dark:border-secondary-dark">
          <Text className="text-center text-lg font-medium text-content dark:text-content-dark">{text}</Text>
          {source && (
            <Text className="text-right text-xs text-muted dark:text-muted-dark mt-1">{source}</Text>
          )}
        </View>
        <View className="h-4 w-4 bg-card dark:bg-card-dark rotate-45 border-b-2 border-r-2 border-secondary dark:border-secondary-dark absolute bottom-6 left-1/2 -ml-2" />
      </View>
    );
  };

export default SpeechBubble
