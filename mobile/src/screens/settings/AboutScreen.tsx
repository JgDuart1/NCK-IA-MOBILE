import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { AppInfo, LinkItem } from '@/components/settings';
import { colors, darkTheme, spacing, typography } from '@/theme';

const SITE_URL = 'https://nckia.com.br';
const TERMS_URL = 'https://nckia.com.br/termos';
const PRIVACY_URL = 'https://nckia.com.br/privacidade';
const SUPPORT_EMAIL = 'mailto:suporte@nckia.com.br';

export function AboutScreen() {
  const version = Constants.expoConfig?.version || '1.0.0';
  const buildRaw =
    Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode ?? '1';
  const buildNumber = String(buildRaw);

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NCK IA</Text>
        </View>
        <AppInfo name="NCK IA Mobile" version={version} build={buildNumber} />
      </View>

      <View style={styles.links}>
        <LinkItem icon="globe-outline" label="Site oficial" onPress={() => openUrl(SITE_URL)} />
        <LinkItem
          icon="document-text-outline"
          label="Termos de uso"
          onPress={() => openUrl(TERMS_URL)}
        />
        <LinkItem
          icon="shield-checkmark-outline"
          label="Política de privacidade"
          onPress={() => openUrl(PRIVACY_URL)}
        />
        <LinkItem icon="mail-outline" label="Contato" onPress={() => openUrl(SUPPORT_EMAIL)} />
      </View>

      <Text style={styles.footer}>© 2026 NCK IA. Todos os direitos reservados.</Text>
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
    gap: spacing.md,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: darkTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...typography.h3,
    color: colors.neutral[50],
    fontWeight: '700',
  },
  links: {
    gap: spacing.sm,
  },
  footer: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
});
