# Plano 08: Notas - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/08-notas`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── notes/
│       ├── NotesListScreen.tsx
│       ├── NoteFoldersScreen.tsx
│       ├── NoteDetailScreen.tsx
│       ├── NoteNewScreen.tsx
│       ├── NoteVersionsScreen.tsx
│       └── index.ts
│
├── components/
│   └── notes/
│       ├── NoteCard.tsx
│       ├── NoteEditor.tsx
│       ├── NoteToolbar.tsx
│       ├── FolderSelector.tsx
│       ├── FolderItem.tsx
│       ├── FolderTree.tsx
│       ├── VersionItem.tsx
│       ├── NoteFilters.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       ├── notes.api.ts
│       └── note-folders.api.ts
│
└── hooks/
    ├── use-notes.ts
    └── use-note-folders.ts
```

---

## Implementações

### 1. Notes API (src/services/api/notes.api.ts)

```typescript
import { apiClient } from './client';
import { Note, NoteVersion } from '@/types';

interface NoteFilters {
  project_id?: string;
  folder_id?: string;
  search?: string;
  is_pinned?: boolean;
}

interface CreateNoteDto {
  project_id?: string;
  folder_id?: string;
  title: string;
  content: string;
  accent_color?: string;
  visibility?: 'ALL_COMPANY' | 'FILTERED' | 'SPECIFIC_USERS';
}

export const notesApi = {
  async list(filters: NoteFilters = {}): Promise<Note[]> {
    const response = await apiClient.get('/notes', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Note> {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data.data;
  },

  async create(data: CreateNoteDto): Promise<Note> {
    const response = await apiClient.post('/notes', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateNoteDto>): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notes/${id}`);
  },

  async pin(id: string): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, { is_pinned: true });
    return response.data.data;
  },

  async unpin(id: string): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, { is_pinned: false });
    return response.data.data;
  },

  // Versions
  async getVersions(noteId: string): Promise<NoteVersion[]> {
    const response = await apiClient.get(`/notes/${noteId}/versions`);
    return response.data.data;
  },

  async restoreVersion(noteId: string, versionId: string): Promise<Note> {
    const response = await apiClient.post(`/notes/${noteId}/versions/${versionId}/restore`);
    return response.data.data;
  },
};
```

### 2. Note Folders API (src/services/api/note-folders.api.ts)

```typescript
import { apiClient } from './client';
import { NoteFolder } from '@/types';

export const noteFoldersApi = {
  async list(parentId?: string): Promise<NoteFolder[]> {
    const response = await apiClient.get('/note-folders', {
      params: { parent_id: parentId },
    });
    return response.data.data;
  },

  async create(data: { name: string; parent_id?: string; accent_color?: string }): Promise<NoteFolder> {
    const response = await apiClient.post('/note-folders', data);
    return response.data.data;
  },

  async update(id: string, data: { name?: string; accent_color?: string }): Promise<NoteFolder> {
    const response = await apiClient.patch(`/note-folders/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/note-folders/${id}`);
  },
};
```

### 3. useNotes Hook (src/hooks/use-notes.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/services/api/notes.api';
import { useDebounce } from './use-debounce';

export function useNotes(filters = {}) {
  return useQuery({
    queryKey: ['notes', filters],
    queryFn: () => notesApi.list(filters),
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', 'detail', id],
    queryFn: () => notesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => notesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', id] });
    },
  });
}

// Auto-save hook
export function useAutoSaveNote(noteId: string) {
  const updateNote = useUpdateNote();
  const [isSaving, setIsSaving] = React.useState(false);

  const save = useDebounce(async (content: string) => {
    setIsSaving(true);
    try {
      await updateNote.mutateAsync({ id: noteId, data: { content } });
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  return { save, isSaving };
}

export function useNoteVersions(noteId: string) {
  return useQuery({
    queryKey: ['notes', noteId, 'versions'],
    queryFn: () => notesApi.getVersions(noteId),
    enabled: !!noteId,
  });
}
```

### 4. NoteCard Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '@/types';
import { Avatar } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { formatRelativeTime } from '@/utils/format';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const hasAttachments = note.attachments && note.attachments.length > 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        note.accent_color && { borderLeftColor: note.accent_color },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        {note.is_pinned && (
          <Ionicons name="pin" size={14} color={darkTheme.primary} style={styles.pinIcon} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {note.content.replace(/<[^>]*>/g, '')}
      </Text>

      <View style={styles.footer}>
        <View style={styles.author}>
          <Avatar uri={note.author.avatar_url} name={note.author.name} size={20} />
          <Text style={styles.authorName}>{note.author.name}</Text>
        </View>

        <View style={styles.meta}>
          {hasAttachments && (
            <Ionicons name="attach" size={14} color={darkTheme.textSecondary} />
          )}
          <Text style={styles.time}>{formatRelativeTime(note.updated_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pinIcon: {
    marginRight: spacing.xs,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    flex: 1,
  },
  content: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorName: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
```

### 5. NoteEditor Component

```typescript
import React from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { NoteToolbar } from './NoteToolbar';
import { AttachmentGrid } from '@/components/tasks';
import { darkTheme, spacing, typography } from '@/theme';

interface NoteEditorProps {
  title: string;
  content: string;
  attachments?: any[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onAddAttachment: () => void;
  isSaving?: boolean;
}

export function NoteEditor({
  title,
  content,
  attachments = [],
  onTitleChange,
  onContentChange,
  onAddAttachment,
  isSaving,
}: NoteEditorProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        style={styles.titleInput}
        placeholder="Título da nota"
        placeholderTextColor={darkTheme.textSecondary}
        value={title}
        onChangeText={onTitleChange}
      />

      <TextInput
        style={styles.contentInput}
        placeholder="Comece a escrever..."
        placeholderTextColor={darkTheme.textSecondary}
        value={content}
        onChangeText={onContentChange}
        multiline
        textAlignVertical="top"
      />

      {attachments.length > 0 && (
        <View style={styles.attachments}>
          <AttachmentGrid attachments={attachments} editable />
        </View>
      )}

      <NoteToolbar
        onAddAttachment={onAddAttachment}
        isSaving={isSaving}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  titleInput: {
    ...typography.h2,
    color: darkTheme.text,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  contentInput: {
    ...typography.body,
    color: darkTheme.text,
    flex: 1,
    padding: spacing.md,
    lineHeight: 24,
  },
  attachments: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
  },
});
```

### 6. NotesListScreen

```typescript
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { NoteCard, FolderSelector } from '@/components/notes';
import { Button } from '@/components/ui';
import { EmptyState, LoadingScreen } from '@/components/feedback';
import { useNotes } from '@/hooks/use-notes';
import { darkTheme, spacing } from '@/theme';

export function NotesListScreen({ route, navigation }: any) {
  const projectId = route.params?.projectId;
  const [search, setSearch] = useState('');
  const [folderId, setFolderId] = useState<string | undefined>();

  const { data: notes, isLoading, refetch } = useNotes({
    project_id: projectId,
    folder_id: folderId,
    search: search || undefined,
  });

  // Ordenar: fixadas primeiro, depois por data
  const sortedNotes = React.useMemo(() => {
    if (!notes) return [];
    return [...notes].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [notes]);

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notas..."
          placeholderTextColor={darkTheme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FolderSelector
        selectedId={folderId}
        onSelect={setFolderId}
      />

      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Nenhuma nota"
            message="Crie sua primeira nota"
            action={{
              label: 'Criar Nota',
              onPress: () => navigation.navigate('NoteNew', { projectId, folderId }),
            }}
          />
        }
        refreshing={false}
        onRefresh={refetch}
      />

      <View style={styles.fab}>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('NoteNew', { projectId, folderId })}
          leftIcon={<Ionicons name="add" size={24} color="#fff" />}
        >
          Nova Nota
        </Button>
      </View>
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
  },
  searchInput: {
    backgroundColor: darkTheme.surface,
    borderRadius: 8,
    padding: spacing.md,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Lista notas corretamente
- [ ] Filtro por pasta funciona
- [ ] Busca funciona
- [ ] Criar nota funciona
- [ ] Editar com auto-save funciona
- [ ] Fixar/desafixar funciona
- [ ] Pastas funcionam
- [ ] Versões funcionam
- [ ] Anexos funcionam

---

## Checklist de Entrega

- [ ] Todas as telas implementadas
- [ ] Editor com auto-save
- [ ] Pastas funcionando
- [ ] Versões funcionando
- [ ] Anexos integrados
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
