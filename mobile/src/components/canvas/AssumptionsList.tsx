import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AssumptionItem } from './AssumptionItem';
import { Button, Input } from '@/components/ui';
import { CanvasAssumption } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { useAddAssumption, useDeleteAssumption, useToggleAssumption } from '@/hooks/use-canvas';

interface AssumptionsListProps {
  canvasId: string;
  assumptions: CanvasAssumption[];
}

export function AssumptionsList({ canvasId, assumptions }: AssumptionsListProps) {
  const [text, setText] = useState('');
  const addMutation = useAddAssumption();
  const toggleMutation = useToggleAssumption();
  const deleteMutation = useDeleteAssumption();

  const canAdd = useMemo(() => text.trim().length > 0, [text]);

  const handleAdd = () => {
    if (!canAdd) return;
    addMutation.mutate({ canvasId, text: text.trim() });
    setText('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Input placeholder="Adicionar assumption" value={text} onChangeText={setText} />
        <Button onPress={handleAdd} disabled={!canAdd}>
          Adicionar
        </Button>
      </View>

      {assumptions.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma assumption registrada.</Text>
      ) : (
        <View style={styles.list}>
          {assumptions.map((assumption) => (
            <AssumptionItem
              key={assumption.id}
              assumption={assumption}
              onToggle={() =>
                toggleMutation.mutate({
                  canvasId,
                  assumptionId: assumption.id,
                  validated: !assumption.validated,
                })
              }
              onDelete={() => deleteMutation.mutate({ canvasId, assumptionId: assumption.id })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
