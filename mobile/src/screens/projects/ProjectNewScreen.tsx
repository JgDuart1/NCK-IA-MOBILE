import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { ColorPicker, WorkModeSelector, WorkMode } from '@/components/projects';
import { useCreateProject } from '@/hooks/use-projects';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';
import { zodResolver } from '@/utils/zod-resolver';

const projectSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().optional(),
  work_mode: z.enum(['SCRUM', 'KANBAN', 'SIMPLE']),
  color: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

type Props = ProjectsScreenProps<'ProjectNew'>;

export function ProjectNewScreen({ navigation }: Props) {
  const { mutateAsync, isPending } = useCreateProject();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      work_mode: 'SCRUM',
      color: undefined,
      start_date: '',
      end_date: '',
    },
  });

  const workMode = watch('work_mode');
  const color = watch('color');

  const onSubmit = async (data: ProjectForm) => {
    try {
      await mutateAsync({
        name: data.name,
        description: data.description || undefined,
        work_mode: data.work_mode,
        color: data.color || undefined,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
      });
      Toast.show({
        type: 'success',
        text1: 'Projeto criado',
        text2: 'Seu projeto foi criado com sucesso.',
      });
      navigation.goBack();
    } catch (err: unknown) {
      const message = getApiErrorMessage(err) || 'Nao foi possivel criar o projeto';
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar projeto',
        text2: message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Novo Projeto</Text>

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
            <Text style={styles.sectionTitle}>Modo de trabalho</Text>
            <WorkModeSelector
              value={workMode as WorkMode}
              onChange={(value) => setValue('work_mode', value)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cor do projeto</Text>
            <ColorPicker value={color} onChange={(value) => setValue('color', value)} />
          </View>

          <Controller
            control={control}
            name="start_date"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Data de inicio"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="end_date"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Data de fim"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <View style={styles.actions}>
            <Button variant="ghost" onPress={() => navigation.goBack()}>
              Cancelar
            </Button>
            <Button onPress={handleSubmit(onSubmit)} loading={isPending}>
              Criar
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
  return maybeResponse?.data?.message ?? null;
}
