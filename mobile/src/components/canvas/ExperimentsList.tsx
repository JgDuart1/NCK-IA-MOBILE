import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ExperimentForm } from './ExperimentForm';
import { ExperimentItem } from './ExperimentItem';
import { Button, Modal } from '@/components/ui';
import { CanvasExperiment } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { useAddExperiment, useDeleteExperiment, useUpdateExperiment } from '@/hooks/use-canvas';

interface ExperimentsListProps {
  canvasId: string;
  experiments: CanvasExperiment[];
}

export function ExperimentsList({ canvasId, experiments }: ExperimentsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<CanvasExperiment | null>(null);
  const addMutation = useAddExperiment();
  const updateMutation = useUpdateExperiment();
  const deleteMutation = useDeleteExperiment();

  const handleCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const handleEdit = (experiment: CanvasExperiment) => {
    setEditing(experiment);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const handleSubmit = (values: {
    hypothesis: string;
    method: string;
    result?: string;
    status: CanvasExperiment['status'];
  }) => {
    if (editing) {
      updateMutation.mutate({
        canvasId,
        experimentId: editing.id,
        data: values,
      });
    } else {
      addMutation.mutate({ canvasId, data: values });
    }
    handleClose();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Button variant="outline" onPress={handleCreate}>
        Novo experimento
      </Button>

      {experiments.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum experimento registrado.</Text>
      ) : (
        <View style={styles.list}>
          {experiments.map((experiment) => (
            <ExperimentItem
              key={experiment.id}
              experiment={experiment}
              onEdit={() => handleEdit(experiment)}
              onDelete={() =>
                deleteMutation.mutate({ canvasId, experimentId: experiment.id })
              }
            />
          ))}
        </View>
      )}

      <Modal visible={isOpen} onClose={handleClose}>
        <ExperimentForm
          initialValues={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
