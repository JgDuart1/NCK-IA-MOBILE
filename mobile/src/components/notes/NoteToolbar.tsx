import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, darkTheme, spacing, typography } from '@/theme';

interface NoteToolbarProps {
  isPinned?: boolean;
  onTogglePin?: () => void;
  onOpenVersions?: () => void;
  onDelete?: () => void;
  onAddAttachment?: () => void;
}

export function NoteToolbar({
  isPinned,
  onTogglePin,
  onOpenVersions,
  onDelete,
  onAddAttachment,
}: NoteToolbarProps) {
  return (
    <View style={styles.container}>
      <ToolbarButton
        icon={isPinned ? 'pin' : 'pin-outline'}
        label={isPinned ? 'Fixada' : 'Fixar'}
        onPress={onTogglePin}
      />
      <ToolbarButton icon="time-outline" label="Versoes" onPress={onOpenVersions} />
      <ToolbarButton icon="attach-outline" label="Anexos" onPress={onAddAttachment} />
      <ToolbarButton icon="trash-outline" label="Excluir" onPress={onDelete} danger />
    </View>
  );
}

interface ToolbarButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

function ToolbarButton({ icon, label, onPress, danger }: ToolbarButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={!onPress}>
      <Ionicons name={icon} size={18} color={danger ? colors.error : darkTheme.primary} />
      <Text style={[styles.buttonLabel, danger && styles.dangerText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    backgroundColor: darkTheme.surface,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  buttonLabel: {
    ...typography.caption,
    color: darkTheme.text,
  },
  dangerText: {
    color: colors.error,
  },
});
