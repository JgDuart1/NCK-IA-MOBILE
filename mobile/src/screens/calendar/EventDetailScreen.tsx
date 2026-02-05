import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AttendeesList, EventTypeBadge } from '@/components/calendar';
import { Button } from '@/components/ui/Button';
import { useDeleteEvent, useEvent } from '@/hooks/use-events';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CalendarScreenProps } from '@/navigation/types';

const LABELS: Record<string, string> = {
  start: 'Inicio',
  end: 'Fim',
  location: 'Local',
  meeting: 'Link de reuniao',
  project: 'Projeto',
};

type Props = CalendarScreenProps<'EventDetail'>;

export function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const { data: event, isLoading, isError, refetch } = useEvent(eventId);
  const deleteEvent = useDeleteEvent();

  const handleDelete = () => {
    Alert.alert('Excluir evento', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent.mutateAsync(eventId);
            navigation.goBack();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel excluir o evento.');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Text style={styles.helperText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !event) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Text style={styles.helperText}>Erro ao carregar evento.</Text>
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
          <Text style={styles.title}>{event.title}</Text>
          <EventTypeBadge type={event.type} />
        </View>

        {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{LABELS.start}</Text>
          <Text style={styles.infoValue}>{formatDateTime(event.start_at)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{LABELS.end}</Text>
          <Text style={styles.infoValue}>{formatDateTime(event.end_at)}</Text>
        </View>

        {event.location ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{LABELS.location}</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>
        ) : null}

        {event.meeting_url ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{LABELS.meeting}</Text>
            <Text style={styles.link} onPress={() => Linking.openURL(event.meeting_url ?? '')}>
              {event.meeting_url}
            </Text>
          </View>
        ) : null}

        {event.project_id ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{LABELS.project}</Text>
            <Text style={styles.infoValue}>{event.project_id}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participantes</Text>
          <AttendeesList attendees={event.attendees} />
        </View>

        <View style={styles.actions}>
          <Button variant="outline" onPress={() => navigation.navigate('EventEdit', { eventId })}>
            Editar
          </Button>
          <Button variant="danger" onPress={handleDelete} loading={deleteEvent.isPending}>
            Excluir
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
  link: {
    ...typography.bodySmall,
    color: darkTheme.primary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: darkTheme.text,
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
