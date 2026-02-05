import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/services/api/events.api';
import { Event } from '@/types';

interface EventFilters {
  project_id?: string;
  start_at_gte?: string;
  start_at_lte?: string;
}

interface CreateEventDto {
  title: string;
  description?: string;
  type: Event['type'];
  location?: string;
  meeting_url?: string;
  color?: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  project_id?: string;
  attendee_ids?: string[];
}

export function useEvents(filters: EventFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.list(filters),
    enabled,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', 'detail', id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

export function useEventsByMonth(year: number, month: number, projectId?: string) {
  const startDate = new Date(year, month, 1, 0, 0, 0).toISOString();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  return useEvents({
    start_at_gte: startDate,
    start_at_lte: endDate,
    project_id: projectId,
  });
}

export function useEventsByDay(date: string | null, projectId?: string) {
  if (!date) {
    return useEvents({}, false);
  }

  const dayStart = `${date}T00:00:00`;
  const dayEnd = `${date}T23:59:59`;

  return useEvents({
    start_at_gte: dayStart,
    start_at_lte: dayEnd,
    project_id: projectId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventDto> }) =>
      eventsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
