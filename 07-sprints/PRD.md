# Plano 07: Sprints - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/07-sprints`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03, 05 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de sprints para projetos em modo Scrum: listagem, criação, gestão de status e visualização de tarefas por sprint.

---

## User Stories

### US-01: Listar Sprints
**Como** usuário  
**Quero** ver sprints do projeto  
**Para** organizar o trabalho em iterações

**Critérios de Aceitação:**
- [ ] Lista de sprints ordenada
- [ ] Status visual (Planning, Active, Completed)
- [ ] Datas de início e fim
- [ ] Contagem de tarefas

### US-02: Criar Sprint
**Como** usuário  
**Quero** criar novas sprints  
**Para** planejar iterações

**Critérios de Aceitação:**
- [ ] Formulário de criação
- [ ] Nome e goal da sprint
- [ ] Datas de início e fim
- [ ] Validação de datas

### US-03: Ver Detalhes da Sprint
**Como** usuário  
**Quero** ver detalhes de uma sprint  
**Para** acompanhar o progresso

**Critérios de Aceitação:**
- [ ] Informações da sprint
- [ ] Lista de tarefas da sprint
- [ ] Progresso (tarefas concluídas/total)
- [ ] Ações: iniciar, completar, editar

### US-04: Gerenciar Status
**Como** usuário  
**Quero** mudar o status da sprint  
**Para** controlar o ciclo de vida

**Critérios de Aceitação:**
- [ ] Iniciar sprint (Planning → Active)
- [ ] Completar sprint (Active → Completed)
- [ ] Apenas uma sprint ativa por vez

---

## Telas

### 1. SprintsListScreen
- Header com projeto
- Lista de sprints
- Indicador de sprint ativa
- FAB para nova sprint
- Empty state quando sem sprints

### 2. SprintNewScreen
- Formulário:
  - Nome (obrigatório)
  - Goal/Objetivo
  - Data de início
  - Data de fim
- Botões: Cancelar, Criar

### 3. SprintDetailScreen
- Header com nome e status
- Barra de progresso
- Goal da sprint
- Datas
- Lista de tarefas
- Ações: Iniciar/Completar, Editar

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projects/:id/sprints` | Listar sprints |
| POST | `/sprints` | Criar sprint |
| GET | `/sprints/:id` | Detalhes da sprint |
| PATCH | `/sprints/:id` | Atualizar sprint |
| DELETE | `/sprints/:id` | Excluir sprint |
| POST | `/sprints/:id/start` | Iniciar sprint |
| POST | `/sprints/:id/complete` | Completar sprint |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `SprintCard` | Card de sprint |
| `SprintProgress` | Barra de progresso |
| `SprintStatusBadge` | Badge de status |
| `SprintTasksList` | Lista de tarefas da sprint |
| `SprintForm` | Formulário de sprint |
