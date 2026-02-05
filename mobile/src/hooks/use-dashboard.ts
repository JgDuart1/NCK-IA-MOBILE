import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api/dashboard.api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardApi.getMetrics,
  });
}

export function useRecentProjects() {
  return useQuery({
    queryKey: ['dashboard', 'recent-projects'],
    queryFn: dashboardApi.getRecentProjects,
  });
}

export function useTimeline() {
  return useInfiniteQuery({
    queryKey: ['dashboard', 'timeline'],
    queryFn: ({ pageParam = 1 }) => dashboardApi.getTimeline(pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
  });
}

export function useMyTasks() {
  return useQuery({
    queryKey: ['dashboard', 'my-tasks'],
    queryFn: dashboardApi.getMyTasks,
  });
}

export function useTodayEvents() {
  return useQuery({
    queryKey: ['dashboard', 'today-events'],
    queryFn: dashboardApi.getTodayEvents,
  });
}
