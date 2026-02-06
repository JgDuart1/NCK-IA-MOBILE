import { apiClient } from './client';
import { Notification } from '@/types';

export const notificationsApi = {
  async list(): Promise<Notification[]> {
    const response = await apiClient.get('/notifications');
    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data.data.count;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/mark-all-read');
  },

  async registerDevice(token: string, platform: 'ios' | 'android'): Promise<void> {
    await apiClient.post('/notifications/register-device', { token, platform });
  },

  async unregisterDevice(token: string): Promise<void> {
    await apiClient.delete('/notifications/unregister-device', { data: { token } });
  },
};
