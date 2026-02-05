import { colors } from '@/theme/colors';

export const RESERVATION_STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmada', color: colors.success },
  CANCELLED: { label: 'Cancelada', color: colors.neutral[500] },
  COMPLETED: { label: 'Concluida', color: colors.info },
  NO_SHOW: { label: 'Nao compareceu', color: colors.error },
} as const;

export const PERIOD_CONFIG = {
  MORNING: { label: 'Manha', time: '08:00 - 12:00', icon: 'sunny-outline' },
  AFTERNOON: { label: 'Tarde', time: '13:00 - 18:00', icon: 'moon-outline' },
} as const;

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(date: string, compareDate: Date = new Date()): boolean {
  return date === toISODate(compareDate);
}

export function isPastDay(date: string, compareDate: Date = new Date()): boolean {
  return date < toISODate(compareDate);
}

export function isFutureOrToday(date: string, compareDate: Date = new Date()): boolean {
  return date >= toISODate(compareDate);
}

export function canCheckin(date: string, period: 'MORNING' | 'AFTERNOON'): boolean {
  if (!isSameDay(date)) return false;
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  if (period === 'MORNING') {
    return hours >= 8 && hours < 12;
  }
  return hours >= 13 && hours < 18;
}

export function formatWeekdayShort(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
    .format(new Date(date))
    .replace('.', '')
    .toUpperCase();
}

export function formatDayNumber(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(new Date(date));
}
