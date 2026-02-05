import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '@/navigation/types';
import {
  DashboardHeader,
  MetricsRow,
  QuickActions,
  RecentProjects,
  TimelineList,
} from '@/components/dashboard';
import { useDashboardMetrics, useRecentProjects, useTimeline } from '@/hooks/use-dashboard';
import { useAuth } from '@/hooks/use-auth';
import { TimelineEntry } from '@/types';
import { darkTheme, spacing } from '@/theme';

export type DashboardScreenProps = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const metrics = useDashboardMetrics();
  const projects = useRecentProjects();
  const timeline = useTimeline();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);

    if (distanceFromBottom < 200 && timeline.hasNextPage && !timeline.isFetchingNextPage) {
      timeline.fetchNextPage();
    }
  };

  const handleTimelinePress = (entry: TimelineEntry) => {
    const tabNavigation = navigation.getParent();
    const entityType = entry.entity_type.toLowerCase();

    if (entityType.includes('project')) {
      tabNavigation?.navigate('ProjectsTab', {
        screen: 'ProjectDetail',
        params: { projectId: entry.entity_id },
      });
      return;
    }

    if (entityType.includes('task') && entry.project_id) {
      tabNavigation?.navigate('ProjectsTab', {
        screen: 'TaskDetail',
        params: { projectId: entry.project_id, taskId: entry.entity_id },
      });
      return;
    }

    if (entityType.includes('note')) {
      tabNavigation?.navigate('ProjectsTab', {
        screen: 'NoteDetail',
        params: { noteId: entry.entity_id },
      });
      return;
    }

    if (entityType.includes('event')) {
      tabNavigation?.navigate('CalendarTab', {
        screen: 'EventDetail',
        params: { eventId: entry.entity_id },
      });
    }
  };

  const tabNavigation = navigation.getParent();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkTheme.primary}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <DashboardHeader
          greeting={getGreeting()}
          userName={user?.name || 'Usuario'}
          avatarUrl={user?.avatar_url}
          onNotificationsPress={() => tabNavigation?.navigate('NotificationsTab')}
        />

        <MetricsRow metrics={metrics.data} isLoading={metrics.isLoading} />

        <QuickActions
          onNewTask={() =>
            tabNavigation?.navigate('ProjectsTab', {
              screen: 'TaskNew',
              params: { projectId: undefined },
            })
          }
          onNewEvent={() =>
            tabNavigation?.navigate('CalendarTab', {
              screen: 'EventNew',
            })
          }
        />

        <RecentProjects
          projects={projects.data || []}
          isLoading={projects.isLoading}
          onProjectPress={(projectId) =>
            tabNavigation?.navigate('ProjectsTab', {
              screen: 'ProjectDetail',
              params: { projectId },
            })
          }
          onSeeAll={() => tabNavigation?.navigate('ProjectsTab')}
        />

        <TimelineList timeline={timeline} onItemPress={handleTimelinePress} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
});
