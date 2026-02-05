import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProjectMember } from '@/types';
import { Avatar, Badge, Button } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface MemberListItemProps {
  member: ProjectMember;
  onRemove?: (member: ProjectMember) => void;
  onChangeRole?: (member: ProjectMember) => void;
}

const ROLE_LABELS: Record<ProjectMember['role'], string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Membro',
  VIEWER: 'Viewer',
};

export function MemberListItem({ member, onRemove, onChangeRole }: MemberListItemProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={member.user?.avatar_url} size={40} />
      <View style={styles.info}>
        <Text style={styles.name}>{member.user?.name || 'Usuario'}</Text>
        <Text style={styles.email}>{member.user?.email}</Text>
        <Badge label={ROLE_LABELS[member.role]} />
      </View>
      <View style={styles.actions}>
        {onChangeRole ? (
          <Button variant="outline" size="sm" onPress={() => onChangeRole(member)}>
            Role
          </Button>
        ) : null}
        {onRemove ? (
          <Button variant="danger" size="sm" onPress={() => onRemove(member)}>
            Remover
          </Button>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  email: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  actions: {
    gap: spacing.xs,
  },
});
