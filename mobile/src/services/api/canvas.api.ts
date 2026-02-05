import { apiClient } from './client';
import {
  BusinessModelCanvas,
  CanvasAssumption,
  CanvasBlocks,
  CanvasExperiment,
} from '@/types';

interface CreateCanvasDto {
  project_id: string;
  name: string;
  description?: string;
}

export const canvasApi = {
  async list(projectId: string): Promise<BusinessModelCanvas[]> {
    const response = await apiClient.get(`/projects/${projectId}/canvas`);
    return response.data.data;
  },

  async getById(id: string): Promise<BusinessModelCanvas> {
    const response = await apiClient.get(`/canvas/${id}`);
    return response.data.data;
  },

  async create(data: CreateCanvasDto): Promise<BusinessModelCanvas> {
    const response = await apiClient.post('/canvas', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateCanvasDto>): Promise<BusinessModelCanvas> {
    const response = await apiClient.patch(`/canvas/${id}`, data);
    return response.data.data;
  },

  async updateBlocks(id: string, blocks: CanvasBlocks): Promise<BusinessModelCanvas> {
    const response = await apiClient.patch(`/canvas/${id}`, { blocks });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/canvas/${id}`);
  },

  async addAssumption(canvasId: string, text: string): Promise<CanvasAssumption> {
    const response = await apiClient.post(`/canvas/${canvasId}/assumptions`, { text });
    return response.data.data;
  },

  async updateAssumption(
    canvasId: string,
    assumptionId: string,
    validated: boolean
  ): Promise<CanvasAssumption> {
    const response = await apiClient.patch(
      `/canvas/${canvasId}/assumptions/${assumptionId}`,
      { validated }
    );
    return response.data.data;
  },

  async deleteAssumption(canvasId: string, assumptionId: string): Promise<void> {
    await apiClient.delete(`/canvas/${canvasId}/assumptions/${assumptionId}`);
  },

  async addExperiment(
    canvasId: string,
    data: Partial<CanvasExperiment>
  ): Promise<CanvasExperiment> {
    const response = await apiClient.post(`/canvas/${canvasId}/experiments`, data);
    return response.data.data;
  },

  async updateExperiment(
    canvasId: string,
    experimentId: string,
    data: Partial<CanvasExperiment>
  ): Promise<CanvasExperiment> {
    const response = await apiClient.patch(
      `/canvas/${canvasId}/experiments/${experimentId}`,
      data
    );
    return response.data.data;
  },

  async deleteExperiment(canvasId: string, experimentId: string): Promise<void> {
    await apiClient.delete(`/canvas/${canvasId}/experiments/${experimentId}`);
  },
};
