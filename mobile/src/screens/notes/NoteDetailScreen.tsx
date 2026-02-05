import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

import { AttachmentGrid } from '@/components/tasks';
import { NoteEditor, NoteToolbar } from '@/components/notes';
import { ErrorState, LoadingScreen } from '@/components/feedback';
import { useAutoSaveNote, useDeleteNote, useNote, useUpdateNote } from '@/hooks/use-notes';
import { useDebounce } from '@/hooks/use-debounce';
import { notesApi } from '@/services/api/notes.api';
import { attachmentService } from '@/services/attachments';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps, MoreScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'NoteDetail'> | MoreScreenProps<'NoteDetail'>;

export function NoteDetailScreen({ route, navigation }: Props) {
  const nav = navigation as any;
  const noteId = (route as { params?: { noteId: string } }).params?.noteId;
  const queryClient = useQueryClient();
  const { data: note, isLoading, error, refetch } = useNote(noteId || '');
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const { save, isSaving } = useAutoSaveNote(noteId || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setContent(note.content);
    hasInitialized.current = true;
  }, [note]);

  const saveTitle = useDebounce((value: string) => {
    if (!noteId) return;
    void updateNote.mutateAsync({ id: noteId, data: { title: value } });
  }, 1000);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (hasInitialized.current) {
      saveTitle(value);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (hasInitialized.current) {
      save(value);
    }
  };

  const handleDelete = () => {
    if (!noteId) return;
    Alert.alert('Excluir nota', 'Tem certeza que deseja excluir esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote.mutateAsync(noteId);
            Toast.show({ type: 'success', text1: 'Nota excluida' });
            nav.goBack();
          } catch (err: unknown) {
            Toast.show({
              type: 'error',
              text1: 'Erro ao excluir nota',
              text2: getApiErrorMessage(err) || 'Tente novamente',
            });
          }
        },
      },
    ]);
  };

  const handleTogglePin = async () => {
    if (!note) return;
    try {
      if (note.is_pinned) {
        await notesApi.unpin(note.id);
      } else {
        await notesApi.pin(note.id);
      }
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', note.id] });
      Toast.show({ type: 'success', text1: 'Nota atualizada' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar nota',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleAddImage = async () => {
    if (!note) return;
    try {
      const result = await attachmentService.pickImage();
      if (result.canceled) return;
      const asset = result.assets[0];
      await attachmentService.upload(asset.uri, 'note', note.id);
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', note.id] });
      Toast.show({ type: 'success', text1: 'Imagem adicionada' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar imagem',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleAddDocument = async () => {
    if (!note) return;
    try {
      const result = await attachmentService.pickDocument();
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      await attachmentService.upload(asset.uri, 'note', note.id);
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', note.id] });
      Toast.show({ type: 'success', text1: 'Documento adicionado' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar documento',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!note) return;
    try {
      await attachmentService.delete(attachmentId);
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', note.id] });
      Toast.show({ type: 'success', text1: 'Anexo removido' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao remover anexo',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  const canShow = useMemo(() => !!noteId, [noteId]);

  if (!canShow || isLoading) {
    return <LoadingScreen />;
  }

  if (error || !note) {
    return (
      <ErrorState
        title="Nota nao encontrada"
        message="Nao foi possivel carregar a nota"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <NoteEditor
          title={title}
          content={content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          saving={isSaving || updateNote.isPending}
        />

        <NoteToolbar
          isPinned={note.is_pinned}
          onTogglePin={handleTogglePin}
          onOpenVersions={() => nav.navigate('NoteVersions', { noteId: note.id })}
          onDelete={handleDelete}
          onAddAttachment={handleAddDocument}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anexos</Text>
          <AttachmentGrid
            attachments={note.attachments || []}
            editable
            onDelete={(id) => handleDeleteAttachment(id)}
          />
          <View style={styles.attachmentActions}>
            <Text style={styles.attachmentHint}>Adicionar</Text>
            <Text style={styles.attachmentLink} onPress={handleAddImage}>
              imagem
            </Text>
            <Text style={styles.attachmentHint}>ou</Text>
            <Text style={styles.attachmentLink} onPress={handleAddDocument}>
              documento
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
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
    gap: spacing.xs,
  },
  attachmentHint: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  attachmentLink: {
    ...typography.caption,
    color: darkTheme.primary,
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
