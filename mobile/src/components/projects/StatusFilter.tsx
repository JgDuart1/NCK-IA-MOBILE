import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface StatusOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  options: StatusOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function StatusFilter({ options, selected, onSelect }: StatusFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {options.map((option) => {
            const isActive = selected === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, isActive ? styles.chipActive : null]}
                onPress={() => onSelect(option.value)}
              >
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : null]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
  },
  chipActive: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  chipText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  chipTextActive: {
    color: darkTheme.text,
    fontWeight: '600',
  },
});
