# Plano 12: Caverna do Dragão - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/12-caverna-dragao`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo Caverna do Dragão: sistema de reservas de salas/espaços com tickets semanais, períodos (manhã/tarde) e check-in.

---

## User Stories

### US-01: Ver Disponibilidade
**Como** usuário  
**Quero** ver dias disponíveis para reserva  
**Para** escolher quando usar o espaço

**Critérios de Aceitação:**
- [ ] Calendário com dias disponíveis
- [ ] Indicador de vagas por período
- [ ] Dias passados bloqueados
- [ ] Limite de dias futuros configurável

### US-02: Fazer Reserva
**Como** usuário  
**Quero** reservar um período  
**Para** garantir meu lugar

**Critérios de Aceitação:**
- [ ] Selecionar dia
- [ ] Escolher período (manhã/tarde)
- [ ] Confirmar reserva
- [ ] Ticket descontado do saldo

### US-03: Ver Meus Tickets
**Como** usuário  
**Quero** ver meu saldo de tickets  
**Para** saber quantas reservas posso fazer

**Critérios de Aceitação:**
- [ ] Tickets da semana atual
- [ ] Tickets usados vs disponíveis
- [ ] Renovação automática semanal

### US-04: Ver Minhas Reservas
**Como** usuário  
**Quero** ver minhas reservas  
**Para** lembrar quando tenho espaço reservado

**Critérios de Aceitação:**
- [ ] Lista de reservas futuras
- [ ] Histórico de reservas passadas
- [ ] Status de cada reserva

### US-05: Cancelar Reserva
**Como** usuário  
**Quero** cancelar uma reserva  
**Para** liberar o espaço e recuperar o ticket

**Critérios de Aceitação:**
- [ ] Cancelar até X horas antes
- [ ] Ticket devolvido ao saldo
- [ ] Confirmação de cancelamento

### US-06: Fazer Check-in
**Como** usuário  
**Quero** fazer check-in no dia  
**Para** confirmar minha presença

**Critérios de Aceitação:**
- [ ] Botão de check-in disponível no dia
- [ ] Check-in possível só no período correto
- [ ] Status atualizado para COMPLETED
- [ ] No-show se não fizer check-in

---

## Telas

### 1. CavernaHomeScreen
- Saldo de tickets da semana
- Calendário de disponibilidade
- Próxima reserva (se houver)
- Botões: Nova Reserva, Minhas Reservas

### 2. CavernaReservarScreen
- Calendário para selecionar dia
- Períodos disponíveis (manhã/tarde)
- Vagas restantes por período
- Botão confirmar

### 3. CavernaMinhasReservasScreen
- Reservas futuras (com ações)
- Histórico de reservas
- Status de cada reserva

### 4. ReservationDetailScreen
- Detalhes da reserva
- Botão check-in (se for o dia)
- Botão cancelar (se permitido)

---

## Períodos

| Período | Horário |
|---------|---------|
| Manhã | 08:00 - 12:00 |
| Tarde | 13:00 - 18:00 |

---

## Status de Reserva

| Status | Descrição |
|--------|-----------|
| CONFIRMED | Reserva confirmada |
| CANCELLED | Cancelada pelo usuário |
| COMPLETED | Check-in realizado |
| NO_SHOW | Não compareceu |

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/caverna-dragao/settings` | Configurações |
| GET | `/caverna-dragao/availability` | Disponibilidade |
| GET | `/caverna-dragao/tickets` | Meus tickets |
| GET | `/caverna-dragao/reservations` | Minhas reservas |
| POST | `/caverna-dragao/reservations` | Criar reserva |
| DELETE | `/caverna-dragao/reservations/:id` | Cancelar |
| POST | `/caverna-dragao/reservations/:id/checkin` | Check-in |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `TicketBalance` | Exibição do saldo |
| `AvailabilityCalendar` | Calendário com vagas |
| `PeriodSelector` | Seletor manhã/tarde |
| `ReservationCard` | Card de reserva |
| `CheckinButton` | Botão de check-in |
