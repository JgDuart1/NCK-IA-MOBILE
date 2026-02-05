import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Sprint } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface SprintSelectorProps {
  sprints: Sprint[];
  value?: string | null;
  onChange: (sprintId?: string) => void;
}

export function SprintSelector({ sprints, value, onChange }: SprintSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sprint</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        <TouchableOpacity
          style={[styles.option, !value && styles.optionActive]}
          onPress={() => onChange(undefined)}
        >
          <Text style={styles.optionText}>Sem sprint</Text>
        </TouchableOpacity>

        {sprints.map((sprint) => (
          <TouchableOpacity
            key={sprint.id}
            style={[styles.option, value === sprint.id && styles.optionActive]}
            onPress={() => onChange(sprint.id)}
          >
            <Text style={styles.optionText} numberOfLines={1}>
              {sprint.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {sprints.length === 0 ? (
        <Text style={styles.emptyHint}>Nenhuma sprint disponivel</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  list: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: darkTheme.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: darkTheme.surface,
  },
  optionActive: {
    borderColor: darkTheme.primary,
  },
  optionText: {
    ...typography.caption,
    color: darkTheme.text,
    maxWidth: 140,
  },
  emptyHint: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
});
