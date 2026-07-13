import { View, Image, Animated, Pressable, PressableProps, ImageSourcePropType } from 'react-native';
import { useRef, useEffect } from 'react'
import Reanimated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';


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
      <Reanimated.View entering={FadeInDown.duration(400)}>
        <View className="items-center justify-center">
          <LinearGradient
            colors={['rgba(74,223,134,0.18)', 'rgba(120,180,255,0.10)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: 176, height: 176, borderRadius: 88, alignItems: 'center', justifyContent: 'center' }}
          >
            <Animated.View
              className="w-40 h-40 overflow-hidden"
              style={{ transform: [{ scale: scaleAnim }] }}
            >
              <Image
                source={source}
                className="w-40 h-40"
                resizeMode="contain"
              />
            </Animated.View>
          </LinearGradient>
        </View>
      </Reanimated.View>
    </Pressable>
  )
}

export default ThemedAvatar
