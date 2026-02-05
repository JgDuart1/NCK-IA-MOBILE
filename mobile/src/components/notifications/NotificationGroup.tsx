import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface NotificationGroupProps {
  title: string;
  count?: number;
}

export function NotificationGroup({ title, count }: NotificationGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {typeof count === 'number' ? <Text style={styles.count}>{count}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  count: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
});
