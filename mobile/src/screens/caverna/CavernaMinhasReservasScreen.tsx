import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReservationCard } from '@/components/caverna';
import { Button, Card, Skeleton } from '@/components/ui';
import { useCancelReservation, useMyReservations } from '@/hooks/use-caverna';
import { MoreScreenProps } from '@/navigation/types';
import { darkTheme, spacing, typography } from '@/theme';
import { toISODate } from '@/utils/caverna';
import { toast } from '@/components/ui/Toast';
import { DragonReservation } from '@/types';

type Props = MoreScreenProps<'CavernaMinhasReservas'>;

export function CavernaMinhasReservasScreen({ navigation }: Props) {
  const { data, isLoading, isError, refetch, isFetching } = useMyReservations();
  const cancelReservation = useCancelReservation();

  const today = toISODate(new Date());
  const upcoming = (data || []).filter(
    (reservation) => reservation.status === 'CONFIRMED' && reservation.date >= today
  );
  const history = (data || []).filter(
    (reservation) => reservation.status !== 'CONFIRMED' || reservation.date < today
  );

  const handleCancel = (reservation: DragonReservation) => {
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
          } catch (error: any) {
            const message =
              error?.response?.data?.message || 'Nao foi possivel cancelar a reserva.';
            toast.show({
              type: 'error',
              text1: 'Erro ao cancelar',
              text2: message,
            });
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loading}>
          <Skeleton height={120} borderRadius={12} />
          <Skeleton height={120} borderRadius={12} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Card padding={spacing.md} style={styles.errorCard}>
          <Text style={styles.errorText}>Nao foi possivel carregar suas reservas.</Text>
          <Button variant="outline" onPress={() => refetch()}>
            Tentar novamente
          </Button>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proximas reservas</Text>
          {upcoming.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma reserva futura encontrada.</Text>
          ) : (
            upcoming.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onPress={() =>
                  navigation.navigate('ReservationDetail', { reservationId: reservation.id })
                }
                onCancel={() => handleCancel(reservation)}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historico</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma reserva no historico.</Text>
          ) : (
            history.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onPress={() =>
                  navigation.navigate('ReservationDetail', { reservationId: reservation.id })
                }
              />
            ))
          )}
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
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  emptyText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
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
