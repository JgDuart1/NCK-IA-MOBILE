import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/zod-resolver';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input } from '@/components/ui';
import { authApi } from '@/services/api/auth.api';
import { darkTheme, spacing, typography } from '@/theme';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

export function MagicLinkEmailScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await authApi.requestMagicLink(data.email);
      navigation.navigate('MagicLinkSent', { email: data.email });
    } catch {
      navigation.navigate('MagicLinkSent', { email: data.email });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={darkTheme.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Entrar sem senha</Text>
          <Text style={styles.description}>
            Digite seu email e enviaremos um link mágico para você entrar.
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message as string | undefined}
              leftIcon="mail-outline"
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} loading={isLoading} fullWidth>
          Enviar link
        </Button>

        <Button variant="ghost" onPress={() => navigation.navigate('Login')} fullWidth>
          Voltar para login
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: darkTheme.textSecondary,
  },
});
