import { BurnoutLevel } from '@/constants/recomendations';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = '@burnout_history';

/* Intervalo único (días) para poder repetir el test */
export const RETAKE_INTERVAL_DAYS = 14;

/* ---------- Tipos ---------- */

export interface HistoryItem {
  date: string;
  probability: number;
  name: string;
  responses: Record<string, any>;
  factores: {
    variable: string;
    valor_usuario: number;
    impacto_modelo: number;
  }[];
}


/* ---------- Guardar nuevo resultado ---------- */
export const saveResult = async (
  probability: number,
  responses: Record<string, any>,
  factores: {
    variable: string;
    valor_usuario: number;
    impacto_modelo: number;
  }[]
) => {
  try {
    const prev = await AsyncStorage.getItem(STORAGE_KEY);
    const history: HistoryItem[] = prev ? JSON.parse(prev) : [];

    history.push({
      date: new Date().toISOString(),
      probability,
      name: responses?.nombre ?? 'Sin-nombre',
      responses,
      factores,
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('No se pudo guardar el historial:', err);
  }
};

/* ---------- Imprimir historial por consola ---------- */
export const printHistory = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    console.log('Historial vacío');
    return;
  }
  const history: HistoryItem[] = JSON.parse(raw);
  console.log('📊 Historial de predicciones:');
  history.forEach((h, i) =>
    console.log(
      `${i + 1}. ${new Date(h.date).toLocaleDateString()} → ${h.probability}% (usuario: ${h.name})`,
    ),
  );
};

/* ---------- Obtener nombre del usuario (del último registro) ---------- */
export const getLastUserName = async (): Promise<string | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const history: HistoryItem[] = JSON.parse(raw);
  const last = history[history.length - 1];
  return last?.name ?? null;
};

/* ---------- Arreglo de probabilidades (más antiguo → más nuevo) ---------- */
export const getProbabilitiesHistory = async (): Promise<number[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const history: HistoryItem[] = JSON.parse(raw);
  return history.map((h) => h.probability);
};

/* ---------- ¿Ya se puede repetir el test? ---------- */
export const shouldRetakeForm = async (): Promise<boolean> => {
  const since = await getDaysSinceLastPrediction();
  if (since === null) return true; // nunca se ha tomado
  return since >= RETAKE_INTERVAL_DAYS;
};

export const clearHistory = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('🗑️  Historial de burnout eliminado');
    } catch (err) {
      console.warn('No se pudo borrar el historial:', err);
    }
  };

  /* ---------- Obtener el último porcentaje registrado (entero) ---------- */
export const getLastProbability = async (): Promise<number | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const history: HistoryItem[] = JSON.parse(raw);
    const last = history[history.length - 1];

    return last ? Math.round(last.probability) : null;
  } catch (err) {
    console.warn('No se pudo obtener el último porcentaje:', err);
    return null;
  }
};

export const getRiskInfo = async (): Promise<BurnoutLevel> => {
  const p = await getLastProbability();         // ← AWAIT

  if (p === null) return 'error';            // valor por defecto
  if (p < 30)    return 'low';
  if (p >= 50)   return 'high';
  return 'moderate';
};

/* ───── Días desde la última predicción ───── */
export const getDaysSinceLastPrediction = async (): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const history: HistoryItem[] = JSON.parse(raw);
  const last = history.at(-1);
  if (!last) return null;

  const lastDate = new Date(last.date);
  const diffDays = Math.floor(
    (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffDays;
};

/* ───── Días restantes para poder repetir ───── */
export const getDaysUntilNextPrediction = async (): Promise<number> => {
  const since = await getDaysSinceLastPrediction();
  if (since === null) return 0;      // nunca se ha hecho → disponible
  const remaining = RETAKE_INTERVAL_DAYS - since;
  return remaining < 0 ? 0 : remaining;
};
