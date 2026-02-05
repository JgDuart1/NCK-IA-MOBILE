import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlockEditor } from '@/components/canvas';
import { BLOCK_CONFIG, EMPTY_BLOCKS } from '@/components/canvas/constants';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useCanvas, useUpdateBlocks } from '@/hooks/use-canvas';
import { CanvasBlocks } from '@/types';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'BlockEditor'>;

export function BlockEditorScreen({ route }: Props) {
  const { canvasId, blockKey } = route.params;
  const { data: canvas, isLoading, error, refetch } = useCanvas(canvasId);
  const updateBlocks = useUpdateBlocks();
  const [blocks, setBlocks] = useState<CanvasBlocks>(EMPTY_BLOCKS);

  useEffect(() => {
    if (canvas?.blocks) {
      setBlocks(canvas.blocks);
    }
  }, [canvas]);

  const blockConfig = BLOCK_CONFIG[blockKey];
  const items = useMemo(() => blocks[blockKey] || [], [blocks, blockKey]);

  const handleItemsChange = (nextItems: string[]) => {
    const nextBlocks = { ...blocks, [blockKey]: nextItems };
    setBlocks(nextBlocks);
    updateBlocks.mutate({ id: canvasId, blocks: nextBlocks });
  };

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
        <BlockEditor
          title={blockConfig.label}
          description={blockConfig.description}
          items={items}
          onItemsChange={handleItemsChange}
        />
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
