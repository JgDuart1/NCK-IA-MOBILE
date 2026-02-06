import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { ProjectMember, Sprint, Attachment, Task } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { zodResolver } from '@/utils/zod-resolver';
import { attachmentService } from '@/services/attachments';
import { AssigneeSelector } from './AssigneeSelector';
import { SprintSelector } from './SprintSelector';
import { AttachmentGrid, LocalAttachment } from './AttachmentGrid';
import { PriorityBadge } from './PriorityBadge';

const taskSchema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assignee_id: z.string().optional(),
  sprint_id: z.string().optional(),
  deadline: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialValues?: Partial<Task>;
  members: ProjectMember[];
  sprints: Sprint[];
  attachments?: Attachment[];
  onSubmit: (data: TaskFormValues, localAttachments: LocalAttachment[]) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
  onDeleteAttachment?: (id: string) => Promise<void> | void;
}

const PRIORITIES: Array<TaskFormValues['priority']> = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function TaskForm({
  initialValues,
  members,
  sprints,
  attachments = [],
  onSubmit,
  onCancel,
  loading,
  submitLabel = 'Salvar',
  onDeleteAttachment,
}: TaskFormProps) {
  const [localAttachments, setLocalAttachments] = useState<LocalAttachment[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      priority: initialValues?.priority || 'MEDIUM',
      assignee_id: initialValues?.assignee_id || undefined,
      sprint_id: initialValues?.sprint_id || undefined,
      deadline: initialValues?.deadline || '',
    },
  });

  const selectedPriority = watch('priority');

  const handleAddImage = async () => {
    try {
      const result = await attachmentService.pickImage();
      if (result.canceled) return;
      const asset = result.assets[0];
      setLocalAttachments((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          uri: asset.uri,
          name: asset.fileName || 'imagem.jpg',
          mimeType: asset.mimeType || 'image/jpeg',
        },
      ]);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao selecionar imagem',
        text2: error instanceof Error ? error.message : 'Tente novamente',
      });
    }
  };

  const handleAddDocument = async () => {
    try {
      const result = await attachmentService.pickDocument();
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      setLocalAttachments((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          uri: asset.uri,
          name: asset.name || 'documento',
          mimeType: asset.mimeType || 'application/octet-stream',
        },
      ]);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao selecionar documento',
        text2: error instanceof Error ? error.message : 'Tente novamente',
      });
    }
  };

  const handleDeleteAttachment = async (id: string, isLocal?: boolean) => {
    if (isLocal) {
      setLocalAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
      return;
    }

    if (onDeleteAttachment) {
      await onDeleteAttachment(id);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{submitLabel}</Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Titulo"
              placeholder="Titulo da tarefa"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Descricao"
              placeholder="Descreva a tarefa"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Prioridade</Text>
          <View style={styles.priorityList}>
            {PRIORITIES.map((priority) => (
              <Button
                key={priority}
                size="sm"
                variant={selectedPriority === priority ? 'primary' : 'outline'}
                onPress={() => setValue('priority', priority)}
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
          <View style={styles.priorityPreview}>
            <PriorityBadge priority={selectedPriority} />
          </View>
        </View>

        <AssigneeSelector
          members={members}
          value={watch('assignee_id')}
          onChange={(assigneeId) => setValue('assignee_id', assigneeId)}
        />

        <SprintSelector
          sprints={sprints}
          value={watch('sprint_id')}
          onChange={(sprintId) => setValue('sprint_id', sprintId)}
        />

        <Controller
          control={control}
          name="deadline"
          render={({ field: { onChange, value } }) => (
            <Input label="Prazo" placeholder="YYYY-MM-DD" value={value} onChangeText={onChange} />
          )}
        />

        <View style={styles.attachmentsSection}>
          <AttachmentGrid
            attachments={attachments}
            localAttachments={localAttachments}
            editable
            onDelete={handleDeleteAttachment}
          />
          <View style={styles.attachmentActions}>
            <Button variant="outline" size="sm" onPress={handleAddImage}>
              Adicionar imagem
            </Button>
            <Button variant="outline" size="sm" onPress={handleAddDocument}>
              Adicionar documento
            </Button>
          </View>
        </View>

        <View style={styles.actions}>
          <Button variant="ghost" onPress={onCancel}>
            Cancelar
          </Button>
          <Button
            loading={loading}
            onPress={handleSubmit((data) => onSubmit(data, localAttachments))}
          >
            {submitLabel}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  priorityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priorityPreview: {
    alignItems: 'flex-start',
  },
  attachmentsSection: {
    gap: spacing.sm,
  },
  attachmentActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
