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
import {
  CanvasListScreen,
  CanvasNewScreen,
  CanvasDetailScreen,
  BlockEditorScreen,
  AssumptionsScreen,
  ExperimentsScreen,
} from '@/screens/canvas';
import { TasksListScreen, TaskDetailScreen, TaskNewScreen, TaskEditScreen } from '@/screens/tasks';
import { SprintsListScreen, SprintDetailScreen, SprintNewScreen } from '@/screens/sprints';
import {
  NotesListScreen,
  NoteDetailScreen,
  NoteNewScreen,
  NoteVersionsScreen,
} from '@/screens/notes';
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

      <Stack.Screen name="TasksList" component={TasksListScreen} options={{ title: 'Tarefas' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Tarefa' }} />
      <Stack.Screen name="TaskNew" component={TaskNewScreen} options={{ title: 'Nova Tarefa' }} />
      <Stack.Screen
        name="TaskEdit"
        component={TaskEditScreen}
        options={{ title: 'Editar Tarefa' }}
      />

      <Stack.Screen
        name="SprintsList"
        component={SprintsListScreen}
        options={{ title: 'Sprints' }}
      />
      <Stack.Screen
        name="SprintDetail"
        component={SprintDetailScreen}
        options={{ title: 'Sprint' }}
      />
      <Stack.Screen
        name="SprintNew"
        component={SprintNewScreen}
        options={{ title: 'Nova Sprint' }}
      />

      <Stack.Screen name="ProjectNotes" component={NotesListScreen} options={{ title: 'Notas' }} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} options={{ title: 'Nota' }} />
      <Stack.Screen name="NoteNew" component={NoteNewScreen} options={{ title: 'Nova Nota' }} />
      <Stack.Screen
        name="NoteVersions"
        component={NoteVersionsScreen}
        options={{ title: 'Versoes' }}
      />

      <Stack.Screen
        name="ProjectCanvas"
        component={CanvasListScreen}
        options={{ title: 'Canvas' }}
      />
      <Stack.Screen
        name="CanvasDetail"
        component={CanvasDetailScreen}
        options={{ title: 'Business Canvas' }}
      />
      <Stack.Screen
        name="CanvasNew"
        component={CanvasNewScreen}
        options={{ title: 'Novo Canvas' }}
      />
      <Stack.Screen
        name="BlockEditor"
        component={BlockEditorScreen}
        options={{ title: 'Editar Bloco' }}
      />
      <Stack.Screen
        name="Assumptions"
        component={AssumptionsScreen}
        options={{ title: 'Assumptions' }}
      />
      <Stack.Screen
        name="Experiments"
        component={ExperimentsScreen}
        options={{ title: 'Experimentos' }}
      />
    </Stack.Navigator>
  );
}
