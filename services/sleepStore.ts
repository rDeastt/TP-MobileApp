import AsyncStorage from '@react-native-async-storage/async-storage';

export const SLEEP_STORAGE_KEY = '@sleep_checklist';

/** Mapa fecha (YYYY-MM-DD) → ids de hábitos marcados esa noche. */
type SleepLog = Record<string, string[]>;

const dateKey = (d: Date = new Date()): string => {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const readLog = async (): Promise<SleepLog> => {
  try {
    const raw = await AsyncStorage.getItem(SLEEP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/** Ids marcados hoy. */
export const getToday = async (): Promise<string[]> => {
  const log = await readLog();
  return log[dateKey()] ?? [];
};

/** Marca/desmarca un hábito hoy y devuelve la lista resultante. */
export const toggleItem = async (id: string): Promise<string[]> => {
  const log = await readLog();
  const key = dateKey();
  const day = log[key] ?? [];
  const updated = day.includes(id) ? day.filter((i) => i !== id) : [...day, id];
  log[key] = updated;
  try {
    await AsyncStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(log));
  } catch {}
  return updated;
};

/** Cantidad de hábitos marcados en los últimos 7 días (antiguo → hoy). */
export const getLast7Days = async (): Promise<number[]> => {
  const log = await readLog();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return (log[dateKey(d)] ?? []).length;
  });
};
