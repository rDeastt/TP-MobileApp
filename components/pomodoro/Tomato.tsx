import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';

interface TomatoProps {
  current: number;
  total: number;
  triggerShake: boolean;
}

const Tomato: React.FC<TomatoProps> = ({ current, total, triggerShake }) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (triggerShake) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [triggerShake]);

  const shakeStyle = {
    transform: [
      {
        translateX: shakeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-8, 8],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[shakeStyle]} className="items-center justify-center">
      <Image
        source={require('@/assets/images/tomato.png')}
        style={{ width: 160, height: 160 }}
        resizeMode="contain"
      />
      <View className="absolute">
        <Text className="text-white text-2xl font-bold pt-20">
          {current}/{total}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Tomato;
