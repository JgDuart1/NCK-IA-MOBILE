import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { Sprint } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { zodResolver } from '@/utils/zod-resolver';

const sprintSchema = z
  .object({
    name: z.string().min(1, 'Nome obrigatorio'),
    goal: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      path: ['end_date'],
      message: 'Data final deve ser depois da inicial',
    }
  );

type SprintFormValues = z.infer<typeof sprintSchema>;

interface SprintFormProps {
  initialValues?: Partial<Sprint>;
  onSubmit: (data: SprintFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function SprintForm({
  initialValues,
  onSubmit,
  onCancel,
  loading,
  submitLabel = 'Salvar',
}: SprintFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintFormValues>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: initialValues?.name || '',
      goal: initialValues?.goal || '',
      start_date: initialValues?.start_date || '',
      end_date: initialValues?.end_date || '',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{submitLabel}</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nome"
              placeholder="Nome da sprint"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="goal"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Objetivo"
              placeholder="Objetivo da sprint"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="start_date"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Data inicial"
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
              label="Data final"
              placeholder="YYYY-MM-DD"
              value={value}
              onChangeText={onChange}
              error={errors.end_date?.message}
            />
          )}
        />

        <View style={styles.actions}>
          <Button variant="ghost" onPress={onCancel}>
            Cancelar
          </Button>
          <Button loading={loading} onPress={handleSubmit(onSubmit)}>
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
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
