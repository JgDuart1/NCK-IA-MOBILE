import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface DashboardHeaderProps {
  greeting: string;
  userName: string;
  avatarUrl?: string | null;
  notificationsCount?: number;
  onNotificationsPress: () => void;
}

export function DashboardHeader({
  greeting,
  userName,
  avatarUrl,
  notificationsCount = 0,
  onNotificationsPress,
}: DashboardHeaderProps) {
  const showBadge = notificationsCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onNotificationsPress} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={22} color={darkTheme.text} />
          {showBadge ? <View style={styles.badge} /> : null}
        </TouchableOpacity>
        <Avatar uri={avatarUrl} size={40} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
  },
  greeting: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: darkTheme.text,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.surfaceSecondary,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
