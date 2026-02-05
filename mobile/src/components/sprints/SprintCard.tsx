import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sprint } from '@/types';
import { SprintStatusBadge } from './SprintStatusBadge';
import { SprintProgress } from './SprintProgress';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';

interface SprintCardProps {
  sprint: Sprint;
  onPress: () => void;
}

export function SprintCard({ sprint, onPress }: SprintCardProps) {
  const isActive = sprint.status === 'ACTIVE';
  const tasksTotal = sprint.tasks?.length || 0;
  const tasksDone = sprint.tasks?.filter((t) => t.status === 'DONE').length || 0;

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{sprint.name}</Text>
        <SprintStatusBadge status={sprint.status} />
      </View>

      {sprint.goal ? (
        <Text style={styles.goal} numberOfLines={2}>
          {sprint.goal}
        </Text>
      ) : null}

      <SprintProgress done={tasksDone} total={tasksTotal} />

      <View style={styles.footer}>
        <View style={styles.dates}>
          <Ionicons name="calendar-outline" size={14} color={darkTheme.textSecondary} />
          <Text style={styles.dateText}>
            {sprint.start_date ? formatDate(sprint.start_date) : 'Sem data'}
            {' - '}
            {sprint.end_date ? formatDate(sprint.end_date) : 'Sem data'}
          </Text>
        </View>
        <Text style={styles.tasksCount}>
          {tasksDone}/{tasksTotal} tarefas
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.sm,
  },
  containerActive: {
    borderWidth: 2,
    borderColor: darkTheme.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.h4,
    color: darkTheme.text,
    flex: 1,
  },
  goal: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  dates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  dateText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  tasksCount: {
    ...typography.caption,
    color: darkTheme.text,
    fontWeight: '600',
  },
});
