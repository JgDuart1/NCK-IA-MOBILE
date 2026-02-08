# Plano 01: Estrutura Base - Dependencies

## O Que Este Plano Provê

Este é o plano **fundacional**. Todos os demais planos dependem dele.

### Exports

#### Componentes UI (`src/components/`)

| Componente | Import Path | Descrição |
|------------|-------------|-----------|
| `Button` | `@/components/ui` | Botão com variantes |
| `Input` | `@/components/ui` | Campo de texto |
| `Card` | `@/components/ui` | Container card |
| `Avatar` | `@/components/ui` | Imagem de perfil |
| `Badge` | `@/components/ui` | Etiqueta de status |
| `Skeleton` | `@/components/ui` | Loading placeholder |
| `Modal` | `@/components/ui` | Dialog modal |
| `Toast` | `@/components/ui` | Notificação toast |
| `LoadingScreen` | `@/components/feedback` | Tela de loading |
| `EmptyState` | `@/components/feedback` | Estado vazio |
| `ErrorState` | `@/components/feedback` | Estado de erro |

#### Services (`src/services/`)

| Service | Import Path | Descrição |
|---------|-------------|-----------|
| `apiClient` | `@/services/api` | Axios instance configurado |
| `secureStorage` | `@/services/storage` | Tokens (SecureStore) |
| `asyncStorage` | `@/services/storage` | Dados gerais (AsyncStorage) |
| `attachmentService` | `@/services/attachments` | Upload/download de anexos |

#### Theme (`src/theme/`)

| Export | Import Path | Descrição |
|--------|-------------|-----------|
| `colors` | `@/theme` | Paleta de cores |
| `darkTheme` | `@/theme` | Tema dark |
| `spacing` | `@/theme` | Espaçamentos |
| `typography` | `@/theme` | Estilos de texto |

#### Hooks (`src/hooks/`)

| Hook | Import Path | Descrição |
|------|-------------|-----------|
| `useTheme` | `@/hooks` | Acesso ao tema atual |

#### Types (`src/types/`)

Todos os tipos definidos em `contracts.md` são re-exportados de `@/types`.

#### Providers (`src/providers/`)

| Provider | Import Path | Descrição |
|----------|-------------|-----------|
| `Providers` | `@/providers` | Wrapper com todos os providers |
| `ThemeProvider` | `@/providers` | Provider de tema |
| `QueryProvider` | `@/providers` | React Query provider |

---

## O Que Este Plano Consome

**Nenhum** - Este é o plano base.

---

## Planos Dependentes

Todos os planos dependem deste:

| Plano | Usa |
|-------|-----|
| 02-auth | apiClient, secureStorage, Button, Input, LoadingScreen |
| 03-navigation | Theme, Providers |
| 04-dashboard | Card, Avatar, Badge, Skeleton, apiClient |
| 05-projetos | Card, Badge, EmptyState, apiClient |
| 06-tarefas | Card, Badge, attachmentService, apiClient |
| 07-sprints | Card, Badge, apiClient |
| 08-notas | Card, attachmentService, apiClient |
| 09-calendario | Card, Badge, Modal, apiClient |
| 10-notificacoes | Card, Badge, apiClient |
| 11-canvas | Card, apiClient |
| 12-caverna | Card, Badge, apiClient |
| 13-usuarios | Avatar, Button, Input, apiClient |
| 14-config | Card, Button, asyncStorage |
| 15-deployment | assets/, app.json |

---

## Contratos

### API Client

O `apiClient` já inclui:
- Base URL configurável via `EXPO_PUBLIC_API_URL`
- Interceptor que adiciona `Authorization: Bearer <token>`
- Interceptor que tenta refresh automático em 401
- Timeout de 30 segundos

**Uso:**
```typescript
import { apiClient } from '@/services/api';

const response = await apiClient.get('/projects');
const data = response.data;
```

### Secure Storage

Tokens são gerenciados pelo `secureStorage`:

```typescript
import { secureStorage } from '@/services/storage';

// Salvar tokens (após login)
await secureStorage.setTokens(accessToken, refreshToken);

// Recuperar token (automático nos interceptors)
const token = await secureStorage.getAccessToken();

// Limpar tokens (logout)
await secureStorage.clearTokens();
```

### Attachment Service

Upload de arquivos:

```typescript
import { attachmentService } from '@/services/attachments';

// Selecionar imagem
const result = await attachmentService.pickImage();
if (!result.canceled) {
  const upload = await attachmentService.upload(
    result.assets[0].uri,
    'task',
    taskId
  );
}

// Download
const localPath = await attachmentService.download(attachment);
```

---

## Path Aliases

O tsconfig.json configura:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Uso: `import { Button } from '@/components/ui'`

---

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EXPO_PUBLIC_API_URL` | URL base da API | `https://api.nckia.com.br/api/v1` |

Configurar em `app.json` ou `.env`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.EXPO_PUBLIC_API_URL
    }
  }
}
```
