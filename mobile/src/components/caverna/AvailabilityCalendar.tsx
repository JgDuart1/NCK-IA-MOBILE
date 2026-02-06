import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AvailabilityDay } from './AvailabilityDay';
import { Button, Card, Skeleton } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { isPastDay } from '@/utils/caverna';
import { DragonAvailabilityDay } from '@/services/api/caverna.api';

interface AvailabilityCalendarProps {
  availability?: DragonAvailabilityDay[] | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  selectedDate?: string | null;
  onSelect?: (date: string) => void;
  title?: string;
}

export function AvailabilityCalendar({
  availability,
  isLoading = false,
  isError = false,
  onRetry,
  selectedDate,
  onSelect,
  title = 'Disponibilidade',
}: AvailabilityCalendarProps) {
  if (isLoading) {
    return <Skeleton height={120} borderRadius={12} />;
  }

  if (isError) {
    return (
      <Card padding={spacing.md}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Nao foi possivel carregar a disponibilidade.</Text>
          <Button variant="outline" size="sm" onPress={onRetry || (() => undefined)}>
            Tentar novamente
          </Button>
        </View>
      </Card>
    );
  }

  if (!availability?.length) {
    return (
      <Card padding={spacing.md}>
        <Text style={styles.emptyText}>Nenhuma data disponivel no periodo.</Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {availability.map((day) => (
          <AvailabilityDay
            key={day.date}
            date={day.date}
            morningAvailable={day.morning.available}
            afternoonAvailable={day.afternoon.available}
            selected={selectedDate === day.date}
            disabled={isPastDay(day.date)}
            onPress={() => onSelect?.(day.date)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  list: {
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  errorContainer: {
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
