import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api/tasks.api';
import { Task } from '@/types';

type TasksFilters = Parameters<typeof tasksApi.list>[0];

export function useTasks(projectId: string, filters: Omit<TasksFilters, 'project_id'> = {}) {
  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => tasksApi.list({ project_id: projectId, ...filters }),
    enabled: !!projectId,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useTasksByStatus(
  projectId: string,
  filters: Omit<TasksFilters, 'project_id'> = {}
) {
  const query = useTasks(projectId, filters);

  const grouped = React.useMemo(() => {
    const tasks = query.data || [];
    return {
      BACKLOG: tasks.filter((t) => t.status === 'BACKLOG'),
      TODO: tasks.filter((t) => t.status === 'TODO'),
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
      IN_REVIEW: tasks.filter((t) => t.status === 'IN_REVIEW'),
      DONE: tasks.filter((t) => t.status === 'DONE'),
    } as Record<string, Task[]>;
  }, [query.data]);

  return { ...query, grouped };
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tasksApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });

      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) => {
        if (!old) return old;
        return old.map((task) => (task.id === id ? { ...task, status } : task));
      });

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (!context?.previousTasks) return;
      context.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
