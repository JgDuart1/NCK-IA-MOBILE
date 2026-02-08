# Plano 09: Calendário - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/09-calendario`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de calendário: visualização de eventos, criação de eventos, meeting requests e integração com projetos.

---

## User Stories

### US-01: Visualizar Calendário
**Como** usuário  
**Quero** ver meus eventos em um calendário  
**Para** organizar minha agenda

**Critérios de Aceitação:**
- [ ] Vista mensal com dias marcados
- [ ] Vista de agenda (lista de eventos)
- [ ] Navegação entre meses
- [ ] Indicador de eventos por dia
- [ ] Filtro por projeto

### US-02: Criar Evento
**Como** usuário  
**Quero** criar eventos  
**Para** agendar compromissos

**Critérios de Aceitação:**
- [ ] Formulário de evento
- [ ] Título, descrição, local
- [ ] Data e hora início/fim
- [ ] Evento de dia inteiro
- [ ] Associar a projeto
- [ ] Adicionar participantes

### US-03: Ver Detalhes do Evento
**Como** usuário  
**Quero** ver detalhes de um evento  
**Para** saber informações completas

**Critérios de Aceitação:**
- [ ] Todas as informações
- [ ] Lista de participantes
- [ ] Link de reunião (se houver)
- [ ] Ações: editar, excluir

### US-04: Meeting Requests
**Como** usuário  
**Quero** solicitar reuniões  
**Para** agendar com outros usuários

**Critérios de Aceitação:**
- [ ] Criar solicitação de reunião
- [ ] Propor data e hora
- [ ] Selecionar destinatários
- [ ] Ver status (pendente, aceito, recusado)

### US-05: Responder Meeting Request
**Como** usuário  
**Quero** aceitar/recusar solicitações  
**Para** confirmar minha disponibilidade

**Critérios de Aceitação:**
- [ ] Ver solicitações recebidas
- [ ] Aceitar ou recusar
- [ ] Evento criado ao aceitar

---

## Telas

### 1. CalendarScreen
- Header com mês/ano e navegação
- Calendário mensal (grid)
- Lista de eventos do dia selecionado
- FAB para novo evento
- Toggle: todos eventos / apenas projeto

### 2. EventNewScreen
- Formulário:
  - Título (obrigatório)
  - Tipo (Meeting, Deadline, Milestone, etc.)
  - Descrição
  - Local
  - Link de reunião
  - Data/hora início
  - Data/hora fim
  - Dia inteiro (toggle)
  - Projeto (opcional)
  - Participantes
- Botões: Cancelar, Criar

### 3. EventDetailScreen
- Header com título e tipo
- Informações completas
- Lista de participantes com status
- Link de reunião (clicável)
- Ações: Editar, Excluir

### 4. MeetingRequestDetailScreen
- Informações da solicitação
- Proponente
- Data/hora proposta
- Destinatários
- Botões: Aceitar, Recusar

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/events` | Listar eventos |
| POST | `/events` | Criar evento |
| GET | `/events/:id` | Detalhes do evento |
| PATCH | `/events/:id` | Atualizar evento |
| DELETE | `/events/:id` | Excluir evento |
| POST | `/events/:id/attendees` | Adicionar participante |
| PATCH | `/events/:id/attendees/:id` | Atualizar status participante |
| GET | `/meeting-requests` | Listar meeting requests |
| POST | `/meeting-requests` | Criar meeting request |
| PATCH | `/meeting-requests/:id/accept` | Aceitar |
| PATCH | `/meeting-requests/:id/decline` | Recusar |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `CalendarGrid` | Grid mensal |
| `CalendarDay` | Célula de dia |
| `EventCard` | Card de evento |
| `EventTypeBadge` | Badge de tipo |
| `AttendeesList` | Lista de participantes |
| `AttendeeItem` | Item de participante |
| `DateTimePicker` | Seletor de data/hora |
| `MeetingRequestCard` | Card de solicitação |
