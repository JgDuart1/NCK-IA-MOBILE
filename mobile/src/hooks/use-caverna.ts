import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cavernaApi } from '@/services/api/caverna.api';

export function useCavernaSettings() {
  return useQuery({
    queryKey: ['caverna', 'settings'],
    queryFn: cavernaApi.getSettings,
  });
}

export function useCavernaAvailability(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['caverna', 'availability', startDate, endDate],
    queryFn: () => cavernaApi.getAvailability(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useMyTickets() {
  return useQuery({
    queryKey: ['caverna', 'tickets'],
    queryFn: cavernaApi.getMyTickets,
  });
}

export function useMyReservations(status?: string) {
  return useQuery({
    queryKey: ['caverna', 'reservations', status],
    queryFn: () => cavernaApi.getMyReservations(status),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cavernaApi.createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caverna'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cavernaApi.cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caverna'] });
    },
  });
}

export function useCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cavernaApi.checkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caverna'] });
    },
  });
}

export function useNextReservation() {
  const { data: reservations } = useMyReservations('CONFIRMED');

  return React.useMemo(() => {
    if (!reservations?.length) return null;
    const now = new Date();
    const upcoming = reservations
      .filter((reservation) => new Date(reservation.date) >= now)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    return upcoming[0] || null;
  }, [reservations]);
}
