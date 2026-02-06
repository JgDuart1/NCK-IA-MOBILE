import React from 'react';
import Toast from 'react-native-toast-message';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskForm } from '@/components/tasks';
import { useCreateTask } from '@/hooks/use-task-mutations';
import { useProjectMembers } from '@/hooks/use-project-members';
import { useSprints } from '@/hooks/use-sprints';
import { attachmentService } from '@/services/attachments';
import { darkTheme } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';
import { LocalAttachment } from '@/components/tasks/AttachmentGrid';

type Props = ProjectsScreenProps<'TaskNew'>;

export function TaskNewScreen({ route, navigation }: Props) {
  const { projectId, sprintId } = route.params;
  const { mutateAsync, isPending } = useCreateTask();
  const { data: members = [] } = useProjectMembers(projectId);
  const { data: sprints = [] } = useSprints(projectId);

  const handleSubmit = async (
    data: {
      title: string;
      description?: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      assignee_id?: string;
      sprint_id?: string;
      deadline?: string;
    },
    localAttachments: LocalAttachment[],
  ) => {
    try {
      const task = await mutateAsync({
        project_id: projectId,
        sprint_id: data.sprint_id || sprintId,
        assignee_id: data.assignee_id,
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        deadline: data.deadline || undefined,
      });

      if (localAttachments.length > 0) {
        const results = await Promise.all(
          localAttachments.map((attachment) =>
            attachmentService.upload(attachment.uri, 'task', task.id),
          ),
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
        text1: 'Tarefa criada',
        text2: 'Sua tarefa foi criada com sucesso.',
      });

      navigation.navigate('TaskDetail', { projectId, taskId: task.id });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar tarefa',
        text2: getApiErrorMessage(err) || 'Nao foi possivel criar a tarefa',
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }} edges={['bottom']}>
      <TaskForm
        initialValues={{ sprint_id: sprintId }}
        members={members}
        sprints={sprints}
        submitLabel="Criar"
        loading={isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
  return maybeResponse?.data?.message ?? null;
}
