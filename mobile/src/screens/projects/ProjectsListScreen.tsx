import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ProjectCard, StatusFilter } from '@/components/projects';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { Button } from '@/components/ui';
import { useProjects } from '@/hooks/use-projects';
import { darkTheme, spacing } from '@/theme';
import { ProjectsScreenProps } from '@/navigation/types';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'PAUSED', label: 'Pausados' },
  { value: 'ARCHIVED', label: 'Arquivados' },
];

type Props = ProjectsScreenProps<'ProjectsList'>;

export function ProjectsListScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const filters = useMemo(() => ({ search, status }), [search, status]);
  const { data, isLoading, isFetching, refetch, error } = useProjects(filters);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar projetos"
        onRetry={refetch}
        description="Nao foi possivel carregar a lista de projetos."
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar projetos..."
          placeholderTextColor={darkTheme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Button
          variant="primary"
          size="sm"
          onPress={() => navigation.navigate('ProjectNew')}
          leftIcon={<Ionicons name="add" size={20} color="#fff" />}
        >
          Novo
        </Button>
      </View>

      <StatusFilter options={STATUS_OPTIONS} selected={status} onSelect={setStatus} />

      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="folder-outline"
              title="Nenhum projeto"
              description="Crie seu primeiro projeto para comecar"
            />
            <Button onPress={() => navigation.navigate('ProjectNew')}>Criar Projeto</Button>
          </View>
        }
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 8,
    padding: spacing.md,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  emptyContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
});
