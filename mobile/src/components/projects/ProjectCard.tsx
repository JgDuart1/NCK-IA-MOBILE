import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { Badge } from '@/components/ui';

interface ProjectWithCounts extends Project {
  tasks_count?: number;
  members_count?: number;
}

interface ProjectCardProps {
  project: ProjectWithCounts;
  onPress: () => void;
}

const STATUS_LABELS: Record<Project['status'], string> = {
  PLANNING: 'Planejando',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  COMPLETED: 'Concluido',
  ARCHIVED: 'Arquivado',
};

const STATUS_COLORS: Record<Project['status'], string> = {
  PLANNING: '#F59E0B',
  ACTIVE: '#10B981',
  PAUSED: '#6B7280',
  COMPLETED: '#3B82F6',
  ARCHIVED: '#4B5563',
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const tasksCount = project.tasks_count;
  const membersCount = project.members_count;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View
        style={[styles.colorBar, { backgroundColor: project.color || darkTheme.primary }]}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {project.name}
          </Text>
          <Badge
            label={STATUS_LABELS[project.status]}
            style={{ backgroundColor: STATUS_COLORS[project.status] }}
          />
        </View>
        {project.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <View style={styles.stat}>
            <Ionicons name="checkbox-outline" size={16} color={darkTheme.textSecondary} />
            <Text style={styles.statText}>
              {typeof tasksCount === 'number' ? `${tasksCount} tarefas` : 'Tarefas'}
            </Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={16} color={darkTheme.textSecondary} />
            <Text style={styles.statText}>
              {typeof membersCount === 'number' ? `${membersCount} membros` : 'Membros'}
            </Text>
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
    borderWidth: 1,
    borderColor: darkTheme.border,
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
