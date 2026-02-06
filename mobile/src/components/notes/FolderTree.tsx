import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NoteFolder } from '@/types';
import { spacing } from '@/theme';
import { FolderItem } from './FolderItem';

interface FolderTreeProps {
  folders: NoteFolder[];
  depth?: number;
  onSelect?: (folder: NoteFolder) => void;
  onEdit?: (folder: NoteFolder) => void;
  onDelete?: (folder: NoteFolder) => void;
}

export function FolderTree({ folders, depth = 0, onSelect, onEdit, onDelete }: FolderTreeProps) {
  return (
    <View style={styles.container}>
      {folders.map((folder) => (
        <View key={folder.id} style={{ marginLeft: depth * spacing.md }}>
          <FolderItem
            folder={folder}
            onPress={() => onSelect?.(folder)}
            onEdit={onEdit ? () => onEdit(folder) : undefined}
            onDelete={onDelete ? () => onDelete(folder) : undefined}
          />
          {folder.children && folder.children.length > 0 ? (
            <FolderTree
              folders={folder.children}
              depth={depth + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});
