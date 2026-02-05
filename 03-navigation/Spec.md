# Plano 03: Navegação - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/03-navigation`
- **Timeout**: 1.5 horas
- **Arquivos de contexto**:
  - `../contracts.md`
  - `../01-estrutura-base/dependencies.md`
  - `../02-auth/dependencies.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── navigation/
│   ├── RootNavigator.tsx
│   ├── AuthStack.tsx
│   ├── MainTabs.tsx
│   ├── stacks/
│   │   ├── DashboardStack.tsx
│   │   ├── ProjectsStack.tsx
│   │   ├── CalendarStack.tsx
│   │   ├── NotificationsStack.tsx
│   │   └── MoreStack.tsx
│   ├── types.ts
│   ├── linking.ts
│   └── index.ts
│
└── components/
    └── navigation/
        ├── TabBar.tsx
        ├── Header.tsx
        └── index.ts
```

---

## Implementações

### 1. Types (src/navigation/types.ts)

```typescript
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  MagicLinkEmail: undefined;
  MagicLinkSent: { email: string };
  MagicLinkVerify: { token: string };
};

// Dashboard Stack
export type DashboardStackParamList = {
  Dashboard: undefined;
};

// Projects Stack
export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectNew: undefined;
  ProjectDetail: { projectId: string };
  ProjectSettings: { projectId: string };
  ProjectMembers: { projectId: string };
  // Tasks (Plano 06)
  TasksList: { projectId: string };
  TaskDetail: { projectId: string; taskId: string };
  TaskNew: { projectId: string; sprintId?: string };
  // Sprints (Plano 07)
  SprintsList: { projectId: string };
  SprintDetail: { projectId: string; sprintId: string };
  SprintNew: { projectId: string };
  // Notes (Plano 08)
  ProjectNotes: { projectId: string };
  NoteDetail: { noteId: string };
  NoteNew: { projectId?: string; folderId?: string };
  // Canvas (Plano 11)
  ProjectCanvas: { projectId: string };
  CanvasDetail: { canvasId: string };
};

// Calendar Stack
export type CalendarStackParamList = {
  Calendar: { projectId?: string };
  EventDetail: { eventId: string };
  EventNew: { date?: string; projectId?: string };
  MeetingRequestDetail: { requestId: string };
};

// Notifications Stack
export type NotificationsStackParamList = {
  NotificationsList: undefined;
};

// More Stack
export type MoreStackParamList = {
  MoreMenu: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  InviteUser: undefined;
  PendingInvites: undefined;
  Settings: undefined;
  About: undefined;
  // Global Notes
  NotesList: undefined;
  NoteFolders: undefined;
  // Canvas
  CanvasList: undefined;
  // Caverna
  CavernaHome: undefined;
  CavernaReservar: undefined;
  CavernaMinhasReservas: undefined;
};

// Main Tabs
export type MainTabsParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  ProjectsTab: NavigatorScreenParams<ProjectsStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarStackParamList>;
  NotificationsTab: NavigatorScreenParams<NotificationsStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

// Root
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};

// Screen Props helpers
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type ProjectsScreenProps<T extends keyof ProjectsStackParamList> =
  NativeStackScreenProps<ProjectsStackParamList, T>;

export type CalendarScreenProps<T extends keyof CalendarStackParamList> =
  NativeStackScreenProps<CalendarStackParamList, T>;

export type MoreScreenProps<T extends keyof MoreStackParamList> =
  NativeStackScreenProps<MoreStackParamList, T>;
```

### 2. Root Navigator (src/navigation/RootNavigator.tsx)

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/stores/auth.store';
import { LoadingScreen } from '@/components/feedback';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { linking } from './linking';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Auth Stack (src/navigation/AuthStack.tsx)

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  MagicLinkEmailScreen,
  MagicLinkSentScreen,
  MagicLinkVerifyScreen,
} from '@/screens/auth';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MagicLinkEmail" component={MagicLinkEmailScreen} />
      <Stack.Screen name="MagicLinkSent" component={MagicLinkSentScreen} />
      <Stack.Screen name="MagicLinkVerify" component={MagicLinkVerifyScreen} />
    </Stack.Navigator>
  );
}
```

### 4. Main Tabs (src/navigation/MainTabs.tsx)

```typescript
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
        tabBarBadge: route.name === 'NotificationsTab' && unreadCount > 0
          ? unreadCount > 99 ? '99+' : unreadCount
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
```

### 5. Projects Stack (src/navigation/stacks/ProjectsStack.tsx)

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProjectsStackParamList } from '../types';
import { darkTheme } from '@/theme';

// Placeholder screens - serão implementadas nos respectivos planos
const PlaceholderScreen = () => null;

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
      {/* Plano 05 */}
      <Stack.Screen
        name="ProjectsList"
        component={PlaceholderScreen}
        options={{ title: 'Projetos' }}
      />
      <Stack.Screen
        name="ProjectNew"
        component={PlaceholderScreen}
        options={{ title: 'Novo Projeto' }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={PlaceholderScreen}
        options={{ title: 'Projeto' }}
      />
      <Stack.Screen
        name="ProjectSettings"
        component={PlaceholderScreen}
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen
        name="ProjectMembers"
        component={PlaceholderScreen}
        options={{ title: 'Membros' }}
      />

      {/* Plano 06 - Tasks */}
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

      {/* Plano 07 - Sprints */}
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

      {/* Plano 08 - Notes */}
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

      {/* Plano 11 - Canvas */}
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
```

### 6. More Stack (src/navigation/stacks/MoreStack.tsx)

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MoreStackParamList } from '../types';
import { darkTheme } from '@/theme';

const PlaceholderScreen = () => null;

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
      
      {/* Plano 13 - Usuários */}
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
      
      {/* Plano 14 - Configurações */}
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
      
      {/* Plano 08 - Notes Global */}
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
      
      {/* Plano 11 - Canvas */}
      <Stack.Screen
        name="CanvasList"
        component={PlaceholderScreen}
        options={{ title: 'Business Canvas' }}
      />
      
      {/* Plano 12 - Caverna */}
      <Stack.Screen
        name="CavernaHome"
        component={PlaceholderScreen}
        options={{ title: 'Caverna do Dragão' }}
      />
      <Stack.Screen
        name="CavernaReservar"
        component={PlaceholderScreen}
        options={{ title: 'Nova Reserva' }}
      />
      <Stack.Screen
        name="CavernaMinhasReservas"
        component={PlaceholderScreen}
        options={{ title: 'Minhas Reservas' }}
      />
    </Stack.Navigator>
  );
}
```

### 7. Deep Linking (src/navigation/linking.ts)

```typescript
import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from './types';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'nckia://', 'https://app.nckia.com.br'],
  
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          MagicLinkVerify: 'auth/magic-link/verify',
        },
      },
      Main: {
        screens: {
          DashboardTab: {
            screens: {
              Dashboard: 'dashboard',
            },
          },
          ProjectsTab: {
            screens: {
              ProjectsList: 'projects',
              ProjectDetail: 'projects/:projectId',
              TaskDetail: 'projects/:projectId/tasks/:taskId',
            },
          },
          CalendarTab: {
            screens: {
              Calendar: 'calendar',
              EventDetail: 'events/:eventId',
            },
          },
          NotificationsTab: {
            screens: {
              NotificationsList: 'notifications',
            },
          },
        },
      },
    },
  },
};
```

---

## Atualização do App.tsx

```typescript
import { RootNavigator } from './src/navigation';

export default function App() {
  // ... existing code ...

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <StatusBar style="light" />
        <RootNavigator />
      </Providers>
    </GestureHandlerRootView>
  );
}
```

---

## Testes

### Testes Manuais
- [ ] Tab bar exibe corretamente
- [ ] Navegação entre tabs funciona
- [ ] Stack navigation funciona (push/pop)
- [ ] Deep links abrem telas corretas
- [ ] AuthGuard redireciona corretamente
- [ ] Badge de notificações exibe

---

## Checklist de Entrega

- [ ] RootNavigator com AuthGuard
- [ ] AuthStack com todas as telas
- [ ] MainTabs com 5 tabs
- [ ] Todas as stacks criadas
- [ ] Types exportados
- [ ] Deep linking configurado
- [ ] Placeholder screens funcionando
- [ ] Sem erros de TypeScript
