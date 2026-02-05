import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/theme';
import { spacing } from '@/theme';
import { typography } from '@/theme';

interface PlaceholderScreenProps {
  title?: string;
  description?: string;
}

export function PlaceholderScreen({
  title = 'Em desenvolvimento',
  description = 'Esta tela sera implementada em um proximo plano.',
}: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={48} color={darkTheme.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: darkTheme.background,
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
