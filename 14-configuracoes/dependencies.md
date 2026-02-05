# Plano 14: Configurações - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/settings/`)

| Export | Descrição |
|--------|-----------|
| `SettingsScreen` | Tela de configurações |
| `AboutScreen` | Sobre o app |

#### Components (`src/components/settings/`)

| Export | Descrição |
|--------|-----------|
| `SettingsSection` | Seção agrupadora |
| `SettingsItem` | Item de configuração |
| `SettingsToggle` | Toggle com label |
| `CacheInfo` | Info de cache |
| `AppInfo` | Info do app |
| `LinkItem` | Link externo |

#### Services (`src/services/cache/`)

| Export | Descrição |
|--------|-----------|
| `cacheService` | Gerenciamento de cache |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useSettings` | Configurações do app |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Button`, `Card` | Componentes UI |
| `asyncStorage` | Persistir settings |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | logout |

---

## Planos Dependentes

Nenhum plano depende diretamente deste.

---

## Contratos

### AppSettings

```typescript
interface AppSettings {
  pushEnabled: boolean;   // Notificações push
  soundEnabled: boolean;  // Som de notificação
}

const DEFAULT_SETTINGS: AppSettings = {
  pushEnabled: true,
  soundEnabled: true,
};
```

### SettingsItem

```typescript
interface SettingsItemProps {
  icon: string;           // Nome do ícone Ionicons
  label: string;          // Texto do item
  value?: string;         // Valor exibido (opcional)
  onPress?: () => void;   // Ação ao pressionar
  toggle?: boolean;       // Se é um toggle
  toggleValue?: boolean;  // Valor do toggle
  onToggle?: (v: boolean) => void; // Callback do toggle
  danger?: boolean;       // Estilo de perigo (vermelho)
}
```

### App Info

Obtido via `expo-constants`:

```typescript
import Constants from 'expo-constants';

const version = Constants.expoConfig?.version;
const buildNumber = Constants.expoConfig?.android?.versionCode;
```
