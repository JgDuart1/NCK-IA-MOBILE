import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AttachmentGrid, LocalAttachment } from '@/components/tasks';
import { FolderSelector, NoteEditor } from '@/components/notes';
import { Button } from '@/components/ui';
import { useCreateNote } from '@/hooks/use-notes';
import { useNoteFolders } from '@/hooks/use-note-folders';
import { attachmentService } from '@/services/attachments';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps, MoreScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'NoteNew'> | MoreScreenProps<'NoteNew'>;

export function NoteNewScreen({ navigation, route }: Props) {
  const nav = navigation as any;
  const { projectId, folderId: initialFolder } = route.params || {};
  const { data: folders = [] } = useNoteFolders();
  const createNote = useCreateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState<string | undefined>(initialFolder);
  const [localAttachments, setLocalAttachments] = useState<LocalAttachment[]>([]);

  const handleAddImage = async () => {
    try {
      const result = await attachmentService.pickImage();
      if (result.canceled) return;
      const asset = result.assets[0];
      setLocalAttachments((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          uri: asset.uri,
          name: asset.fileName || 'imagem.jpg',
          mimeType: asset.mimeType || 'image/jpeg',
        },
      ]);
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao selecionar imagem',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleAddDocument = async () => {
    try {
      const result = await attachmentService.pickDocument();
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      setLocalAttachments((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          uri: asset.uri,
          name: asset.name || 'documento',
          mimeType: asset.mimeType || 'application/octet-stream',
        },
      ]);
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao selecionar documento',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleDeleteLocal = (id: string) => {
    setLocalAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Titulo obrigatorio',
        text2: 'Informe um titulo para a nota.',
      });
      return;
    }

    try {
      const note = await createNote.mutateAsync({
        project_id: projectId,
        folder_id: folderId,
        title: title.trim(),
        content: content.trim(),
      });

      if (localAttachments.length > 0) {
        const results = await Promise.all(
          localAttachments.map((attachment) =>
            attachmentService.upload(attachment.uri, 'note', note.id)
          )
        );
        const failed = results.filter((result) => !result.success);
        if (failed.length > 0) {
          Toast.show({
            type: 'error',
            text1: 'Alguns anexos falharam',
            text2: 'Tente reenviar os anexos.',
          });
        }
      }

      Toast.show({
        type: 'success',
        text1: 'Nota criada',
        text2: 'Sua nota foi salva com sucesso.',
      });
      nav.replace('NoteDetail', { noteId: note.id });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar nota',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Nova nota</Text>

          <NoteEditor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
          />

          <FolderSelector folders={folders} value={folderId} onChange={setFolderId} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anexos</Text>
            <AttachmentGrid
              attachments={[]}
              localAttachments={localAttachments}
              editable
              onDelete={(id) => handleDeleteLocal(id)}
            />
            <View style={styles.attachmentActions}>
              <Button variant="outline" size="sm" onPress={handleAddImage}>
                Adicionar imagem
              </Button>
              <Button variant="outline" size="sm" onPress={handleAddDocument}>
                Adicionar documento
              </Button>
            </View>
          </View>

          <View style={styles.actions}>
            <Button variant="ghost" onPress={() => nav.goBack()}>
              Cancelar
            </Button>
            <Button loading={createNote.isPending} onPress={handleSubmit}>
              Salvar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  attachmentActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
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
