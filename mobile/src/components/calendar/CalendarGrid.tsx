import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CalendarDay } from './CalendarDay';
import { Event } from '@/types';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface CalendarGridProps {
  year: number;
  month: number;
  events: Event[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export function CalendarGrid({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i += 1) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i += 1) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event) => event.start_at.startsWith(dateStr));
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => {
          const dateStr = day
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null;

          return (
            <CalendarDay
              key={`${index}-${day ?? 'empty'}`}
              day={day}
              events={day ? getEventsForDay(day) : []}
              isSelected={!!dateStr && selectedDate === dateStr}
              isToday={day !== null && isToday(year, month, day)}
              onPress={() => {
                if (day) {
                  onSelectDate(dateStr as string);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    color: darkTheme.textSecondary,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
