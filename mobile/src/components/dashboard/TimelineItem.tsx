import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimelineEntry, TimelineAction } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { Avatar } from '@/components/ui';
import { formatRelativeTime } from '@/utils/format';

interface TimelineItemProps {
  entry: TimelineEntry;
  onPress: () => void;
}

const ACTION_CONFIG: Record<TimelineAction, { icon: string; color: string; text: string }> = {
  CREATED: { icon: 'add-circle', color: '#10B981', text: 'criou' },
  UPDATED: { icon: 'pencil', color: '#3B82F6', text: 'atualizou' },
  DELETED: { icon: 'trash', color: '#EF4444', text: 'excluiu' },
  STATUS_CHANGED: { icon: 'swap-horizontal', color: '#F59E0B', text: 'alterou status de' },
  MEMBER_ADDED: { icon: 'person-add', color: '#10B981', text: 'adicionou membro em' },
  MEMBER_REMOVED: { icon: 'person-remove', color: '#EF4444', text: 'removeu membro de' },
  ASSIGNED: { icon: 'person', color: '#6366F1', text: 'atribuiu' },
  UNASSIGNED: { icon: 'person-outline', color: '#9CA3AF', text: 'desatribuiu' },
  COMMENT_ADDED: { icon: 'chatbubble', color: '#3B82F6', text: 'comentou em' },
  VERSION_CREATED: { icon: 'git-branch', color: '#8B5CF6', text: 'criou versao de' },
};

export function TimelineItem({ entry, onPress }: TimelineItemProps) {
  const config = ACTION_CONFIG[entry.action] || ACTION_CONFIG.UPDATED;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Avatar uri={entry.user.avatar_url} size={40} />
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.userName}>{entry.user.name}</Text> {config.text}{' '}
          <Text style={styles.entityType}>{entry.entity_type}</Text>
        </Text>
        <Text style={styles.time}>{formatRelativeTime(entry.created_at)}</Text>
      </View>
      <Ionicons name={config.icon as any} size={20} color={config.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  text: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  userName: {
    fontWeight: '600',
  },
  entityType: {
    color: darkTheme.primary,
  },
  time: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
});
