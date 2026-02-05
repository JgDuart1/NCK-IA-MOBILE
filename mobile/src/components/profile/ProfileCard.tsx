import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Card } from '@/components/ui';
import { ProfileInfo } from './ProfileInfo';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';
import { Tenant, User } from '@/types';

interface ProfileCardProps {
  user: User;
  tenant?: Tenant | null;
}

export function ProfileCard({ user, tenant }: ProfileCardProps) {
  return (
    <View>
      <View style={styles.header}>
        <Avatar uri={user.avatar_url} name={user.name} size={100} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user.role.name}</Text>
        </View>
      </View>

      <Card style={styles.info}>
        <ProfileInfo label="Workspace" value={tenant?.name} />
        <ProfileInfo label="Membro desde" value={formatDate(user.created_at)} />
        {user.last_login_at ? (
          <ProfileInfo label="Ultimo acesso" value={formatDate(user.last_login_at)} />
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h2,
    color: darkTheme.text,
    marginTop: spacing.md,
  },
  email: {
    ...typography.body,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: darkTheme.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  info: {
    marginBottom: spacing.lg,
  },
});
