import { View, Text, StyleSheet } from 'react-native';
import React from 'react'

interface Props{
    text: string,
    source: string
}

const SpeechBubble = ({ text, source }:Props) => {
    return (
      <View className="px-4 py-8 w-full">
        <View className="bg-white rounded-2xl px-4 py-3 border-2 border-secondary">
          <Text className="text-center text-lg font-medium">{text}</Text>
          {source && (
            <Text className="text-right text-xs text-gray-500 mt-1">{source}</Text>
          )}
        </View>
        <View className="h-4 w-4 bg-white rotate-45 border-b-2 border-r-2 border-secondary absolute bottom-6 left-1/2 -ml-2" style={styles.triangle} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    triangle: {
      transform: [{ rotate: '45deg' }],
    },
  });
  
export default SpeechBubble