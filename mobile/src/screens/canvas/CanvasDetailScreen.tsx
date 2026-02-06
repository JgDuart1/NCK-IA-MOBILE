import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CanvasGrid, AssumptionsList, ExperimentsList } from '@/components/canvas';
import { LoadingScreen, ErrorState } from '@/components/feedback';
import { useCanvas } from '@/hooks/use-canvas';
import { CanvasBlocks } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

const TAB_OPTIONS = [
  { key: 'canvas', label: 'Canvas' },
  { key: 'assumptions', label: 'Assumptions' },
  { key: 'experiments', label: 'Experimentos' },
] as const;

type TabKey = (typeof TAB_OPTIONS)[number]['key'];

type Props = ProjectsScreenProps<'CanvasDetail'>;

export function CanvasDetailScreen({ route, navigation }: Props) {
  const { canvasId } = route.params;
  const { data: canvas, isLoading, error, refetch } = useCanvas(canvasId);
  const [activeTab, setActiveTab] = useState<TabKey>('canvas');

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

  const handleBlockPress = (blockKey: keyof CanvasBlocks) => {
    navigation.navigate('BlockEditor', { canvasId, blockKey });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabs}>
        {TAB_OPTIONS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'canvas' && (
          <CanvasGrid blocks={canvas.blocks} onBlockPress={handleBlockPress} />
        )}
        {activeTab === 'assumptions' && (
          <AssumptionsList canvasId={canvasId} assumptions={canvas.assumptions || []} />
        )}
        {activeTab === 'experiments' && (
          <ExperimentsList canvasId={canvasId} experiments={canvas.experiments || []} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: darkTheme.primary,
  },
  tabLabel: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
});
