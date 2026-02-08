# Plano 06: Tarefas e Kanban - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/06-tarefas-kanban`
- **Timeout**: 2.5 horas
- **Dependências**: Planos 01, 02, 03, 05 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de tarefas com visualização Kanban, CRUD completo, drag & drop entre colunas, filtros, atribuição e gestão de anexos.

---

## User Stories

### US-01: Visualizar Kanban
**Como** usuário  
**Quero** ver tarefas em colunas (Kanban)  
**Para** visualizar o fluxo de trabalho

**Critérios de Aceitação:**
- [ ] Colunas por status (Backlog, To Do, In Progress, In Review, Done)
- [ ] Cards de tarefa em cada coluna
- [ ] Scroll horizontal entre colunas
- [ ] Scroll vertical dentro de cada coluna
- [ ] Contadores por coluna

### US-02: Mover Tarefas (Drag & Drop)
**Como** usuário  
**Quero** arrastar tarefas entre colunas  
**Para** atualizar o status rapidamente

**Critérios de Aceitação:**
- [ ] Long press para iniciar drag
- [ ] Visual feedback durante drag
- [ ] Drop em outra coluna atualiza status
- [ ] Animação suave
- [ ] Atualização otimista

### US-03: Criar Tarefa
**Como** usuário  
**Quero** criar novas tarefas  
**Para** adicionar trabalho ao projeto

**Critérios de Aceitação:**
- [ ] Formulário de criação
- [ ] Campos: título, descrição, prioridade, assignee, sprint
- [ ] Anexar arquivos/imagens
- [ ] Data de prazo opcional

### US-04: Ver Detalhes da Tarefa
**Como** usuário  
**Quero** ver detalhes completos de uma tarefa  
**Para** entender o contexto e agir

**Critérios de Aceitação:**
- [ ] Todas as informações da tarefa
- [ ] Lista de anexos
- [ ] Histórico de mudanças
- [ ] Ações: editar, excluir, mover

### US-05: Filtrar Tarefas
**Como** usuário  
**Quero** filtrar tarefas  
**Para** focar no que é relevante

**Critérios de Aceitação:**
- [ ] Filtro por assignee
- [ ] Filtro por prioridade
- [ ] Filtro por sprint
- [ ] Busca por texto

### US-06: Gerenciar Anexos
**Como** usuário  
**Quero** anexar arquivos às tarefas  
**Para** manter documentos relacionados

**Critérios de Aceitação:**
- [ ] Upload de imagens
- [ ] Upload de documentos
- [ ] Visualizar anexos
- [ ] Excluir anexos

---

## Telas

### 1. TasksListScreen (Kanban)
- Header com projeto e filtros
- Colunas horizontais por status
- Cards de tarefa empilhados
- FAB para nova tarefa
- Modal de filtros

### 2. TaskNewScreen
- Formulário completo:
  - Título (obrigatório)
  - Descrição (rich text simples)
  - Prioridade (Low, Medium, High, Urgent)
  - Assignee (seletor de usuário)
  - Sprint (seletor)
  - Deadline (date picker)
  - Anexos
- Botões: Cancelar, Criar

### 3. TaskDetailScreen
- Header com título e ações
- Seções:
  - Status e prioridade (editáveis inline)
  - Assignee
  - Sprint
  - Descrição
  - Anexos (grid de thumbnails)
  - Timeline de atividades
- Ações: Editar, Excluir

### 4. TaskEditScreen
- Mesmo formulário do New, preenchido

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projects/:id/tasks` | Listar tarefas do projeto |
| POST | `/tasks` | Criar tarefa |
| GET | `/tasks/:id` | Detalhes da tarefa |
| PATCH | `/tasks/:id` | Atualizar tarefa |
| DELETE | `/tasks/:id` | Excluir tarefa |
| PATCH | `/tasks/:id/status` | Mudar status (drag) |
| PATCH | `/tasks/:id/order` | Reordenar tarefa |
| POST | `/attachments` | Upload de anexo |
| DELETE | `/attachments/:id` | Excluir anexo |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `KanbanBoard` | Container do Kanban |
| `KanbanColumn` | Coluna individual |
| `TaskCard` | Card de tarefa |
| `TaskCardDraggable` | Card com drag handler |
| `PriorityBadge` | Badge de prioridade |
| `AssigneeSelector` | Seletor de usuário |
| `AttachmentGrid` | Grid de anexos |
| `AttachmentItem` | Item de anexo |
| `TaskFiltersModal` | Modal de filtros |

---

## Considerações Técnicas

### Drag & Drop
- Usar `react-native-gesture-handler` + `react-native-reanimated`
- Ou `react-native-draggable-flatlist` para simplicidade
- Atualização otimista com rollback em caso de erro

### Performance
- Virtualizar listas longas
- Lazy load de imagens de anexos
- Memoizar componentes de card

### Anexos
- Usar `attachmentService` do Plano 01
- Compressão de imagens antes do upload
- Preview de imagens inline
