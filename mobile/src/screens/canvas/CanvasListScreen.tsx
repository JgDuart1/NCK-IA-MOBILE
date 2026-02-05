import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { CanvasCard } from '@/components/canvas';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { Button } from '@/components/ui';
import { useCanvasList } from '@/hooks/use-canvas';
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
  const projectId = route.params?.projectId ?? selectedProject?.id;

  const { data, isLoading, error, refetch, isFetching } = useCanvasList(projectId ?? '');

  const handleNavigateToProjects = () => {
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    parent?.navigate('ProjectsTab', { screen: 'ProjectsList' });
  };

  const handleNewCanvas = () => {
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    if (!projectId) return;
    if (parent) {
      parent.navigate('ProjectsTab', { screen: 'CanvasNew', params: { projectId } });
      return;
    }
    navigation.navigate('CanvasNew', { projectId });
  };

  const handleOpenCanvas = (canvasId: string) => {
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    if (parent) {
      parent.navigate('ProjectsTab', { screen: 'CanvasDetail', params: { canvasId } });
      return;
    }
    navigation.navigate('CanvasDetail', { canvasId });
  };

  if (!projectId && !isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="briefcase-outline"
            title="Selecione um projeto"
            description="Escolha um projeto para visualizar os canvas."
          />
          <Button onPress={handleNavigateToProjects}>Ir para projetos</Button>
        </View>
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
      <View style={styles.header}>
        <Button
          variant="primary"
          size="sm"
          onPress={handleNewCanvas}
          leftIcon={<Ionicons name="add" size={18} color="#fff" />}
        >
          Novo Canvas
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
