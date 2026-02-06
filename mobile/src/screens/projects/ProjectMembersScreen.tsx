import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { MemberListItem } from '@/components/projects';
import { EmptyState, ErrorState, LoadingScreen } from '@/components/feedback';
import { Button, Input, Modal } from '@/components/ui';
import {
  useAddProjectMember,
  useProjectMembers,
  useRemoveProjectMember,
  useUpdateProjectMemberRole,
} from '@/hooks/use-project-members';
import { darkTheme, spacing, typography } from '@/theme';
import { ProjectMember } from '@/types';
import { ProjectsScreenProps } from '@/navigation/types';

const ROLE_OPTIONS: ProjectMember['role'][] = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'];

type Props = ProjectsScreenProps<'ProjectMembers'>;

export function ProjectMembersScreen({ route }: Props) {
  const { projectId } = route.params;
  const { data, isLoading, error, refetch } = useProjectMembers(projectId);
  const addMember = useAddProjectMember(projectId);
  const removeMember = useRemoveProjectMember(projectId);
  const updateRole = useUpdateProjectMemberRole(projectId);

  const [isAddOpen, setAddOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<ProjectMember['role']>('MEMBER');
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);

  const handleAddMember = async () => {
    const normalizedUserId = userId.trim();
    try {
      await addMember.mutateAsync({ userId: normalizedUserId, role });
      Toast.show({
        type: 'success',
        text1: 'Membro adicionado',
        text2: 'O membro foi adicionado ao projeto.',
      });
      setUserId('');
      setRole('MEMBER');
      setAddOpen(false);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err) || 'Nao foi possivel adicionar o membro';
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar',
        text2: message,
      });
    }
  };

  const handleRemove = (member: ProjectMember) => {
    Alert.alert('Remover membro', `Deseja remover ${member.user?.name || 'este membro'}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeMember.mutateAsync(member.id);
            Toast.show({
              type: 'success',
              text1: 'Membro removido',
              text2: 'O membro foi removido do projeto.',
            });
          } catch (err: unknown) {
            const message = getApiErrorMessage(err) || 'Nao foi possivel remover o membro';
            Toast.show({
              type: 'error',
              text1: 'Erro ao remover',
              text2: message,
            });
          }
        },
      },
    ]);
  };

  const handleChangeRole = async (member: ProjectMember, nextRole: ProjectMember['role']) => {
    try {
      await updateRole.mutateAsync({ memberId: member.id, role: nextRole });
      Toast.show({
        type: 'success',
        text1: 'Role atualizada',
        text2: 'A permissao do membro foi atualizada.',
      });
      setEditingMember(null);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err) || 'Nao foi possivel atualizar a role';
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar',
        text2: message,
      });
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar membros"
        description="Nao foi possivel carregar os membros deste projeto."
        onRetry={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Membros</Text>
        <Button size="sm" onPress={() => setAddOpen(true)}>
          Adicionar
        </Button>
      </View>

      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MemberListItem
            member={item}
            onRemove={handleRemove}
            onChangeRole={(member) => setEditingMember(member)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="Sem membros"
            description="Adicione membros ao projeto para colaborar."
          />
        }
      />

      <Modal visible={isAddOpen} onClose={() => setAddOpen(false)}>
        <Text style={styles.modalTitle}>Adicionar membro</Text>
        <Input
          label="ID do usuario"
          placeholder="ID ou email"
          value={userId}
          onChangeText={setUserId}
        />
        <Text style={styles.modalLabel}>Role</Text>
        <View style={styles.roleRow}>
          {ROLE_OPTIONS.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={role === item ? 'primary' : 'outline'}
              onPress={() => setRole(item)}
            >
              {item}
            </Button>
          ))}
        </View>
        <View style={styles.modalActions}>
          <Button variant="ghost" onPress={() => setAddOpen(false)}>
            Cancelar
          </Button>
          <Button onPress={handleAddMember} loading={addMember.isPending} disabled={!userId.trim()}>
            Adicionar
          </Button>
        </View>
      </Modal>

      <Modal visible={!!editingMember} onClose={() => setEditingMember(null)}>
        <Text style={styles.modalTitle}>Alterar role</Text>
        <Text style={styles.modalLabel}>{editingMember?.user?.name || 'Membro'}</Text>
        <View style={styles.roleRow}>
          {ROLE_OPTIONS.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={editingMember?.role === item ? 'primary' : 'outline'}
              onPress={() => editingMember && handleChangeRole(editingMember, item)}
            >
              {item}
            </Button>
          ))}
        </View>
        <View style={styles.modalActions}>
          <Button variant="ghost" onPress={() => setEditingMember(null)}>
            Fechar
          </Button>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: darkTheme.text,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: darkTheme.text,
    marginBottom: spacing.sm,
  },
  modalLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});

function getApiErrorMessage(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return null;
  }
  const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
  return maybeResponse?.data?.message ?? null;
}
