import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '@/types';
import { spacing } from '@/theme/spacing';

interface EventTypeBadgeProps {
  type: Event['type'];
}

const TYPE_CONFIG: Record<
  Event['type'],
  { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }
> = {
  MEETING: { icon: 'videocam', color: '#3B82F6', label: 'Reuniao' },
  DEADLINE: { icon: 'flag', color: '#EF4444', label: 'Prazo' },
  MILESTONE: { icon: 'trophy', color: '#F59E0B', label: 'Marco' },
  REMINDER: { icon: 'alarm', color: '#8B5CF6', label: 'Lembrete' },
  DELIVERY: { icon: 'cube', color: '#10B981', label: 'Entrega' },
  OTHER: { icon: 'ellipsis-horizontal', color: '#6B7280', label: 'Outro' },
};

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
  const config = TYPE_CONFIG[type];

  return (
    <View style={[styles.container, { backgroundColor: config.color }]}>
      <Ionicons name={config.icon} size={12} color="#fff" />
      <Text style={styles.text}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
