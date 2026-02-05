import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Event } from '@/types';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface CalendarDayProps {
  day: number | null;
  events: Event[];
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

export function CalendarDay({ day, events, isSelected, isToday, onPress }: CalendarDayProps) {
  if (!day) {
    return <View style={styles.emptyCell} />;
  }

  const dotColors = events.slice(0, 3).map((event) => event.color || darkTheme.primary);

  return (
    <Pressable
      style={[styles.cell, isSelected && styles.selected, isToday && styles.today]}
      onPress={onPress}
    >
      <Text style={[styles.dayText, isSelected && styles.selectedText]}>{day}</Text>
      <View style={styles.dots}>
        {dotColors.map((color, index) => (
          <View key={`${color}-${index}`} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: '14.2857%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  emptyCell: {
    width: '14.2857%',
    aspectRatio: 1,
  },
  dayText: {
    color: darkTheme.text,
    fontSize: 13,
  },
  selected: {
    backgroundColor: darkTheme.primary,
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  today: {
    borderWidth: 1,
    borderColor: darkTheme.primary,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
