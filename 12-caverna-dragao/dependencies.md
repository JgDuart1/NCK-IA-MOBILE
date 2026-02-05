# Plano 12: Caverna do Dragão - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/caverna/`)

| Export | Descrição |
|--------|-----------|
| `CavernaHomeScreen` | Tela inicial |
| `CavernaReservarScreen` | Fazer reserva |
| `CavernaMinhasReservasScreen` | Minhas reservas |
| `ReservationDetailScreen` | Detalhes da reserva |

#### Components (`src/components/caverna/`)

| Export | Descrição |
|--------|-----------|
| `TicketBalance` | Saldo de tickets |
| `AvailabilityCalendar` | Calendário de vagas |
| `AvailabilityDay` | Dia no calendário |
| `PeriodSelector` | Seletor manhã/tarde |
| `ReservationCard` | Card de reserva |
| `CheckinButton` | Botão de check-in |
| `NextReservation` | Próxima reserva |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useCavernaSettings` | Configurações |
| `useCavernaAvailability` | Disponibilidade |
| `useMyTickets` | Meus tickets |
| `useMyReservations` | Minhas reservas |
| `useNextReservation` | Próxima reserva |
| `useCreateReservation` | Mutation criar |
| `useCancelReservation` | Mutation cancelar |
| `useCheckin` | Mutation check-in |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Button`, `Badge` | Componentes UI |
| `Skeleton` | Loading |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Usuário para reservas |

---

## Planos Dependentes

Nenhum plano depende diretamente deste.

---

## Contratos

### DragonSettings

```typescript
interface DragonSettings {
  id: string;
  tenant_id: string;
  max_capacity_morning: number;   // Capacidade manhã
  max_capacity_afternoon: number; // Capacidade tarde
  tickets_per_week: number;       // Tickets por semana
  advance_days: number;           // Dias de antecedência
  enabled: boolean;               // Sistema ativo
}
```

### DragonTicket

```typescript
interface DragonTicket {
  id: string;
  tenant_id: string;
  user_id: string;
  week_start: string;        // Início da semana
  total_tickets: number;     // Total de tickets
  used_tickets: number;      // Tickets usados
  remaining_tickets: number; // Tickets disponíveis
}
```

### Reservation Status

```typescript
type ReservationStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmada', color: '#10B981' },
  CANCELLED: { label: 'Cancelada', color: '#6B7280' },
  COMPLETED: { label: 'Concluída', color: '#3B82F6' },
  NO_SHOW: { label: 'Não compareceu', color: '#EF4444' },
};
```

### Period

```typescript
type Period = 'MORNING' | 'AFTERNOON';

const PERIOD_CONFIG = {
  MORNING: { label: 'Manhã', time: '08:00 - 12:00', icon: 'sunny-outline' },
  AFTERNOON: { label: 'Tarde', time: '13:00 - 18:00', icon: 'moon-outline' },
};
```
