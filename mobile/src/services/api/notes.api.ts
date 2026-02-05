import { apiClient } from './client';
import { Note, NoteVersion } from '@/types';

interface NoteFilters {
  project_id?: string;
  folder_id?: string;
  search?: string;
  is_pinned?: boolean;
}

interface CreateNoteDto {
  project_id?: string;
  folder_id?: string;
  title: string;
  content: string;
  accent_color?: string;
  visibility?: 'ALL_COMPANY' | 'FILTERED' | 'SPECIFIC_USERS';
}

export const notesApi = {
  async list(filters: NoteFilters = {}): Promise<Note[]> {
    const response = await apiClient.get('/notes', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Note> {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data.data;
  },

  async create(data: CreateNoteDto): Promise<Note> {
    const response = await apiClient.post('/notes', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateNoteDto>): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notes/${id}`);
  },

  async pin(id: string): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, { is_pinned: true });
    return response.data.data;
  },

  async unpin(id: string): Promise<Note> {
    const response = await apiClient.patch(`/notes/${id}`, { is_pinned: false });
    return response.data.data;
  },

  async getVersions(noteId: string): Promise<NoteVersion[]> {
    const response = await apiClient.get(`/notes/${noteId}/versions`);
    return response.data.data;
  },

  async restoreVersion(noteId: string, versionId: string): Promise<Note> {
    const response = await apiClient.post(`/notes/${noteId}/versions/${versionId}/restore`);
    return response.data.data;
  },
};
