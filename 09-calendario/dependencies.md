# Plano 09: Calendário - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/calendar/`)

| Export | Descrição |
|--------|-----------|
| `CalendarScreen` | Tela do calendário |
| `EventNewScreen` | Criar evento |
| `EventDetailScreen` | Detalhes do evento |
| `EventEditScreen` | Editar evento |
| `MeetingRequestDetailScreen` | Detalhes da solicitação |

#### Components (`src/components/calendar/`)

| Export | Descrição |
|--------|-----------|
| `CalendarGrid` | Grid mensal |
| `CalendarDay` | Célula de dia |
| `CalendarHeader` | Header com navegação |
| `EventCard` | Card de evento |
| `EventTypeBadge` | Badge de tipo |
| `EventsList` | Lista de eventos |
| `AttendeesList` | Lista de participantes |
| `AttendeeItem` | Item de participante |
| `AttendeeSelector` | Seletor de participantes |
| `DateTimePicker` | Seletor de data/hora |
| `MeetingRequestCard` | Card de solicitação |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useEvents` | Lista de eventos |
| `useEvent` | Evento por ID |
| `useEventsByMonth` | Eventos do mês |
| `useEventsByDay` | Eventos do dia |
| `useCreateEvent` | Mutation criar |
| `useMeetingRequests` | Solicitações |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Badge`, `Button`, `Input` | Componentes UI |
| `Modal` | Para seletores |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Usuário atual para participantes |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 04-dashboard | Eventos de hoje |
| 05-projetos | Eventos do projeto |

---

## Contratos

### EventTypeBadge

```typescript
interface EventTypeBadgeProps {
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'DELIVERY' | 'OTHER';
}

const TYPE_CONFIG = {
  MEETING: { icon: 'videocam', color: '#3B82F6', label: 'Reunião' },
  DEADLINE: { icon: 'flag', color: '#EF4444', label: 'Prazo' },
  MILESTONE: { icon: 'trophy', color: '#F59E0B', label: 'Marco' },
  REMINDER: { icon: 'alarm', color: '#8B5CF6', label: 'Lembrete' },
  DELIVERY: { icon: 'cube', color: '#10B981', label: 'Entrega' },
  OTHER: { icon: 'ellipsis-horizontal', color: '#6B7280', label: 'Outro' },
};
```

### DateTimePicker

Wrapper para expo date picker nativo:

```typescript
interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
}
```

### Meeting Request Status

```typescript
type MeetingRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'RESCHEDULED';
```
