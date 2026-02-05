import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MeetingRequest } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  onPress?: (id: string) => void;
}

export function MeetingRequestCard({ request, onPress }: MeetingRequestCardProps) {
  const start = new Date(request.proposed_start_at);
  const end = new Date(request.proposed_end_at);

  return (
    <Pressable onPress={() => onPress?.(request.id)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{request.title}</Text>
          <Badge label={formatStatus(request.status)} variant={statusVariant(request.status)} />
        </View>
        <Text style={styles.meta}>
          {formatDate(start)} {formatTime(start)} - {formatTime(end)}
        </Text>
        <Text style={styles.meta}>Proponente: {request.creator?.name ?? 'N/A'}</Text>
      </Card>
    </Pressable>
  );
}

function statusVariant(status: MeetingRequest['status']) {
  switch (status) {
    case 'ACCEPTED':
      return 'success';
    case 'DECLINED':
      return 'error';
    case 'RESCHEDULED':
      return 'warning';
    default:
      return 'info';
  }
}

function formatStatus(status: MeetingRequest['status']) {
  switch (status) {
    case 'ACCEPTED':
      return 'Aceito';
    case 'DECLINED':
      return 'Recusado';
    case 'RESCHEDULED':
      return 'Reagendar';
    default:
      return 'Pendente';
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
    flex: 1,
  },
  meta: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
