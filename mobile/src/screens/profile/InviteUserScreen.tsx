import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zod-resolver';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { RoleSelector } from '@/components/profile';
import { useSendInvite } from '@/hooks/use-invites';
import { RoleType } from '@/services/api/users.api';
import { darkTheme, spacing, typography } from '@/theme';

const inviteSchema = z.object({
  email: z.string().email('Email invalido'),
  role_type: z.enum([
    'SUPER_ADMIN',
    'NUCLEO_NCK',
    'AGENTE_NCK',
    'CLIENTE',
    'FORNECEDOR',
    'INVESTIDOR',
  ]),
});

type InviteForm = z.infer<typeof inviteSchema>;

export function InviteUserScreen() {
  const sendInvite = useSendInvite();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role_type: 'CLIENTE',
    },
  });

  const role = watch('role_type');

  const onSubmit = async (data: InviteForm) => {
    try {
      await sendInvite.mutateAsync({
        email: data.email,
        role_type: data.role_type,
      });
      Toast.show({
        type: 'success',
        text1: 'Convite enviado',
        text2: 'O usuario foi convidado com sucesso.',
      });
      reset({ email: '', role_type: data.role_type });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nao foi possivel enviar o convite';
      Toast.show({
        type: 'error',
        text1: 'Erro ao convidar',
        text2: message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Novo convite</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="usuario@empresa.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              leftIcon="mail-outline"
            />
          )}
        />

        <Text style={styles.label}>Role do usuario</Text>
        <RoleSelector value={role as RoleType} onChange={(value) => setValue('role_type', value)} />

        <Button onPress={handleSubmit(onSubmit)} loading={sendInvite.isPending} fullWidth>
          Enviar convite
        </Button>
      </ScrollView>
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
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.xs,
  },
});
