import { apiClient } from './client';
import { User } from '@/types';

export interface UpdateProfileDto {
  name?: string;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}

export interface InviteUserDto {
  email: string;
  role_type: RoleType;
  project_ids?: string[];
}

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export type RoleType =
  | 'SUPER_ADMIN'
  | 'NUCLEO_NCK'
  | 'AGENTE_NCK'
  | 'CLIENTE'
  | 'FORNECEDOR'
  | 'INVESTIDOR';

export interface Invite {
  id: string;
  email: string;
  role_type: RoleType;
  status: InviteStatus;
  created_at: string;
  expires_at: string;
}

export const usersApi = {
  async getMe(): Promise<User> {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await apiClient.patch('/users/me', data);
    return response.data.data;
  },

  async uploadAvatar(uri: string): Promise<User> {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'avatar.jpg';

    formData.append('avatar', {
      uri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    const response = await apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async removeAvatar(): Promise<User> {
    const response = await apiClient.delete('/users/me/avatar');
    return response.data.data;
  },

  async changePassword(data: ChangePasswordDto): Promise<void> {
    await apiClient.post('/users/change-password', data);
  },

  async invite(data: InviteUserDto): Promise<Invite> {
    const response = await apiClient.post('/users/invite', data);
    return response.data.data;
  },

  async getInvites(): Promise<Invite[]> {
    const response = await apiClient.get('/users/invites');
    return response.data.data;
  },

  async resendInvite(id: string): Promise<void> {
    await apiClient.post(`/users/invites/${id}/resend`);
  },

  async cancelInvite(id: string): Promise<void> {
    await apiClient.delete(`/users/invites/${id}`);
  },
};
