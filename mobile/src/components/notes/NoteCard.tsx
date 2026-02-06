import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Note } from '@/types';
import { Avatar } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { formatRelativeTime } from '@/utils/format';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const hasAttachments = (note.attachments || []).length > 0;

  return (
    <TouchableOpacity
      style={[styles.container, note.accent_color ? { borderLeftColor: note.accent_color } : null]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {note.is_pinned ? <Ionicons name="pin" size={14} color={darkTheme.primary} /> : null}
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
        </View>
        {hasAttachments ? (
          <Ionicons name="attach" size={16} color={darkTheme.textSecondary} />
        ) : null}
      </View>

      <Text style={styles.preview} numberOfLines={2}>
        {note.content || 'Sem conteudo'}
      </Text>

      <View style={styles.footer}>
        <View style={styles.author}>
          <Avatar name={note.author?.name || 'Usuario'} size={24} />
          <Text style={styles.authorName} numberOfLines={1}>
            {note.author?.name || 'Usuario'}
          </Text>
        </View>
        <Text style={styles.time}>{formatRelativeTime(note.updated_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  title: {
    ...typography.body,
    color: darkTheme.text,
    fontWeight: '600',
    flexShrink: 1,
  },
  preview: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  authorName: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    flexShrink: 1,
  },
  time: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
});
