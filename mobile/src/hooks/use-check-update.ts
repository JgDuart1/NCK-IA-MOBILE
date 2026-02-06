import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

const DOWNLOAD_BASE_URL = 'https://download.nckia.com.br';
const UPDATE_URL = `${DOWNLOAD_BASE_URL}/latest.json`;

interface LatestVersion {
  version: string;
  versionCode: number;
  filename: string;
  releaseDate: string;
  changelog: string;
  minAndroidVersion: string;
  fileSize: string;
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((partsA[i] ?? 0) > (partsB[i] ?? 0)) return 1;
    if ((partsA[i] ?? 0) < (partsB[i] ?? 0)) return -1;
  }
  return 0;
}

async function checkForUpdate(): Promise<void> {
  try {
    const response = await fetch(UPDATE_URL);
    const latest: LatestVersion = await response.json();
    const currentVersion = Constants.expoConfig?.version ?? '0.0.0';

    if (compareVersions(latest.version, currentVersion) > 0) {
      Alert.alert(
        'Atualização Disponível',
        `Versão ${latest.version} está disponível.\n\n${latest.changelog}`,
        [
          { text: 'Depois', style: 'cancel' },
          {
            text: 'Atualizar',
            onPress: () => Linking.openURL(`${DOWNLOAD_BASE_URL}/${latest.filename}`),
          },
        ],
      );
    }
  } catch {
    // Silently fail - user can check manually
  }
}

export function useCheckUpdate(): void {
  useEffect(() => {
    checkForUpdate();
  }, []);
}
