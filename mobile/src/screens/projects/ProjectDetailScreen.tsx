import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ProjectHeader, ProjectTabs, ProjectOverview } from '@/components/projects';
import type { TabItem } from '@/components/projects';
import { LoadingScreen, ErrorState } from '@/components/feedback';
import { useProject } from '@/hooks/use-projects';
import { useProjectStore } from '@/stores/project.store';
import { darkTheme, spacing } from '@/theme';
import { MainTabsParamList, ProjectsScreenProps } from '@/navigation/types';

type Props = ProjectsScreenProps<'ProjectDetail'>;

export function ProjectDetailScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { data: project, isLoading, error, refetch } = useProject(projectId);
  const setSelectedProject = useProjectStore((s) => s.setSelectedProject);

  React.useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
    return () => setSelectedProject(null);
  }, [project, setSelectedProject]);

  if (isLoading) return <LoadingScreen />;
  if (error || !project) {
    return (
      <ErrorState
        title="Projeto nao encontrado"
        message="Nao foi possivel carregar o projeto"
        action={{ label: 'Tentar novamente', onPress: refetch }}
      />
    );
  }

  const tabs: TabItem[] = [
    { key: 'overview', label: 'Visao Geral', icon: 'grid-outline' },
    { key: 'tasks', label: 'Tarefas', icon: 'checkbox-outline' },
    { key: 'sprints', label: 'Sprints', icon: 'layers-outline' },
    { key: 'notes', label: 'Notas', icon: 'document-text-outline' },
    { key: 'calendar', label: 'Calendario', icon: 'calendar-outline' },
    { key: 'canvas', label: 'Canvas', icon: 'bulb-outline' },
    { key: 'members', label: 'Membros', icon: 'people-outline' },
    { key: 'settings', label: 'Config', icon: 'settings-outline' },
  ];

  const handleTabPress = (key: string) => {
    switch (key) {
      case 'tasks':
        navigation.navigate('TasksList', { projectId });
        break;
      case 'sprints':
        navigation.navigate('SprintsList', { projectId });
        break;
      case 'notes':
        navigation.navigate('ProjectNotes', { projectId });
        break;
      case 'calendar': {
        const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
        parent?.navigate('CalendarTab', { screen: 'Calendar', params: { projectId } });
        break;
      }
      case 'canvas':
        navigation.navigate('ProjectCanvas', { projectId });
        break;
      case 'members':
        navigation.navigate('ProjectMembers', { projectId });
        break;
      case 'settings':
        navigation.navigate('ProjectSettings', { projectId });
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProjectHeader project={project} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <ProjectTabs tabs={tabs} onTabPress={handleTabPress} />
        <ProjectOverview project={project} />
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
  },
});
