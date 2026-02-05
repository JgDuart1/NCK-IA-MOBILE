import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, InviteUserDto } from '@/services/api/users.api';

const INVITES_QUERY_KEY = ['invites'];

export function useInvites() {
  return useQuery({
    queryKey: INVITES_QUERY_KEY,
    queryFn: usersApi.getInvites,
  });
}

export function useSendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserDto) => usersApi.invite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
    },
  });
}

export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.resendInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
    },
  });
}

export function useCancelInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.cancelInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
    },
  });
}
