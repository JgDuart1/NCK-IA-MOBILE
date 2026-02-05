import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CanvasExperiment } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface ExperimentItemProps {
  experiment: CanvasExperiment;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_LABEL: Record<CanvasExperiment['status'], string> = {
  pending: 'Pendente',
  running: 'Em andamento',
  completed: 'Concluido',
};

const STATUS_COLOR: Record<CanvasExperiment['status'], string> = {
  pending: '#F59E0B',
  running: '#3B82F6',
  completed: '#22C55E',
};

export function ExperimentItem({ experiment, onEdit, onDelete }: ExperimentItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {experiment.hypothesis}
        </Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLOR[experiment.status] }]}
        >
          <Text style={styles.badgeText}>{STATUS_LABEL[experiment.status]}</Text>
        </View>
      </View>
      <Text style={styles.subtitle} numberOfLines={2}>
        Metodo: {experiment.method}
      </Text>
      {experiment.result ? (
        <Text style={styles.result} numberOfLines={2}>
          Resultado: {experiment.result}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color={darkTheme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    color: darkTheme.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    ...typography.caption,
    color: '#fff',
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  result: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
