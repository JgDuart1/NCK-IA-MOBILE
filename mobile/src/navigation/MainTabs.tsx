import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useNotificationStore } from '@/stores/notification.store';
import { DashboardStack } from './stacks/DashboardStack';
import { ProjectsStack } from './stacks/ProjectsStack';
import { CalendarStack } from './stacks/CalendarStack';
import { NotificationsStack } from './stacks/NotificationsStack';
import { MoreStack } from './stacks/MoreStack';
import { MainTabsParamList } from './types';
import { darkTheme } from '@/theme';
import { usePushNotifications, useUnreadCount } from '@/hooks';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_ICONS: Record<keyof MainTabsParamList, keyof typeof Ionicons.glyphMap> = {
  DashboardTab: 'home-outline',
  ProjectsTab: 'folder-outline',
  CalendarTab: 'calendar-outline',
  NotificationsTab: 'notifications-outline',
  MoreTab: 'menu-outline',
};

const TAB_LABELS: Record<keyof MainTabsParamList, string> = {
  DashboardTab: 'Início',
  ProjectsTab: 'Projetos',
  CalendarTab: 'Calendário',
  NotificationsTab: 'Alertas',
  MoreTab: 'Mais',
};

export function MainTabs() {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  usePushNotifications();
  useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: darkTheme.surface,
          borderTopColor: darkTheme.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: darkTheme.primary,
        tabBarInactiveTintColor: darkTheme.textSecondary,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
        tabBarLabel: TAB_LABELS[route.name],
        tabBarBadge:
          route.name === 'NotificationsTab' && unreadCount > 0
            ? unreadCount > 99
              ? '99+'
              : unreadCount
            : undefined,
        tabBarBadgeStyle: {
          backgroundColor: '#EF4444',
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} />
      <Tab.Screen name="ProjectsTab" component={ProjectsStack} />
      <Tab.Screen name="CalendarTab" component={CalendarStack} />
      <Tab.Screen name="NotificationsTab" component={NotificationsStack} />
      <Tab.Screen name="MoreTab" component={MoreStack} />
    </Tab.Navigator>
  );
}
