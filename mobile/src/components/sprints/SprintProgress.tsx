import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface SprintProgressProps {
  done: number;
  total: number;
}

export function SprintProgress({ done, total }: SprintProgressProps) {
  const percent = total > 0 ? Math.min(1, done / total) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        {done}/{total} concluidas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  track: {
    height: 8,
    backgroundColor: darkTheme.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: darkTheme.primary,
    borderRadius: 999,
  },
  label: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
