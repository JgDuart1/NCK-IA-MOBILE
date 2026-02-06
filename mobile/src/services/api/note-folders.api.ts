import { apiClient } from './client';
import { NoteFolder } from '@/types';

export const noteFoldersApi = {
  async list(parentId?: string): Promise<NoteFolder[]> {
    const response = await apiClient.get('/note-folders', {
      params: { parent_id: parentId },
    });
    return response.data.data;
  },

  async create(data: {
    name: string;
    parent_id?: string;
    accent_color?: string;
  }): Promise<NoteFolder> {
    const response = await apiClient.post('/note-folders', data);
    return response.data.data;
  },

  async update(id: string, data: { name?: string; accent_color?: string }): Promise<NoteFolder> {
    const response = await apiClient.patch(`/note-folders/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/note-folders/${id}`);
  },
};
