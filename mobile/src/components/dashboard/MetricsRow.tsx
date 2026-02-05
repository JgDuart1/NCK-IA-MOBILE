import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { MetricCard } from './MetricCard';
import { spacing } from '@/theme';

interface DashboardMetrics {
  active_projects: number;
  pending_tasks: number;
  tasks_today: number;
  events_today: number;
}

interface MetricsRowProps {
  metrics?: DashboardMetrics;
  isLoading?: boolean;
}

export function MetricsRow({ metrics, isLoading }: MetricsRowProps) {
  const finalMetrics: DashboardMetrics = metrics ?? {
    active_projects: 0,
    pending_tasks: 0,
    tasks_today: 0,
    events_today: 0,
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <MetricCard
        icon="briefcase-outline"
        value={finalMetrics.active_projects}
        label="Projetos ativos"
        color="#3B82F6"
        isLoading={isLoading}
      />
      <MetricCard
        icon="checkmark-circle-outline"
        value={finalMetrics.pending_tasks}
        label="Tarefas pendentes"
        color="#F59E0B"
        isLoading={isLoading}
      />
      <MetricCard
        icon="time-outline"
        value={finalMetrics.tasks_today}
        label="Tarefas hoje"
        color="#10B981"
        isLoading={isLoading}
      />
      <MetricCard
        icon="calendar-outline"
        value={finalMetrics.events_today}
        label="Eventos hoje"
        color="#8B5CF6"
        isLoading={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
});
