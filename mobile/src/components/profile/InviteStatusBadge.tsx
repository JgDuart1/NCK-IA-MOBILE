import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '@/theme';
import { InviteStatus } from '@/services/api/users.api';

const STATUS_CONFIG: Record<InviteStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: '#F59E0B' },
  ACCEPTED: { label: 'Aceito', color: '#10B981' },
  EXPIRED: { label: 'Expirado', color: '#6B7280' },
};

interface InviteStatusBadgeProps {
  status: InviteStatus;
}

export function InviteStatusBadge({ status }: InviteStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}
    >
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
