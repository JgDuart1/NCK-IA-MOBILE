import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DragonReservation } from '@/types';
import { Card, Button } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';
import { PERIOD_CONFIG } from '@/utils/caverna';

interface NextReservationProps {
  reservation: DragonReservation;
  onPress: () => void;
}

export function NextReservation({ reservation, onPress }: NextReservationProps) {
  const period = PERIOD_CONFIG[reservation.period];

  return (
    <Card padding={spacing.md}>
      <View style={styles.header}>
        <Text style={styles.title}>Proxima reserva</Text>
        <Text style={styles.date}>{formatDate(reservation.date)}</Text>
      </View>

      <Text style={styles.period}>{period.label}</Text>
      <Text style={styles.time}>{period.time}</Text>

      <View style={styles.button}>
        <Button variant="outline" size="sm" onPress={onPress}>
          Ver detalhes
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  date: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  period: {
    ...typography.h4,
    color: darkTheme.primary,
    marginTop: spacing.sm,
  },
  time: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  button: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
});
