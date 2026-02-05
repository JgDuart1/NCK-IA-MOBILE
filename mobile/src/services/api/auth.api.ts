import { apiClient } from './client';
import { LoginResponse, MagicLinkRequest, Tenant, User } from '@/types';

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getMe(): Promise<{ user: User; tenant: Tenant }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async requestMagicLink(email: string): Promise<void> {
    const payload: MagicLinkRequest = { email };
    await apiClient.post('/auth/magic-link', payload);
  },

  async verifyMagicLink(token: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/magic-link/verify', {
      token,
    });
    return response.data;
  },
};
