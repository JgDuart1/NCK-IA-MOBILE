import React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[`variant_${variant}`], style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    backgroundColor: darkTheme.surfaceSecondary,
  },
  text: {
    ...typography.caption,
    color: darkTheme.text,
  },
  variant_default: {
    backgroundColor: darkTheme.surfaceSecondary,
  },
  variant_success: {
    backgroundColor: colors.success,
  },
  variant_warning: {
    backgroundColor: colors.warning,
  },
  variant_error: {
    backgroundColor: colors.error,
  },
  variant_info: {
    backgroundColor: colors.info,
  },
});
