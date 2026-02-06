import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input, Modal } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface BlockEditorProps {
  title: string;
  description: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
}

export function BlockEditor({ title, description, items, onItemsChange }: BlockEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [text, setText] = useState('');

  const isEditing = editingIndex !== null;

  const canSave = useMemo(() => text.trim().length > 0, [text]);

  const handleOpenCreate = () => {
    setEditingIndex(null);
    setText('');
    setIsOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setText(items[index] ?? '');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setText('');
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!canSave) return;
    const nextText = text.trim();
    if (isEditing && editingIndex !== null) {
      const next = items.map((item, idx) => (idx === editingIndex ? nextText : item));
      onItemsChange(next);
    } else {
      onItemsChange([...items, nextText]);
    }
    handleClose();
  };

  const handleDelete = (index: number) => {
    const next = items.filter((_, idx) => idx !== index);
    onItemsChange(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Button variant="outline" size="sm" onPress={handleOpenCreate}>
          Adicionar
        </Button>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="add-circle-outline" size={28} color={darkTheme.textSecondary} />
          <Text style={styles.emptyText}>Nenhum item ainda.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemText}>{item}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleOpenEdit(index)}>
                  <Ionicons name="create-outline" size={20} color={darkTheme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal visible={isOpen} onClose={handleClose}>
        <Text style={styles.modalTitle}>{isEditing ? 'Editar item' : 'Novo item'}</Text>
        <Input placeholder="Descreva o item" value={text} onChangeText={setText} multiline />
        <View style={styles.modalActions}>
          <Button variant="ghost" onPress={handleClose}>
            Cancelar
          </Button>
          <Button onPress={handleSave} disabled={!canSave}>
            Salvar
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  list: {
    gap: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: darkTheme.surface,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.md,
  },
  itemText: {
    ...typography.bodySmall,
    color: darkTheme.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  modalTitle: {
    ...typography.h3,
    color: darkTheme.text,
    marginBottom: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
