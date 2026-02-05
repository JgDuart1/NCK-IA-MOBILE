import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

export type WorkMode = 'SCRUM' | 'KANBAN' | 'SIMPLE';

interface WorkModeSelectorProps {
  value: WorkMode;
  onChange: (value: WorkMode) => void;
}

const OPTIONS: { value: WorkMode; label: string }[] = [
  { value: 'SCRUM', label: 'Scrum' },
  { value: 'KANBAN', label: 'Kanban' },
  { value: 'SIMPLE', label: 'Simples' },
];

export function WorkModeSelector({ value, onChange }: WorkModeSelectorProps) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, isActive ? styles.optionActive : null]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.label, isActive ? styles.labelActive : null]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  labelActive: {
    color: darkTheme.text,
    fontWeight: '600',
  },
});
