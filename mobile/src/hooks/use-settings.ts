import { useEffect, useState } from 'react';

import { asyncStorage } from '@/services/storage';

interface AppSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  pushEnabled: true,
  soundEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await asyncStorage.get<AppSettings>('settings');
    if (saved) {
      setSettings(saved);
    }
    setIsLoading(false);
  };

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await asyncStorage.set('settings', newSettings);
  };

  return {
    settings,
    isLoading,
    updateSetting,
  };
}
