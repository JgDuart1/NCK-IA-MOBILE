import { useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { pushService } from '@/services/push/push.service';
import { useNotificationStore } from '@/stores/notification.store';
import { MainTabsParamList } from '@/navigation/types';
import { useAuthStore } from '@/stores/auth.store';

type EntityType = 'task' | 'note' | 'event' | 'meeting_request' | 'project';

type PushData = {
  notification_id?: string;
  entity_type?: EntityType;
  entity_id?: string;
  project_id?: string;
};

export function usePushNotifications() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const incrementUnread = useNotificationStore((state) => state.incrementUnread);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const navigateToEntity = useCallback(
    (entityType: EntityType, entityId: string, projectId?: string) => {
      switch (entityType) {
        case 'task':
          if (projectId) {
            navigation.navigate('ProjectsTab', {
              screen: 'TaskDetail',
              params: { projectId, taskId: entityId },
            });
          } else {
            navigation.navigate('ProjectsTab', { screen: 'ProjectsList' });
          }
          break;
        case 'project':
          navigation.navigate('ProjectsTab', {
            screen: 'ProjectDetail',
            params: { projectId: entityId },
          });
          break;
        case 'note':
          navigation.navigate('ProjectsTab', {
            screen: 'NoteDetail',
            params: { noteId: entityId },
          });
          break;
        case 'event':
          navigation.navigate('CalendarTab', {
            screen: 'EventDetail',
            params: { eventId: entityId },
          });
          break;
        case 'meeting_request':
          navigation.navigate('CalendarTab', {
            screen: 'MeetingRequestDetail',
            params: { requestId: entityId },
          });
          break;
        default:
          navigation.navigate('NotificationsTab', { screen: 'NotificationsList' });
          break;
      }
    },
    [navigation],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    pushService.registerForPushNotifications().then(() => {
      if (!isMounted) return;
    });

    notificationListener.current = pushService.addNotificationReceivedListener(() => {
      incrementUnread();
    });

    responseListener.current = pushService.addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data as PushData;
      if (data?.entity_type && data?.entity_id) {
        navigateToEntity(data.entity_type, data.entity_id, data.project_id);
      } else {
        navigation.navigate('NotificationsTab', { screen: 'NotificationsList' });
      }
    });

    return () => {
      isMounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [incrementUnread, isAuthenticated, navigateToEntity, navigation]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Notifications.setBadgeCountAsync(unreadCount).catch(() => {});
  }, [isAuthenticated, unreadCount]);
}
