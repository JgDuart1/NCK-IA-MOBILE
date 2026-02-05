import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme, spacing, typography } from '@/theme';

interface PeriodSelectorProps {
  morningAvailable: number;
  afternoonAvailable: number;
  selected: 'MORNING' | 'AFTERNOON' | null;
  onSelect: (period: 'MORNING' | 'AFTERNOON') => void;
}

export function PeriodSelector({
  morningAvailable,
  afternoonAvailable,
  selected,
  onSelect,
}: PeriodSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.period,
          selected === 'MORNING' && styles.periodSelected,
          morningAvailable === 0 && styles.periodDisabled,
        ]}
        onPress={() => morningAvailable > 0 && onSelect('MORNING')}
        disabled={morningAvailable === 0}
        activeOpacity={0.8}
      >
        <Ionicons
          name="sunny-outline"
          size={24}
          color={selected === 'MORNING' ? '#fff' : darkTheme.text}
        />
        <Text style={[styles.periodLabel, selected === 'MORNING' && styles.periodLabelSelected]}>
          Manha
        </Text>
        <Text style={[styles.periodTime, selected === 'MORNING' && styles.periodTimeSelected]}>
          08:00 - 12:00
        </Text>
        <View style={[styles.availability, morningAvailable === 0 && styles.availabilityEmpty]}>
          <Text
            style={[
              styles.availabilityText,
              selected === 'MORNING' && styles.availabilityTextSelected,
            ]}
          >
            {morningAvailable > 0 ? `${morningAvailable} vagas` : 'Esgotado'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.period,
          selected === 'AFTERNOON' && styles.periodSelected,
          afternoonAvailable === 0 && styles.periodDisabled,
        ]}
        onPress={() => afternoonAvailable > 0 && onSelect('AFTERNOON')}
        disabled={afternoonAvailable === 0}
        activeOpacity={0.8}
      >
        <Ionicons
          name="moon-outline"
          size={24}
          color={selected === 'AFTERNOON' ? '#fff' : darkTheme.text}
        />
        <Text style={[styles.periodLabel, selected === 'AFTERNOON' && styles.periodLabelSelected]}>
          Tarde
        </Text>
        <Text style={[styles.periodTime, selected === 'AFTERNOON' && styles.periodTimeSelected]}>
          13:00 - 18:00
        </Text>
        <View style={[styles.availability, afternoonAvailable === 0 && styles.availabilityEmpty]}>
          <Text
            style={[
              styles.availabilityText,
              selected === 'AFTERNOON' && styles.availabilityTextSelected,
            ]}
          >
            {afternoonAvailable > 0 ? `${afternoonAvailable} vagas` : 'Esgotado'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  period: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  periodSelected: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  periodDisabled: {
    opacity: 0.5,
  },
  periodLabel: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    marginTop: spacing.sm,
  },
  periodLabelSelected: {
    color: '#fff',
  },
  periodTime: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
  periodTimeSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  availability: {
    backgroundColor: `${darkTheme.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  availabilityEmpty: {
    backgroundColor: '#EF444420',
  },
  availabilityText: {
    ...typography.caption,
    color: darkTheme.primary,
  },
  availabilityTextSelected: {
    color: '#fff',
  },
});
