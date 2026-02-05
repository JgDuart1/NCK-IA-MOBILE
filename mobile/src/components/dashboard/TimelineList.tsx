import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { TimelineEntry, TimelineAction } from '@/types';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Skeleton } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';
import { TimelineItem } from './TimelineItem';

type TimelinePage = { data: TimelineEntry[]; hasMore: boolean };

interface TimelineListProps {
  timeline: UseInfiniteQueryResult<InfiniteData<TimelinePage>, Error>;
  onItemPress: (entry: TimelineEntry) => void;
}

const FILTERS: { id: 'ALL' | TimelineAction; label: string }[] = [
  { id: 'ALL', label: 'Tudo' },
  { id: 'CREATED', label: 'Criados' },
  { id: 'UPDATED', label: 'Atualizados' },
  { id: 'STATUS_CHANGED', label: 'Status' },
  { id: 'COMMENT_ADDED', label: 'Comentarios' },
];

export function TimelineList({ timeline, onItemPress }: TimelineListProps) {
  const [filter, setFilter] = React.useState<'ALL' | TimelineAction>('ALL');

  const entries = React.useMemo(() => {
    const allEntries = timeline.data?.pages.flatMap((page: TimelinePage) => page.data) ?? [];
    if (filter === 'ALL') return allEntries;
    return allEntries.filter((entry: TimelineEntry) => entry.action === filter);
  }, [timeline.data, filter]);

  if (timeline.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Timeline</Text>
        <View style={styles.list}>
          <TimelineSkeleton />
          <TimelineSkeleton />
          <TimelineSkeleton />
        </View>
      </View>
    );
  }

  if (timeline.isError) {
    return (
      <ErrorState
        title="Erro ao carregar timeline"
        description="Nao foi possivel carregar atividades recentes."
        onRetry={() => timeline.refetch()}
      />
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Timeline</Text>
        <EmptyState
          title="Sem atividades"
          description="Nenhuma atividade recente encontrada."
          icon="time-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((item) => {
            const isActive = item.id === filter;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setFilter(item.id)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.list}>
        {entries.map((entry) => (
          <TimelineItem key={entry.id} entry={entry} onPress={() => onItemPress(entry)} />
        ))}
        {timeline.isFetchingNextPage ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator color={darkTheme.primary} />
            <Text style={styles.loadingText}>Carregando mais...</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function TimelineSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ flex: 1 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} style={{ marginTop: spacing.xs }} />
      </View>
      <Skeleton width={20} height={20} borderRadius={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  filters: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: darkTheme.surfaceSecondary,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  filterChipActive: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  filterText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  filterTextActive: {
    color: darkTheme.text,
    fontWeight: '600',
  },
  list: {
    gap: spacing.sm,
  },
  skeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
