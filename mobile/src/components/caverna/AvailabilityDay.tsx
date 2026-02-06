import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDayNumber, formatWeekdayShort } from '@/utils/caverna';

interface AvailabilityDayProps {
  date: string;
  morningAvailable: number;
  afternoonAvailable: number;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export function AvailabilityDay({
  date,
  morningAvailable,
  afternoonAvailable,
  selected = false,
  disabled = false,
  onPress,
}: AvailabilityDayProps) {
  const isDisabled = disabled || (morningAvailable === 0 && afternoonAvailable === 0);

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected, isDisabled && styles.disabled]}
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.weekday, selected && styles.weekdaySelected]}>
        {formatWeekdayShort(date)}
      </Text>
      <Text style={[styles.day, selected && styles.daySelected]}>{formatDayNumber(date)}</Text>

      <View style={styles.availabilityRow}>
        <View style={[styles.badge, morningAvailable === 0 && styles.badgeEmpty]}>
          <Text style={styles.badgeText}>M {morningAvailable}</Text>
        </View>
        <View style={[styles.badge, afternoonAvailable === 0 && styles.badgeEmpty]}>
          <Text style={styles.badgeText}>T {afternoonAvailable}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.border,
    alignItems: 'center',
    minWidth: 84,
    gap: spacing.xs,
  },
  selected: {
    borderColor: darkTheme.primary,
    backgroundColor: `${darkTheme.primary}20`,
  },
  disabled: {
    opacity: 0.5,
  },
  weekday: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  weekdaySelected: {
    color: darkTheme.primary,
  },
  day: {
    ...typography.h4,
    color: darkTheme.text,
  },
  daySelected: {
    color: darkTheme.primary,
  },
  availabilityRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: `${darkTheme.primary}20`,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeEmpty: {
    backgroundColor: `${darkTheme.textSecondary}20`,
  },
  badgeText: {
    ...typography.caption,
    color: darkTheme.text,
  },
});
