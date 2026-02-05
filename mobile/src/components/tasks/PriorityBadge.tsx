import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

const PRIORITY_COLORS = {
  LOW: '#6B7280',
  MEDIUM: '#3B82F6',
  HIGH: '#F59E0B',
  URGENT: '#EF4444',
} as const;

const PRIORITY_LABELS = {
  LOW: 'Baixa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
} as const;

interface PriorityBadgeProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  size?: 'sm' | 'md';
  active?: boolean;
}

export function PriorityBadge({ priority, size = 'md', active = false }: PriorityBadgeProps) {
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: PRIORITY_COLORS[priority] },
        size === 'sm' ? styles.sm : styles.md,
        active ? styles.active : null,
      ]}
    >
      <Text style={[styles.text, size === 'sm' ? styles.textSm : styles.textMd]}>
        {PRIORITY_LABELS[priority]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sm: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.caption,
    color: darkTheme.text,
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
  active: {
    borderWidth: 1,
    borderColor: darkTheme.text,
  },
});
