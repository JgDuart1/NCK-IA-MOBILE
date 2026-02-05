import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  useAcceptMeetingRequest,
  useDeclineMeetingRequest,
  useMeetingRequest,
} from '@/hooks/use-meeting-requests';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CalendarScreenProps } from '@/navigation/types';

const STATUS_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  PENDING: 'info',
  ACCEPTED: 'success',
  DECLINED: 'error',
  RESCHEDULED: 'warning',
};

type Props = CalendarScreenProps<'MeetingRequestDetail'>;

export function MeetingRequestDetailScreen({ route, navigation }: Props) {
  const { requestId } = route.params;
  const { data: request, isLoading, isError, refetch } = useMeetingRequest(requestId);
  const acceptMutation = useAcceptMeetingRequest();
  const declineMutation = useDeclineMeetingRequest();

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(requestId);
      Alert.alert('Solicitacao aceita', 'O evento foi criado.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel aceitar a solicitacao.');
    }
  };

  const handleDecline = async () => {
    try {
      await declineMutation.mutateAsync(requestId);
      Alert.alert('Solicitacao recusada', 'A resposta foi enviada.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel recusar a solicitacao.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Text style={styles.helperText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !request) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Text style={styles.helperText}>Erro ao carregar solicitacao.</Text>
        <Button variant="outline" onPress={refetch}>
          Tentar novamente
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{request.title}</Text>
          <Badge
            label={request.status}
            variant={STATUS_VARIANTS[request.status] ?? 'default'}
          />
        </View>

        {request.description ? <Text style={styles.description}>{request.description}</Text> : null}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Proponente</Text>
          <Text style={styles.infoValue}>{request.creator?.name ?? 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Horario proposto</Text>
          <Text style={styles.infoValue}>
            {formatDateTime(request.proposed_start_at)} - {formatDateTime(request.proposed_end_at)}
          </Text>
        </View>

        {request.location ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Local</Text>
            <Text style={styles.infoValue}>{request.location}</Text>
          </View>
        ) : null}

        {request.meeting_url ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Link</Text>
            <Text style={styles.infoValue}>{request.meeting_url}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destinatarios</Text>
          <View style={styles.recipients}>
            {request.recipients.map((recipient) => (
              <View key={recipient.id} style={styles.recipientRow}>
                <Text style={styles.infoValue}>{recipient.user.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={handleDecline}
            loading={declineMutation.isPending}
          >
            Recusar
          </Button>
          <Button onPress={handleAccept} loading={acceptMutation.isPending}>
            Aceitar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
  },
  description: {
    ...typography.body,
    color: darkTheme.textSecondary,
  },
  infoRow: {
    gap: spacing.xs,
  },
  infoLabel: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  infoValue: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: darkTheme.text,
  },
  recipients: {
    gap: spacing.sm,
  },
  recipientRow: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: darkTheme.surface,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  helperText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    padding: spacing.md,
  },
});
