import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MoreStackParamList } from '../types';
import { PlaceholderScreen } from '@/components/feedback';
import { AboutScreen, SettingsScreen } from '@/screens/settings';
import {
  CavernaHomeScreen,
  CavernaReservarScreen,
  CavernaMinhasReservasScreen,
  ReservationDetailScreen,
} from '@/screens/caverna';
import { CanvasListScreen } from '@/screens/canvas';
import {
  ProfileScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  InviteUserScreen,
  PendingInvitesScreen,
} from '@/screens/profile';
import {
  NotesListScreen,
  NoteFoldersScreen,
  NoteDetailScreen,
  NoteNewScreen,
  NoteVersionsScreen,
} from '@/screens/notes';
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
      <Stack.Screen name="MoreMenu" component={PlaceholderScreen} options={{ title: 'Mais' }} />

      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Alterar Senha' }}
      />
      <Stack.Screen
        name="InviteUser"
        component={InviteUserScreen}
        options={{ title: 'Convidar Usuário' }}
      />
      <Stack.Screen
        name="PendingInvites"
        component={PendingInvitesScreen}
        options={{ title: 'Convites Pendentes' }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre' }} />

      <Stack.Screen name="NotesList" component={NotesListScreen} options={{ title: 'Notas' }} />
      <Stack.Screen
        name="NoteFolders"
        component={NoteFoldersScreen}
        options={{ title: 'Pastas' }}
      />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} options={{ title: 'Nota' }} />
      <Stack.Screen name="NoteNew" component={NoteNewScreen} options={{ title: 'Nova Nota' }} />
      <Stack.Screen
        name="NoteVersions"
        component={NoteVersionsScreen}
        options={{ title: 'Versões' }}
      />

      <Stack.Screen
        name="CanvasList"
        component={CanvasListScreen}
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
