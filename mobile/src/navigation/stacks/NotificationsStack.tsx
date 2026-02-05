import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NotificationsStackParamList } from '../types';
import { NotificationsListScreen } from '@/screens/notifications';
import { darkTheme } from '@/theme';

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

export function NotificationsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: darkTheme.surface,
        },
        headerTintColor: darkTheme.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="NotificationsList"
        component={NotificationsListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
