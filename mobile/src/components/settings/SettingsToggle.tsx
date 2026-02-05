import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { darkTheme, spacing, typography } from '@/theme';

interface SettingsToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export function SettingsToggle({
  label,
  value,
  onValueChange,
  description,
  disabled,
}: SettingsToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: darkTheme.surfaceSecondary, true: darkTheme.primary }}
        thumbColor="#fff"
      />
    </View>
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
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
    gap: spacing.xs,
  },
  label: {
    ...typography.body,
    color: darkTheme.text,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
