import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingScreen, ErrorState } from '@/components/feedback';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { darkTheme, spacing } from '@/theme';

export function MagicLinkVerifyScreen({ route, navigation }: any) {
  const { token } = route.params;
  const { loginWithMagicLink } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    setError(null);
    try {
      await loginWithMagicLink(token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Link inválido ou expirado');
    }
  }, [loginWithMagicLink, token]);

  useEffect(() => {
    verify();
  }, [verify]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          title="Erro na verificação"
          message={error}
          action={{
            label: 'Tentar novamente',
            onPress: verify,
          }}
        />
        <Button variant="ghost" onPress={() => navigation.navigate('Login')} fullWidth>
          Voltar para login
        </Button>
      </SafeAreaView>
    );
  }

  return <LoadingScreen message="Verificando..." />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
});
