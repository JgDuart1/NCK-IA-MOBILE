import { apiClient } from './client';
import { Task } from '@/types';

interface TaskFilters {
  project_id: string;
  sprint_id?: string;
  assignee_id?: string;
  priority?: string;
  status?: string;
  search?: string;
}

interface CreateTaskDto {
  project_id: string;
  sprint_id?: string;
  assignee_id?: string;
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  deadline?: string;
}

interface UpdateTaskDto extends Partial<CreateTaskDto> {
  status?: string;
}

export const tasksApi = {
  async list(filters: TaskFilters): Promise<Task[]> {
    const response = await apiClient.get('/tasks', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post('/tasks', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status });
    return response.data.data;
  },

  async reorder(id: string, order_index: number, status?: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/order`, {
      order_index,
      status,
    });
    return response.data.data;
  },
};
