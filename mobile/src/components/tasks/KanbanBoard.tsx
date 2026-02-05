import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Task } from '@/types';
import { spacing } from '@/theme';
import { KanbanColumn } from './KanbanColumn';
import { KANBAN_COLUMNS } from './constants';

interface KanbanBoardProps {
  tasks: Record<string, Task[]>;
  onTaskPress: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: string) => void;
  isLoading?: boolean;
}

export function KanbanBoard({ tasks, onTaskPress, onTaskDrop, isLoading }: KanbanBoardProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {KANBAN_COLUMNS.map((column, index) => (
        <KanbanColumn
          key={column.key}
          title={column.label}
          color={column.color}
          tasks={tasks[column.key] || []}
          status={column.key}
          columnIndex={index}
          onTaskPress={onTaskPress}
          onTaskDrop={onTaskDrop}
          isLoading={isLoading}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
});
