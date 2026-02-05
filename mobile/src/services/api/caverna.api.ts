import { apiClient } from './client';
import { DragonSettings, DragonTicket, DragonReservation } from '@/types';

export interface DragonAvailabilityDay {
  date: string;
  morning: { available: number; total: number };
  afternoon: { available: number; total: number };
}

interface CreateReservationDto {
  date: string;
  period: 'MORNING' | 'AFTERNOON';
}

export const cavernaApi = {
  async getSettings(): Promise<DragonSettings> {
    const response = await apiClient.get('/caverna-dragao/settings');
    return response.data.data;
  },

  async getAvailability(startDate: string, endDate: string): Promise<DragonAvailabilityDay[]> {
    const response = await apiClient.get('/caverna-dragao/availability', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data.data;
  },

  async getMyTickets(): Promise<DragonTicket> {
    const response = await apiClient.get('/caverna-dragao/tickets');
    return response.data.data;
  },

  async getMyReservations(status?: string): Promise<DragonReservation[]> {
    const response = await apiClient.get('/caverna-dragao/reservations', {
      params: { status },
    });
    return response.data.data;
  },

  async createReservation(data: CreateReservationDto): Promise<DragonReservation> {
    const response = await apiClient.post('/caverna-dragao/reservations', data);
    return response.data.data;
  },

  async cancelReservation(id: string): Promise<void> {
    await apiClient.delete(`/caverna-dragao/reservations/${id}`);
  },

  async checkin(id: string): Promise<DragonReservation> {
    const response = await apiClient.post(`/caverna-dragao/reservations/${id}/checkin`);
    return response.data.data;
  },
};
