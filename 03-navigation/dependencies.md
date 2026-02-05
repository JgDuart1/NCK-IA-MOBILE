# Plano 03: Navegação - Dependencies

## O Que Este Plano Provê

### Exports

#### Navegação (`src/navigation/`)

| Export | Import Path | Descrição |
|--------|-------------|-----------|
| `RootNavigator` | `@/navigation` | Navigator raiz do app |
| Types | `@/navigation/types` | Tipagens de navegação |

#### Types Importantes

```typescript
// Para usar em qualquer tela
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'ProjectDetail'>;

function ProjectDetailScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  // ...
}
```

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | De | Uso |
|--------|-----|-----|
| `LoadingScreen` | `@/components/feedback` | Loading inicial |
| `darkTheme` | `@/theme` | Cores de navegação |
| `Providers` | `@/providers` | Wrapper no App.tsx |

### Do Plano 02 (auth)

| Import | De | Uso |
|--------|-----|-----|
| `useAuthStore` | `@/stores/auth.store` | Estado de autenticação |
| `LoginScreen` | `@/screens/auth` | Tela de login |
| `MagicLinkEmailScreen` | `@/screens/auth` | Tela magic link |
| `MagicLinkSentScreen` | `@/screens/auth` | Tela confirmação |
| `MagicLinkVerifyScreen` | `@/screens/auth` | Tela verificação |

---

## Planos Dependentes

Todos os planos de feature usam a navegação:

| Plano | Usa |
|-------|-----|
| 04-dashboard | `DashboardStack`, navigation types |
| 05-projetos | `ProjectsStack`, `ProjectsScreenProps` |
| 06-tarefas | `ProjectsStack` (sub-rotas de tasks) |
| 07-sprints | `ProjectsStack` (sub-rotas de sprints) |
| 08-notas | `ProjectsStack` + `MoreStack` |
| 09-calendario | `CalendarStack`, `CalendarScreenProps` |
| 10-notificacoes | `NotificationsStack` |
| 11-canvas | `ProjectsStack` + `MoreStack` |
| 12-caverna | `MoreStack` |
| 13-usuarios | `MoreStack` |
| 14-config | `MoreStack` |

---

## Contratos

### Navegação Tipada

Cada stack exporta seu ParamList. Para navegar:

```typescript
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<ProjectsStackParamList>;

function MyComponent() {
  const navigation = useNavigation<NavigationProp>();

  const goToProject = (projectId: string) => {
    navigation.navigate('ProjectDetail', { projectId });
  };
}
```

### Acessar Parâmetros

```typescript
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ProjectsStackParamList } from '@/navigation/types';

type RouteProps = RouteProp<ProjectsStackParamList, 'ProjectDetail'>;

function ProjectDetailScreen() {
  const route = useRoute<RouteProps>();
  const { projectId } = route.params;
}
```

### Registrar Novas Telas

Quando um plano implementar suas telas, deve:

1. Importar o componente real no Stack correspondente
2. Substituir o `PlaceholderScreen`
3. Configurar options do header

```typescript
// Antes (placeholder)
<Stack.Screen name="ProjectsList" component={PlaceholderScreen} />

// Depois (implementado pelo Plano 05)
import { ProjectsListScreen } from '@/screens/projects';
<Stack.Screen name="ProjectsList" component={ProjectsListScreen} />
```

---

## Deep Links

| URL | Tela | Parâmetros |
|-----|------|------------|
| `nckia://login` | LoginScreen | - |
| `nckia://auth/magic-link/verify?token=X` | MagicLinkVerifyScreen | token |
| `nckia://dashboard` | Dashboard | - |
| `nckia://projects` | ProjectsList | - |
| `nckia://projects/:id` | ProjectDetail | projectId |
| `nckia://projects/:id/tasks/:taskId` | TaskDetail | projectId, taskId |
| `nckia://calendar` | Calendar | - |
| `nckia://events/:id` | EventDetail | eventId |
| `nckia://notifications` | NotificationsList | - |

---

## Hooks Úteis

### useNavigationReady

```typescript
import { useNavigationContainerRef } from '@react-navigation/native';

// Para navegação programática fora de componentes
export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}
```

---

## Convenções

### Nomenclatura de Rotas
- PascalCase: `ProjectDetail`, `TaskNew`
- Sufixos: `List`, `Detail`, `New`, `Edit`

### Nomenclatura de Stacks
- `{Feature}Stack`: `ProjectsStack`, `CalendarStack`
- `{Feature}Tab`: `ProjectsTab`, `CalendarTab`

### Parâmetros
- IDs: `projectId`, `taskId`, `eventId`
- Opcionais: `date?`, `sprintId?`
