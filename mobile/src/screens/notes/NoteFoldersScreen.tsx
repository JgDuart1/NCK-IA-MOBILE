import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { FolderItem, FolderSelector } from '@/components/notes';
import { Button, Input, Modal } from '@/components/ui';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import {
  useCreateNoteFolder,
  useDeleteNoteFolder,
  useNoteFolders,
  useUpdateNoteFolder,
} from '@/hooks/use-note-folders';
import { darkTheme, spacing, typography } from '@/theme';
import { NoteFolder } from '@/types';
import { MoreScreenProps } from '@/navigation/types';

type Props = MoreScreenProps<'NoteFolders'>;

export function NoteFoldersScreen({ navigation }: Props) {
  const { data: folders = [], isLoading, error, refetch } = useNoteFolders();
  const createFolder = useCreateNoteFolder();
  const updateFolder = useUpdateNoteFolder();
  const deleteFolder = useDeleteNoteFolder();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<NoteFolder | null>(null);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | undefined>();

  const resetForm = () => {
    setName('');
    setParentId(undefined);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (folder: NoteFolder) => {
    setEditing(folder);
    setName(folder.name);
    setParentId(folder.parent_id || undefined);
    setModalVisible(true);
  };

  const availableParents = useMemo(
    () => folders.filter((folder) => folder.id !== editing?.id),
    [folders, editing]
  );

  const handleSubmit = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Nome obrigatorio',
        text2: 'Informe o nome da pasta.',
      });
      return;
    }

    try {
      if (editing) {
        await updateFolder.mutateAsync({
          id: editing.id,
          data: { name: name.trim(), accent_color: editing.accent_color || undefined },
        });
        Toast.show({ type: 'success', text1: 'Pasta atualizada' });
      } else {
        await createFolder.mutateAsync({
          name: name.trim(),
          parent_id: parentId,
        });
        Toast.show({ type: 'success', text1: 'Pasta criada' });
      }
      setModalVisible(false);
      resetForm();
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar pasta',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleDelete = (folder: NoteFolder) => {
    Alert.alert(
      'Excluir pasta',
      'Tem certeza que deseja excluir esta pasta? Somente pastas vazias podem ser removidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFolder.mutateAsync(folder.id);
              Toast.show({ type: 'success', text1: 'Pasta removida' });
            } catch (err: unknown) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao remover pasta',
                text2: getApiErrorMessage(err) || 'Tente novamente',
              });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Pastas</Text>
        <Button size="sm" onPress={openCreate}>
          Nova pasta
        </Button>
      </View>

      {folders.length === 0 ? (
        <EmptyState
          icon="folder-outline"
          title="Sem pastas"
          description="Crie pastas para organizar suas notas."
        />
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FolderItem
              folder={item}
              onPress={() => navigation.navigate('NotesList', undefined as never)}
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editing ? 'Editar pasta' : 'Nova pasta'}
          </Text>
          <Input label="Nome" value={name} onChangeText={setName} />
          <FolderSelector
            label="Pasta pai"
            folders={availableParents}
            value={parentId}
            onChange={setParentId}
            allowNone
          />
          <View style={styles.modalActions}>
            <Button variant="ghost" onPress={() => setModalVisible(false)}>
              Cancelar
            </Button>
            <Button loading={createFolder.isPending || updateFolder.isPending} onPress={handleSubmit}>
              Salvar
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  modalContent: {
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h4,
    color: darkTheme.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } })
    .response;
  return maybeResponse?.data?.message ?? null;
}
