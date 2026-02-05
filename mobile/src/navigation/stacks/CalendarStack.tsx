import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CalendarStackParamList } from '../types';
import { PlaceholderScreen } from '@/components/feedback';
import { darkTheme } from '@/theme';

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export function CalendarStack() {
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
        name="Calendar"
        component={PlaceholderScreen}
        options={{ title: 'Calendário' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={PlaceholderScreen}
        options={{ title: 'Evento' }}
      />
      <Stack.Screen
        name="EventNew"
        component={PlaceholderScreen}
        options={{ title: 'Novo Evento' }}
      />
      <Stack.Screen
        name="MeetingRequestDetail"
        component={PlaceholderScreen}
        options={{ title: 'Reunião' }}
      />
    </Stack.Navigator>
  );
}
