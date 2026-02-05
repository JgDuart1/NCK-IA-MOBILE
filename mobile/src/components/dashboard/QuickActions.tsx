import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { darkTheme, spacing } from '@/theme';

interface QuickActionsProps {
  onNewTask: () => void;
  onNewEvent: () => void;
}

export function QuickActions({ onNewTask, onNewEvent }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Button
        variant="secondary"
        size="md"
        onPress={onNewTask}
        leftIcon={<Ionicons name="add-circle-outline" size={18} color={darkTheme.text} />}
        fullWidth
      >
        Nova tarefa
      </Button>
      <Button
        variant="outline"
        size="md"
        onPress={onNewEvent}
        leftIcon={<Ionicons name="calendar-outline" size={18} color={darkTheme.text} />}
        fullWidth
      >
        Novo evento
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});
