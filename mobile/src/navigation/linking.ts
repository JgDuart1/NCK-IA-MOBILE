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
              EventNew: 'events/new',
              EventEdit: 'events/:eventId/edit',
              MeetingRequestDetail: 'meeting-requests/:requestId',
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
