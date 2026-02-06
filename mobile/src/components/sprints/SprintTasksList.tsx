import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { Button } from '@/components/ui';

interface SprintTasksListProps {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
  onRemoveTask?: (task: Task) => void;
  loading?: boolean;
}

const STATUS_LABELS: Record<Task['status'], string> = {
  BACKLOG: 'Backlog',
  TODO: 'A fazer',
  IN_PROGRESS: 'Em progresso',
  IN_REVIEW: 'Em revisao',
  DONE: 'Concluida',
  CANCELLED: 'Cancelada',
};

export function SprintTasksList({
  tasks,
  onTaskPress,
  onRemoveTask,
  loading,
}: SprintTasksListProps) {
  if (!tasks.length) {
    return (
      <View style={styles.empty}>
        <Ionicons name="clipboard-outline" size={24} color={darkTheme.textMuted} />
        <Text style={styles.emptyText}>Nenhuma tarefa nesta sprint.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.itemInfo}
            onPress={() => onTaskPress?.(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemStatus}>{STATUS_LABELS[item.status]}</Text>
          </TouchableOpacity>
          {onRemoveTask ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => onRemoveTask(item)}
              disabled={loading}
              leftIcon={<Ionicons name="close-circle" size={16} color={darkTheme.primary} />}
            >
              Remover
            </Button>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  item: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  itemTitle: {
    ...typography.body,
    color: darkTheme.text,
  },
  itemStatus: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
