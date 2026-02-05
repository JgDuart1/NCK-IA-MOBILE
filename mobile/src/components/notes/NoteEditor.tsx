import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Input } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface NoteEditorProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  saving?: boolean;
}

export function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  saving,
}: NoteEditorProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Titulo"
        placeholder="Titulo da nota"
        value={title}
        onChangeText={onTitleChange}
      />

      <View style={styles.contentWrapper}>
        <Text style={styles.label}>Conteudo</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Escreva sua nota..."
          placeholderTextColor={darkTheme.textMuted}
          multiline
          value={content}
          onChangeText={onContentChange}
          textAlignVertical="top"
        />
        {saving ? <Text style={styles.saving}>Salvando...</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  contentWrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  textarea: {
    minHeight: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
    padding: spacing.md,
    color: darkTheme.text,
    ...typography.body,
  },
  saving: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
});
