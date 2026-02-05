import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BlockItem } from './BlockItem';
import { darkTheme, spacing, typography } from '@/theme';

interface CanvasBlockProps {
  config: { label: string; color: string };
  items: string[];
  onPress: () => void;
  half?: boolean;
}

export function CanvasBlock({ config, items, onPress, half }: CanvasBlockProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderTopColor: config.color },
        half ? styles.halfHeight : null,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>
          {config.label}
        </Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>

      <ScrollView style={styles.items} nestedScrollEnabled>
        {items.slice(0, 3).map((item, index) => (
          <BlockItem key={`${item}-${index}`} text={item} color={config.color} />
        ))}
        {items.length > 3 && (
          <Text style={styles.more}>+{items.length - 3} mais</Text>
        )}
        {items.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="add-circle-outline" size={24} color={darkTheme.textSecondary} />
            <Text style={styles.emptyText}>Adicionar</Text>
          </View>
        )}
      </ScrollView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderTopWidth: 3,
    padding: spacing.sm,
    minHeight: 150,
  },
  halfHeight: {
    minHeight: 70,
    flex: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  count: {
    backgroundColor: darkTheme.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  items: {
    flex: 1,
  },
  more: {
    ...typography.caption,
    color: darkTheme.primary,
    marginTop: spacing.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
