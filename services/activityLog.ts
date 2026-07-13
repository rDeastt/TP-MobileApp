import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACTIVITY_LOG_KEY = '@activity_log';

export type ToolId =
  | 'pomodoro'
  | 'breathe'
  | 'meditation'
  | 'routine'
  | 'activePause'
  | 'thoughts'
  | 'gratitude'
  | 'sleep'
  | 'petBreak'
  | 'outdoor'
  | 'mood';

/** Mapa fecha (YYYY-MM-DD) → herramientas completadas ese día. */
type ActivityLog = Record<string, ToolId[]>;

const dateKey = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const readLog = async (): Promise<ActivityLog> => {
  try {
    const raw = await AsyncStorage.getItem(ACTIVITY_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/** Registra que hoy se completó una herramienta (idempotente por día). */
export const logCompletion = async (tool: ToolId): Promise<void> => {
  const log = await readLog();
  const key = dateKey();
  const day = log[key] ?? [];
  if (!day.includes(tool)) day.push(tool);
  log[key] = day;
  try {
    await AsyncStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
  } catch {}
};

/** Herramientas completadas hoy. */
export const getTodayTools = async (): Promise<ToolId[]> => {
  const log = await readLog();
  return log[dateKey()] ?? [];
};

/** Últimos 7 días (más antiguo → hoy): ¿hubo al menos una actividad? */
export const getWeekActivity = async (): Promise<boolean[]> => {
  const log = await readLog();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return (log[dateKey(d)] ?? []).length > 0;
  });
};

/**
 * Días consecutivos con ≥1 actividad. La racha sigue "viva" si hoy aún
 * no hay actividad pero ayer sí (se cuenta desde ayer).
 */
export const getStreak = async (): Promise<number> => {
  const log = await readLog();
  const d = new Date();
  if (!log[dateKey(d)]?.length) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (log[dateKey(d)]?.length) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};
