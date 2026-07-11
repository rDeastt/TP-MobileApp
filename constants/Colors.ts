/**
 * Colores usados desde JS (StatusBar, NavigationBar, tab bar, gráficos).
 * Deben espejar los tokens de tailwind.config.js: surface/card/content/muted/main/secondary.
 */

const tintColorLight = '#4ADF86';
const tintColorDark = '#4ADF86';

export const Colors = {
  light: {
    text: '#11181C',
    textMuted: '#687076',
    background: '#F3F3F3',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabBar: '#78B4FF',
    chartLine: '#4ADF86',
    chartAxis: '#687076',
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#9BA1A6',
    background: '#0F1218',
    card: '#1B212B',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabBar: '#1B212B',
    chartLine: '#4ADF86',
    chartAxis: '#9BA1A6',
  },
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
