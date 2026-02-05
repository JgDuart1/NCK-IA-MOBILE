import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  label?: string;
}

export function DateTimePicker({ value, onChange, mode, minimumDate, label }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateInput, setDateInput] = useState(formatDate(value));
  const [timeInput, setTimeInput] = useState(formatTime(value));
  const [error, setError] = useState('');

  useEffect(() => {
    setDateInput(formatDate(value));
    setTimeInput(formatTime(value));
  }, [value]);

  const open = () => {
    setError('');
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleSave = () => {
    const next = new Date(value);

    if (mode === 'date' || mode === 'datetime') {
      const parsedDate = parseDateInput(dateInput);
      if (!parsedDate) {
        setError('Data invalida. Use AAAA-MM-DD.');
        return;
      }
      next.setFullYear(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    }

    if (mode === 'time' || mode === 'datetime') {
      const parsedTime = parseTimeInput(timeInput);
      if (!parsedTime) {
        setError('Hora invalida. Use HH:MM.');
        return;
      }
      next.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    }

    if (minimumDate && next < minimumDate) {
      setError('Data menor que o minimo permitido.');
      return;
    }

    onChange(next);
    setIsOpen(false);
  };

  const displayValue = () => {
    if (mode === 'date') {
      return dateInput;
    }
    if (mode === 'time') {
      return timeInput;
    }
    return `${dateInput} ${timeInput}`;
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.field} onPress={open}>
        <Text style={styles.fieldText}>{displayValue()}</Text>
      </Pressable>

      <Modal visible={isOpen} onClose={close}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecionar data e hora</Text>
          {(mode === 'date' || mode === 'datetime') && (
            <Input
              label="Data"
              placeholder="AAAA-MM-DD"
              value={dateInput}
              onChangeText={setDateInput}
            />
          )}
          {(mode === 'time' || mode === 'datetime') && (
            <Input
              label="Hora"
              placeholder="HH:MM"
              value={timeInput}
              onChangeText={setTimeInput}
            />
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <Button variant="ghost" onPress={close}>
              Cancelar
            </Button>
            <Button onPress={handleSave}>Salvar</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function parseDateInput(value: string): Date | null {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const [year, month, day] = value.split('-').map((item) => Number(item));
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function parseTimeInput(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return { hours, minutes };
}

const styles = StyleSheet.create({
  field: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: darkTheme.surface,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  fieldText: {
    ...typography.body,
    color: darkTheme.text,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  modalContent: {
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h3,
    color: darkTheme.text,
  },
  error: {
    ...typography.caption,
    color: '#EF4444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
