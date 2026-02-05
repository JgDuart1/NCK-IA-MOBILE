import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sprintsApi } from '@/services/api/sprints.api';
import { Sprint } from '@/types';

type CreateSprintInput = Parameters<typeof sprintsApi.create>[0];

export function useSprints(projectId: string) {
  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: () => sprintsApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useSprint(id: string) {
  return useQuery({
    queryKey: ['sprints', 'detail', id],
    queryFn: () => sprintsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSprintInput) => sprintsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprints', variables.project_id] });
    },
  });
}

export function useUpdateSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSprintInput> }) =>
      sprintsApi.update(id, data),
    onSuccess: (sprint) => {
      queryClient.invalidateQueries({ queryKey: ['sprints', sprint.project_id] });
      queryClient.invalidateQueries({ queryKey: ['sprints', 'detail', sprint.id] });
    },
  });
}

export function useDeleteSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sprintsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useStartSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sprintsApi.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useCompleteSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sprintsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useActiveSprint(projectId: string) {
  const { data: sprints } = useSprints(projectId);
  return sprints?.find((s: Sprint) => s.status === 'ACTIVE') || null;
}
