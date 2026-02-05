# Plano 10: Notificações - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/10-notificacoes`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── notifications/
│       ├── NotificationsListScreen.tsx
│       └── index.ts
│
├── components/
│   └── notifications/
│       ├── NotificationItem.tsx
│       ├── NotificationIcon.tsx
│       ├── NotificationGroup.tsx
│       └── index.ts
│
├── services/
│   ├── api/
│   │   └── notifications.api.ts
│   └── push/
│       └── push.service.ts
│
├── stores/
│   └── notification.store.ts
│
└── hooks/
    ├── use-notifications.ts
    └── use-push-notifications.ts
```

---

## Implementações

### 1. Notification Store (src/stores/notification.store.ts)

```typescript
import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
```

### 2. Notifications API (src/services/api/notifications.api.ts)

```typescript
import { apiClient } from './client';
import { Notification } from '@/types';

export const notificationsApi = {
  async list(): Promise<Notification[]> {
    const response = await apiClient.get('/notifications');
    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.count;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  },

  async registerDevice(token: string, platform: 'ios' | 'android'): Promise<void> {
    await apiClient.post('/notifications/register-device', { token, platform });
  },

  async unregisterDevice(token: string): Promise<void> {
    await apiClient.delete('/notifications/unregister-device', { data: { token } });
  },
};
```

### 3. Push Service (src/services/push/push.service.ts)

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationsApi } from '../api/notifications.api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const pushService = {
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with actual project ID
    });

    // Register token with backend
    await notificationsApi.registerDevice(
      token.data,
      Platform.OS as 'ios' | 'android'
    );

    return token.data;
  },

  async unregister(token: string): Promise<void> {
    await notificationsApi.unregisterDevice(token);
  },

  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
```

### 4. usePushNotifications Hook (src/hooks/use-push-notifications.ts)

```typescript
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { pushService } from '@/services/push/push.service';
import { useNotificationStore } from '@/stores/notification.store';

export function usePushNotifications() {
  const navigation = useNavigation();
  const incrementUnread = useNotificationStore((s) => s.incrementUnread);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Register for push notifications
    pushService.registerForPushNotifications();

    // Handle notifications received while app is open
    notificationListener.current = pushService.addNotificationReceivedListener(
      (notification) => {
        incrementUnread();
      }
    );

    // Handle notification taps
    responseListener.current = pushService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data;
        
        // Navigate based on notification type
        if (data.entity_type && data.entity_id) {
          navigateToEntity(data.entity_type, data.entity_id);
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const navigateToEntity = (entityType: string, entityId: string) => {
    switch (entityType) {
      case 'task':
        navigation.navigate('ProjectsTab', {
          screen: 'TaskDetail',
          params: { taskId: entityId },
        });
        break;
      case 'event':
        navigation.navigate('CalendarTab', {
          screen: 'EventDetail',
          params: { eventId: entityId },
        });
        break;
      case 'note':
        navigation.navigate('MoreTab', {
          screen: 'NoteDetail',
          params: { noteId: entityId },
        });
        break;
      default:
        navigation.navigate('NotificationsTab');
    }
  };
}
```

### 5. NotificationItem Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NotificationIcon } from './NotificationIcon';
import { Notification } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { formatRelativeTime } from '@/utils/format';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const isUnread = notification.status === 'UNREAD';

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.containerUnread]}
      onPress={onPress}
    >
      <NotificationIcon type={notification.type} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>
          {formatRelativeTime(notification.created_at)}
        </Text>
      </View>

      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  containerUnread: {
    backgroundColor: `${darkTheme.primary}10`,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkTheme.primary,
    marginTop: 6,
  },
});
```

### 6. NotificationsListScreen

```typescript
import React, { useEffect } from 'react';
import { View, SectionList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationItem, NotificationGroup } from '@/components/notifications';
import { Button } from '@/components/ui';
import { EmptyState, LoadingScreen } from '@/components/feedback';
import { useNotifications, useMarkAllAsRead } from '@/hooks/use-notifications';
import { useNotificationStore } from '@/stores/notification.store';
import { darkTheme, spacing, typography } from '@/theme';
import { groupNotificationsByDate } from '@/utils/notifications';

export function NotificationsListScreen({ navigation }: any) {
  const { data: notifications, isLoading, refetch } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();
  const clearUnread = useNotificationStore((s) => s.clearUnread);

  const sections = React.useMemo(() => {
    return groupNotificationsByDate(notifications || []);
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
    clearUnread();
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (notification.status === 'UNREAD') {
      await notificationsApi.markAsRead(notification.id);
      refetch();
    }

    // Navigate to entity
    if (notification.data?.entity_type && notification.data?.entity_id) {
      navigateToEntity(notification.data.entity_type, notification.data.entity_id);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificações</Text>
        <Button variant="ghost" size="sm" onPress={handleMarkAllAsRead}>
          Marcar todas como lidas
        </Button>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="Nenhuma notificação"
            message="Você está em dia!"
          />
        }
        refreshing={false}
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
  sectionHeader: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Lista notificações corretamente
- [ ] Marcar como lida funciona
- [ ] Marcar todas como lidas funciona
- [ ] Badge atualiza
- [ ] Push notifications chegam
- [ ] Clicar no push navega corretamente

---

## Checklist de Entrega

- [ ] NotificationStore funcionando
- [ ] Lista de notificações
- [ ] Marcar como lida
- [ ] Push notifications configurado
- [ ] Badge na tab
- [ ] Navegação para entidade
- [ ] Sem erros de TypeScript
