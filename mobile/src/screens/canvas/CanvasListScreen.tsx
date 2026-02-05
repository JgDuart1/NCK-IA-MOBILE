import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { CanvasCard } from '@/components/canvas';
import { ProjectCard } from '@/components/projects';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { Button } from '@/components/ui';
import { useCanvasList } from '@/hooks/use-canvas';
import { useProjects } from '@/hooks/use-projects';
import { useProjectStore } from '@/stores/project.store';
import { darkTheme, spacing } from '@/theme';
import { MainTabsParamList } from '@/navigation/types';

interface CanvasListRoute {
  params?: {
    projectId?: string;
  };
}

interface CanvasListProps {
  navigation: {
    getParent: <T = BottomTabNavigationProp<MainTabsParamList>>() => T | undefined;
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route: CanvasListRoute;
}

export function CanvasListScreen({ navigation, route }: CanvasListProps) {
  const selectedProject = useProjectStore((s) => s.selectedProject);
  const setSelectedProject = useProjectStore((s) => s.setSelectedProject);

  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(
    route.params?.projectId ?? selectedProject?.id
  );

  useEffect(() => {
    if (route.params?.projectId) {
      setActiveProjectId(route.params.projectId);
      return;
    }
    if (!activeProjectId && selectedProject?.id) {
      setActiveProjectId(selectedProject.id);
    }
  }, [route.params?.projectId, selectedProject?.id, activeProjectId]);

  const { data, isLoading, error, refetch, isFetching } = useCanvasList(
    activeProjectId ?? ''
  );
  const projectsQuery = useProjects();

  const handleNavigateToProjects = () => {
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    parent?.navigate('ProjectsTab', { screen: 'ProjectsList' });
  };

  const handleNewCanvas = () => {
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    if (!activeProjectId) return;
    if (parent) {
      parent.navigate('ProjectsTab', { screen: 'CanvasNew', params: { projectId: activeProjectId } });
      return;
    }
    navigation.navigate('CanvasNew', { projectId: activeProjectId });
  };

  const handleOpenCanvas = (canvasId: string) => {
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    if (parent) {
      parent.navigate('ProjectsTab', { screen: 'CanvasDetail', params: { canvasId } });
      return;
    }
    navigation.navigate('CanvasDetail', { canvasId });
  };

  const handleSelectProject = (project: NonNullable<typeof projectsQuery.data>['data'][number]) => {
    setSelectedProject(project);
    setActiveProjectId(project.id);
  };

  const projects = useMemo(() => projectsQuery.data?.data || [], [projectsQuery.data]);

  if (!activeProjectId) {
    if (projectsQuery.isLoading) {
      return <LoadingScreen />;
    }

    if (projectsQuery.error) {
      return (
        <ErrorState
          title="Erro ao carregar projetos"
          description="Nao foi possivel carregar os projetos."
          onRetry={projectsQuery.refetch}
        />
      );
    }

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <EmptyState
            icon="briefcase-outline"
            title="Selecione um projeto"
            description="Escolha um projeto para abrir o Business Model Canvas."
          />
          <Button onPress={handleNavigateToProjects}>Ver projetos</Button>
        </View>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProjectCard project={item} onPress={() => handleSelectProject(item)} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="folder-outline"
                title="Nenhum projeto"
                description="Crie um projeto para comecar."
              />
              <Button onPress={handleNavigateToProjects}>Criar projeto</Button>
            </View>
          }
          refreshing={projectsQuery.isFetching}
          onRefresh={projectsQuery.refetch}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar canvas"
        description="Nao foi possivel carregar o canvas."
        onRetry={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Button
          variant="primary"
          size="sm"
          onPress={handleNewCanvas}
          leftIcon={<Ionicons name="add" size={18} color="#fff" />}
        >
          Novo Canvas
        </Button>
        <Button variant="outline" size="sm" onPress={() => setActiveProjectId(undefined)}>
          Trocar projeto
        </Button>
      </View>
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CanvasCard canvas={item} onPress={() => handleOpenCanvas(item.id)} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="document-outline"
              title="Nenhum canvas"
              description="Crie o primeiro canvas do projeto."
            />
            <Button onPress={handleNewCanvas}>Criar canvas</Button>
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
    padding: spacing.md,
    gap: spacing.md,
  },
  headerRow: {
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
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
