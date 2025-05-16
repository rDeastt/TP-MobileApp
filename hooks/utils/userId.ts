// src/utils/userId.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const KEY = '@user_identifier';

export const getUserId = async (): Promise<string> => {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing) return existing;

  const newId = uuidv4();          // → “3dcb-4c1a-…”
  await AsyncStorage.setItem(KEY, newId);
  return newId;
};
