import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CanvasAssumption } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface AssumptionItemProps {
  assumption: CanvasAssumption;
  onToggle: () => void;
  onDelete: () => void;
}

export function AssumptionItem({ assumption, onToggle, onDelete }: AssumptionItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onToggle} style={styles.toggle}>
          <Ionicons
            name={assumption.validated ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={assumption.validated ? '#22C55E' : darkTheme.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{assumption.text}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: darkTheme.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  toggle: {
    padding: spacing.xs,
  },
  text: {
    ...typography.bodySmall,
    color: darkTheme.text,
    flex: 1,
  },
});
