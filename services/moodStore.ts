import AsyncStorage from '@react-native-async-storage/async-storage';

export const MOOD_STORAGE_KEY = '@mood_log';

/** 1 = muy mal · 5 = muy bien */
export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  /** YYYY-MM-DD */
  date: string;
  mood: MoodValue;
  note?: string;
}

type MoodLog = Record<string, MoodEntry>;

const dateKey = (d: Date = new Date()): string => {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const readLog = async (): Promise<MoodLog> => {
  try {
    const raw = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/** Registro de hoy, si existe. */
export const getToday = async (): Promise<MoodEntry | null> => {
  const log = await readLog();
  return log[dateKey()] ?? null;
};

/** Guarda (o reemplaza) el ánimo de hoy. */
export const saveToday = async (mood: MoodValue, note?: string): Promise<void> => {
  const log = await readLog();
  log[dateKey()] = { date: dateKey(), mood, note: note?.trim() || undefined };
  try {
    await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(log));
  } catch {}
};

/** Últimos 7 días (antiguo → hoy); null si no hay registro ese día. */
export const getWeek = async (): Promise<(MoodValue | null)[]> => {
  const log = await readLog();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return log[dateKey(d)]?.mood ?? null;
  });
};
