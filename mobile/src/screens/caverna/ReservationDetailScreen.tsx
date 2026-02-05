import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckinButton } from '@/components/caverna';
import { Badge, Button, Card, Skeleton } from '@/components/ui';
import { useCancelReservation, useCheckin, useMyReservations } from '@/hooks/use-caverna';
import { MoreScreenProps } from '@/navigation/types';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';
import {
  PERIOD_CONFIG,
  RESERVATION_STATUS_CONFIG,
  canCheckin,
  isFutureOrToday,
} from '@/utils/caverna';
import { toast } from '@/components/ui/Toast';

type Props = MoreScreenProps<'ReservationDetail'>;

export function ReservationDetailScreen({ route, navigation }: Props) {
  const { reservationId } = route.params;
  const { data, isLoading, isError, refetch } = useMyReservations();
  const checkin = useCheckin();
  const cancelReservation = useCancelReservation();

  const reservation = data?.find((item) => item.id === reservationId);

  const handleCheckin = async () => {
    if (!reservation) return;
    try {
      await checkin.mutateAsync(reservation.id);
      toast.show({
        type: 'success',
        text1: 'Check-in confirmado',
        text2: 'Boa experiencia na Caverna do Dragao!',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Nao foi possivel fazer o check-in.';
      toast.show({ type: 'error', text1: 'Erro no check-in', text2: message });
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    Alert.alert('Cancelar reserva', 'Deseja cancelar esta reserva?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelReservation.mutateAsync(reservation.id);
            toast.show({
              type: 'success',
              text1: 'Reserva cancelada',
              text2: 'Seu ticket foi devolvido.',
            });
            navigation.goBack();
          } catch (error: any) {
            const message =
              error?.response?.data?.message || 'Nao foi possivel cancelar a reserva.';
            toast.show({ type: 'error', text1: 'Erro ao cancelar', text2: message });
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loading}>
          <Skeleton height={160} borderRadius={12} />
          <Skeleton height={120} borderRadius={12} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !reservation) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Card padding={spacing.md} style={styles.errorCard}>
          <Text style={styles.errorText}>Nao foi possivel carregar esta reserva.</Text>
          <Button variant="outline" onPress={() => refetch()}>
            Tentar novamente
          </Button>
        </Card>
      </SafeAreaView>
    );
  }

  const statusConfig = RESERVATION_STATUS_CONFIG[reservation.status];
  const periodConfig = PERIOD_CONFIG[reservation.period];
  const canCancel = reservation.status === 'CONFIRMED' && isFutureOrToday(reservation.date);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card padding={spacing.md} style={styles.detailCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Detalhes da reserva</Text>
            <Badge label={statusConfig.label} style={{ backgroundColor: statusConfig.color }} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{formatDate(reservation.date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Periodo</Text>
            <Text style={styles.value}>{periodConfig.label}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Horario</Text>
            <Text style={styles.value}>{periodConfig.time}</Text>
          </View>
        </Card>

        {reservation.status === 'CONFIRMED' ? (
          <CheckinButton
            enabled={canCheckin(reservation.date, reservation.period)}
            loading={checkin.isPending}
            onPress={handleCheckin}
          />
        ) : null}

        {canCancel ? (
          <Button variant="danger" onPress={handleCancel} fullWidth>
            Cancelar reserva
          </Button>
        ) : null}
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
  detailCard: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  value: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  loading: {
    padding: spacing.md,
    gap: spacing.md,
  },
  errorCard: {
    margin: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
