import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';

const CACHE_PREFIX = '@nckia:cache:';

export const cacheService = {
  async getCacheSize(): Promise<string> {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) return '0 KB';

      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) return '0 KB';

      const size = dirInfo.size || 0;

      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return 'Desconhecido';
    }
  },

  async clearCache(queryClient: QueryClient): Promise<void> {
    queryClient.clear();

    const cacheDir = FileSystem.cacheDirectory;
    if (cacheDir) {
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      await Promise.all(
        files.map((file) => FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true }))
      );
    }

    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    if (cacheKeys.length) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  },
};
