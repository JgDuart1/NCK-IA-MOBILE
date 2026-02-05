import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function CalendarHeader({ year, month, onPrevious, onNext }: CalendarHeaderProps) {
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1));

  const title = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <View style={styles.container}>
      <Pressable style={styles.navButton} onPress={onPrevious}>
        <Ionicons name="chevron-back" size={22} color={darkTheme.text} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <Pressable style={styles.navButton} onPress={onNext}>
        <Ionicons name="chevron-forward" size={22} color={darkTheme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: darkTheme.text,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.surface,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
});
