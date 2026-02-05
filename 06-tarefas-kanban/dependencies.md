# Plano 06: Tarefas e Kanban - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/tasks/`)

| Export | Descrição |
|--------|-----------|
| `TasksListScreen` | Kanban de tarefas |
| `TaskNewScreen` | Criar tarefa |
| `TaskDetailScreen` | Detalhes da tarefa |
| `TaskEditScreen` | Editar tarefa |

#### Components (`src/components/tasks/`)

| Export | Descrição |
|--------|-----------|
| `KanbanBoard` | Container Kanban |
| `KanbanColumn` | Coluna do Kanban |
| `TaskCard` | Card de tarefa |
| `TaskCardDraggable` | Card arrastável |
| `PriorityBadge` | Badge de prioridade |
| `AssigneeSelector` | Seletor de usuário |
| `SprintSelector` | Seletor de sprint |
| `AttachmentGrid` | Grid de anexos |
| `AttachmentItem` | Item de anexo |
| `TaskFiltersModal` | Modal de filtros |
| `TaskForm` | Formulário de tarefa |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useTasks` | Lista de tarefas |
| `useTask` | Tarefa por ID |
| `useTasksByStatus` | Tarefas agrupadas |
| `useUpdateTaskStatus` | Mutation de status |
| `useCreateTask` | Mutation criar |
| `useUpdateTask` | Mutation atualizar |
| `useDeleteTask` | Mutation excluir |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Avatar`, `Badge`, `Skeleton` | Componentes UI |
| `Button`, `Input`, `Modal` | Formulários |
| `attachmentService` | Upload/download |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Usuário para assignee |

### Do Plano 03 (navigation)

| Import | Uso |
|--------|-----|
| `ProjectsScreenProps` | Tipagem |

### Do Plano 05 (projetos)

| Import | Uso |
|--------|-----|
| `useProjectStore` | Projeto atual |
| `useProjectMembers` | Lista de membros para assignee |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 07-sprints | `useTasks` filtrado por sprint |
| 08-notas | Navegação para tarefa |

---

## Contratos

### PriorityBadge

```typescript
interface PriorityBadgeProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  size?: 'sm' | 'md';
}

// Cores
const PRIORITY_COLORS = {
  LOW: '#6B7280',
  MEDIUM: '#3B82F6',
  HIGH: '#F59E0B',
  URGENT: '#EF4444',
};
```

### Status de Tarefa

```typescript
type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';

// Ordem para Kanban
const STATUS_ORDER = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
```

### AttachmentGrid

```typescript
interface AttachmentGridProps {
  attachments: Attachment[];
  onDelete?: () => void;
  editable?: boolean;
}
```
