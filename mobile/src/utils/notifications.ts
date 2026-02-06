import { Notification } from '@/types';

type NotificationSection = {
  title: string;
  data: Notification[];
};

const DAY_MS = 1000 * 60 * 60 * 24;

function startOfDay(date: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export function groupNotificationsByDate(notifications: Notification[]): NotificationSection[] {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart.getTime() - DAY_MS);
  const weekStart = new Date(todayStart.getTime() - DAY_MS * 7);

  const sections: Record<string, Notification[]> = {
    Hoje: [],
    Ontem: [],
    'Esta semana': [],
    Anteriores: [],
  };

  sorted.forEach((notification) => {
    const createdAt = new Date(notification.created_at);
    if (createdAt >= todayStart) {
      sections.Hoje.push(notification);
    } else if (createdAt >= yesterdayStart) {
      sections.Ontem.push(notification);
    } else if (createdAt >= weekStart) {
      sections['Esta semana'].push(notification);
    } else {
      sections.Anteriores.push(notification);
    }
  });

  return Object.entries(sections)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
}
