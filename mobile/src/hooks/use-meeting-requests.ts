import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meetingRequestsApi } from '@/services/api/meeting-requests.api';

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

export function useMeetingRequests() {
  return useQuery({
    queryKey: ['meeting-requests'],
    queryFn: () => meetingRequestsApi.list(),
  });
}

export function useMeetingRequest(id: string) {
  return useQuery({
    queryKey: ['meeting-requests', 'detail', id],
    queryFn: () => meetingRequestsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMeetingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingRequestDto) => meetingRequestsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-requests'] });
    },
  });
}

export function useAcceptMeetingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => meetingRequestsApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-requests'] });
    },
  });
}

export function useDeclineMeetingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => meetingRequestsApi.decline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-requests'] });
    },
  });
}
