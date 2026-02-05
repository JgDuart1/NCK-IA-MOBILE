import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface ProfileInfoProps {
  label: string;
  value?: string | null;
}

export function ProfileInfo({ label, value }: ProfileInfoProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  value: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
});
