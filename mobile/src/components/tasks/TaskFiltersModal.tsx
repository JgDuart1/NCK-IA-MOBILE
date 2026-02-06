import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Modal } from '@/components/ui';
import { Button, Input } from '@/components/ui';
import { ProjectMember, Sprint } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { AssigneeSelector } from './AssigneeSelector';
import { SprintSelector } from './SprintSelector';

export interface TaskFilters {
  assignee_id?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  sprint_id?: string;
  search?: string;
}

interface TaskFiltersModalProps {
  visible: boolean;
  filters: TaskFilters;
  members: ProjectMember[];
  sprints: Sprint[];
  onClose: () => void;
  onApply: (filters: TaskFilters) => void;
}

const PRIORITIES: Array<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function TaskFiltersModal({
  visible,
  filters,
  members,
  sprints,
  onClose,
  onApply,
}: TaskFiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);

  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [filters, visible]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared: TaskFilters = {};
    setLocalFilters(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Filtros</Text>

        <Input
          label="Buscar"
          placeholder="Buscar por titulo ou descricao"
          value={localFilters.search || ''}
          onChangeText={(text) => setLocalFilters((prev) => ({ ...prev, search: text }))}
        />

        <AssigneeSelector
          members={members}
          value={localFilters.assignee_id}
          onChange={(assigneeId) =>
            setLocalFilters((prev) => ({ ...prev, assignee_id: assigneeId }))
          }
        />

        <SprintSelector
          sprints={sprints}
          value={localFilters.sprint_id}
          onChange={(sprintId) => setLocalFilters((prev) => ({ ...prev, sprint_id: sprintId }))}
        />

        <View style={styles.prioritySection}>
          <Text style={styles.sectionLabel}>Prioridade</Text>
          <View style={styles.priorityActions}>
            {PRIORITIES.map((priority) => (
              <Button
                key={priority}
                size="sm"
                variant={localFilters.priority === priority ? 'primary' : 'outline'}
                onPress={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    priority: prev.priority === priority ? undefined : priority,
                  }))
                }
              >
                {priority === 'LOW'
                  ? 'Baixa'
                  : priority === 'MEDIUM'
                    ? 'Media'
                    : priority === 'HIGH'
                      ? 'Alta'
                      : 'Urgente'}
              </Button>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button variant="ghost" onPress={handleClear}>
            Limpar
          </Button>
          <Button onPress={handleApply}>Aplicar</Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  sectionLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  prioritySection: {
    gap: spacing.sm,
  },
  priorityActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
