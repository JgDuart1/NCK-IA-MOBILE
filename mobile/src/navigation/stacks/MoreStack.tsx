import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MoreStackParamList } from '../types';
import { PlaceholderScreen } from '@/components/feedback';
import {
  CavernaHomeScreen,
  CavernaReservarScreen,
  CavernaMinhasReservasScreen,
  ReservationDetailScreen,
} from '@/screens/caverna';
import { darkTheme } from '@/theme';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreStack() {
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
        name="MoreMenu"
        component={PlaceholderScreen}
        options={{ title: 'Mais' }}
      />

      <Stack.Screen
        name="Profile"
        component={PlaceholderScreen}
        options={{ title: 'Meu Perfil' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={PlaceholderScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={PlaceholderScreen}
        options={{ title: 'Alterar Senha' }}
      />
      <Stack.Screen
        name="InviteUser"
        component={PlaceholderScreen}
        options={{ title: 'Convidar Usuário' }}
      />
      <Stack.Screen
        name="PendingInvites"
        component={PlaceholderScreen}
        options={{ title: 'Convites Pendentes' }}
      />

      <Stack.Screen
        name="Settings"
        component={PlaceholderScreen}
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen
        name="About"
        component={PlaceholderScreen}
        options={{ title: 'Sobre' }}
      />

      <Stack.Screen
        name="NotesList"
        component={PlaceholderScreen}
        options={{ title: 'Notas' }}
      />
      <Stack.Screen
        name="NoteFolders"
        component={PlaceholderScreen}
        options={{ title: 'Pastas' }}
      />

      <Stack.Screen
        name="CanvasList"
        component={PlaceholderScreen}
        options={{ title: 'Business Canvas' }}
      />

      <Stack.Screen
        name="CavernaHome"
        component={CavernaHomeScreen}
        options={{ title: 'Caverna do Dragão' }}
      />
      <Stack.Screen
        name="CavernaReservar"
        component={CavernaReservarScreen}
        options={{ title: 'Nova Reserva' }}
      />
      <Stack.Screen
        name="CavernaMinhasReservas"
        component={CavernaMinhasReservasScreen}
        options={{ title: 'Minhas Reservas' }}
      />
      <Stack.Screen
        name="ReservationDetail"
        component={ReservationDetailScreen}
        options={{ title: 'Detalhes da Reserva' }}
      />
    </Stack.Navigator>
  );
}



