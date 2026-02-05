import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { NoteCard, NoteFilters } from '@/components/notes';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useNoteFolders } from '@/hooks/use-note-folders';
import { useNotes } from '@/hooks/use-notes';
import { darkTheme, spacing, typography } from '@/theme';
import { MoreScreenProps, ProjectsScreenProps } from '@/navigation/types';
import { Note } from '@/types';

type Props = ProjectsScreenProps<'ProjectNotes'> | MoreScreenProps<'NotesList'>;

export function NotesListScreen({ navigation, route }: Props) {
  const nav = navigation as any;
  const projectId = (route as { params?: { projectId?: string } }).params?.projectId;
  const [search, setSearch] = useState('');
  const [folderId, setFolderId] = useState<string | undefined>();
  const [pinnedOnly, setPinnedOnly] = useState(false);

  const { data: folders = [] } = useNoteFolders();
  const {
    data: notes = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useNotes({
    project_id: projectId,
    folder_id: folderId,
    search: search.trim() || undefined,
    is_pinned: pinnedOnly ? true : undefined,
  });

  const orderedNotes = useMemo(() => {
    const list = [...notes];
    list.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));
    return list;
  }, [notes]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  const renderItem = ({ item }: { item: Note }) => (
    <NoteCard note={item} onPress={() => nav.navigate('NoteDetail', { noteId: item.id })} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notas</Text>
          {projectId ? (
            <Text style={styles.subtitle}>Notas do projeto</Text>
          ) : (
            <Text style={styles.subtitle}>Todas as suas notas</Text>
          )}
        </View>
        <Pressable style={styles.folderButton} onPress={() => nav.navigate('NoteFolders')}>
          <Ionicons name="folder-outline" size={18} color={darkTheme.primary} />
          <Text style={styles.folderButtonText}>Pastas</Text>
        </Pressable>
      </View>

      <NoteFilters
        search={search}
        onSearchChange={setSearch}
        folders={folders}
        folderId={folderId}
        onFolderChange={setFolderId}
        pinnedOnly={pinnedOnly}
        onPinnedToggle={() => setPinnedOnly((prev) => !prev)}
      />

      {orderedNotes.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="Sem notas"
          description="Crie a primeira nota para organizar suas ideias."
        />
      ) : (
        <FlatList
          data={orderedNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() =>
          nav.navigate('NoteNew', {
            projectId,
            folderId,
          })
        }
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
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
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  folderButtonText: {
    ...typography.caption,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
