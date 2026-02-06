import { apiClient } from './client';
import { LoginResponse, MagicLinkRequest, Tenant, User } from '@/types';
import { secureStorage } from '../storage';

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = await secureStorage.getRefreshToken();
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },

  async getMe(): Promise<{ user: User; tenant: Tenant }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async requestMagicLink(email: string): Promise<void> {
    const payload: MagicLinkRequest = { email };
    await apiClient.post('/auth/magic-link/request', payload);
  },

  async verifyMagicLink(token: string): Promise<LoginResponse> {
    const response = await apiClient.get<LoginResponse>('/auth/magic-link/validate', {
      params: { token },
    });
    return response.data;
  },
};
