import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { SprintForm } from '@/components/sprints';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useCreateSprint, useSprint, useUpdateSprint } from '@/hooks/use-sprints';
import { darkTheme } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';


type Props = ProjectsScreenProps<'SprintNew'>;

export function SprintNewScreen({ route, navigation }: Props) {
  const { projectId, sprintId } = route.params;
  const isEdit = !!sprintId;

  const { data: sprint, isLoading, error, refetch } = useSprint(sprintId || '');
  const createSprint = useCreateSprint();
  const updateSprint = useUpdateSprint();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Editar Sprint' : 'Nova Sprint' });
  }, [isEdit, navigation]);

  if (isEdit && isLoading) {
    return <LoadingScreen />;
  }

  if (isEdit && (error || !sprint)) {
    return (
      <ErrorState
        title="Sprint nao encontrada"
        message="Nao foi possivel carregar a sprint"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  const handleSubmit = async (data: {
    name: string;
    goal?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    try {
      if (isEdit && sprint) {
        await updateSprint.mutateAsync({
          id: sprint.id,
          data: {
            name: data.name,
            goal: data.goal || undefined,
            start_date: data.start_date || undefined,
            end_date: data.end_date || undefined,
          },
        });

        Toast.show({
          type: 'success',
          text1: 'Sprint atualizada',
        });

        navigation.goBack();
        return;
      }

      const created = await createSprint.mutateAsync({
        project_id: projectId,
        name: data.name,
        goal: data.goal || undefined,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Sprint criada',
        text2: 'Sua sprint foi criada com sucesso.',
      });

      navigation.replace('SprintDetail', { projectId, sprintId: created.id });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar sprint',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }} edges={['bottom']}>
      <SprintForm
        initialValues={sprint}
        submitLabel={isEdit ? 'Salvar' : 'Criar'}
        loading={createSprint.isPending || updateSprint.isPending}
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
  const maybeResponse = (error as { response?: { data?: { message?: string } } })
    .response;
  return maybeResponse?.data?.message ?? null;
}
