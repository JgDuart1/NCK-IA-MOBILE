import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { darkTheme, spacing, typography } from '@/theme';

interface BlockItemProps {
  text: string;
  color: string;
}

export function BlockItem({ text, color }: BlockItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...typography.caption,
    color: darkTheme.text,
    flex: 1,
  },
});
