# Plano 06: Tarefas e Kanban - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/06-tarefas-kanban`
- **Timeout**: 2.5 horas
- **Dependências**: Planos 01, 02, 03, 05 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── tasks/
│       ├── TasksListScreen.tsx
│       ├── TaskNewScreen.tsx
│       ├── TaskDetailScreen.tsx
│       ├── TaskEditScreen.tsx
│       └── index.ts
│
├── components/
│   └── tasks/
│       ├── KanbanBoard.tsx
│       ├── KanbanColumn.tsx
│       ├── TaskCard.tsx
│       ├── TaskCardDraggable.tsx
│       ├── PriorityBadge.tsx
│       ├── AssigneeSelector.tsx
│       ├── SprintSelector.tsx
│       ├── AttachmentGrid.tsx
│       ├── AttachmentItem.tsx
│       ├── TaskFiltersModal.tsx
│       ├── TaskForm.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── tasks.api.ts
│
└── hooks/
    ├── use-tasks.ts
    └── use-task-mutations.ts
```

---

## Implementações

### 1. Tasks API (src/services/api/tasks.api.ts)

```typescript
import { apiClient } from './client';
import { Task, PaginatedResponse } from '@/types';

interface TaskFilters {
  project_id: string;
  sprint_id?: string;
  assignee_id?: string;
  priority?: string;
  status?: string;
  search?: string;
}

interface CreateTaskDto {
  project_id: string;
  sprint_id?: string;
  assignee_id?: string;
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  deadline?: string;
}

interface UpdateTaskDto extends Partial<CreateTaskDto> {
  status?: string;
}

export const tasksApi = {
  async list(filters: TaskFilters): Promise<Task[]> {
    const response = await apiClient.get('/tasks', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post('/tasks', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status });
    return response.data.data;
  },

  async reorder(id: string, order_index: number, status?: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/order`, {
      order_index,
      status,
    });
    return response.data.data;
  },
};
```

### 2. useTasks Hook (src/hooks/use-tasks.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api/tasks.api';
import { Task } from '@/types';

export function useTasks(projectId: string, filters = {}) {
  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => tasksApi.list({ project_id: projectId, ...filters }),
    enabled: !!projectId,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useTasksByStatus(projectId: string, filters = {}) {
  const query = useTasks(projectId, filters);

  const grouped = React.useMemo(() => {
    const tasks = query.data || [];
    return {
      BACKLOG: tasks.filter((t) => t.status === 'BACKLOG'),
      TODO: tasks.filter((t) => t.status === 'TODO'),
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
      IN_REVIEW: tasks.filter((t) => t.status === 'IN_REVIEW'),
      DONE: tasks.filter((t) => t.status === 'DONE'),
    };
  }, [query.data]);

  return { ...query, grouped };
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tasksApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === id ? { ...task, status } : task
        );
      });

      return { previousTasks };
    },
    onError: (_, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

### 3. KanbanBoard Component

```typescript
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { KanbanColumn } from './KanbanColumn';
import { Task } from '@/types';
import { darkTheme, spacing } from '@/theme';

interface KanbanBoardProps {
  tasks: Record<string, Task[]>;
  onTaskPress: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: string) => void;
  isLoading?: boolean;
}

const COLUMNS = [
  { key: 'BACKLOG', label: 'Backlog', color: '#6B7280' },
  { key: 'TODO', label: 'A Fazer', color: '#3B82F6' },
  { key: 'IN_PROGRESS', label: 'Em Progresso', color: '#F59E0B' },
  { key: 'IN_REVIEW', label: 'Em Revisão', color: '#8B5CF6' },
  { key: 'DONE', label: 'Concluído', color: '#10B981' },
];

export function KanbanBoard({ tasks, onTaskPress, onTaskDrop, isLoading }: KanbanBoardProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.key}
          title={column.label}
          color={column.color}
          tasks={tasks[column.key] || []}
          status={column.key}
          onTaskPress={onTaskPress}
          onTaskDrop={onTaskDrop}
          isLoading={isLoading}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
});
```

### 4. KanbanColumn Component

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { TaskCard } from './TaskCard';
import { Skeleton } from '@/components/ui';
import { Task } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

const COLUMN_WIDTH = Dimensions.get('window').width * 0.75;

interface KanbanColumnProps {
  title: string;
  color: string;
  tasks: Task[];
  status: string;
  onTaskPress: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: string) => void;
  isLoading?: boolean;
}

export function KanbanColumn({
  title,
  color,
  tasks,
  status,
  onTaskPress,
  onTaskDrop,
  isLoading,
}: KanbanColumnProps) {
  return (
    <View style={[styles.container, { borderTopColor: color }]}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{tasks.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <>
            <Skeleton height={100} borderRadius={8} />
            <Skeleton height={100} borderRadius={8} />
            <Skeleton height={100} borderRadius={8} />
          </>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskPress(task)}
              onDrop={(newStatus) => onTaskDrop(task.id, newStatus)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: COLUMN_WIDTH,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderTopWidth: 3,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    flex: 1,
  },
  badge: {
    backgroundColor: darkTheme.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
});
```

### 5. TaskCard Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { Avatar } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { formatRelativeDate } from '@/utils/format';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onDrop?: (newStatus: string) => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  const hasAttachments = task.attachments && task.attachments.length > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <PriorityBadge priority={task.priority} />
        {task.deadline && (
          <Text style={styles.deadline}>
            {formatRelativeDate(task.deadline)}
          </Text>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>

      {task.description && (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      )}

      <View style={styles.footer}>
        {task.assignee ? (
          <Avatar
            uri={task.assignee.avatar_url}
            name={task.assignee.name}
            size={24}
          />
        ) : (
          <View style={styles.noAssignee}>
            <Ionicons name="person-outline" size={16} color={darkTheme.textSecondary} />
          </View>
        )}

        <View style={styles.footerRight}>
          {hasAttachments && (
            <View style={styles.iconWithCount}>
              <Ionicons name="attach" size={14} color={darkTheme.textSecondary} />
              <Text style={styles.count}>{task.attachments!.length}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surfaceSecondary,
    borderRadius: 8,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  deadline: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noAssignee: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: darkTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  count: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
```

### 6. TaskDetailScreen

```typescript
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PriorityBadge, AttachmentGrid } from '@/components/tasks';
import { Avatar, Badge, Button } from '@/components/ui';
import { LoadingScreen, ErrorState } from '@/components/feedback';
import { useTask } from '@/hooks/use-tasks';
import { attachmentService } from '@/services/attachments';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'TaskDetail'>;

export function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { data: task, isLoading, error, refetch } = useTask(taskId);

  if (isLoading) return <LoadingScreen />;
  if (error || !task) {
    return <ErrorState title="Erro" message="Tarefa não encontrada" action={{ label: 'Tentar novamente', onPress: refetch }} />;
  }

  const handleAddAttachment = async () => {
    try {
      const result = await attachmentService.pickImage();
      if (!result.canceled) {
        await attachmentService.upload(result.assets[0].uri, 'task', taskId);
        refetch();
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <PriorityBadge priority={task.priority} />
          <Badge label={task.status.replace('_', ' ')} />
        </View>

        <Text style={styles.title}>{task.title}</Text>

        {task.assignee && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Responsável</Text>
            <View style={styles.assignee}>
              <Avatar uri={task.assignee.avatar_url} name={task.assignee.name} size={32} />
              <Text style={styles.assigneeName}>{task.assignee.name}</Text>
            </View>
          </View>
        )}

        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descrição</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Anexos</Text>
            <Button variant="ghost" size="sm" onPress={handleAddAttachment}>
              Adicionar
            </Button>
          </View>
          <AttachmentGrid attachments={task.attachments || []} onDelete={refetch} />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          variant="outline"
          onPress={() => navigation.navigate('TaskEdit', { taskId })}
          fullWidth
        >
          Editar
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
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.sm,
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  assigneeName: {
    ...typography.body,
    color: darkTheme.text,
  },
  description: {
    ...typography.body,
    color: darkTheme.text,
  },
  actions: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Kanban exibe colunas corretamente
- [ ] Tasks aparecem na coluna correta
- [ ] Drag and drop funciona
- [ ] Criar tarefa funciona
- [ ] Detalhes carregam corretamente
- [ ] Anexos funcionam (upload/view/delete)
- [ ] Filtros funcionam

---

## Checklist de Entrega

- [ ] KanbanBoard funcionando
- [ ] Drag and drop implementado
- [ ] CRUD de tarefas completo
- [ ] Anexos integrados
- [ ] Filtros implementados
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
