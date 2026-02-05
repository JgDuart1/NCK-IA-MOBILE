# Plano 02: Autenticação - Dependencies

## O Que Este Plano Provê

### Exports

#### Store (`src/stores/`)

| Export | Import Path | Descrição |
|--------|-------------|-----------|
| `useAuthStore` | `@/stores/auth.store` | Store Zustand de autenticação |

#### Hooks (`src/hooks/`)

| Export | Import Path | Descrição |
|--------|-------------|-----------|
| `useAuth` | `@/hooks/use-auth` | Hook simplificado para auth |

#### API (`src/services/api/`)

| Export | Import Path | Descrição |
|--------|-------------|-----------|
| `authApi` | `@/services/api/auth.api` | Funções de API de auth |

#### Screens (`src/screens/auth/`)

| Screen | Descrição |
|--------|-----------|
| `LoginScreen` | Tela de login |
| `MagicLinkEmailScreen` | Entrada de email para magic link |
| `MagicLinkSentScreen` | Confirmação de envio |
| `MagicLinkVerifyScreen` | Verificação do token |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | De | Uso |
|--------|-----|-----|
| `Button` | `@/components/ui` | Botões das telas |
| `Input` | `@/components/ui` | Campos de formulário |
| `LoadingScreen` | `@/components/feedback` | Loading durante verificação |
| `ErrorState` | `@/components/feedback` | Erro na verificação |
| `apiClient` | `@/services/api` | Requisições HTTP |
| `secureStorage` | `@/services/storage` | Armazenar tokens |
| `darkTheme` | `@/theme` | Cores do tema |
| `spacing` | `@/theme` | Espaçamentos |
| `typography` | `@/theme` | Estilos de texto |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 03-navigation | `useAuthStore` para rotas protegidas |
| 04-dashboard | `useAuth` para dados do usuário |
| 05-projetos | `useAuth` para tenant_id |
| 06-tarefas | `useAuth` para assignee |
| 07-sprints | `useAuth` para created_by |
| 08-notas | `useAuth` para author_id |
| 09-calendario | `useAuth` para created_by |
| 10-notificacoes | `useAuth` para user_id |
| 11-canvas | `useAuth` para created_by |
| 12-caverna | `useAuth` para user_id |
| 13-usuarios | `useAuth` para perfil |
| 14-config | `logout` do useAuth |

---

## Contratos

### useAuth Hook

```typescript
interface UseAuthReturn {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithMagicLink: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

**Uso em outros planos:**

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyScreen() {
  const { user, tenant, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null; // AuthGuard lida com isso
  }

  return (
    <View>
      <Text>Olá, {user.name}</Text>
      <Button onPress={logout}>Sair</Button>
    </View>
  );
}
```

### AuthStore State

```typescript
interface AuthState {
  user: User | null;        // Usuário logado
  tenant: Tenant | null;    // Tenant do usuário
  isAuthenticated: boolean; // Se está autenticado
  isLoading: boolean;       // Se está fazendo login/logout
  isInitialized: boolean;   // Se já verificou token inicial
}
```

---

## Eventos

O AuthStore emite mudanças de estado que podem ser observadas:

```typescript
// Em App.tsx ou AuthGuard
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const isInitialized = useAuthStore((state) => state.isInitialized);

// Reage a mudanças de autenticação
useEffect(() => {
  if (isInitialized && !isAuthenticated) {
    // Redirecionar para login
  }
}, [isAuthenticated, isInitialized]);
```

---

## Deep Link Schema

O app responde ao schema `nckia://`:

| Path | Parâmetros | Tela |
|------|------------|------|
| `/auth/magic-link/verify` | `token` | MagicLinkVerifyScreen |

Exemplo de URL:
```
nckia://auth/magic-link/verify?token=abc123
https://app.nckia.com.br/auth/magic-link?token=abc123
```
