import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '@/theme';
import { Sprint } from '@/types';

const STATUS_CONFIG: Record<Sprint['status'], { label: string; color: string }> = {
  PLANNING: { label: 'Planejando', color: '#6B7280' },
  PLANNED: { label: 'Planejada', color: '#3B82F6' },
  ACTIVE: { label: 'Ativa', color: '#10B981' },
  COMPLETED: { label: 'Concluida', color: '#8B5CF6' },
  CANCELLED: { label: 'Cancelada', color: '#EF4444' },
};

interface SprintStatusBadgeProps {
  status: Sprint['status'];
}

export function SprintStatusBadge({ status }: SprintStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Text style={styles.text}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  text: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
});
