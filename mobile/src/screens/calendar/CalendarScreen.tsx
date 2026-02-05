import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import {
  CalendarHeader,
  CalendarGrid,
  EventsList,
  MeetingRequestCard,
} from '@/components/calendar';
import { Button } from '@/components/ui/Button';
import { useEventsByMonth, useEventsByDay } from '@/hooks/use-events';
import { useMeetingRequests } from '@/hooks/use-meeting-requests';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CalendarScreenProps } from '@/navigation/types';

type Props = CalendarScreenProps<'Calendar'>;

export function CalendarScreen({ route, navigation }: Props) {
  const projectId = route.params?.projectId;
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [filterByProject, setFilterByProject] = useState(!!projectId);

  const activeProjectId = filterByProject ? projectId : undefined;

  const monthEventsQuery = useEventsByMonth(year, month, activeProjectId);
  const dayEventsQuery = useEventsByDay(selectedDate, activeProjectId);
  const meetingRequestsQuery = useMeetingRequests();

  const pendingRequests = useMemo(() => {
    return (meetingRequestsQuery.data ?? []).filter((request) => request.status === 'PENDING');
  }, [meetingRequestsQuery.data]);

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <CalendarHeader year={year} month={month} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />

        {projectId ? (
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Filtro</Text>
            <View style={styles.filterButtons}>
              <Pressable
                style={[styles.filterButton, !filterByProject && styles.filterButtonActive]}
                onPress={() => setFilterByProject(false)}
              >
                <Text style={styles.filterButtonText}>Todos</Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterByProject && styles.filterButtonActive]}
                onPress={() => setFilterByProject(true)}
              >
                <Text style={styles.filterButtonText}>Projeto</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <CalendarGrid
          year={year}
          month={month}
          events={monthEventsQuery.data ?? []}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos do dia</Text>
          <EventsList
            events={dayEventsQuery.data ?? []}
            isLoading={dayEventsQuery.isLoading}
            isError={dayEventsQuery.isError}
            onRetry={dayEventsQuery.refetch}
            onEventPress={(eventId) => navigation.navigate('EventDetail', { eventId })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting requests</Text>
          {meetingRequestsQuery.isLoading ? (
            <Text style={styles.helperText}>Carregando solicitacoes...</Text>
          ) : null}
          {!meetingRequestsQuery.isLoading && !pendingRequests.length ? (
            <Text style={styles.helperText}>Nenhuma solicitacao pendente.</Text>
          ) : null}
          <View style={styles.list}>
            {pendingRequests.map((request) => (
              <MeetingRequestCard
                key={request.id}
                request={request}
                onPress={(requestId) => navigation.navigate('MeetingRequestDetail', { requestId })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.fab}>
        <Button
          variant="primary"
          onPress={() =>
            navigation.navigate('EventNew', {
              date: selectedDate ?? undefined,
              projectId,
            })
          }
          leftIcon={<Ionicons name="add" size={24} color="#fff" />}
        >
          Novo evento
        </Button>
      </View>
    </SafeAreaView>
  );
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 100,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: darkTheme.text,
  },
  helperText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  list: {
    gap: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  filterRow: {
    gap: spacing.sm,
  },
  filterLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: darkTheme.surface,
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.xs,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: darkTheme.primary,
  },
  filterButtonText: {
    ...typography.caption,
    color: darkTheme.text,
  },
});
