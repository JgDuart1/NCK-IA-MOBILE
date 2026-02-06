import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

import { VersionItem } from '@/components/notes';
import { Button, Modal } from '@/components/ui';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useNoteVersions } from '@/hooks/use-notes';
import { notesApi } from '@/services/api/notes.api';
import { darkTheme, spacing, typography } from '@/theme';
import { NoteVersion } from '@/types';
import { ProjectsScreenProps, MoreScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'NoteVersions'> | MoreScreenProps<'NoteVersions'>;

export function NoteVersionsScreen({ route }: Props) {
  const noteId = (route as { params: { noteId: string } }).params.noteId;
  const queryClient = useQueryClient();
  const { data: versions = [], isLoading, error, refetch } = useNoteVersions(noteId);
  const [selected, setSelected] = useState<NoteVersion | null>(null);

  const handleRestore = async (version: NoteVersion) => {
    try {
      await notesApi.restoreVersion(noteId, version.id);
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', noteId] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      Toast.show({ type: 'success', text1: 'Versao restaurada' });
    } catch (err: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao restaurar versao',
        text2: getApiErrorMessage(err) || 'Tente novamente',
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {versions.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="Sem versoes"
          description="Nenhuma versao anterior encontrada."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {versions.map((version) => (
            <VersionItem
              key={version.id}
              version={version}
              onPress={() => setSelected(version)}
              onRestore={() => handleRestore(version)}
            />
          ))}
        </ScrollView>
      )}

      <Modal visible={!!selected} onClose={() => setSelected(null)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Conteudo da versao</Text>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalText}>{selected?.content || ''}</Text>
          </ScrollView>
          <Button variant="ghost" onPress={() => setSelected(null)}>
            Fechar
          </Button>
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
  modalBody: {
    maxHeight: 320,
  },
  modalText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
  return maybeResponse?.data?.message ?? null;
}
