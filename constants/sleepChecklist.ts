import { Ionicons } from '@expo/vector-icons';

export interface SleepChecklistItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/** Hábitos de higiene del sueño (checklist nocturna). */
export const SLEEP_CHECKLIST: SleepChecklistItem[] = [
  { id: 'no-screens', label: 'Dejé las pantallas 1 hora antes de dormir', icon: 'phone-portrait-outline' },
  { id: 'no-caffeine', label: 'No tomé cafeína después de media tarde', icon: 'cafe-outline' },
  { id: 'schedule', label: 'Me acuesto a la misma hora que ayer', icon: 'time-outline' },
  { id: 'dark-room', label: 'Mi cuarto está oscuro y fresco', icon: 'moon-outline' },
  { id: 'no-heavy-food', label: 'Cené ligero, sin comidas pesadas', icon: 'restaurant-outline' },
  { id: 'wind-down', label: 'Hice algo relajante antes de dormir', icon: 'book-outline' },
  { id: 'no-work-bed', label: 'No estudié ni trabajé en la cama', icon: 'bed-outline' },
];

/** Ítems marcados para considerar la noche "completada". */
export const SLEEP_GOAL = 5;
