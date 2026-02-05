import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DragonReservation } from '@/types';
import { Badge, Button, Card } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';
import { PERIOD_CONFIG, RESERVATION_STATUS_CONFIG, isFutureOrToday } from '@/utils/caverna';

interface ReservationCardProps {
  reservation: DragonReservation;
  onPress?: () => void;
  onCancel?: () => void;
}

export function ReservationCard({ reservation, onPress, onCancel }: ReservationCardProps) {
  const statusConfig = RESERVATION_STATUS_CONFIG[reservation.status];
  const periodConfig = PERIOD_CONFIG[reservation.period];
  const canCancel = reservation.status === 'CONFIRMED' && isFutureOrToday(reservation.date);

  return (
    <Card padding={spacing.md}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
        disabled={!onPress}
        style={styles.cardContent}
      >
        <View style={styles.header}>
          <Text style={styles.date}>{formatDate(reservation.date)}</Text>
          <Badge label={statusConfig.label} style={{ backgroundColor: statusConfig.color }} />
        </View>
        <Text style={styles.period}>{periodConfig.label}</Text>
        <Text style={styles.time}>{periodConfig.time}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        {onPress ? (
          <Button variant="outline" size="sm" onPress={onPress}>
            Ver detalhes
          </Button>
        ) : null}
        {canCancel && onCancel ? (
          <Button variant="danger" size="sm" onPress={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  period: {
    ...typography.h4,
    color: darkTheme.primary,
  },
  time: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
