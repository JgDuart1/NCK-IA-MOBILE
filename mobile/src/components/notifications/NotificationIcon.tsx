import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationType } from '@/types';
import { colors } from '@/theme';

interface NotificationIconProps {
  type: NotificationType;
  size?: number;
}

const TYPE_ICONS: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; color: string }> =
  {
    TASK_CREATED: { icon: 'checkbox-outline', color: colors.info },
    TASK_UPDATED: { icon: 'create-outline', color: colors.warning },
    TASK_ASSIGNED: { icon: 'person-add-outline', color: colors.success },
    NOTE_CREATED: { icon: 'document-text-outline', color: colors.primary[500] },
    NOTE_UPDATED: { icon: 'document-text', color: colors.primary[400] },
    SPRINT_CREATED: { icon: 'flag-outline', color: colors.info },
    SPRINT_STARTED: { icon: 'play-outline', color: colors.success },
    SPRINT_COMPLETED: { icon: 'checkmark-done-outline', color: colors.success },
    MEETING_REQUEST_CREATED: { icon: 'calendar-outline', color: colors.info },
    MEETING_REQUEST_ACCEPTED: { icon: 'checkmark-circle-outline', color: colors.success },
    MEETING_REQUEST_DECLINED: { icon: 'close-circle-outline', color: colors.error },
    MEETING_REQUEST_RESCHEDULED: { icon: 'time-outline', color: colors.warning },
  };

export function NotificationIcon({ type, size = 20 }: NotificationIconProps) {
  const { icon, color } = TYPE_ICONS[type];
  return (
    <View style={[styles.container, { backgroundColor: `${color}1A` }]}>
      <Ionicons name={icon} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
