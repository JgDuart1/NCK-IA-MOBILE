import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, Avatar } from '@/components/ui';
import { Task } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  const assigneeName = task.assignee?.name || 'Sem responsavel';
  const hasAttachments = (task.attachments || []).length > 0;

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <PriorityBadge priority={task.priority} size="sm" />
        </View>

        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.meta}>
          <View style={styles.assignee}>
            <Avatar size={24} uri={task.assignee?.avatar_url || undefined} name={assigneeName} />
            <Text style={styles.assigneeName} numberOfLines={1}>
              {assigneeName}
            </Text>
          </View>

          <View style={styles.metaRight}>
            {task.deadline ? (
              <View style={styles.deadline}>
                <Ionicons name="calendar-outline" size={14} color={darkTheme.textSecondary} />
                <Text style={styles.deadlineText}>{formatDate(task.deadline)}</Text>
              </View>
            ) : null}

            {hasAttachments ? (
              <View style={styles.attachment}>
                <Ionicons name="attach-outline" size={14} color={darkTheme.textSecondary} />
                <Text style={styles.attachmentText}>{task.attachments?.length || 0}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    color: darkTheme.text,
    flex: 1,
  },
  description: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  assigneeName: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    flex: 1,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachmentText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}
