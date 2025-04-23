// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving to storage', e);
  }
};

export const loadFromStorage = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading from storage', e);
    return null;
  }
};
