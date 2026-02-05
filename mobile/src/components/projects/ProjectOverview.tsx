import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Project } from '@/types';
import { Card } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface ProjectWithCounts extends Project {
  tasks_count?: number;
  members_count?: number;
  sprints_count?: number;
  notes_count?: number;
}

interface ProjectOverviewProps {
  project: ProjectWithCounts;
}

const STATUS_LABELS: Record<Project['status'], string> = {
  PLANNING: 'Planejando',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  COMPLETED: 'Concluido',
  ARCHIVED: 'Arquivado',
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Visao Geral</Text>
        <Text style={styles.cardText}>
          {project.description || 'Sem descricao adicionada.'}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Detalhes</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>{STATUS_LABELS[project.status]}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Modo</Text>
          <Text style={styles.detailValue}>{project.work_mode}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Inicio</Text>
          <Text style={styles.detailValue}>
            {project.start_date ? formatDate(project.start_date) : '-'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fim</Text>
          <Text style={styles.detailValue}>
            {project.end_date ? formatDate(project.end_date) : '-'}
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Metricas</Text>
        <View style={styles.metricsRow}>
          <Metric label="Tarefas" value={project.tasks_count} />
          <Metric label="Membros" value={project.members_count} />
          <Metric label="Sprints" value={project.sprints_count} />
          <Metric label="Notas" value={project.notes_count} />
        </View>
      </Card>
    </View>
  );
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{typeof value === 'number' ? value : '-'}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  } catch {
    return date;
  }
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  card: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: darkTheme.text,
    marginBottom: spacing.sm,
  },
  cardText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  detailValue: {
    ...typography.bodySmall,
    color: darkTheme.text,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metric: {
    flexBasis: '45%',
    backgroundColor: darkTheme.surfaceSecondary,
    borderRadius: 10,
    padding: spacing.md,
  },
  metricValue: {
    ...typography.h3,
    color: darkTheme.text,
  },
  metricLabel: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
