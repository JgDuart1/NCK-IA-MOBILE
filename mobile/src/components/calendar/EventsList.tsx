import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Event } from '@/types';
import { EventCard } from './EventCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface EventsListProps {
  events: Event[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEventPress: (eventId: string) => void;
}

export function EventsList({ events, isLoading, isError, onRetry, onEventPress }: EventsListProps) {
  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator color={darkTheme.primary} />
      </View>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!events.length) {
    return (
      <EmptyState
        title="Sem eventos"
        description="Nao ha eventos para esta data."
        icon="calendar-outline"
      />
    );
  }

  return (
    <View style={styles.list}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} onPress={onEventPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  stateContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
