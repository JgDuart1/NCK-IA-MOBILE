import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { NoteFolder } from '@/types';
import { colors, darkTheme, spacing, typography } from '@/theme';

interface FolderItemProps {
  folder: NoteFolder;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selected?: boolean;
}

export function FolderItem({ folder, onPress, onEdit, onDelete, selected }: FolderItemProps) {
  return (
    <TouchableOpacity style={[styles.container, selected && styles.selected]} onPress={onPress}>
      <View style={styles.info}>
        <Ionicons name="folder-outline" size={18} color={darkTheme.primary} />
        <View>
          <Text style={styles.title}>{folder.name}</Text>
          <Text style={styles.subtitle}>{folder.notes_count ?? 0} notas</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {onEdit ? (
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Ionicons name="create-outline" size={16} color={darkTheme.textSecondary} />
          </TouchableOpacity>
        ) : null}
        {onDelete ? (
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        ) : null}
      </View>
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
  selected: {
    borderColor: darkTheme.primary,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
});
