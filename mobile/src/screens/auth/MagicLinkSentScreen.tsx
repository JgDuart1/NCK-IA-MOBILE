import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui';
import { authApi } from '@/services/api/auth.api';
import { darkTheme, spacing, typography } from '@/theme';

export function MagicLinkSentScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [cooldown, setCooldown] = useState(0);

  const resendLink = async () => {
    setCooldown(60);
    try {
      await authApi.requestMagicLink(email);
    } finally {
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const openEmail = () => {
    Linking.openURL('mailto:');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={64} color={darkTheme.primary} />
        </View>

        <Text style={styles.title}>Verifique seu email</Text>
        <Text style={styles.description}>
          Enviamos um link mágico para{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <Button onPress={openEmail} fullWidth>
          Abrir app de email
        </Button>

        <Button variant="ghost" onPress={resendLink} disabled={cooldown > 0} fullWidth>
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar link'}
        </Button>

        <Button variant="ghost" onPress={() => navigation.navigate('Login')} fullWidth>
          Usar outra forma de login
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: darkTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  email: {
    color: darkTheme.text,
    fontWeight: '600',
  },
});
