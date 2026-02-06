import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { KanbanBoard, TaskFiltersModal, TaskFilters } from '@/components/tasks';
import { KanbanStatus } from '@/components/tasks/constants';
import { Button } from '@/components/ui';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useProject } from '@/hooks/use-projects';
import { useProjectMembers } from '@/hooks/use-project-members';
import { useSprints } from '@/hooks/use-sprints';
import { useTasksByStatus, useUpdateTaskStatus } from '@/hooks/use-tasks';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'TasksList'>;

export function TasksListScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const [filters, setFilters] = useState<TaskFilters>({});
  const [filtersVisible, setFiltersVisible] = useState(false);

  const { data: project } = useProject(projectId);
  const { data: members = [] } = useProjectMembers(projectId);
  const { data: sprints = [] } = useSprints(projectId);
  const { grouped, isLoading, error, refetch, isRefetching } = useTasksByStatus(projectId, filters);
  const updateStatus = useUpdateTaskStatus();

  const handleTaskDrop = async (taskId: string, newStatus: KanbanStatus) => {
    try {
      await updateStatus.mutateAsync({ id: taskId, status: newStatus });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao mover tarefa',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  const hasAnyTasks = Object.values(grouped || {}).some((list) => list.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tarefas</Text>
          {project?.name ? <Text style={styles.subtitle}>{project.name}</Text> : null}
        </View>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => setFiltersVisible(true)}
          leftIcon={<Ionicons name="filter" size={16} color={darkTheme.primary} />}
        >
          Filtros
        </Button>
      </View>

      {!hasAnyTasks ? (
        <EmptyState
          icon="checkbox-outline"
          title="Sem tarefas"
          description="Crie a primeira tarefa para este projeto."
        />
      ) : null}

      <KanbanBoard
        tasks={grouped}
        onTaskPress={(task) => navigation.navigate('TaskDetail', { projectId, taskId: task.id })}
        onTaskDrop={handleTaskDrop}
        isLoading={isRefetching}
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('TaskNew', { projectId })}>
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>

      <TaskFiltersModal
        visible={filtersVisible}
        filters={filters}
        members={members}
        sprints={sprints}
        onClose={() => setFiltersVisible(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
  return maybeResponse?.data?.message ?? null;
}
