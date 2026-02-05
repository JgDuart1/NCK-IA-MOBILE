import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvailabilityCalendar, NextReservation, TicketBalance } from '@/components/caverna';
import { Button, Card } from '@/components/ui';
import { useCavernaAvailability, useCavernaSettings, useNextReservation } from '@/hooks/use-caverna';
import { MoreScreenProps } from '@/navigation/types';
import { addDays, toISODate } from '@/utils/caverna';
import { darkTheme, spacing, typography } from '@/theme';

type Props = MoreScreenProps<'CavernaHome'>;

export function CavernaHomeScreen({ navigation }: Props) {
  const nextReservation = useNextReservation();
  const { data: settings } = useCavernaSettings();

  const advanceDays = settings?.advance_days ?? 7;
  const startDate = toISODate(new Date());
  const endDate = toISODate(addDays(new Date(), advanceDays));
  const availabilityQuery = useCavernaAvailability(startDate, endDate);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {settings && !settings.enabled ? (
          <Card padding={spacing.md}>
            <Text style={styles.disabledTitle}>Sistema desativado</Text>
            <Text style={styles.disabledText}>
              As reservas da Caverna do Dragao estao temporariamente indisponiveis.
            </Text>
          </Card>
        ) : null}

        <TicketBalance />

        {nextReservation ? (
          <NextReservation
            reservation={nextReservation}
            onPress={() =>
              navigation.navigate('ReservationDetail', { reservationId: nextReservation.id })
            }
          />
        ) : null}

        <AvailabilityCalendar
          availability={availabilityQuery.data}
          isLoading={availabilityQuery.isLoading}
          isError={availabilityQuery.isError}
          onRetry={availabilityQuery.refetch}
        />

        <View style={styles.actions}>
          <Button
            variant="primary"
            onPress={() => navigation.navigate('CavernaReservar')}
            fullWidth
          >
            Nova reserva
          </Button>
          <Button
            variant="outline"
            onPress={() => navigation.navigate('CavernaMinhasReservas')}
            fullWidth
          >
            Minhas reservas
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
  disabledTitle: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  disabledText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
