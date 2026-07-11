import AsyncStorage from '@react-native-async-storage/async-storage';

export const GRATITUDE_STORAGE_KEY = '@gratitude_entries';

export interface GratitudeEntry {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** 1 a 3 cosas positivas del día. */
  items: string[];
  createdAt: string;
}

const todayKey = (): string => {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const readAll = async (): Promise<GratitudeEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(GRATITUDE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = async (entries: GratitudeEntry[]) => {
  try {
    await AsyncStorage.setItem(GRATITUDE_STORAGE_KEY, JSON.stringify(entries));
  } catch {}
};

/** Entrada de hoy, si existe. */
export const getToday = async (): Promise<GratitudeEntry | null> => {
  const entries = await readAll();
  return entries.find((e) => e.date === todayKey()) ?? null;
};

/** Crea o actualiza la entrada de hoy (una por día). */
export const upsertToday = async (items: string[]): Promise<GratitudeEntry> => {
  const entries = await readAll();
  const key = todayKey();
  const clean = items.map((i) => i.trim()).filter(Boolean).slice(0, 3);
  const existing = entries.find((e) => e.date === key);

  if (existing) {
    existing.items = clean;
    await writeAll(entries);
    return existing;
  }

  const entry: GratitudeEntry = {
    id: Date.now().toString(),
    date: key,
    items: clean,
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  await writeAll(entries);
  return entry;
};

/** Historial ordenado del más reciente al más antiguo. */
export const getHistory = async (): Promise<GratitudeEntry[]> => {
  const entries = await readAll();
  return entries.sort((a, b) => b.date.localeCompare(a.date));
};
