import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/services/api/notifications.api';
import { Notification } from '@/types';
import { useNotificationStore } from '@/stores/notification.store';

const notificationsKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationsKeys.all, 'list'] as const,
  unreadCount: () => [...notificationsKeys.all, 'unread-count'] as const,
};

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: notificationsKeys.list(),
    queryFn: notificationsApi.list,
  });
}

export function useUnreadCount() {
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const query = useQuery<number>({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
  });

  useEffect(() => {
    if (typeof query.data === 'number') {
      setUnreadCount(query.data);
    }
  }, [query.data, setUnreadCount]);

  return query;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const decrementUnread = useNotificationStore((state) => state.decrementUnread);

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      decrementUnread();
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.list() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const clearUnread = useNotificationStore((state) => state.clearUnread);

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      clearUnread();
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.list() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
    },
  });
}
