import { apiClient } from './client';
import { TimelineEntry, Project, Task, Event } from '@/types';

interface DashboardMetrics {
  active_projects: number;
  pending_tasks: number;
  tasks_today: number;
  events_today: number;
}

export const dashboardApi = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data.data;
  },

  async getRecentProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects', {
      params: { limit: 5, sort: '-updated_at' },
    });
    return response.data.data;
  },

  async getTimeline(page = 1): Promise<{ data: TimelineEntry[]; hasMore: boolean }> {
    const response = await apiClient.get('/timeline', {
      params: { page, per_page: 20 },
    });
    return {
      data: response.data.data,
      hasMore: response.data.meta.page < response.data.meta.total_pages,
    };
  },

  async getMyTasks(): Promise<Task[]> {
    const response = await apiClient.get('/tasks', {
      params: { assignee: 'me', status: 'TODO,IN_PROGRESS', limit: 10 },
    });
    return response.data.data;
  },

  async getTodayEvents(): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    const response = await apiClient.get('/events', {
      params: { start_at_gte: today, limit: 5 },
    });
    return response.data.data;
  },
};
