import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Skeleton } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { Project } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface RecentProjectsProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectPress: (projectId: string) => void;
  onSeeAll: () => void;
}

export function RecentProjects({
  projects,
  isLoading,
  onProjectPress,
  onSeeAll,
}: RecentProjectsProps) {
  const hasProjects = projects.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projetos recentes</Text>
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver todos</Text>
          <Ionicons name="chevron-forward" size={16} color={darkTheme.textSecondary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </ScrollView>
      ) : hasProjects ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
          {projects.map((project) => (
            <ProjectCardSmall
              key={project.id}
              project={project}
              onPress={() => onProjectPress(project.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <EmptyState
          title="Sem projetos recentes"
          description="Crie um novo projeto para acompanhar aqui."
          icon="briefcase-outline"
        />
      )}
    </View>
  );
}

interface ProjectCardSmallProps {
  project: Project & { tasks_count?: number };
  onPress: () => void;
}

function ProjectCardSmall({ project, onPress }: ProjectCardSmallProps) {
  const color = project.color || darkTheme.primary;
  const tasksCount = project.tasks_count;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {project.name}
        </Text>
        <Text style={styles.cardSubtitle}>
          {tasksCount != null ? `${tasksCount} tarefas` : project.status.toLowerCase()}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card style={styles.card}>
      <Skeleton width={16} height={16} borderRadius={8} />
      <Skeleton width={120} height={16} style={{ marginTop: spacing.sm }} />
      <Skeleton width={80} height={12} style={{ marginTop: spacing.xs }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  seeAllText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  list: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  card: {
    width: 170,
    minHeight: 110,
    gap: spacing.sm,
    padding: spacing.md,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  cardTitle: {
    ...typography.body,
    color: darkTheme.text,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
