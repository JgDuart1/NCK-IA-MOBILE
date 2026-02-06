import React from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { InviteCard } from '@/components/profile';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useInvites, useResendInvite, useCancelInvite } from '@/hooks/use-invites';
import { Invite } from '@/services/api/users.api';
import { darkTheme, spacing } from '@/theme';

export function PendingInvitesScreen() {
  const { data, isLoading, isError, refetch, isFetching } = useInvites();
  const resendInvite = useResendInvite();
  const cancelInvite = useCancelInvite();

  const invites = data ?? [];

  const handleResend = async (invite: Invite) => {
    try {
      await resendInvite.mutateAsync(invite.id);
      Toast.show({
        type: 'success',
        text1: 'Convite reenviado',
        text2: `Convite para ${invite.email} reenviado.`,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nao foi possivel reenviar o convite';
      Toast.show({
        type: 'error',
        text1: 'Erro ao reenviar',
        text2: message,
      });
    }
  };

  const handleCancel = (invite: Invite) => {
    Alert.alert('Cancelar convite', `Deseja cancelar o convite para ${invite.email}?`, [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar convite',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelInvite.mutateAsync(invite.id);
            Toast.show({
              type: 'success',
              text1: 'Convite cancelado',
              text2: `Convite para ${invite.email} cancelado.`,
            });
          } catch (err: any) {
            const message = err.response?.data?.message || 'Nao foi possivel cancelar o convite';
            Toast.show({
              type: 'error',
              text1: 'Erro ao cancelar',
              text2: message,
            });
          }
        },
      },
    ]);
  };

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        contentContainerStyle={styles.content}
        data={invites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const canResend = item.status === 'PENDING' || item.status === 'EXPIRED';
          const canCancel = item.status === 'PENDING';

          return (
            <InviteCard
              invite={item}
              onResend={canResend ? () => handleResend(item) : undefined}
              onCancel={canCancel ? () => handleCancel(item) : undefined}
              isLoadingResend={resendInvite.isPending}
              isLoadingCancel={cancelInvite.isPending}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState title="Nenhum convite" description="Ainda nao ha convites pendentes." />
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={darkTheme.primary}
          />
        }
      />
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
  },
});
