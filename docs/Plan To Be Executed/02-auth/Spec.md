# Plano 02: Autenticação - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/02-auth`
- **Timeout**: 1.5 horas
- **Arquivos de contexto**:
  - `../contracts.md`
  - `../01-estrutura-base/dependencies.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx
│       ├── MagicLinkEmailScreen.tsx
│       ├── MagicLinkSentScreen.tsx
│       ├── MagicLinkVerifyScreen.tsx
│       └── index.ts
│
├── stores/
│   └── auth.store.ts
│
├── services/
│   └── api/
│       └── auth.api.ts
│
└── hooks/
    └── use-auth.ts
```

---

## Implementações

### 1. Auth Store (src/stores/auth.store.ts)

```typescript
import { create } from 'zustand';
import { User, Tenant } from '@/types';
import { secureStorage } from '@/services/storage';
import { authApi } from '@/services/api/auth.api';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithMagicLink: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const token = await secureStorage.getAccessToken();
      if (token) {
        const { user, tenant } = await authApi.getMe();
        set({ user, tenant, isAuthenticated: true });
      }
    } catch (error) {
      await secureStorage.clearTokens();
    } finally {
      set({ isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(email, password);
      await secureStorage.setTokens(response.access_token, response.refresh_token);
      set({
        user: response.user,
        tenant: response.tenant,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithMagicLink: async (token: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.verifyMagicLink(token);
      await secureStorage.setTokens(response.access_token, response.refresh_token);
      set({
        user: response.user,
        tenant: response.tenant,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    } finally {
      await secureStorage.clearTokens();
      set({
        user: null,
        tenant: null,
        isAuthenticated: false,
      });
    }
  },

  refreshUser: async () => {
    const { user, tenant } = await authApi.getMe();
    set({ user, tenant });
  },

  setUser: (user: User) => set({ user }),
}));
```

### 2. Auth API (src/services/api/auth.api.ts)

```typescript
import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  MagicLinkRequest,
  User,
  Tenant,
} from '@/types';

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getMe(): Promise<{ user: User; tenant: Tenant }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async requestMagicLink(email: string): Promise<void> {
    await apiClient.post('/auth/magic-link', { email });
  },

  async verifyMagicLink(token: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/magic-link/verify', {
      token,
    });
    return response.data;
  },
};
```

### 3. useAuth Hook (src/hooks/use-auth.ts)

```typescript
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    tenant: store.tenant,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    login: store.login,
    loginWithMagicLink: store.loginWithMagicLink,
    logout: store.logout,
    refreshUser: store.refreshUser,
  };
}
```

### 4. Login Screen (src/screens/auth/LoginScreen.tsx)

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { darkTheme, spacing, typography } from '@/theme';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginScreenProps {
  navigation: any; // Tipagem será definida no Plano 03
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
      // Navegação será tratada pelo AuthGuard no Plano 03
    } catch (err: any) {
      const message = err.response?.data?.message || 'Email ou senha incorretos';
      setError(message);
      Toast.show({
        type: 'error',
        text1: 'Erro ao entrar',
        text2: message,
      });
    }
  };

  const goToMagicLink = () => {
    navigation.navigate('MagicLinkEmail');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>NCK IA</Text>
            <Text style={styles.subtitle}>Gerencie seus projetos</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  leftIcon="mail-outline"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Senha"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  leftIcon="lock-closed-outline"
                />
              )}
            />

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
            >
              Entrar
            </Button>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Magic Link */}
          <Button
            variant="outline"
            onPress={goToMagicLink}
            fullWidth
          >
            Entrar com link mágico
          </Button>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoText: {
    ...typography.h1,
    color: darkTheme.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.body,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.bodySmall,
    color: '#EF4444',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: darkTheme.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginHorizontal: spacing.md,
  },
});
```

### 5. Magic Link Screens

#### MagicLinkEmailScreen.tsx
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await authApi.requestMagicLink(data.email);
      navigation.navigate('MagicLinkSent', { email: data.email });
    } catch (error) {
      // Sempre mostrar sucesso para evitar enumeração de emails
      navigation.navigate('MagicLinkSent', { email: data.email });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
              error={errors.email?.message}
              leftIcon="mail-outline"
            />
          )}
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
        >
          Enviar link
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
```

#### MagicLinkSentScreen.tsx
```typescript
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
    await authApi.requestMagicLink(email);
    
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
          Enviamos um link mágico para{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <Button onPress={openEmail} fullWidth>
          Abrir app de email
        </Button>

        <Button
          variant="ghost"
          onPress={resendLink}
          disabled={cooldown > 0}
          fullWidth
        >
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar link'}
        </Button>

        <Button
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
          fullWidth
        >
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
```

#### MagicLinkVerifyScreen.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingScreen, ErrorState, Button } from '@/components';
import { useAuth } from '@/hooks/use-auth';
import { darkTheme, spacing, typography } from '@/theme';

export function MagicLinkVerifyScreen({ route, navigation }: any) {
  const { token } = route.params;
  const { loginWithMagicLink } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verify();
  }, [token]);

  const verify = async () => {
    setError(null);
    try {
      await loginWithMagicLink(token);
      // Navegação para Dashboard será tratada pelo AuthGuard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Link inválido ou expirado');
    }
  };

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
        <Button
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
          fullWidth
        >
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
  },
});
```

---

## Deep Linking (app.json)

```json
{
  "expo": {
    "scheme": "nckia",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.nckia.com.br",
              "pathPrefix": "/auth/magic-link"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## Testes

### Testes Unitários
- [ ] AuthStore: login atualiza estado corretamente
- [ ] AuthStore: logout limpa estado
- [ ] useAuth: retorna dados corretos

### Testes de Integração
- [ ] Login flow completo
- [ ] Magic link flow completo
- [ ] Refresh token flow

### Testes Manuais
- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Logout limpa sessão
- [ ] App mantém sessão ao reabrir

---

## Checklist de Entrega

- [ ] AuthStore implementado
- [ ] Auth API implementada
- [ ] LoginScreen funcional
- [ ] Magic Link flow completo
- [ ] Deep linking configurado
- [ ] Tokens armazenados com segurança
- [ ] Tratamento de erros adequado
- [ ] Sem erros de TypeScript
