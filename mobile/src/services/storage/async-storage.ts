import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@nckia:';

export const asyncStorage = {
  async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(`${PREFIX}${key}`);
    return value ? (JSON.parse(value) as T) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(`${PREFIX}${key}`);
  },

  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((item) => item.startsWith(PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  },
};
