import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api/tasks.api';

type CreateTaskInput = Parameters<typeof tasksApi.create>[0];
type UpdateTaskInput = Parameters<typeof tasksApi.update>[1];

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.create(data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => tasksApi.update(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', task.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
