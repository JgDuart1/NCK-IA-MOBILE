import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMyTickets } from '@/hooks/use-caverna';
import { darkTheme, spacing, typography } from '@/theme';
import { Skeleton } from '@/components/ui';

export function TicketBalance() {
  const { data: tickets, isLoading } = useMyTickets();

  if (isLoading) {
    return <Skeleton height={80} borderRadius={12} />;
  }

  if (!tickets) return null;

  const percentage = tickets.total_tickets
    ? (tickets.used_tickets / tickets.total_tickets) * 100
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="ticket-outline" size={24} color={darkTheme.primary} />
        <Text style={styles.title}>Meus tickets</Text>
      </View>

      <View style={styles.balance}>
        <Text style={styles.remaining}>{tickets.remaining_tickets}</Text>
        <Text style={styles.total}>/ {tickets.total_tickets}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${100 - percentage}%` }]} />
      </View>

      <Text style={styles.hint}>
        {tickets.remaining_tickets > 0
          ? `Voce pode fazer ${tickets.remaining_tickets} reserva(s) esta semana`
          : 'Voce usou todos os tickets desta semana'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  remaining: {
    ...typography.h1,
    color: darkTheme.primary,
  },
  total: {
    ...typography.h3,
    color: darkTheme.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: darkTheme.surfaceSecondary,
    borderRadius: 3,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: darkTheme.primary,
    borderRadius: 3,
  },
  hint: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
