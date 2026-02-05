import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationIcon } from './NotificationIcon';
import { Notification } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { formatRelativeTime } from '@/utils';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const isUnread = notification.status === 'UNREAD';

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.containerUnread]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <NotificationIcon type={notification.type} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(notification.created_at)}</Text>
      </View>

      {isUnread ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  containerUnread: {
    backgroundColor: `${darkTheme.primary}10`,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkTheme.primary,
    marginTop: 6,
  },
});
