import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

/** Orbe que pulsa suavemente (loading, respiración). Sin dependencias nuevas. */
const PulsingOrb = ({ size = 120, color = '#4ADF86', children }: Props) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="items-center justify-center"
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.85,
        },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default PulsingOrb;
