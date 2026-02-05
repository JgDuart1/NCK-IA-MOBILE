# Plano 12: Caverna do Dragão - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/12-caverna-dragao`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── caverna/
│       ├── CavernaHomeScreen.tsx
│       ├── CavernaReservarScreen.tsx
│       ├── CavernaMinhasReservasScreen.tsx
│       ├── ReservationDetailScreen.tsx
│       └── index.ts
│
├── components/
│   └── caverna/
│       ├── TicketBalance.tsx
│       ├── AvailabilityCalendar.tsx
│       ├── AvailabilityDay.tsx
│       ├── PeriodSelector.tsx
│       ├── ReservationCard.tsx
│       ├── CheckinButton.tsx
│       ├── NextReservation.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── caverna.api.ts
│
└── hooks/
    └── use-caverna.ts
```

---

## Implementações

### 1. Caverna API (src/services/api/caverna.api.ts)

```typescript
import { apiClient } from './client';
import { DragonSettings, DragonTicket, DragonReservation } from '@/types';

interface AvailabilityDay {
  date: string;
  morning: { available: number; total: number };
  afternoon: { available: number; total: number };
}

interface CreateReservationDto {
  date: string;
  period: 'MORNING' | 'AFTERNOON';
}

export const cavernaApi = {
  async getSettings(): Promise<DragonSettings> {
    const response = await apiClient.get('/caverna-dragao/settings');
    return response.data.data;
  },

  async getAvailability(startDate: string, endDate: string): Promise<AvailabilityDay[]> {
    const response = await apiClient.get('/caverna-dragao/availability', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data.data;
  },

  async getMyTickets(): Promise<DragonTicket> {
    const response = await apiClient.get('/caverna-dragao/tickets');
    return response.data.data;
  },

  async getMyReservations(status?: string): Promise<DragonReservation[]> {
    const response = await apiClient.get('/caverna-dragao/reservations', {
      params: { status },
    });
    return response.data.data;
  },

  async createReservation(data: CreateReservationDto): Promise<DragonReservation> {
    const response = await apiClient.post('/caverna-dragao/reservations', data);
    return response.data.data;
  },

  async cancelReservation(id: string): Promise<void> {
    await apiClient.delete(`/caverna-dragao/reservations/${id}`);
  },

  async checkin(id: string): Promise<DragonReservation> {
    const response = await apiClient.post(`/caverna-dragao/reservations/${id}/checkin`);
    return response.data.data;
  },
};
```

### 2. useCaverna Hook (src/hooks/use-caverna.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cavernaApi } from '@/services/api/caverna.api';

export function useCavernaSettings() {
  return useQuery({
    queryKey: ['caverna', 'settings'],
    queryFn: cavernaApi.getSettings,
  });
}

export function useCavernaAvailability(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['caverna', 'availability', startDate, endDate],
    queryFn: () => cavernaApi.getAvailability(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useMyTickets() {
  return useQuery({
    queryKey: ['caverna', 'tickets'],
    queryFn: cavernaApi.getMyTickets,
  });
}

export function useMyReservations(status?: string) {
  return useQuery({
    queryKey: ['caverna', 'reservations', status],
    queryFn: () => cavernaApi.getMyReservations(status),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cavernaApi.createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caverna'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cavernaApi.cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caverna'] });
    },
  });
}

export function useCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cavernaApi.checkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caverna'] });
    },
  });
}

export function useNextReservation() {
  const { data: reservations } = useMyReservations('CONFIRMED');
  
  return React.useMemo(() => {
    if (!reservations?.length) return null;
    const now = new Date();
    return reservations.find((r) => new Date(r.date) >= now) || null;
  }, [reservations]);
}
```

### 3. TicketBalance Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMyTickets } from '@/hooks/use-caverna';
import { darkTheme, spacing, typography } from '@/theme';
import { Skeleton } from '@/components/ui';

export function TicketBalance() {
  const { data: tickets, isLoading } = useMyTickets();

  if (isLoading) {
    return <Skeleton height={80} borderRadius={12} />;
  }

  if (!tickets) return null;

  const percentage = (tickets.used_tickets / tickets.total_tickets) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="ticket-outline" size={24} color={darkTheme.primary} />
        <Text style={styles.title}>Meus Tickets</Text>
      </View>

      <View style={styles.balance}>
        <Text style={styles.remaining}>{tickets.remaining_tickets}</Text>
        <Text style={styles.total}>/ {tickets.total_tickets}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${100 - percentage}%` }]} />
      </View>

      <Text style={styles.hint}>
        {tickets.remaining_tickets > 0
          ? `Você pode fazer ${tickets.remaining_tickets} reserva(s) esta semana`
          : 'Você usou todos os tickets desta semana'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.bodyMedium,
    color: darkTheme.text,
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  remaining: {
    ...typography.h1,
    color: darkTheme.primary,
  },
  total: {
    ...typography.h3,
    color: darkTheme.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: darkTheme.surfaceSecondary,
    borderRadius: 3,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: darkTheme.primary,
    borderRadius: 3,
  },
  hint: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
```

### 4. PeriodSelector Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme, spacing, typography } from '@/theme';

interface PeriodSelectorProps {
  morningAvailable: number;
  afternoonAvailable: number;
  selected: 'MORNING' | 'AFTERNOON' | null;
  onSelect: (period: 'MORNING' | 'AFTERNOON') => void;
}

export function PeriodSelector({
  morningAvailable,
  afternoonAvailable,
  selected,
  onSelect,
}: PeriodSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.period,
          selected === 'MORNING' && styles.periodSelected,
          morningAvailable === 0 && styles.periodDisabled,
        ]}
        onPress={() => morningAvailable > 0 && onSelect('MORNING')}
        disabled={morningAvailable === 0}
      >
        <Ionicons
          name="sunny-outline"
          size={24}
          color={selected === 'MORNING' ? '#fff' : darkTheme.text}
        />
        <Text style={[styles.periodLabel, selected === 'MORNING' && styles.periodLabelSelected]}>
          Manhã
        </Text>
        <Text style={[styles.periodTime, selected === 'MORNING' && styles.periodTimeSelected]}>
          08:00 - 12:00
        </Text>
        <View style={[styles.availability, morningAvailable === 0 && styles.availabilityEmpty]}>
          <Text style={styles.availabilityText}>
            {morningAvailable > 0 ? `${morningAvailable} vagas` : 'Esgotado'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.period,
          selected === 'AFTERNOON' && styles.periodSelected,
          afternoonAvailable === 0 && styles.periodDisabled,
        ]}
        onPress={() => afternoonAvailable > 0 && onSelect('AFTERNOON')}
        disabled={afternoonAvailable === 0}
      >
        <Ionicons
          name="moon-outline"
          size={24}
          color={selected === 'AFTERNOON' ? '#fff' : darkTheme.text}
        />
        <Text style={[styles.periodLabel, selected === 'AFTERNOON' && styles.periodLabelSelected]}>
          Tarde
        </Text>
        <Text style={[styles.periodTime, selected === 'AFTERNOON' && styles.periodTimeSelected]}>
          13:00 - 18:00
        </Text>
        <View style={[styles.availability, afternoonAvailable === 0 && styles.availabilityEmpty]}>
          <Text style={styles.availabilityText}>
            {afternoonAvailable > 0 ? `${afternoonAvailable} vagas` : 'Esgotado'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  period: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  periodSelected: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  periodDisabled: {
    opacity: 0.5,
  },
  periodLabel: {
    ...typography.bodyMedium,
    color: darkTheme.text,
    marginTop: spacing.sm,
  },
  periodLabelSelected: {
    color: '#fff',
  },
  periodTime: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
  periodTimeSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  availability: {
    backgroundColor: `${darkTheme.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  availabilityEmpty: {
    backgroundColor: '#EF444420',
  },
  availabilityText: {
    ...typography.caption,
    color: darkTheme.primary,
  },
});
```

### 5. CavernaHomeScreen

```typescript
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TicketBalance, NextReservation, AvailabilityCalendar } from '@/components/caverna';
import { Button } from '@/components/ui';
import { useNextReservation } from '@/hooks/use-caverna';
import { darkTheme, spacing } from '@/theme';

export function CavernaHomeScreen({ navigation }: any) {
  const nextReservation = useNextReservation();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <TicketBalance />

        {nextReservation && (
          <NextReservation
            reservation={nextReservation}
            onPress={() => navigation.navigate('ReservationDetail', { reservationId: nextReservation.id })}
          />
        )}

        <View style={styles.actions}>
          <Button
            variant="primary"
            onPress={() => navigation.navigate('CavernaReservar')}
            fullWidth
          >
            Nova Reserva
          </Button>
          <Button
            variant="outline"
            onPress={() => navigation.navigate('CavernaMinhasReservas')}
            fullWidth
          >
            Minhas Reservas
          </Button>
        </View>
      </ScrollView>
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
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Saldo de tickets exibe corretamente
- [ ] Calendário mostra disponibilidade
- [ ] Fazer reserva funciona
- [ ] Cancelar reserva funciona
- [ ] Check-in funciona
- [ ] Tickets são descontados/devolvidos

---

## Checklist de Entrega

- [ ] Todas as telas implementadas
- [ ] Sistema de tickets funcionando
- [ ] Reservas funcionando
- [ ] Check-in funcionando
- [ ] Cancelamento funcionando
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
