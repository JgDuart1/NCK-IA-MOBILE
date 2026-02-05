import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { SprintProgress, SprintStatusBadge, SprintTasksList } from '@/components/sprints';
import { Button } from '@/components/ui';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useProject } from '@/hooks/use-projects';
import { useActiveSprint, useCompleteSprint, useSprint, useStartSprint } from '@/hooks/use-sprints';
import { useTasks } from '@/hooks/use-tasks';
import { useUpdateTask } from '@/hooks/use-task-mutations';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';
import { formatDate } from '@/utils/format';
import { Task } from '@/types';


type Props = ProjectsScreenProps<'SprintDetail'>;

export function SprintDetailScreen({ route, navigation }: Props) {
  const { projectId, sprintId } = route.params;
  const { data: project } = useProject(projectId);
  const { data: sprint, isLoading, error, refetch } = useSprint(sprintId);
  const activeSprint = useActiveSprint(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId, {
    sprint_id: sprintId,
  });
  const startSprint = useStartSprint();
  const completeSprint = useCompleteSprint();
  const updateTask = useUpdateTask();

  const tasksDone = tasks.filter((task) => task.status === 'DONE').length;

  const handleStartSprint = async () => {
    if (!sprint) return;
    if (activeSprint && activeSprint.id !== sprint.id) {
      Toast.show({
        type: 'error',
        text1: 'Ja existe uma sprint ativa',
        text2: 'Finalize a sprint ativa antes de iniciar outra.',
      });
      return;
    }
    try {
      await startSprint.mutateAsync(sprint.id);
      Toast.show({ type: 'success', text1: 'Sprint iniciada' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao iniciar sprint',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleCompleteSprint = async () => {
    if (!sprint) return;
    try {
      await completeSprint.mutateAsync(sprint.id);
      Toast.show({ type: 'success', text1: 'Sprint concluida' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao concluir sprint',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleRemoveTask = async (task: Task) => {
    try {
      await updateTask.mutateAsync({ id: task.id, data: { sprint_id: null } });
      Toast.show({ type: 'success', text1: 'Tarefa removida da sprint' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao remover tarefa',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !sprint) {
    return (
      <ErrorState
        title="Sprint nao encontrada"
        message="Nao foi possivel carregar a sprint"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  const canStart =
    (sprint.status === 'PLANNING' || sprint.status === 'PLANNED') &&
    (!activeSprint || activeSprint.id === sprint.id);
  const canComplete = sprint.status === 'ACTIVE';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{sprint.name}</Text>
              {project?.name ? (
                <Text style={styles.subtitle}>{project.name}</Text>
              ) : null}
            </View>
            <SprintStatusBadge status={sprint.status} />
          </View>
          {sprint.goal ? <Text style={styles.goal}>{sprint.goal}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso</Text>
          <SprintProgress done={tasksDone} total={tasks.length} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datas</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={darkTheme.textSecondary} />
            <Text style={styles.dateText}>
              {sprint.start_date ? formatDate(sprint.start_date) : 'Sem data'}
              {' - '}
              {sprint.end_date ? formatDate(sprint.end_date) : 'Sem data'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tarefas</Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => navigation.navigate('TaskNew', { projectId, sprintId })}
              leftIcon={<Ionicons name="add" size={16} color={darkTheme.text} />}
            >
              Adicionar
            </Button>
          </View>

          {tasks.length === 0 ? (
            <EmptyState
              icon="checkbox-outline"
              title="Sem tarefas"
              description="Adicione tarefas para esta sprint."
            />
          ) : (
            <SprintTasksList
              tasks={tasks}
              loading={updateTask.isPending}
              onTaskPress={(task) =>
                navigation.navigate('TaskDetail', { projectId, taskId: task.id })
              }
              onRemoveTask={handleRemoveTask}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="ghost"
          onPress={() => navigation.navigate('SprintNew', { projectId, sprintId })}
          leftIcon={<Ionicons name="create-outline" size={16} color={darkTheme.primary} />}
        >
          Editar
        </Button>
        {canStart ? (
          <Button loading={startSprint.isPending} onPress={handleStartSprint}>
            Iniciar
          </Button>
        ) : null}
        {canComplete ? (
          <Button loading={completeSprint.isPending} onPress={handleCompleteSprint}>
            Concluir
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  goal: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: darkTheme.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
  },
});

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } })
    .response;
  return maybeResponse?.data?.message ?? null;
}
