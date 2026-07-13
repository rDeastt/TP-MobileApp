import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  source: ImageSourcePropType;
  size?: number;
  /** Par de colores del halo (con alpha). */
  colors?: [string, string];
}

/** Imagen sobre un halo circular con gradiente suave — le da profundidad a los PNG planos. */
const HaloImage = ({
  source,
  size = 190,
  colors = ['rgba(74,223,134,0.25)', 'rgba(120,180,255,0.15)'],
}: Props) => (
  <LinearGradient
    colors={colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={source}
      style={{ width: size * 0.82, height: size * 0.82 }}
      resizeMode="contain"
    />
  </LinearGradient>
);

export default HaloImage;
