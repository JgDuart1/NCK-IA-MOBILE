import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from '@/components/ui';
import { InviteStatusBadge } from './InviteStatusBadge';
import { ROLE_LABELS } from './RoleSelector';
import { Invite } from '@/services/api/users.api';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';

interface InviteCardProps {
  invite: Invite;
  onResend?: () => void;
  onCancel?: () => void;
  isLoadingResend?: boolean;
  isLoadingCancel?: boolean;
}

export function InviteCard({
  invite,
  onResend,
  onCancel,
  isLoadingResend,
  isLoadingCancel,
}: InviteCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.email}>{invite.email}</Text>
          <Text style={styles.role}>{ROLE_LABELS[invite.role_type]}</Text>
        </View>
        <InviteStatusBadge status={invite.status} />
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaText}>Enviado em {formatDate(invite.created_at)}</Text>
        <Text style={styles.metaText}>Expira em {formatDate(invite.expires_at)}</Text>
      </View>

      {(onResend || onCancel) && (
        <View style={styles.actions}>
          {onResend ? (
            <Button
              variant="outline"
              size="sm"
              onPress={onResend}
              loading={isLoadingResend}
            >
              Reenviar
            </Button>
          ) : null}
          {onCancel ? (
            <Button
              variant="danger"
              size="sm"
              onPress={onCancel}
              loading={isLoadingCancel}
            >
              Cancelar
            </Button>
          ) : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  email: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  role: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  meta: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
