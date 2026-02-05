# Plano 04: Dashboard - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/04-dashboard`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar a tela inicial do app com resumos, métricas, atividades recentes e acesso rápido às principais funcionalidades.

---

## User Stories

### US-01: Visão Geral
**Como** usuário  
**Quero** ver um resumo das minhas atividades  
**Para** ter uma visão rápida do status geral

**Critérios de Aceitação:**
- [ ] Cards com métricas principais
- [ ] Projetos ativos
- [ ] Tarefas pendentes (minhas)
- [ ] Eventos próximos

### US-02: Timeline de Atividades
**Como** usuário  
**Quero** ver atividades recentes do meu workspace  
**Para** acompanhar o que está acontecendo

**Critérios de Aceitação:**
- [ ] Lista cronológica de atividades
- [ ] Filtro por tipo de atividade
- [ ] Navegação para entidade relacionada
- [ ] Pull to refresh

### US-03: Acesso Rápido
**Como** usuário  
**Quero** atalhos para ações frequentes  
**Para** ser mais produtivo

**Critérios de Aceitação:**
- [ ] Botão "Nova Tarefa"
- [ ] Botão "Novo Evento"
- [ ] Lista de projetos favoritos/recentes

---

## Telas

### Dashboard Screen

**Seções:**

1. **Header**
   - Saudação personalizada ("Bom dia, {nome}")
   - Avatar do usuário
   - Ícone de notificações com badge

2. **Cards de Métricas** (scroll horizontal)
   - Projetos ativos (count)
   - Tarefas pendentes (count)
   - Tarefas para hoje (count)
   - Eventos hoje (count)

3. **Ações Rápidas** (2 botões)
   - Nova Tarefa
   - Novo Evento

4. **Projetos Recentes** (scroll horizontal)
   - Cards pequenos de projetos
   - Máximo 5 projetos

5. **Timeline** (scroll vertical)
   - Atividades recentes
   - Infinite scroll
   - Filtro por tipo

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard/metrics` | Métricas do dashboard |
| GET | `/projects?limit=5&sort=-updated_at` | Projetos recentes |
| GET | `/timeline?limit=20` | Atividades recentes |
| GET | `/tasks?assignee=me&status=TODO,IN_PROGRESS` | Minhas tarefas |
| GET | `/events?start_at_gte=today&limit=5` | Eventos próximos |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `MetricCard` | Card com ícone, valor e label |
| `ProjectCardSmall` | Card compacto de projeto |
| `TimelineItem` | Item da timeline de atividades |
| `QuickActionButton` | Botão de ação rápida |

---

## Fora do Escopo

- Gráficos e charts complexos
- Customização do dashboard
- Widgets arrastáveis
