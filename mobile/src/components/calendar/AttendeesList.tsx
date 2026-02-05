import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EventAttendee } from '@/types';
import { AttendeeItem } from './AttendeeItem';
import { EmptyState } from '@/components/feedback/EmptyState';
import { spacing } from '@/theme/spacing';

interface AttendeesListProps {
  attendees?: EventAttendee[];
}

export function AttendeesList({ attendees = [] }: AttendeesListProps) {
  if (!attendees.length) {
    return (
      <EmptyState
        title="Sem participantes"
        description="Nenhum participante foi adicionado ainda."
        icon="people-outline"
      />
    );
  }

  return (
    <View style={styles.list}>
      {attendees.map((attendee) => (
        <AttendeeItem key={attendee.id} attendee={attendee} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
});
