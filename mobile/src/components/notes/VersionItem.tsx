import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { NoteVersion } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';

interface VersionItemProps {
  version: NoteVersion;
  onPress?: () => void;
  onRestore?: () => void;
}

export function VersionItem({ version, onPress, onRestore }: VersionItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.title}>Versao {version.version}</Text>
        <Text style={styles.subtitle}>{formatDate(version.created_at)}</Text>
      </View>
      {onRestore ? (
        <TouchableOpacity onPress={onRestore} style={styles.restoreButton}>
          <Ionicons name="refresh" size={16} color={darkTheme.primary} />
          <Text style={styles.restoreText}>Restaurar</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    ...typography.body,
    color: darkTheme.text,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  restoreText: {
    ...typography.caption,
    color: darkTheme.primary,
  },
});
