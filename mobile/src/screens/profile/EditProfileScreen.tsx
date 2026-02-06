import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zod-resolver';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { AvatarPicker } from '@/components/profile';
import { LoadingScreen } from '@/components/feedback';
import { useAuth } from '@/hooks/use-auth';
import { useRemoveAvatar, useUpdateProfile, useUploadAvatar } from '@/hooks/use-profile';
import { darkTheme, spacing, typography } from '@/theme';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome obrigatorio'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function EditProfileScreen() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  if (!user) return <LoadingScreen />;

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile.mutateAsync({ name: data.name });
      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado',
        text2: 'Seus dados foram salvos com sucesso.',
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nao foi possivel atualizar o perfil';
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: message,
      });
    }
  };

  const handlePickAvatar = async (uri: string) => {
    try {
      await uploadAvatar.mutateAsync(uri);
      Toast.show({
        type: 'success',
        text1: 'Avatar atualizado',
        text2: 'Sua foto foi alterada com sucesso.',
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nao foi possivel enviar o avatar';
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar',
        text2: message,
      });
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar.mutateAsync();
      Toast.show({
        type: 'success',
        text1: 'Avatar removido',
        text2: 'Sua foto foi removida com sucesso.',
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nao foi possivel remover o avatar';
      Toast.show({
        type: 'error',
        text1: 'Erro ao remover',
        text2: message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AvatarPicker
          currentUri={user.avatar_url}
          name={user.name}
          onPick={handlePickAvatar}
          onRemove={handleRemoveAvatar}
        />

        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nome"
              placeholder="Seu nome completo"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              leftIcon="person-outline"
            />
          )}
        />

        <Input label="Email" value={user.email} editable={false} leftIcon="mail-outline" />

        <Button onPress={handleSubmit(onSubmit)} loading={updateProfile.isPending} fullWidth>
          Salvar alteracoes
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
});
