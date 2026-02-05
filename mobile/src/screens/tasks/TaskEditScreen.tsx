import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

import { TaskForm } from '@/components/tasks';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useTask } from '@/hooks/use-tasks';
import { useUpdateTask } from '@/hooks/use-task-mutations';
import { useProjectMembers } from '@/hooks/use-project-members';
import { attachmentService } from '@/services/attachments';
import { darkTheme } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';
import { LocalAttachment } from '@/components/tasks/AttachmentGrid';



type Props = ProjectsScreenProps<'TaskEdit'>;

export function TaskEditScreen({ route, navigation }: Props) {
  const { taskId, projectId } = route.params;
  const queryClient = useQueryClient();
  const { data: task, isLoading, error, refetch } = useTask(taskId);
  const { mutateAsync, isPending } = useUpdateTask();
  const { data: members = [] } = useProjectMembers(projectId);

  const handleSubmit = async (
    data: {
      title: string;
      description?: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      assignee_id?: string;
      sprint_id?: string;
      deadline?: string;
    },
    localAttachments: LocalAttachment[]
  ) => {
    try {
      const updated = await mutateAsync({
        id: taskId,
        data: {
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          assignee_id: data.assignee_id,
          sprint_id: data.sprint_id,
          deadline: data.deadline || undefined,
        },
      });

      if (localAttachments.length > 0) {
        const results = await Promise.all(
          localAttachments.map((attachment) =>
            attachmentService.upload(attachment.uri, 'task', updated.id)
          )
        );
        const failed = results.filter((result) => !result.success);
        if (failed.length > 0) {
          Toast.show({
            type: 'error',
            text1: 'Alguns anexos falharam',
            text2: 'Tente reenviar os anexos.',
          });
        }
      }

      Toast.show({
        type: 'success',
        text1: 'Tarefa atualizada',
        text2: 'As alteracoes foram salvas.',
      });

      navigation.goBack();
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar tarefa',
        text2: getApiErrorMessage(err) || 'Nao foi possivel atualizar a tarefa',
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }} edges={['bottom']}>
      <TaskForm
        initialValues={task}
        members={members}
        sprints={[]}
        attachments={task.attachments || []}
        submitLabel="Salvar"
        loading={isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigation.goBack()}
        onDeleteAttachment={handleDeleteAttachment}
      />
    </SafeAreaView>
  );
}

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } })
    .response;
  return maybeResponse?.data?.message ?? null;
}
