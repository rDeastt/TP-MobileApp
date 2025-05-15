/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F3F3F3',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#11181C',
    background: '#F3F3F3',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  // dark: {
  //   text: '#ECEDEE',
  //   background: '#151718',
  //   tint: tintColorDark,
  //   icon: '#9BA1A6',
  //   tabIconDefault: '#9BA1A6',
  //   tabIconSelected: tintColorDark,
  // },
};

/* Tabla central de colores para tarjetas de recomendación */
export const backgroundColorMap = {
  purple:  '#a78bfa', // purple-400
  sky:     '#0ea5e9', // sky-500
  teal:    '#14b8a6', // teal-500
  emerald: '#10b981', // emerald-500
  pink:    '#f472b6', // pink-400
  yellow:  '#eab308', // yellow-500
  indigo:  '#6366f1', // indigo-500
  orange:  '#f97316', // orange-500
} as const;

export type ColorKey = keyof typeof backgroundColorMap;

/* Paleta (orden) que usan las pantallas */
export const colorRecomendationPalette: ColorKey[] = [
  'purple',
  'sky',
  'teal',
  'emerald',
  'pink',
  'yellow',
  'indigo',
  'orange',
];