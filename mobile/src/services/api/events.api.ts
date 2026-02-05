import { apiClient } from './client';
import { Event, EventAttendee } from '@/types';

interface EventFilters {
  project_id?: string;
  start_at_gte?: string;
  start_at_lte?: string;
}

interface CreateEventDto {
  title: string;
  description?: string;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'DELIVERY' | 'OTHER';
  location?: string;
  meeting_url?: string;
  color?: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  project_id?: string;
  attendee_ids?: string[];
}

export const eventsApi = {
  async list(filters: EventFilters = {}): Promise<Event[]> {
    const response = await apiClient.get('/events', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data;
  },

  async create(data: CreateEventDto): Promise<Event> {
    const response = await apiClient.post('/events', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateEventDto>): Promise<Event> {
    const response = await apiClient.patch(`/events/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },

  async addAttendee(eventId: string, userId: string): Promise<EventAttendee> {
    const response = await apiClient.post(`/events/${eventId}/attendees`, { user_id: userId });
    return response.data.data;
  },

  async updateAttendeeStatus(
    eventId: string,
    attendeeId: string,
    status: EventAttendee['status'],
  ): Promise<EventAttendee> {
    const response = await apiClient.patch(`/events/${eventId}/attendees/${attendeeId}`, {
      status,
    });
    return response.data.data;
  },

  async removeAttendee(eventId: string, attendeeId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/attendees/${attendeeId}`);
  },
};
