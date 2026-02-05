# Plano 04: Dashboard - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/04-dashboard`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── dashboard/
│       ├── DashboardScreen.tsx
│       └── index.ts
│
├── components/
│   └── dashboard/
│       ├── MetricCard.tsx
│       ├── MetricsRow.tsx
│       ├── QuickActions.tsx
│       ├── RecentProjects.tsx
│       ├── TimelineList.tsx
│       ├── TimelineItem.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── dashboard.api.ts
│
└── hooks/
    └── use-dashboard.ts
```

---

## Types

```typescript
interface DashboardMetrics {
  active_projects: number;
  pending_tasks: number;
  tasks_today: number;
  events_today: number;
}

interface QuickProject {
  id: string;
  name: string;
  color: string | null;
  tasks_count: number;
}
```

---

## Implementações

### 1. Dashboard API (src/services/api/dashboard.api.ts)

```typescript
import { apiClient } from './client';
import { TimelineEntry, Project, Task, Event } from '@/types';

interface DashboardMetrics {
  active_projects: number;
  pending_tasks: number;
  tasks_today: number;
  events_today: number;
}

export const dashboardApi = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  },

  async getRecentProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects', {
      params: { limit: 5, sort: '-updated_at' },
    });
    return response.data.data;
  },

  async getTimeline(page = 1): Promise<{ data: TimelineEntry[]; hasMore: boolean }> {
    const response = await apiClient.get('/timeline', {
      params: { page, per_page: 20 },
    });
    return {
      data: response.data.data,
      hasMore: response.data.meta.page < response.data.meta.total_pages,
    };
  },

  async getMyTasks(): Promise<Task[]> {
    const response = await apiClient.get('/tasks', {
      params: { assignee: 'me', status: 'TODO,IN_PROGRESS', limit: 10 },
    });
    return response.data.data;
  },

  async getTodayEvents(): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    const response = await apiClient.get('/events', {
      params: { start_at_gte: today, limit: 5 },
    });
    return response.data.data;
  },
};
```

### 2. useDashboard Hook (src/hooks/use-dashboard.ts)

```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api/dashboard.api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardApi.getMetrics,
  });
}

export function useRecentProjects() {
  return useQuery({
    queryKey: ['dashboard', 'recent-projects'],
    queryFn: dashboardApi.getRecentProjects,
  });
}

export function useTimeline() {
  return useInfiniteQuery({
    queryKey: ['dashboard', 'timeline'],
    queryFn: ({ pageParam = 1 }) => dashboardApi.getTimeline(pageParam),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });
}

export function useMyTasks() {
  return useQuery({
    queryKey: ['dashboard', 'my-tasks'],
    queryFn: dashboardApi.getMyTasks,
  });
}

export function useTodayEvents() {
  return useQuery({
    queryKey: ['dashboard', 'today-events'],
    queryFn: dashboardApi.getTodayEvents,
  });
}
```

### 3. Dashboard Screen (src/screens/dashboard/DashboardScreen.tsx)

```typescript
import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsRow } from '@/components/dashboard/MetricsRow';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { TimelineList } from '@/components/dashboard/TimelineList';
import { useDashboardMetrics, useRecentProjects, useTimeline } from '@/hooks/use-dashboard';
import { useAuth } from '@/hooks/use-auth';
import { darkTheme, spacing } from '@/theme';

export function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const metrics = useDashboardMetrics();
  const projects = useRecentProjects();
  const timeline = useTimeline();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkTheme.primary}
          />
        }
      >
        <DashboardHeader
          greeting={getGreeting()}
          userName={user?.name || ''}
          avatarUrl={user?.avatar_url}
          onNotificationsPress={() => navigation.navigate('NotificationsTab')}
        />

        <MetricsRow
          metrics={metrics.data}
          isLoading={metrics.isLoading}
        />

        <QuickActions
          onNewTask={() => navigation.navigate('ProjectsTab', {
            screen: 'TaskNew',
            params: { projectId: undefined },
          })}
          onNewEvent={() => navigation.navigate('CalendarTab', {
            screen: 'EventNew',
          })}
        />

        <RecentProjects
          projects={projects.data || []}
          isLoading={projects.isLoading}
          onProjectPress={(projectId) => navigation.navigate('ProjectsTab', {
            screen: 'ProjectDetail',
            params: { projectId },
          })}
          onSeeAll={() => navigation.navigate('ProjectsTab')}
        />

        <TimelineList
          timeline={timeline}
          onItemPress={(entry) => {
            // Navegar para entidade baseado no tipo
          }}
        />
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
    gap: spacing.lg,
  },
});
```

### 4. MetricCard Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme, spacing, typography } from '@/theme';
import { Skeleton } from '@/components/ui';

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color?: string;
  isLoading?: boolean;
}

export function MetricCard({ icon, value, label, color = darkTheme.primary, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={50} height={24} style={{ marginTop: 8 }} />
        <Skeleton width={70} height={16} style={{ marginTop: 4 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...typography.h2,
    color: darkTheme.text,
    marginTop: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
});
```

### 5. TimelineItem Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimelineEntry, TimelineAction } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { Avatar } from '@/components/ui';
import { formatRelativeTime } from '@/utils/format';

interface TimelineItemProps {
  entry: TimelineEntry;
  onPress: () => void;
}

const ACTION_CONFIG: Record<TimelineAction, { icon: string; color: string; text: string }> = {
  CREATED: { icon: 'add-circle', color: '#10B981', text: 'criou' },
  UPDATED: { icon: 'pencil', color: '#3B82F6', text: 'atualizou' },
  DELETED: { icon: 'trash', color: '#EF4444', text: 'excluiu' },
  STATUS_CHANGED: { icon: 'swap-horizontal', color: '#F59E0B', text: 'alterou status de' },
  MEMBER_ADDED: { icon: 'person-add', color: '#10B981', text: 'adicionou membro em' },
  MEMBER_REMOVED: { icon: 'person-remove', color: '#EF4444', text: 'removeu membro de' },
  ASSIGNED: { icon: 'person', color: '#6366F1', text: 'atribuiu' },
  UNASSIGNED: { icon: 'person-outline', color: '#9CA3AF', text: 'desatribuiu' },
  COMMENT_ADDED: { icon: 'chatbubble', color: '#3B82F6', text: 'comentou em' },
  VERSION_CREATED: { icon: 'git-branch', color: '#8B5CF6', text: 'criou versão de' },
};

export function TimelineItem({ entry, onPress }: TimelineItemProps) {
  const config = ACTION_CONFIG[entry.action] || ACTION_CONFIG.UPDATED;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Avatar
        uri={entry.user.avatar_url}
        name={entry.user.name}
        size={40}
      />
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.userName}>{entry.user.name}</Text>
          {' '}{config.text}{' '}
          <Text style={styles.entityType}>{entry.entity_type}</Text>
        </Text>
        <Text style={styles.time}>
          {formatRelativeTime(entry.created_at)}
        </Text>
      </View>
      <Ionicons name={config.icon as any} size={20} color={config.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  text: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  userName: {
    fontWeight: '600',
  },
  entityType: {
    color: darkTheme.primary,
  },
  time: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Dashboard carrega corretamente
- [ ] Métricas exibem valores corretos
- [ ] Pull to refresh funciona
- [ ] Timeline carrega mais itens
- [ ] Navegação para projetos funciona
- [ ] Ações rápidas navegam corretamente

---

## Checklist de Entrega

- [ ] DashboardScreen implementada
- [ ] Componentes de dashboard criados
- [ ] API hooks funcionando
- [ ] Timeline com infinite scroll
- [ ] Pull to refresh
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
