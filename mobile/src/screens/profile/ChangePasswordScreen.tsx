import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zod-resolver';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { PasswordStrength } from '@/components/profile';
import { useChangePassword } from '@/hooks/use-profile';
import { darkTheme, spacing, typography } from '@/theme';

const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false,
};

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Senha atual obrigatoria'),
    new_password: z
      .string()
      .min(PASSWORD_RULES.minLength, `Minimo de ${PASSWORD_RULES.minLength} caracteres`)
      .refine(
        (value) =>
          (!PASSWORD_RULES.requireUppercase || /[A-Z]/.test(value)) &&
          (!PASSWORD_RULES.requireLowercase || /[a-z]/.test(value)) &&
          (!PASSWORD_RULES.requireNumber || /\d/.test(value)) &&
          (!PASSWORD_RULES.requireSpecial || /[^a-zA-Z0-9]/.test(value)),
        'Senha nao atende aos requisitos',
      ),
    confirm_password: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'As senhas nao conferem',
    path: ['confirm_password'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export function ChangePasswordScreen() {
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');

  const onSubmit = async (data: PasswordForm) => {
    try {
      await changePassword.mutateAsync({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      Toast.show({
        type: 'success',
        text1: 'Senha atualizada',
        text2: 'Sua senha foi alterada com sucesso.',
      });
      reset();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nao foi possivel alterar a senha';
      Toast.show({
        type: 'error',
        text1: 'Erro ao alterar senha',
        text2: message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Seguranca</Text>

        <Controller
          control={control}
          name="current_password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Senha atual"
              placeholder="��������"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.current_password?.message}
              leftIcon="lock-closed-outline"
            />
          )}
        />

        <Controller
          control={control}
          name="new_password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nova senha"
              placeholder="��������"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.new_password?.message}
              leftIcon="key-outline"
            />
          )}
        />
        <PasswordStrength password={newPassword} />

        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Confirmar nova senha"
              placeholder="��������"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.confirm_password?.message}
              leftIcon="checkmark-circle-outline"
            />
          )}
        />

        <Text style={styles.hint}>
          A senha deve ter no minimo 8 caracteres, letras maiusculas, minusculas e numeros.
        </Text>

        <Button onPress={handleSubmit(onSubmit)} loading={changePassword.isPending} fullWidth>
          Alterar senha
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
  hint: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginBottom: spacing.md,
  },
});
