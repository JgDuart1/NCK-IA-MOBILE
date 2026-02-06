# Plano 05: Projetos - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/05-projetos`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── projects/
│       ├── ProjectsListScreen.tsx
│       ├── ProjectNewScreen.tsx
│       ├── ProjectDetailScreen.tsx
│       ├── ProjectMembersScreen.tsx
│       ├── ProjectSettingsScreen.tsx
│       └── index.ts
│
├── components/
│   └── projects/
│       ├── ProjectCard.tsx
│       ├── ProjectHeader.tsx
│       ├── ProjectTabs.tsx
│       ├── ProjectOverview.tsx
│       ├── MemberListItem.tsx
│       ├── ColorPicker.tsx
│       ├── WorkModeSelector.tsx
│       ├── StatusFilter.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── projects.api.ts
│
├── stores/
│   └── project.store.ts
│
└── hooks/
    ├── use-projects.ts
    └── use-project-members.ts
```

---

## Implementações

### 1. Project Store (src/stores/project.store.ts)

```typescript
import { create } from 'zustand';
import { Project } from '@/types';

interface ProjectState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
```

### 2. Projects API (src/services/api/projects.api.ts)

```typescript
import { apiClient } from './client';
import { Project, ProjectMember, PaginatedResponse } from '@/types';

interface CreateProjectDto {
  name: string;
  description?: string;
  work_mode: 'SCRUM' | 'KANBAN' | 'SIMPLE';
  color?: string;
  start_date?: string;
  end_date?: string;
}

interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
}

interface ProjectFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const projectsApi = {
  async list(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get('/projects', { params: filters });
    return response.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post('/projects', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch(`/projects/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  // Members
  async getMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await apiClient.get(`/projects/${projectId}/members`);
    return response.data.data;
  },

  async addMember(projectId: string, userId: string, role: string): Promise<ProjectMember> {
    const response = await apiClient.post(`/projects/${projectId}/members`, {
      user_id: userId,
      role,
    });
    return response.data.data;
  },

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/members/${memberId}`);
  },

  async updateMemberRole(projectId: string, memberId: string, role: string): Promise<ProjectMember> {
    const response = await apiClient.patch(`/projects/${projectId}/members/${memberId}`, {
      role,
    });
    return response.data.data;
  },
};
```

### 3. useProjects Hook (src/hooks/use-projects.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/services/api/projects.api';

export function useProjects(filters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.list(filters),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

### 4. ProjectsListScreen

```typescript
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProjectCard } from '@/components/projects';
import { StatusFilter } from '@/components/projects';
import { EmptyState, LoadingScreen } from '@/components/feedback';
import { Button } from '@/components/ui';
import { useProjects } from '@/hooks/use-projects';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'ProjectsList'>;

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'PAUSED', label: 'Pausados' },
  { value: 'ARCHIVED', label: 'Arquivados' },
];

export function ProjectsListScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, refetch } = useProjects({ search, status });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar projetos..."
          placeholderTextColor={darkTheme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Button
          variant="primary"
          size="sm"
          onPress={() => navigation.navigate('ProjectNew')}
          leftIcon={<Ionicons name="add" size={20} color="#fff" />}
        >
          Novo
        </Button>
      </View>

      <StatusFilter
        options={STATUS_OPTIONS}
        selected={status}
        onSelect={setStatus}
      />

      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="folder-outline"
            title="Nenhum projeto"
            message="Crie seu primeiro projeto para começar"
            action={{
              label: 'Criar Projeto',
              onPress: () => navigation.navigate('ProjectNew'),
            }}
          />
        }
        refreshing={false}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 8,
    padding: spacing.md,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
});
```

### 5. ProjectCard Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { Badge } from '@/components/ui';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

const STATUS_LABELS = {
  PLANNING: 'Planejando',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  COMPLETED: 'Concluído',
  ARCHIVED: 'Arquivado',
};

const STATUS_COLORS = {
  PLANNING: '#F59E0B',
  ACTIVE: '#10B981',
  PAUSED: '#6B7280',
  COMPLETED: '#3B82F6',
  ARCHIVED: '#4B5563',
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.colorBar, { backgroundColor: project.color || darkTheme.primary }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
          <Badge
            label={STATUS_LABELS[project.status]}
            color={STATUS_COLORS[project.status]}
          />
        </View>
        {project.description && (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        )}
        <View style={styles.footer}>
          <View style={styles.stat}>
            <Ionicons name="checkbox-outline" size={16} color={darkTheme.textSecondary} />
            <Text style={styles.statText}>Tarefas</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={16} color={darkTheme.textSecondary} />
            <Text style={styles.statText}>Membros</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h4,
    color: darkTheme.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
```

### 6. ProjectDetailScreen

```typescript
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProjectHeader, ProjectTabs, ProjectOverview } from '@/components/projects';
import { LoadingScreen, ErrorState } from '@/components/feedback';
import { useProject } from '@/hooks/use-projects';
import { useProjectStore } from '@/stores/project.store';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'ProjectDetail'>;

export function ProjectDetailScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { data: project, isLoading, error, refetch } = useProject(projectId);
  const setSelectedProject = useProjectStore((s) => s.setSelectedProject);

  React.useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
    return () => setSelectedProject(null);
  }, [project]);

  if (isLoading) return <LoadingScreen />;
  if (error || !project) {
    return (
      <ErrorState
        title="Projeto não encontrado"
        message="Não foi possível carregar o projeto"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  const tabs = [
    { key: 'overview', label: 'Visão Geral', icon: 'grid-outline' },
    { key: 'tasks', label: 'Tarefas', icon: 'checkbox-outline' },
    { key: 'sprints', label: 'Sprints', icon: 'layers-outline' },
    { key: 'notes', label: 'Notas', icon: 'document-text-outline' },
    { key: 'calendar', label: 'Calendário', icon: 'calendar-outline' },
    { key: 'canvas', label: 'Canvas', icon: 'bulb-outline' },
    { key: 'members', label: 'Membros', icon: 'people-outline' },
    { key: 'settings', label: 'Config', icon: 'settings-outline' },
  ];

  const handleTabPress = (key: string) => {
    switch (key) {
      case 'tasks':
        navigation.navigate('TasksList', { projectId });
        break;
      case 'sprints':
        navigation.navigate('SprintsList', { projectId });
        break;
      case 'notes':
        navigation.navigate('ProjectNotes', { projectId });
        break;
      case 'calendar':
        navigation.navigate('CalendarTab', { screen: 'Calendar', params: { projectId } });
        break;
      case 'canvas':
        navigation.navigate('ProjectCanvas', { projectId });
        break;
      case 'members':
        navigation.navigate('ProjectMembers', { projectId });
        break;
      case 'settings':
        navigation.navigate('ProjectSettings', { projectId });
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProjectHeader
        project={project}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <ProjectTabs tabs={tabs} onTabPress={handleTabPress} />
        <ProjectOverview project={project} />
      </ScrollView>
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
});
```

---

## Testes

### Testes Manuais
- [ ] Lista projetos corretamente
- [ ] Filtros funcionam
- [ ] Busca funciona
- [ ] Criar projeto funciona
- [ ] Detalhes carregam corretamente
- [ ] Navegação para sub-telas funciona
- [ ] Gerenciar membros funciona
- [ ] Editar configurações funciona

---

## Checklist de Entrega

- [ ] Todas as telas implementadas
- [ ] Componentes criados
- [ ] API e hooks funcionando
- [ ] Store de projeto
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
