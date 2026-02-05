import React, { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { NotificationItem, NotificationGroup } from '@/components/notifications';
import { Button } from '@/components/ui';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useMarkAllAsRead, useMarkAsRead, useNotifications } from '@/hooks';
import { useNotificationStore } from '@/stores/notification.store';
import { darkTheme, spacing, typography } from '@/theme';
import { groupNotificationsByDate } from '@/utils';
import { MainTabsParamList } from '@/navigation/types';
import { Notification } from '@/types';

type EntityType = 'task' | 'note' | 'event' | 'meeting_request' | 'project';

type NotificationData = {
  entity_type?: EntityType;
  entity_id?: string;
  project_id?: string;
};

export function NotificationsListScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const { data: notifications, isLoading, isError, refetch, isRefetching } =
    useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const sections = useMemo(() => {
    return groupNotificationsByDate(notifications || []);
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const navigateToEntity = (entityType: EntityType, entityId: string, projectId?: string) => {
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
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      await markAsRead.mutateAsync(notification.id);
    }

    const data = (notification.data || {}) as NotificationData;
    if (data.entity_type && data.entity_id) {
      navigateToEntity(data.entity_type, data.entity_id, data.project_id);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificacoes</Text>
        <Button
          variant="ghost"
          size="sm"
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0 || markAllAsRead.isPending}
          loading={markAllAsRead.isPending}
        >
          Marcar todas
        </Button>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem notification={item} onPress={() => handleNotificationPress(item)} />
        )}
        renderSectionHeader={({ section }) => (
          <NotificationGroup title={section.title} count={section.data.length} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="Nenhuma notificacao"
            description="Voce esta em dia!"
          />
        }
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
