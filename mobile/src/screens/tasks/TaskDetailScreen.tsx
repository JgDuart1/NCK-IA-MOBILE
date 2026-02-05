import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

import { AttachmentGrid, PriorityBadge } from '@/components/tasks';
import { Button, Modal } from '@/components/ui';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useTask } from '@/hooks/use-tasks';
import { useDeleteTask, useUpdateTask } from '@/hooks/use-task-mutations';
import { attachmentService } from '@/services/attachments';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';
import { KANBAN_COLUMNS } from '@/components/tasks/constants';


type Props = ProjectsScreenProps<'TaskDetail'>;

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId, projectId } = route.params;
  const queryClient = useQueryClient();
  const { data: task, isLoading, error, refetch } = useTask(taskId);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [statusVisible, setStatusVisible] = useState(false);
  const [priorityVisible, setPriorityVisible] = useState(false);

  const handleDelete = () => {
    Alert.alert('Excluir tarefa', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask.mutateAsync(taskId);
            Toast.show({
              type: 'success',
              text1: 'Tarefa excluida',
            });
            navigation.goBack();
          } catch (err: unknown) {
            Toast.show({
              type: 'error',
              text1: 'Erro ao excluir tarefa',
              text2: getApiErrorMessage(err) || 'Tente novamente',
            });
          }
        },
      },
    ]);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!task) return;
    try {
      await updateTask.mutateAsync({ id: task.id, data: { status } });
      Toast.show({
        type: 'success',
        text1: 'Status atualizado',
      });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar status',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleUpdatePriority = async (priority: typeof PRIORITY_OPTIONS[number]) => {
    if (!task) return;
    try {
      await updateTask.mutateAsync({ id: task.id, data: { priority } });
      Toast.show({
        type: 'success',
        text1: 'Prioridade atualizada',
      });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar prioridade',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await attachmentService.delete(attachmentId);
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
      Toast.show({
        type: 'success',
        text1: 'Anexo removido',
      });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao remover anexo',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !task) {
    return (
      <ErrorState
        title="Tarefa nao encontrada"
        message="Nao foi possivel carregar a tarefa"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  const statusLabel =
    KANBAN_COLUMNS.find((column) => column.key === task.status)?.label || task.status;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.actions}>
            <Button
              size="sm"
              variant="outline"
              onPress={() => navigation.navigate('TaskEdit', { projectId, taskId })}
            >
              Editar
            </Button>
            <Button size="sm" variant="danger" onPress={handleDelete}>
              Excluir
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Pressable style={styles.inlineButton} onPress={() => setStatusVisible(true)}>
            <Ionicons name="swap-horizontal" size={16} color={darkTheme.primary} />
            <Text style={styles.inlineText}>{statusLabel}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioridade</Text>
          <Pressable style={styles.inlineButton} onPress={() => setPriorityVisible(true)}>
            <PriorityBadge priority={task.priority} size="sm" />
            <Text style={styles.inlineText}>Alterar</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsavel</Text>
          <Text style={styles.sectionText}>{task.assignee?.name || 'Sem responsavel'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sprint</Text>
          <Text style={styles.sectionText}>
            {task.sprint_id ? task.sprint_id : 'Sem sprint'}
          </Text>
        </View>

        {task.deadline ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prazo</Text>
            <Text style={styles.sectionText}>{formatDate(task.deadline)}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descricao</Text>
          <Text style={styles.sectionText}>
            {task.description || 'Sem descricao fornecida'}
          </Text>
        </View>

        <AttachmentGrid
          attachments={task.attachments || []}
          editable
          onDelete={(id) => handleDeleteAttachment(id)}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historico</Text>
          <Text style={styles.sectionText}>Historico indisponivel no momento.</Text>
        </View>
      </ScrollView>

      <Modal visible={statusVisible} onClose={() => setStatusVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mover para</Text>
          {KANBAN_COLUMNS.map((status) => (
            <Button
              key={status.key}
              variant={task.status === status.key ? 'primary' : 'outline'}
              onPress={() => {
                handleUpdateStatus(status.key);
                setStatusVisible(false);
              }}
            >
              {status.label}
            </Button>
          ))}
        </View>
      </Modal>

      <Modal visible={priorityVisible} onClose={() => setPriorityVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Prioridade</Text>
          {PRIORITY_OPTIONS.map((priority) => (
            <Button
              key={priority}
              variant={task.priority === priority ? 'primary' : 'outline'}
              onPress={() => {
                handleUpdatePriority(priority);
                setPriorityVisible(false);
              }}
            >
              {priority === 'LOW'
                ? 'Baixa'
                : priority === 'MEDIUM'
                ? 'Media'
                : priority === 'HIGH'
                ? 'Alta'
                : 'Urgente'}
            </Button>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  sectionText: {
    ...typography.body,
    color: darkTheme.text,
  },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inlineText: {
    ...typography.bodySmall,
    color: darkTheme.primary,
  },
  modalContent: {
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h3,
    color: darkTheme.text,
  },
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } })
    .response;
  return maybeResponse?.data?.message ?? null;
}
