# Plano 14: Configurações - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/14-configuracoes`
- **Timeout**: 1 hora
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── settings/
│       ├── SettingsScreen.tsx
│       ├── AboutScreen.tsx
│       └── index.ts
│
├── components/
│   └── settings/
│       ├── SettingsSection.tsx
│       ├── SettingsItem.tsx
│       ├── SettingsToggle.tsx
│       ├── CacheInfo.tsx
│       ├── AppInfo.tsx
│       ├── LinkItem.tsx
│       └── index.ts
│
├── services/
│   └── cache/
│       └── cache.service.ts
│
└── hooks/
    └── use-settings.ts
```

---

## Implementações

### 1. Cache Service (src/services/cache/cache.service.ts)

```typescript
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';

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
    // Clear React Query cache
    queryClient.clear();

    // Clear file system cache
    const cacheDir = FileSystem.cacheDirectory;
    if (cacheDir) {
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      await Promise.all(
        files.map((file) => 
          FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true })
        )
      );
    }

    // Clear AsyncStorage cache (keep tokens and settings)
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      (key) => key.startsWith('@nckia:cache:')
    );
    await AsyncStorage.multiRemove(cacheKeys);
  },
};
```

### 2. useSettings Hook (src/hooks/use-settings.ts)

```typescript
import { useState, useEffect } from 'react';
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

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
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
```

### 3. SettingsItem Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme, spacing, typography } from '@/theme';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  danger?: boolean;
}

export function SettingsItem({
  icon,
  label,
  value,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  danger,
}: SettingsItemProps) {
  const Container = toggle ? View : TouchableOpacity;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      disabled={toggle}
    >
      <View style={styles.left}>
        <View style={[styles.iconContainer, danger && styles.iconDanger]}>
          <Ionicons
            name={icon}
            size={20}
            color={danger ? '#EF4444' : darkTheme.primary}
          />
        </View>
        <Text style={[styles.label, danger && styles.labelDanger]}>
          {label}
        </Text>
      </View>

      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: darkTheme.surfaceSecondary, true: darkTheme.primary }}
          thumbColor="#fff"
        />
      ) : (
        <View style={styles.right}>
          {value && <Text style={styles.value}>{value}</Text>}
          <Ionicons name="chevron-forward" size={20} color={darkTheme.textSecondary} />
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${darkTheme.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDanger: {
    backgroundColor: '#EF444420',
  },
  label: {
    ...typography.body,
    color: darkTheme.text,
  },
  labelDanger: {
    color: '#EF4444',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
```

### 4. SettingsScreen

```typescript
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { SettingsSection, SettingsItem, CacheInfo } from '@/components/settings';
import { useSettings } from '@/hooks/use-settings';
import { useAuth } from '@/hooks/use-auth';
import { cacheService } from '@/services/cache/cache.service';
import { darkTheme, spacing } from '@/theme';

export function SettingsScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { settings, updateSetting } = useSettings();
  const [cacheSize, setCacheSize] = useState('...');
  const [isClearing, setIsClearing] = useState(false);

  React.useEffect(() => {
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
            await cacheService.clearCache(queryClient);
            await loadCacheSize();
            setIsClearing(false);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
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
          <SettingsItem
            icon="folder-outline"
            label="Cache"
            value={isClearing ? 'Limpando...' : cacheSize}
            onPress={handleClearCache}
          />
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
            onPress={() => {/* Open URL */}}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Política de privacidade"
            onPress={() => {/* Open URL */}}
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsItem
            icon="log-out-outline"
            label="Sair da conta"
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
```

### 5. AboutScreen

```typescript
import React from 'react';
import { View, Text, StyleSheet, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { LinkItem } from '@/components/settings';
import { darkTheme, spacing, typography } from '@/theme';

export function AboutScreen() {
  const version = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || 
                      Constants.expoConfig?.android?.versionCode || 
                      '1';

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NCK IA</Text>
        </View>
        <Text style={styles.appName}>NCK IA Mobile</Text>
        <Text style={styles.version}>Versão {version} ({buildNumber})</Text>
      </View>

      <View style={styles.links}>
        <LinkItem
          icon="globe-outline"
          label="Site oficial"
          onPress={() => openUrl('https://nckia.com.br')}
        />
        <LinkItem
          icon="document-text-outline"
          label="Termos de uso"
          onPress={() => openUrl('https://nckia.com.br/termos')}
        />
        <LinkItem
          icon="shield-checkmark-outline"
          label="Política de privacidade"
          onPress={() => openUrl('https://nckia.com.br/privacidade')}
        />
        <LinkItem
          icon="mail-outline"
          label="Contato"
          onPress={() => openUrl('mailto:suporte@nckia.com.br')}
        />
      </View>

      <Text style={styles.copyright}>
        © 2026 NCK IA. Todos os direitos reservados.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: darkTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.h3,
    color: '#fff',
    fontWeight: '700',
  },
  appName: {
    ...typography.h2,
    color: darkTheme.text,
  },
  version: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
  links: {
    gap: spacing.sm,
  },
  copyright: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Menu de configurações exibe corretamente
- [ ] Toggles funcionam
- [ ] Limpar cache funciona
- [ ] Sobre exibe informações corretas
- [ ] Links abrem corretamente
- [ ] Logout funciona

---

## Checklist de Entrega

- [ ] SettingsScreen implementada
- [ ] AboutScreen implementada
- [ ] Toggles de notificação
- [ ] Limpar cache funcionando
- [ ] Logout com confirmação
- [ ] Links externos funcionando
- [ ] Sem erros de TypeScript
