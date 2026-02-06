import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Event } from '@/types';
import { Card } from '@/components/ui/Card';
import { EventTypeBadge } from './EventTypeBadge';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface EventCardProps {
  event: Event;
  onPress?: (eventId: string) => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);

  const timeLabel = event.is_all_day ? 'Dia inteiro' : `${formatTime(start)} - ${formatTime(end)}`;

  return (
    <Pressable onPress={() => onPress?.(event.id)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <EventTypeBadge type={event.type} />
        </View>
        <Text style={styles.time}>{timeLabel}</Text>
        {event.location ? <Text style={styles.meta}>{event.location}</Text> : null}
        {event.description ? <Text style={styles.description}>{event.description}</Text> : null}
      </Card>
    </Pressable>
  );
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
    flex: 1,
  },
  time: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  meta: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textMuted,
  },
});
