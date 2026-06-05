import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map<string, string>();

export const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
      return fallback;
    }
    return JSON.parse(value) as T;
  } catch (_error) {
    const local = memoryStore.get(key);
    return local ? (JSON.parse(local) as T) : fallback;
  }
};

export const writeJson = async <T>(key: string, value: T): Promise<void> => {
  const serialized = JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, serialized);
  } catch (_error) {
    memoryStore.set(key, serialized);
  }
};

export const removeKey = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (_error) {
    memoryStore.delete(key);
  }
};
