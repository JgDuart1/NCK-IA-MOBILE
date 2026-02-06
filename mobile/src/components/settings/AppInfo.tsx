import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { darkTheme, spacing, typography } from '@/theme';

interface AppInfoProps {
  name: string;
  version: string;
  build: string;
}

export function AppInfo({ name, version, build }: AppInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.version}>
        Versão {version} ({build})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: darkTheme.text,
  },
  version: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
