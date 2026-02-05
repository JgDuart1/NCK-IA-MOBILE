import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui';
import { BusinessModelCanvas } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface CanvasCardProps {
  canvas: BusinessModelCanvas;
  onPress: () => void;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(date));

export function CanvasCard({ canvas, onPress }: CanvasCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {canvas.name}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={darkTheme.textSecondary} />
        </View>

        {canvas.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {canvas.description}
          </Text>
        ) : (
          <Text style={styles.descriptionMuted}>Sem descricao</Text>
        )}

        <View style={styles.footer}>
          <Ionicons name="time-outline" size={14} color={darkTheme.textSecondary} />
          <Text style={styles.updatedAt}>Atualizado em {formatDate(canvas.updated_at)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  descriptionMuted: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  updatedAt: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
