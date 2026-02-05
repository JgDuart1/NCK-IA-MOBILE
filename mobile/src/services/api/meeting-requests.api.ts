import { apiClient } from './client';
import { MeetingRequest } from '@/types';

interface CreateMeetingRequestDto {
  title: string;
  description?: string;
  location?: string;
  meeting_url?: string;
  proposed_start_at: string;
  proposed_end_at: string;
  project_id?: string;
  recipient_ids: string[];
}

export const meetingRequestsApi = {
  async list(): Promise<MeetingRequest[]> {
    const response = await apiClient.get('/meeting-requests');
    return response.data.data;
  },

  async getById(id: string): Promise<MeetingRequest> {
    const response = await apiClient.get(`/meeting-requests/${id}`);
    return response.data.data;
  },

  async create(data: CreateMeetingRequestDto): Promise<MeetingRequest> {
    const response = await apiClient.post('/meeting-requests', data);
    return response.data.data;
  },

  async accept(id: string): Promise<MeetingRequest> {
    const response = await apiClient.patch(`/meeting-requests/${id}/accept`);
    return response.data.data;
  },

  async decline(id: string): Promise<MeetingRequest> {
    const response = await apiClient.patch(`/meeting-requests/${id}/decline`);
    return response.data.data;
  },
};
