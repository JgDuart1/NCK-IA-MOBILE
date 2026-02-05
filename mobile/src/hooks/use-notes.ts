import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/services/api/notes.api';
import { useDebounce } from './use-debounce';

type NotesFilters = Parameters<typeof notesApi.list>[0];

export function useNotes(filters: NotesFilters = {}) {
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
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof notesApi.update>[1] }) =>
      notesApi.update(id, data),
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'detail', note.id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useAutoSaveNote(noteId: string) {
  const updateNote = useUpdateNote();
  const [isSaving, setIsSaving] = React.useState(false);

  const save = useDebounce(async (content: string) => {
    if (!noteId) return;
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
