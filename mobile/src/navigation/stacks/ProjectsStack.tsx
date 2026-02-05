import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProjectsStackParamList } from '../types';
import { PlaceholderScreen } from '@/components/feedback';
import {
  ProjectDetailScreen,
  ProjectMembersScreen,
  ProjectNewScreen,
  ProjectSettingsScreen,
  ProjectsListScreen,
} from '@/screens/projects';
import { darkTheme } from '@/theme';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export function ProjectsStack() {
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
        name="ProjectsList"
        component={ProjectsListScreen}
        options={{ title: 'Projetos' }}
      />
      <Stack.Screen
        name="ProjectNew"
        component={ProjectNewScreen}
        options={{ title: 'Novo Projeto' }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{ title: 'Projeto' }}
      />
      <Stack.Screen
        name="ProjectSettings"
        component={ProjectSettingsScreen}
        options={{ title: 'Configuracoes' }}
      />
      <Stack.Screen
        name="ProjectMembers"
        component={ProjectMembersScreen}
        options={{ title: 'Membros' }}
      />

      <Stack.Screen
        name="TasksList"
        component={PlaceholderScreen}
        options={{ title: 'Tarefas' }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={PlaceholderScreen}
        options={{ title: 'Tarefa' }}
      />
      <Stack.Screen
        name="TaskNew"
        component={PlaceholderScreen}
        options={{ title: 'Nova Tarefa' }}
      />

      <Stack.Screen
        name="SprintsList"
        component={PlaceholderScreen}
        options={{ title: 'Sprints' }}
      />
      <Stack.Screen
        name="SprintDetail"
        component={PlaceholderScreen}
        options={{ title: 'Sprint' }}
      />
      <Stack.Screen
        name="SprintNew"
        component={PlaceholderScreen}
        options={{ title: 'Nova Sprint' }}
      />

      <Stack.Screen
        name="ProjectNotes"
        component={PlaceholderScreen}
        options={{ title: 'Notas' }}
      />
      <Stack.Screen
        name="NoteDetail"
        component={PlaceholderScreen}
        options={{ title: 'Nota' }}
      />
      <Stack.Screen
        name="NoteNew"
        component={PlaceholderScreen}
        options={{ title: 'Nova Nota' }}
      />

      <Stack.Screen
        name="ProjectCanvas"
        component={PlaceholderScreen}
        options={{ title: 'Canvas' }}
      />
      <Stack.Screen
        name="CanvasDetail"
        component={PlaceholderScreen}
        options={{ title: 'Business Canvas' }}
      />
    </Stack.Navigator>
  );
}
