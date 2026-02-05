import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  MagicLinkEmail: undefined;
  MagicLinkSent: { email: string };
  MagicLinkVerify: { token: string };
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectNew: undefined;
  ProjectDetail: { projectId: string };
  ProjectSettings: { projectId: string };
  ProjectMembers: { projectId: string };
  TasksList: { projectId: string };
  TaskDetail: { projectId: string; taskId: string };
  TaskNew: { projectId: string; sprintId?: string };
  TaskEdit: { projectId: string; taskId: string };
  SprintsList: { projectId: string };
  SprintDetail: { projectId: string; sprintId: string };
  SprintNew: { projectId: string; sprintId?: string };
  ProjectNotes: { projectId: string };
  NoteDetail: { noteId: string };
  NoteNew: { projectId?: string; folderId?: string };
  NoteVersions: { noteId: string };
  ProjectCanvas: { projectId: string };
  CanvasDetail: { canvasId: string };
};

export type CalendarStackParamList = {
  Calendar: { projectId?: string };
  EventDetail: { eventId: string };
  EventNew: { date?: string; projectId?: string };
  EventEdit: { eventId: string };
  MeetingRequestDetail: { requestId: string };
};

export type NotificationsStackParamList = {
  NotificationsList: undefined;
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  InviteUser: undefined;
  PendingInvites: undefined;
  Settings: undefined;
  About: undefined;
  NotesList: undefined;
  NoteFolders: undefined;
  NoteDetail: { noteId: string };
  NoteNew: { projectId?: string; folderId?: string };
  NoteVersions: { noteId: string };
  CanvasList: undefined;
  CavernaHome: undefined;
  CavernaReservar: undefined;
  CavernaMinhasReservas: undefined;
  ReservationDetail: { reservationId: string };
};

export type MainTabsParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  ProjectsTab: NavigatorScreenParams<ProjectsStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarStackParamList>;
  NotificationsTab: NavigatorScreenParams<NotificationsStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type ProjectsScreenProps<T extends keyof ProjectsStackParamList> =
  NativeStackScreenProps<ProjectsStackParamList, T>;

export type CalendarScreenProps<T extends keyof CalendarStackParamList> =
  NativeStackScreenProps<CalendarStackParamList, T>;

export type MoreScreenProps<T extends keyof MoreStackParamList> =
  NativeStackScreenProps<MoreStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabsParamList> =
  BottomTabScreenProps<MainTabsParamList, T>;
