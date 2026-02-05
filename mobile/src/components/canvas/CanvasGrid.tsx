import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';

import { CanvasBlock } from './CanvasBlock';
import { CanvasBlocks } from '@/types';
import { spacing } from '@/theme';
import { BLOCK_CONFIG } from './constants';

interface CanvasGridProps {
  blocks: CanvasBlocks;
  onBlockPress: (blockKey: keyof CanvasBlocks) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function CanvasGrid({ blocks, onBlockPress }: CanvasGridProps) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.page}>
        <View style={styles.row}>
          <CanvasBlock
            config={BLOCK_CONFIG.key_partners}
            items={blocks.key_partners}
            onPress={() => onBlockPress('key_partners')}
          />
          <View style={styles.doubleBlock}>
            <CanvasBlock
              config={BLOCK_CONFIG.key_activities}
              items={blocks.key_activities}
              onPress={() => onBlockPress('key_activities')}
              half
            />
            <CanvasBlock
              config={BLOCK_CONFIG.key_resources}
              items={blocks.key_resources}
              onPress={() => onBlockPress('key_resources')}
              half
            />
          </View>
          <CanvasBlock
            config={BLOCK_CONFIG.value_propositions}
            items={blocks.value_propositions}
            onPress={() => onBlockPress('value_propositions')}
          />
        </View>
      </View>

      <View style={styles.page}>
        <View style={styles.row}>
          <View style={styles.doubleBlock}>
            <CanvasBlock
              config={BLOCK_CONFIG.customer_relationships}
              items={blocks.customer_relationships}
              onPress={() => onBlockPress('customer_relationships')}
              half
            />
            <CanvasBlock
              config={BLOCK_CONFIG.channels}
              items={blocks.channels}
              onPress={() => onBlockPress('channels')}
              half
            />
          </View>
          <CanvasBlock
            config={BLOCK_CONFIG.customer_segments}
            items={blocks.customer_segments}
            onPress={() => onBlockPress('customer_segments')}
          />
        </View>
      </View>

      <View style={styles.page}>
        <View style={styles.row}>
          <CanvasBlock
            config={BLOCK_CONFIG.cost_structure}
            items={blocks.cost_structure}
            onPress={() => onBlockPress('cost_structure')}
          />
          <CanvasBlock
            config={BLOCK_CONFIG.revenue_streams}
            items={blocks.revenue_streams}
            onPress={() => onBlockPress('revenue_streams')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  page: {
    width: SCREEN_WIDTH - spacing.md * 2,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  doubleBlock: {
    flex: 1,
    gap: spacing.sm,
  },
});
