# Plano 04: Dashboard - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/dashboard/`)

| Export | Descrição |
|--------|-----------|
| `DashboardScreen` | Tela principal do dashboard |

#### Components (`src/components/dashboard/`)

| Export | Descrição |
|--------|-----------|
| `DashboardHeader` | Header com saudação e ações |
| `MetricCard` | Card de métrica individual |
| `MetricsRow` | Linha de cards de métricas |
| `QuickActions` | Botões de ação rápida |
| `RecentProjects` | Lista horizontal de projetos |
| `TimelineList` | Lista de timeline |
| `TimelineItem` | Item individual da timeline |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useDashboardMetrics` | Métricas do dashboard |
| `useRecentProjects` | Projetos recentes |
| `useTimeline` | Timeline com infinite scroll |
| `useMyTasks` | Tarefas do usuário |
| `useTodayEvents` | Eventos de hoje |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Avatar`, `Badge`, `Skeleton` | Componentes UI |
| `apiClient` | Requisições HTTP |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Dados do usuário logado |

### Do Plano 03 (navigation)

| Import | Uso |
|--------|-----|
| Navigation types | Tipagem de navegação |
  
---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| Nenhum | Este é um plano terminal |

---

## Contratos

### TimelineItem Reutilizável

O `TimelineItem` pode ser usado em outras telas:

```typescript
import { TimelineItem } from '@/components/dashboard';

<TimelineItem
  entry={timelineEntry}
  onPress={() => navigateToEntity(entry)}
/>
```

### Métricas

A API deve retornar:

```typescript
interface DashboardMetrics {
  active_projects: number;
  pending_tasks: number;
  tasks_today: number;
  events_today: number;
}
```
