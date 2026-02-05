import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { darkTheme, spacing, typography } from '@/theme';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  content: {
    gap: spacing.sm,
  },
});
