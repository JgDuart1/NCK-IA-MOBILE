import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssumptionsList } from '@/components/canvas';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useCanvas } from '@/hooks/use-canvas';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'Assumptions'>;

export function AssumptionsScreen({ route }: Props) {
  const { canvasId } = route.params;
  const { data: canvas, isLoading, error, refetch } = useCanvas(canvasId);

  if (isLoading) return <LoadingScreen />;
  if (error || !canvas) {
    return (
      <ErrorState
        title="Erro"
        message="Canvas nao encontrado"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <AssumptionsList canvasId={canvasId} assumptions={canvas.assumptions || []} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
  },
});
