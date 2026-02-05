import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  title = 'Nada por aqui',
  description = 'Ainda nao ha dados para exibir.',
  icon = 'archive-outline',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={darkTheme.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    textAlign: 'center',
  },
});
