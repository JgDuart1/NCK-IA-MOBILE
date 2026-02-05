# Plano 07: Sprints - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/07-sprints`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03, 05 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── sprints/
│       ├── SprintsListScreen.tsx
│       ├── SprintNewScreen.tsx
│       ├── SprintDetailScreen.tsx
│       └── index.ts
│
├── components/
│   └── sprints/
│       ├── SprintCard.tsx
│       ├── SprintProgress.tsx
│       ├── SprintStatusBadge.tsx
│       ├── SprintTasksList.tsx
│       ├── SprintForm.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── sprints.api.ts
│
└── hooks/
    └── use-sprints.ts
```

---

## Implementações

## Integração com Tarefas (Plano 06)

Este plano se conecta diretamente ao módulo de tarefas já implementado no Plano 06.
Pontos já prontos no módulo de tarefas:
- `TaskForm` possui `SprintSelector` e aceita `sprint_id` no payload de criação/edição.
- `TasksListScreen` suporta filtro por `sprint_id` (via `TaskFiltersModal`).
- API de tarefas aceita `sprint_id` em `tasksApi.list` para filtrar tarefas por sprint.

O que ainda precisa ser conectado quando este plano for executado:
- Fornecer lista real de sprints para o `SprintSelector` e para os filtros (hoje está vazio).
- `SprintDetailScreen` deve usar `useTasks` filtrado por `sprint_id`.
- Navegação opcional da Sprint para o Kanban já existe via rota `TasksList`.

### 1. Sprints API (src/services/api/sprints.api.ts)

```typescript
import { apiClient } from './client';
import { Sprint } from '@/types';

interface CreateSprintDto {
  project_id: string;
  name: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
}

export const sprintsApi = {
  async list(projectId: string): Promise<Sprint[]> {
    const response = await apiClient.get(`/projects/${projectId}/sprints`);
    return response.data.data;
  },

  async getById(id: string): Promise<Sprint> {
    const response = await apiClient.get(`/sprints/${id}`);
    return response.data.data;
  },

  async create(data: CreateSprintDto): Promise<Sprint> {
    const response = await apiClient.post('/sprints', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateSprintDto>): Promise<Sprint> {
    const response = await apiClient.patch(`/sprints/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/sprints/${id}`);
  },

  async start(id: string): Promise<Sprint> {
    const response = await apiClient.post(`/sprints/${id}/start`);
    return response.data.data;
  },

  async complete(id: string): Promise<Sprint> {
    const response = await apiClient.post(`/sprints/${id}/complete`);
    return response.data.data;
  },
};
```

### 2. useSprints Hook (src/hooks/use-sprints.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sprintsApi } from '@/services/api/sprints.api';

export function useSprints(projectId: string) {
  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: () => sprintsApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useSprint(id: string) {
  return useQuery({
    queryKey: ['sprints', 'detail', id],
    queryFn: () => sprintsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sprintsApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprints', variables.project_id] });
    },
  });
}

export function useStartSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sprintsApi.start,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useCompleteSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sprintsApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useActiveSprint(projectId: string) {
  const { data: sprints } = useSprints(projectId);
  return sprints?.find((s) => s.status === 'ACTIVE') || null;
}
```

### 3. SprintCard Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sprint } from '@/types';
import { SprintStatusBadge } from './SprintStatusBadge';
import { SprintProgress } from './SprintProgress';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';

interface SprintCardProps {
  sprint: Sprint;
  onPress: () => void;
}

export function SprintCard({ sprint, onPress }: SprintCardProps) {
  const isActive = sprint.status === 'ACTIVE';
  const tasksTotal = sprint.tasks?.length || 0;
  const tasksDone = sprint.tasks?.filter((t) => t.status === 'DONE').length || 0;

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{sprint.name}</Text>
        <SprintStatusBadge status={sprint.status} />
      </View>

      {sprint.goal && (
        <Text style={styles.goal} numberOfLines={2}>
          {sprint.goal}
        </Text>
      )}

      <SprintProgress done={tasksDone} total={tasksTotal} />

      <View style={styles.footer}>
        <View style={styles.dates}>
          <Ionicons name="calendar-outline" size={14} color={darkTheme.textSecondary} />
          <Text style={styles.dateText}>
            {sprint.start_date ? formatDate(sprint.start_date) : 'Sem data'}
            {' - '}
            {sprint.end_date ? formatDate(sprint.end_date) : 'Sem data'}
          </Text>
        </View>
        <Text style={styles.tasksCount}>
          {tasksDone}/{tasksTotal} tarefas
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  containerActive: {
    borderWidth: 2,
    borderColor: darkTheme.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h4,
    color: darkTheme.text,
    flex: 1,
  },
  goal: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  tasksCount: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
```

### 4. SprintProgress Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface SprintProgressProps {
  done: number;
  total: number;
}

export function SprintProgress({ done, total }: SprintProgressProps) {
  const percentage = total > 0 ? (done / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.text}>{Math.round(percentage)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: darkTheme.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: darkTheme.primary,
    borderRadius: 3,
  },
  text: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    width: 40,
    textAlign: 'right',
  },
});
```

### 5. SprintsListScreen

```typescript
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SprintCard } from '@/components/sprints';
import { Button } from '@/components/ui';
import { EmptyState, LoadingScreen } from '@/components/feedback';
import { useSprints } from '@/hooks/use-sprints';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'SprintsList'>;

export function SprintsListScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { data: sprints, isLoading, refetch } = useSprints(projectId);

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={sprints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SprintCard
            sprint={item}
            onPress={() => navigation.navigate('SprintDetail', { projectId, sprintId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="layers-outline"
            title="Nenhuma sprint"
            message="Crie sua primeira sprint para organizar o trabalho"
            action={{
              label: 'Criar Sprint',
              onPress: () => navigation.navigate('SprintNew', { projectId }),
            }}
          />
        }
        refreshing={false}
        onRefresh={refetch}
      />

      <View style={styles.fab}>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('SprintNew', { projectId })}
          leftIcon={<Ionicons name="add" size={24} color="#fff" />}
        >
          Nova Sprint
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
  list: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Lista sprints corretamente
- [ ] Criar sprint funciona
- [ ] Detalhes carregam
- [ ] Iniciar sprint funciona
- [ ] Completar sprint funciona
- [ ] Progresso exibe corretamente

---

## Checklist de Entrega

- [ ] Todas as telas implementadas
- [ ] Componentes criados
- [ ] API e hooks funcionando
- [ ] Ações de status funcionando
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
