# Plano 07: Sprints - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/sprints/`)

| Export | Descrição |
|--------|-----------|
| `SprintsListScreen` | Lista de sprints |
| `SprintNewScreen` | Criar sprint |
| `SprintDetailScreen` | Detalhes da sprint |

#### Components (`src/components/sprints/`)

| Export | Descrição |
|--------|-----------|
| `SprintCard` | Card de sprint |
| `SprintProgress` | Barra de progresso |
| `SprintStatusBadge` | Badge de status |
| `SprintTasksList` | Lista de tarefas |
| `SprintForm` | Formulário |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useSprints` | Lista de sprints |
| `useSprint` | Sprint por ID |
| `useActiveSprint` | Sprint ativa do projeto |
| `useCreateSprint` | Mutation criar |
| `useUpdateSprint` | Mutation editar |
| `useDeleteSprint` | Mutation excluir |
| `useStartSprint` | Mutation iniciar |
| `useCompleteSprint` | Mutation completar |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Badge`, `Button`, `Input` | Componentes UI |
| `EmptyState`, `LoadingScreen` | Feedback |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 05 (projetos)

| Import | Uso |
|--------|-----|
| `useProjectStore` | Projeto atual |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 06-tarefas | `SprintSelector`, `useSprints` |

---

## Contratos

### SprintStatusBadge

```typescript
interface SprintStatusBadgeProps {
  status: 'PLANNING' | 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

const STATUS_COLORS = {
  PLANNING: '#6B7280',
  PLANNED: '#3B82F6',
  ACTIVE: '#10B981',
  COMPLETED: '#8B5CF6',
  CANCELLED: '#EF4444',
};

const STATUS_LABELS = {
  PLANNING: 'Planejando',
  PLANNED: 'Planejada',
  ACTIVE: 'Ativa',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};
```

### useActiveSprint

Retorna a sprint ativa do projeto (apenas uma pode estar ativa):

```typescript
const activeSprint = useActiveSprint(projectId);
// null se não houver sprint ativa
```
