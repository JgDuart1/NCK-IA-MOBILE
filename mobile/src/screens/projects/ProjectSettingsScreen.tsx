import React, { useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { ColorPicker, StatusFilter } from '@/components/projects';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useDeleteProject, useProject, useUpdateProject } from '@/hooks/use-projects';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';
import { zodResolver } from '@/utils/zod-resolver';

const statusOptions = [
  { value: 'PLANNING', label: 'Planejando' },
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'PAUSED', label: 'Pausado' },
  { value: 'COMPLETED', label: 'Concluido' },
  { value: 'ARCHIVED', label: 'Arquivado' },
];

const settingsSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']),
});

type SettingsForm = z.infer<typeof settingsSchema>;

type Props = ProjectsScreenProps<'ProjectSettings'>;

export function ProjectSettingsScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { data: project, isLoading, error, refetch } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      description: '',
      color: undefined,
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || '',
        color: project.color || undefined,
        status: project.status,
      });
    }
  }, [project, reset]);

  const color = watch('color');
  const status = watch('status');

  const onSubmit = async (data: SettingsForm) => {
    try {
      await updateProject.mutateAsync({
        id: projectId,
        data: {
          name: data.name,
          description: data.description || undefined,
          color: data.color || undefined,
          status: data.status,
        },
      });
      Toast.show({
        type: 'success',
        text1: 'Projeto atualizado',
        text2: 'As configuracoes foram salvas.',
      });
      navigation.goBack();
    } catch (err: unknown) {
      const message =
        getApiErrorMessage(err) || 'Nao foi possivel salvar as alteracoes';
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: message,
      });
    }
  };

  const handleArchive = () => {
    Alert.alert('Arquivar projeto', 'Deseja arquivar este projeto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Arquivar',
        style: 'destructive',
        onPress: async () => {
          try {
            await updateProject.mutateAsync({ id: projectId, data: { status: 'ARCHIVED' } });
            Toast.show({
              type: 'success',
              text1: 'Projeto arquivado',
            });
            navigation.goBack();
          } catch (err: unknown) {
            const message =
              getApiErrorMessage(err) || 'Nao foi possivel arquivar o projeto';
            Toast.show({
              type: 'error',
              text1: 'Erro ao arquivar',
              text2: message,
            });
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Excluir projeto', 'Esta acao nao pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProject.mutateAsync(projectId);
            Toast.show({
              type: 'success',
              text1: 'Projeto excluido',
            });
            navigation.popToTop();
          } catch (err: unknown) {
            const message =
              getApiErrorMessage(err) || 'Nao foi possivel excluir o projeto';
            Toast.show({
              type: 'error',
              text1: 'Erro ao excluir',
              text2: message,
            });
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !project) {
    return (
      <ErrorState
        title="Projeto nao encontrado"
        description="Nao foi possivel carregar o projeto."
        onRetry={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Configuracoes</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nome"
                placeholder="Nome do projeto"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Descricao"
                placeholder="Descreva o projeto"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                error={errors.description?.message}
              />
            )}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <StatusFilter
              options={statusOptions}
              selected={status}
              onSelect={(value) => setValue('status', value as SettingsForm['status'])}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cor</Text>
            <ColorPicker value={color} onChange={(value) => setValue('color', value)} />
          </View>

          <View style={styles.actions}>
            <Button onPress={handleSubmit(onSubmit)} loading={updateProject.isPending}>
              Salvar
            </Button>
            <Button variant="outline" onPress={handleArchive}>
              Arquivar
            </Button>
            <Button variant="danger" onPress={handleDelete} loading={deleteProject.isPending}>
              Excluir
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
    marginBottom: spacing.sm,
  },
  section: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
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
