import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NoteFolder } from '@/types';
import { Button, Input } from '@/components/ui';
import { darkTheme, spacing } from '@/theme';
import { FolderSelector } from './FolderSelector';

interface NoteFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  folders: NoteFolder[];
  folderId?: string;
  onFolderChange: (folderId?: string) => void;
  pinnedOnly: boolean;
  onPinnedToggle: () => void;
}

export function NoteFilters({
  search,
  onSearchChange,
  folders,
  folderId,
  onFolderChange,
  pinnedOnly,
  onPinnedToggle,
}: NoteFiltersProps) {
  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar por titulo ou conteudo"
        value={search}
        onChangeText={onSearchChange}
        leftIcon="search"
      />
      <FolderSelector folders={folders} value={folderId} onChange={onFolderChange} />
      <View style={styles.actions}>
        <Button size="sm" variant={pinnedOnly ? 'primary' : 'outline'} onPress={onPinnedToggle}>
          {pinnedOnly ? 'Fixadas' : 'Todas'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
