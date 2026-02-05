import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { canvasApi } from '@/services/api/canvas.api';
import { CanvasBlocks, CanvasExperiment } from '@/types';

export function useCanvasList(projectId: string) {
  return useQuery({
    queryKey: ['canvas', 'list', projectId],
    queryFn: () => canvasApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCanvas(id: string) {
  return useQuery({
    queryKey: ['canvas', 'detail', id],
    queryFn: () => canvasApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCanvas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: canvasApi.create,
    onSuccess: (canvas) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'list', canvas.project_id] });
      queryClient.setQueryData(['canvas', 'detail', canvas.id], canvas);
    },
  });
}

export function useUpdateCanvas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      canvasApi.update(id, data),
    onSuccess: (canvas) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'list', canvas.project_id] });
      queryClient.setQueryData(['canvas', 'detail', canvas.id], canvas);
    },
  });
}

export function useUpdateBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blocks }: { id: string; blocks: CanvasBlocks }) =>
      canvasApi.updateBlocks(id, blocks),
    onSuccess: (canvas, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', id] });
      queryClient.setQueryData(['canvas', 'detail', id], canvas);
    },
  });
}

export function useDeleteCanvas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => canvasApi.delete(id),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas'] });
      queryClient.removeQueries({ queryKey: ['canvas', 'detail', id] });
    },
  });
}

export function useAddAssumption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, text }: { canvasId: string; text: string }) =>
      canvasApi.addAssumption(canvasId, text),
    onSuccess: (_assumption, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}

export function useToggleAssumption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      canvasId,
      assumptionId,
      validated,
    }: {
      canvasId: string;
      assumptionId: string;
      validated: boolean;
    }) => canvasApi.updateAssumption(canvasId, assumptionId, validated),
    onSuccess: (_assumption, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}

export function useDeleteAssumption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, assumptionId }: { canvasId: string; assumptionId: string }) =>
      canvasApi.deleteAssumption(canvasId, assumptionId),
    onSuccess: (_data, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}

export function useAddExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, data }: { canvasId: string; data: Partial<CanvasExperiment> }) =>
      canvasApi.addExperiment(canvasId, data),
    onSuccess: (_experiment, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}

export function useUpdateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      canvasId,
      experimentId,
      data,
    }: {
      canvasId: string;
      experimentId: string;
      data: Partial<CanvasExperiment>;
    }) => canvasApi.updateExperiment(canvasId, experimentId, data),
    onSuccess: (_experiment, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}

export function useDeleteExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, experimentId }: { canvasId: string; experimentId: string }) =>
      canvasApi.deleteExperiment(canvasId, experimentId),
    onSuccess: (_data, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}
