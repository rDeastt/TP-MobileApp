import { View, Image, Animated, Pressable, PressableProps, ImageSourcePropType } from 'react-native';
import { useRef, useEffect } from 'react'


interface Props extends PressableProps{
    source: ImageSourcePropType,
    animate?: boolean
}

const ThemedAvatar = ({ source, onPress, animate = false }:Props) => {

    const scaleAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (animate) {
          // Crea una animación similar a Duolingo donde el personaje se mueve ligeramente
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, [animate, scaleAnim]);

  return (
    <Pressable onPress={onPress}>
      <View className="items-center justify-center">
        <Animated.View
          className="w-40 h-40 rounded-full overflow-hidden"
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          <Image
            source={source}
            className="w-full h-full"
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    </Pressable>
  )
}

export default ThemedAvatar