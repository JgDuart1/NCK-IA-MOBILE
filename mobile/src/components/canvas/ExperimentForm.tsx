import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { CanvasExperiment } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface ExperimentFormProps {
  initialValues?: Partial<CanvasExperiment>;
  onSubmit: (values: { hypothesis: string; method: string; result?: string; status: CanvasExperiment['status'] }) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: Array<{ label: string; value: CanvasExperiment['status'] }> = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Em andamento', value: 'running' },
  { label: 'Concluido', value: 'completed' },
];

export function ExperimentForm({ initialValues, onSubmit, onCancel }: ExperimentFormProps) {
  const [hypothesis, setHypothesis] = useState(initialValues?.hypothesis ?? '');
  const [method, setMethod] = useState(initialValues?.method ?? '');
  const [result, setResult] = useState(initialValues?.result ?? '');
  const [status, setStatus] = useState<CanvasExperiment['status']>(
    initialValues?.status ?? 'pending'
  );

  const canSubmit = useMemo(
    () => hypothesis.trim().length > 0 && method.trim().length > 0,
    [hypothesis, method]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Experimento</Text>
      <Input
        label="Hipotese"
        placeholder="Descreva a hipotese"
        value={hypothesis}
        onChangeText={setHypothesis}
      />
      <Input
        label="Metodo"
        placeholder="Como voce vai testar?"
        value={method}
        onChangeText={setMethod}
      />
      <Input
        label="Resultado"
        placeholder="Opcional"
        value={result}
        onChangeText={setResult}
      />

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusOptions}>
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setStatus(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button variant="ghost" onPress={onCancel}>
          Cancelar
        </Button>
        <Button
          onPress={() =>
            onSubmit({
              hypothesis: hypothesis.trim(),
              method: method.trim(),
              result: result.trim() || undefined,
              status,
            })
          }
          disabled={!canSubmit}
        >
          Salvar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  statusRow: {
    gap: spacing.sm,
  },
  statusLabel: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
