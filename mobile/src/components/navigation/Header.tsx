import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { darkTheme } from '@/theme';
import { spacing } from '@/theme';
import { typography } from '@/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: darkTheme.surface,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
});
