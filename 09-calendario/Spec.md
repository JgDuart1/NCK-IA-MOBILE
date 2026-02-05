# Plano 09: Calendário - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/09-calendario`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── calendar/
│       ├── CalendarScreen.tsx
│       ├── EventNewScreen.tsx
│       ├── EventDetailScreen.tsx
│       ├── EventEditScreen.tsx
│       ├── MeetingRequestDetailScreen.tsx
│       └── index.ts
│
├── components/
│   └── calendar/
│       ├── CalendarGrid.tsx
│       ├── CalendarDay.tsx
│       ├── CalendarHeader.tsx
│       ├── EventCard.tsx
│       ├── EventTypeBadge.tsx
│       ├── EventsList.tsx
│       ├── AttendeesList.tsx
│       ├── AttendeeItem.tsx
│       ├── AttendeeSelector.tsx
│       ├── DateTimePicker.tsx
│       ├── MeetingRequestCard.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       ├── events.api.ts
│       └── meeting-requests.api.ts
│
└── hooks/
    ├── use-events.ts
    └── use-meeting-requests.ts
```

---

## Implementações

### 1. Events API (src/services/api/events.api.ts)

```typescript
import { apiClient } from './client';
import { Event, EventAttendee } from '@/types';

interface EventFilters {
  project_id?: string;
  start_at_gte?: string;
  start_at_lte?: string;
}

interface CreateEventDto {
  title: string;
  description?: string;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'DELIVERY' | 'OTHER';
  location?: string;
  meeting_url?: string;
  color?: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  project_id?: string;
  attendee_ids?: string[];
}

export const eventsApi = {
  async list(filters: EventFilters = {}): Promise<Event[]> {
    const response = await apiClient.get('/events', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data;
  },

  async create(data: CreateEventDto): Promise<Event> {
    const response = await apiClient.post('/events', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateEventDto>): Promise<Event> {
    const response = await apiClient.patch(`/events/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },

  async addAttendee(eventId: string, userId: string): Promise<EventAttendee> {
    const response = await apiClient.post(`/events/${eventId}/attendees`, { user_id: userId });
    return response.data.data;
  },

  async updateAttendeeStatus(eventId: string, attendeeId: string, status: string): Promise<EventAttendee> {
    const response = await apiClient.patch(`/events/${eventId}/attendees/${attendeeId}`, { status });
    return response.data.data;
  },

  async removeAttendee(eventId: string, attendeeId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/attendees/${attendeeId}`);
  },
};
```

### 2. Meeting Requests API (src/services/api/meeting-requests.api.ts)

```typescript
import { apiClient } from './client';
import { MeetingRequest } from '@/types';

interface CreateMeetingRequestDto {
  title: string;
  description?: string;
  location?: string;
  meeting_url?: string;
  proposed_start_at: string;
  proposed_end_at: string;
  project_id?: string;
  recipient_ids: string[];
}

export const meetingRequestsApi = {
  async list(): Promise<MeetingRequest[]> {
    const response = await apiClient.get('/meeting-requests');
    return response.data.data;
  },

  async getById(id: string): Promise<MeetingRequest> {
    const response = await apiClient.get(`/meeting-requests/${id}`);
    return response.data.data;
  },

  async create(data: CreateMeetingRequestDto): Promise<MeetingRequest> {
    const response = await apiClient.post('/meeting-requests', data);
    return response.data.data;
  },

  async accept(id: string): Promise<MeetingRequest> {
    const response = await apiClient.patch(`/meeting-requests/${id}/accept`);
    return response.data.data;
  },

  async decline(id: string): Promise<MeetingRequest> {
    const response = await apiClient.patch(`/meeting-requests/${id}/decline`);
    return response.data.data;
  },
};
```

### 3. useEvents Hook (src/hooks/use-events.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/services/api/events.api';

export function useEvents(filters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.list(filters),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', 'detail', id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

export function useEventsByMonth(year: number, month: number, projectId?: string) {
  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0).toISOString();

  return useEvents({
    start_at_gte: startDate,
    start_at_lte: endDate,
    project_id: projectId,
  });
}

export function useEventsByDay(date: string, projectId?: string) {
  const dayStart = `${date}T00:00:00`;
  const dayEnd = `${date}T23:59:59`;

  return useEvents({
    start_at_gte: dayStart,
    start_at_lte: dayEnd,
    project_id: projectId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
```

### 4. CalendarGrid Component

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarDay } from './CalendarDay';
import { Event } from '@/types';
import { darkTheme, spacing } from '@/theme';

interface CalendarGridProps {
  year: number;
  month: number;
  events: Event[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function CalendarGrid({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.start_at.startsWith(dateStr));
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
        {days.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            events={day ? getEventsForDay(day) : []}
            isSelected={day !== null && selectedDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
            isToday={day !== null && isToday(year, month, day)}
            onPress={() => {
              if (day) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                onSelectDate(dateStr);
              }
            }}
          />
        ))}
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
```

### 5. CalendarScreen

```typescript
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { CalendarHeader, CalendarGrid, EventsList } from '@/components/calendar';
import { Button } from '@/components/ui';
import { useEventsByMonth, useEventsByDay } from '@/hooks/use-events';
import { darkTheme, spacing } from '@/theme';
import { CalendarScreenProps } from '@/navigation/types';

type Props = CalendarScreenProps<'Calendar'>;

export function CalendarScreen({ route, navigation }: Props) {
  const projectId = route.params?.projectId;
  const today = new Date();
  
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: monthEvents = [] } = useEventsByMonth(year, month, projectId);
  const { data: dayEvents = [] } = useEventsByDay(selectedDate || '', projectId);

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <CalendarHeader
          year={year}
          month={month}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />

        <CalendarGrid
          year={year}
          month={month}
          events={monthEvents}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {selectedDate && (
          <EventsList
            events={dayEvents}
            onEventPress={(eventId) => navigation.navigate('EventDetail', { eventId })}
          />
        )}
      </ScrollView>

      <View style={styles.fab}>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('EventNew', {
            date: selectedDate || undefined,
            projectId,
          })}
          leftIcon={<Ionicons name="add" size={24} color="#fff" />}
        >
          Novo Evento
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Calendário exibe corretamente
- [ ] Navegação entre meses funciona
- [ ] Seleção de dia funciona
- [ ] Eventos do dia aparecem
- [ ] Criar evento funciona
- [ ] Detalhes do evento carregam
- [ ] Meeting requests funcionam

---

## Checklist de Entrega

- [ ] CalendarScreen funcionando
- [ ] CalendarGrid implementado
- [ ] CRUD de eventos
- [ ] Meeting requests
- [ ] Participantes funcionando
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
