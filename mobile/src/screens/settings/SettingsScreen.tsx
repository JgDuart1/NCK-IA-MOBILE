import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { CacheInfo, SettingsItem, SettingsSection } from '@/components/settings';
import { useAuth } from '@/hooks/use-auth';
import { useSettings } from '@/hooks/use-settings';
import { MoreScreenProps } from '@/navigation/types';
import { cacheService } from '@/services/cache/cache.service';
import { darkTheme, spacing } from '@/theme';

const TERMS_URL = 'https://nckia.com.br/termos';
const PRIVACY_URL = 'https://nckia.com.br/privacidade';

type SettingsScreenProps = MoreScreenProps<'Settings'>;

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { settings, updateSetting } = useSettings();
  const [cacheSize, setCacheSize] = useState('...');
  const [isClearing, setIsClearing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadCacheSize();
  }, []);

  const loadCacheSize = async () => {
    const size = await cacheService.getCacheSize();
    setCacheSize(size);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá remover dados temporários. Você precisará recarregar algumas informações.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await cacheService.clearCache(queryClient);
              await loadCacheSize();
            } finally {
              setIsClearing(false);
            }
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await cacheService.clearCache(queryClient);
            await loadCacheSize();
          } finally {
            setIsLoggingOut(false);
            await logout();
          }
        },
      },
    ]);
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsSection title="Notificações">
          <SettingsItem
            icon="notifications-outline"
            label="Notificações push"
            toggle
            toggleValue={settings.pushEnabled}
            onToggle={(value) => updateSetting('pushEnabled', value)}
          />
          <SettingsItem
            icon="volume-medium-outline"
            label="Som de notificação"
            toggle
            toggleValue={settings.soundEnabled}
            onToggle={(value) => updateSetting('soundEnabled', value)}
          />
        </SettingsSection>

        <SettingsSection title="Armazenamento">
          <CacheInfo size={cacheSize} isClearing={isClearing} onClear={handleClearCache} />
        </SettingsSection>

        <SettingsSection title="Sobre">
          <SettingsItem
            icon="information-circle-outline"
            label="Sobre o app"
            onPress={() => navigation.navigate('About')}
          />
          <SettingsItem
            icon="document-text-outline"
            label="Termos de uso"
            onPress={() => openUrl(TERMS_URL)}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Política de privacidade"
            onPress={() => openUrl(PRIVACY_URL)}
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsItem
            icon="log-out-outline"
            label={isLoggingOut ? 'Saindo...' : 'Sair da conta'}
            onPress={handleLogout}
            danger
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
});
