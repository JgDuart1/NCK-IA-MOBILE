import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvailabilityCalendar, PeriodSelector, TicketBalance } from '@/components/caverna';
import { Button, Card } from '@/components/ui';
import {
  useCavernaAvailability,
  useCavernaSettings,
  useCreateReservation,
  useMyTickets,
} from '@/hooks/use-caverna';
import { MoreScreenProps } from '@/navigation/types';
import { addDays, isPastDay, toISODate } from '@/utils/caverna';
import { darkTheme, spacing, typography } from '@/theme';
import { toast } from '@/components/ui/Toast';

type Props = MoreScreenProps<'CavernaReservar'>;

export function CavernaReservarScreen({ navigation }: Props) {
  const { data: settings } = useCavernaSettings();
  const { data: tickets } = useMyTickets();

  const advanceDays = settings?.advance_days ?? 7;
  const startDate = toISODate(new Date());
  const endDate = toISODate(addDays(new Date(), advanceDays));

  const availabilityQuery = useCavernaAvailability(startDate, endDate);
  const availability = availabilityQuery.data;
  const createReservation = useCreateReservation();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'MORNING' | 'AFTERNOON' | null>(null);

  const availableDays = useMemo(
    () =>
      availability?.filter(
        (day) =>
          !isPastDay(day.date) &&
          (day.morning.available > 0 || day.afternoon.available > 0)
      ) || [],
    [availability]
  );

  useEffect(() => {
    if (!selectedDate && availableDays.length > 0) {
      setSelectedDate(availableDays[0].date);
    }
  }, [availableDays, selectedDate]);

  const selectedDay = availability?.find((day) => day.date === selectedDate);
  const remainingTickets = tickets?.remaining_tickets ?? 0;
  const isDisabled =
    !selectedDate ||
    !selectedPeriod ||
    remainingTickets === 0 ||
    (settings && !settings.enabled) ||
    createReservation.isPending;

  const handleConfirm = async () => {
    if (!selectedDate || !selectedPeriod) return;
    try {
      const reservation = await createReservation.mutateAsync({
        date: selectedDate,
        period: selectedPeriod,
      });
      toast.show({
        type: 'success',
        text1: 'Reserva confirmada',
        text2: 'Seu ticket foi usado com sucesso.',
      });
      navigation.navigate('ReservationDetail', { reservationId: reservation.id });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Nao foi possivel criar a reserva.';
      toast.show({
        type: 'error',
        text1: 'Erro ao reservar',
        text2: message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <TicketBalance />

        {settings && !settings.enabled ? (
          <Card padding={spacing.md}>
            <Text style={styles.disabledTitle}>Sistema desativado</Text>
            <Text style={styles.disabledText}>
              As reservas da Caverna do Dragao estao indisponiveis no momento.
            </Text>
          </Card>
        ) : null}

        <AvailabilityCalendar
          availability={availability}
          isLoading={availabilityQuery.isLoading}
          isError={availabilityQuery.isError}
          onRetry={availabilityQuery.refetch}
          selectedDate={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedPeriod(null);
          }}
          title="Escolha o dia"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha o periodo</Text>
          <PeriodSelector
            morningAvailable={selectedDay?.morning.available ?? 0}
            afternoonAvailable={selectedDay?.afternoon.available ?? 0}
            selected={selectedPeriod}
            onSelect={setSelectedPeriod}
          />
        </View>

        {remainingTickets === 0 ? (
          <Text style={styles.warningText}>Voce nao possui tickets disponiveis.</Text>
        ) : null}

        <Button
          variant="primary"
          onPress={handleConfirm}
          disabled={isDisabled}
          loading={createReservation.isPending}
          fullWidth
        >
          Confirmar reserva
        </Button>
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
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  warningText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    textAlign: 'center',
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
