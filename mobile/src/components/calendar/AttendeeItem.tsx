import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { EventAttendee } from '@/types';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface AttendeeItemProps {
  attendee: EventAttendee;
}

export function AttendeeItem({ attendee }: AttendeeItemProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={attendee.user.avatar_url} size={36} />
      <View style={styles.info}>
        <Text style={styles.name}>{attendee.user.name}</Text>
        <Text style={styles.status}>{formatStatus(attendee.status)}</Text>
      </View>
    </View>
  );
}

function formatStatus(status: EventAttendee['status']) {
  switch (status) {
    case 'ACCEPTED':
      return 'Aceito';
    case 'DECLINED':
      return 'Recusado';
    case 'TENTATIVE':
      return 'Talvez';
    default:
      return 'Pendente';
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  status: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
