import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { NoteFolder } from '@/types';
import { Button, Modal } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { FolderItem } from './FolderItem';

interface FolderSelectorProps {
  folders: NoteFolder[];
  value?: string | null;
  onChange: (folderId?: string) => void;
  label?: string;
  allowNone?: boolean;
}

export function FolderSelector({
  folders,
  value,
  onChange,
  label = 'Pasta',
  allowNone = true,
}: FolderSelectorProps) {
  const [visible, setVisible] = useState(false);
  const selected = useMemo(() => folders.find((folder) => folder.id === value), [folders, value]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={styles.value}>
          {selected?.name || (allowNone ? 'Sem pasta' : 'Selecionar pasta')}
        </Text>
        <Ionicons name="chevron-down" size={16} color={darkTheme.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} onClose={() => setVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecionar pasta</Text>
          {allowNone ? (
            <Button
              variant={!value ? 'primary' : 'outline'}
              onPress={() => {
                onChange(undefined);
                setVisible(false);
              }}
            >
              Sem pasta
            </Button>
          ) : null}
          {folders.length === 0 ? (
            <Text style={styles.empty}>Nenhuma pasta cadastrada</Text>
          ) : (
            folders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                selected={folder.id === value}
                onPress={() => {
                  onChange(folder.id);
                  setVisible(false);
                }}
              />
            ))
          )}
          <Button variant="ghost" onPress={() => setVisible(false)}>
            Fechar
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  value: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  modalContent: {
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h4,
    color: darkTheme.text,
  },
  empty: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
});
