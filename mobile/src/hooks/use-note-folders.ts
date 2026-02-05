import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { noteFoldersApi } from '@/services/api/note-folders.api';

export function useNoteFolders(parentId?: string) {
  return useQuery({
    queryKey: ['note-folders', parentId || 'root'],
    queryFn: () => noteFoldersApi.list(parentId),
  });
}

export function useCreateNoteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noteFoldersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-folders'] });
    },
  });
}

export function useUpdateNoteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof noteFoldersApi.update>[1] }) =>
      noteFoldersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-folders'] });
    },
  });
}

export function useDeleteNoteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noteFoldersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-folders'] });
    },
  });
}
