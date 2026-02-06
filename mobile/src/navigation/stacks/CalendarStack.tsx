import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CalendarStackParamList } from '../types';
import {
  CalendarScreen,
  EventDetailScreen,
  EventNewScreen,
  EventEditScreen,
  MeetingRequestDetailScreen,
} from '@/screens/calendar';
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
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendario' }} />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Evento' }}
      />
      <Stack.Screen name="EventNew" component={EventNewScreen} options={{ title: 'Novo Evento' }} />
      <Stack.Screen
        name="EventEdit"
        component={EventEditScreen}
        options={{ title: 'Editar Evento' }}
      />
      <Stack.Screen
        name="MeetingRequestDetail"
        component={MeetingRequestDetailScreen}
        options={{ title: 'Reuniao' }}
      />
    </Stack.Navigator>
  );
}
