import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Task } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { TaskCardDraggable } from './TaskCardDraggable';
import { KANBAN_COLUMN_WIDTH } from './constants';

interface KanbanColumnProps {
  title: string;
  color: string;
  tasks: Task[];
  status: string;
  columnIndex: number;
  onTaskPress: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: string) => void;
  isLoading?: boolean;
}

export function KanbanColumn({
  title,
  color,
  tasks,
  columnIndex,
  onTaskPress,
  onTaskDrop,
  isLoading,
}: KanbanColumnProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{tasks.length}</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCardDraggable
            task={item}
            onPress={() => onTaskPress(item)}
            onDrop={(newStatus) => onTaskDrop(item.id, newStatus)}
            columnIndex={columnIndex}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          isLoading ? null : <Text style={styles.empty}>Sem tarefas</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: KANBAN_COLUMN_WIDTH,
    backgroundColor: darkTheme.surfaceSecondary,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    ...typography.bodySmall,
    color: darkTheme.text,
    flex: 1,
  },
  count: {
    backgroundColor: darkTheme.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  empty: {
    ...typography.caption,
    color: darkTheme.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
