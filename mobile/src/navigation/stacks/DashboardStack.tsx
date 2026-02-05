import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '../types';
import { PlaceholderScreen } from '@/components/feedback';
import { darkTheme } from '@/theme';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack() {
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
        name="Dashboard"
        component={PlaceholderScreen}
        options={{ title: 'Início' }}
      />
    </Stack.Navigator>
  );
}
