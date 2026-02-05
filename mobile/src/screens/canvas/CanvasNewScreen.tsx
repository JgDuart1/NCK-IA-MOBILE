import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@/components/ui';
import { useCreateCanvas } from '@/hooks/use-canvas';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'CanvasNew'>;

export function CanvasNewScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createMutation = useCreateCanvas();

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    createMutation.mutate(
      { project_id: projectId, name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: (canvas) => {
          navigation.replace('CanvasDetail', { canvasId: canvas.id });
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.form}>
        <Input
          label="Nome"
          placeholder="Nome do canvas"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Descricao"
          placeholder="Opcional"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Button onPress={handleSubmit} disabled={!canSubmit} loading={createMutation.isPending}>
          Criar Canvas
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
    padding: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
});
