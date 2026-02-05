import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color?: string;
  isLoading?: boolean;
}

export function MetricCard({
  icon,
  value,
  label,
  color = darkTheme.primary,
  isLoading,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={50} height={24} style={{ marginTop: 8 }} />
        <Skeleton width={70} height={16} style={{ marginTop: 4 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: 110,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...typography.h2,
    color: darkTheme.text,
    marginTop: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
