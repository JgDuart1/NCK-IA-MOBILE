import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '@/types';
import { Badge } from '@/components/ui';
import { colors, darkTheme, spacing, typography } from '@/theme';

interface ProjectHeaderProps {
  project: Project;
  onBack?: () => void;
}

const STATUS_LABELS: Record<Project['status'], string> = {
  PLANNING: 'Planejando',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  COMPLETED: 'Concluido',
  ARCHIVED: 'Arquivado',
};

const STATUS_COLORS: Record<Project['status'], string> = {
  PLANNING: colors.warning,
  ACTIVE: colors.success,
  PAUSED: colors.neutral[500],
  COMPLETED: colors.info,
  ARCHIVED: colors.neutral[600],
};

export function ProjectHeader({ project, onBack }: ProjectHeaderProps) {
  return (
    <View style={[styles.container, { backgroundColor: project.color || darkTheme.primary }]}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={darkTheme.text} />
          </TouchableOpacity>
        ) : null}
        <Badge
          label={STATUS_LABELS[project.status]}
          style={{ backgroundColor: STATUS_COLORS[project.status] }}
        />
      </View>
      <Text style={styles.title}>{project.name}</Text>
      {project.description ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {project.description}
        </Text>
      ) : null}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="layers-outline" size={16} color={darkTheme.text} />
          <Text style={styles.metaText}>{project.work_mode}</Text>
        </View>
        {project.start_date ? (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={darkTheme.text} />
            <Text style={styles.metaText}>{formatDate(project.start_date)}</Text>
          </View>
        ) : null}
      </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.text,
    opacity: 0.9,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: darkTheme.text,
  },
});
