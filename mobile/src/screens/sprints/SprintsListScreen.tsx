import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SprintCard } from '@/components/sprints';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { useProject } from '@/hooks/use-projects';
import { useSprints } from '@/hooks/use-sprints';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';


type Props = ProjectsScreenProps<'SprintsList'>;

export function SprintsListScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { data: project } = useProject(projectId);
  const { data: sprints = [], isLoading, error, refetch } = useSprints(projectId);
  const sortedSprints = [...sprints].sort((a, b) => a.order_index - b.order_index);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sprints</Text>
          {project?.name ? <Text style={styles.subtitle}>{project.name}</Text> : null}
        </View>
      </View>

      {sortedSprints.length === 0 ? (
        <EmptyState
          icon="layers-outline"
          title="Sem sprints"
          description="Crie a primeira sprint para este projeto."
        />
      ) : (
        <FlatList
          data={sortedSprints}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SprintCard
              sprint={item}
              onPress={() =>
                navigation.navigate('SprintDetail', { projectId, sprintId: item.id })
              }
            />
          )}
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('SprintNew', { projectId })}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
