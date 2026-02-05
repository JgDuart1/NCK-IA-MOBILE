import { apiClient } from './client';
import { Sprint } from '@/types';

interface CreateSprintDto {
  project_id: string;
  name: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
}

export const sprintsApi = {
  async list(projectId: string): Promise<Sprint[]> {
    const response = await apiClient.get(`/projects/${projectId}/sprints`);
    return response.data.data;
  },

  async getById(id: string): Promise<Sprint> {
    const response = await apiClient.get(`/sprints/${id}`);
    return response.data.data;
  },

  async create(data: CreateSprintDto): Promise<Sprint> {
    const response = await apiClient.post('/sprints', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateSprintDto>): Promise<Sprint> {
    const response = await apiClient.patch(`/sprints/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/sprints/${id}`);
  },

  async start(id: string): Promise<Sprint> {
    const response = await apiClient.post(`/sprints/${id}/start`);
    return response.data.data;
  },

  async complete(id: string): Promise<Sprint> {
    const response = await apiClient.post(`/sprints/${id}/complete`);
    return response.data.data;
  },
};
