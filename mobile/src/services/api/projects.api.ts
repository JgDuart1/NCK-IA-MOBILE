import { apiClient } from './client';
import { Project, ProjectMember, PaginatedResponse } from '@/types';

interface CreateProjectDto {
  name: string;
  description?: string;
  work_mode: 'SCRUM' | 'KANBAN' | 'SIMPLE';
  color?: string;
  start_date?: string;
  end_date?: string;
}

interface UpdateProjectDto extends Partial<CreateProjectDto> {
  status?: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
}

interface ProjectFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const projectsApi = {
  async list(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get('/projects', { params: filters });
    return { data: response.data.data, meta: response.data.meta };
  },

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post('/projects', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch(`/projects/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  async getMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await apiClient.get(`/projects/${projectId}/members`);
    return response.data.data;
  },

  async addMember(projectId: string, userId: string, role: string): Promise<ProjectMember> {
    const response = await apiClient.post(`/projects/${projectId}/members`, {
      user_id: userId,
      role,
    });
    return response.data.data;
  },

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/members/${memberId}`);
  },

  async updateMemberRole(
    projectId: string,
    memberId: string,
    role: string,
  ): Promise<ProjectMember> {
    const response = await apiClient.patch(`/projects/${projectId}/members/${memberId}`, {
      role,
    });
    return response.data.data;
  },
};
