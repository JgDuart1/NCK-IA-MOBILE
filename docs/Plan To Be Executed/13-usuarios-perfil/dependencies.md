# Plano 13: Usuários e Perfil - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/profile/`)

| Export | Descrição |
|--------|-----------|
| `ProfileScreen` | Visualização do perfil |
| `EditProfileScreen` | Editar perfil |
| `ChangePasswordScreen` | Alterar senha |
| `InviteUserScreen` | Convidar usuário |
| `PendingInvitesScreen` | Convites pendentes |

#### Components (`src/components/profile/`)

| Export | Descrição |
|--------|-----------|
| `ProfileCard` | Card do perfil |
| `ProfileInfo` | Informações do perfil |
| `AvatarPicker` | Seletor de avatar |
| `PasswordStrength` | Indicador de força |
| `RoleSelector` | Seletor de role |
| `InviteCard` | Card de convite |
| `InviteStatusBadge` | Badge de status |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useUpdateProfile` | Mutation atualizar |
| `useUploadAvatar` | Mutation avatar |
| `useRemoveAvatar` | Mutation remover avatar |
| `useChangePassword` | Mutation senha |
| `useInvites` | Lista de convites |
| `useSendInvite` | Mutation convidar |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Avatar`, `Button`, `Card`, `Input` | Componentes UI |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Dados do usuário |
| `useAuthStore` | refreshUser |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 06-tarefas | `RoleSelector` para membros |

---

## Contratos

### Invite Status

```typescript
type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

const STATUS_CONFIG = {
  PENDING: { label: 'Pendente', color: '#F59E0B' },
  ACCEPTED: { label: 'Aceito', color: '#10B981' },
  EXPIRED: { label: 'Expirado', color: '#6B7280' },
};
```

### Role Types

```typescript
type RoleType = 
  | 'SUPER_ADMIN'
  | 'NUCLEO_NCK'
  | 'AGENTE_NCK'
  | 'CLIENTE'
  | 'FORNECEDOR'
  | 'INVESTIDOR';

const ROLE_LABELS: Record<RoleType, string> = {
  SUPER_ADMIN: 'Super Admin',
  NUCLEO_NCK: 'Núcleo NCK',
  AGENTE_NCK: 'Agente NCK',
  CLIENTE: 'Cliente',
  FORNECEDOR: 'Fornecedor',
  INVESTIDOR: 'Investidor',
};
```

### Password Validation

```typescript
const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false,
};
```
