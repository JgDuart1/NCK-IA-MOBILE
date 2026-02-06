import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, darkTheme, spacing, typography } from '@/theme';

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
    <Container style={styles.container} onPress={onPress} disabled={toggle}>
      <View style={styles.left}>
        <View style={[styles.iconContainer, danger && styles.iconDanger]}>
          <Ionicons name={icon} size={20} color={danger ? colors.error : darkTheme.primary} />
        </View>
        <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
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
          {value ? <Text style={styles.value}>{value}</Text> : null}
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
    backgroundColor: `${colors.error}20`,
  },
  label: {
    ...typography.body,
    color: darkTheme.text,
  },
  labelDanger: {
    color: colors.error,
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
