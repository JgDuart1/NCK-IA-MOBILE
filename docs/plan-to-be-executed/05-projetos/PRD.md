# Plano 05: Projetos - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/05-projetos`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo completo de projetos: listagem, criação, detalhes, gestão de membros e configurações do projeto.

---

## User Stories

### US-01: Listar Projetos
**Como** usuário  
**Quero** ver meus projetos  
**Para** acessar e gerenciar meu trabalho

**Critérios de Aceitação:**
- [ ] Lista de projetos com cards
- [ ] Filtro por status
- [ ] Busca por nome
- [ ] Pull to refresh
- [ ] Estado vazio quando sem projetos

### US-02: Criar Projeto
**Como** usuário  
**Quero** criar um novo projeto  
**Para** organizar meu trabalho

**Critérios de Aceitação:**
- [ ] Formulário de criação
- [ ] Campos: nome, descrição, modo de trabalho, cor
- [ ] Validação de campos obrigatórios
- [ ] Feedback de sucesso

### US-03: Ver Detalhes do Projeto
**Como** usuário  
**Quero** ver detalhes de um projeto  
**Para** acessar suas funcionalidades

**Critérios de Aceitação:**
- [ ] Header com info do projeto
- [ ] Tabs/seções: Visão Geral, Tarefas, Sprints, Notas, Calendário
- [ ] Contadores de cada seção
- [ ] Navegação para sub-telas

### US-04: Gerenciar Membros
**Como** admin do projeto  
**Quero** gerenciar membros  
**Para** controlar quem tem acesso

**Critérios de Aceitação:**
- [ ] Lista de membros atuais
- [ ] Adicionar membro (por email/usuário)
- [ ] Remover membro
- [ ] Alterar role do membro

### US-05: Configurações do Projeto
**Como** admin do projeto  
**Quero** editar configurações  
**Para** personalizar o projeto

**Critérios de Aceitação:**
- [ ] Editar nome, descrição, cor
- [ ] Alterar status do projeto
- [ ] Arquivar projeto

---

## Telas

### 1. ProjectsListScreen
- Header com título e botão "+"
- Barra de busca
- Filtros (chips): Todos, Ativos, Pausados, Arquivados
- Lista de cards de projeto
- FAB para novo projeto

### 2. ProjectNewScreen
- Formulário:
  - Nome (obrigatório)
  - Descrição
  - Modo de trabalho (Scrum/Kanban/Simples)
  - Cor (color picker)
  - Datas (opcional)
- Botões: Cancelar, Criar

### 3. ProjectDetailScreen
- Header com cor do projeto, nome, status
- Seções navegáveis:
  - **Visão Geral**: descrição, métricas, atividade recente
  - **Tarefas**: acesso ao kanban (Plano 06)
  - **Sprints**: lista de sprints (Plano 07)
  - **Notas**: notas do projeto (Plano 08)
  - **Calendário**: eventos do projeto (Plano 09)
  - **Canvas**: business canvas (Plano 11)
  - **Membros**: gestão de membros
  - **Configurações**: settings do projeto

### 4. ProjectMembersScreen
- Lista de membros com avatar, nome, role
- Botão adicionar membro
- Swipe para remover
- Modal para alterar role

### 5. ProjectSettingsScreen
- Formulário de edição
- Ações: Pausar, Arquivar, Excluir

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projects` | Listar projetos |
| POST | `/projects` | Criar projeto |
| GET | `/projects/:id` | Detalhes do projeto |
| PATCH | `/projects/:id` | Atualizar projeto |
| DELETE | `/projects/:id` | Excluir projeto |
| GET | `/projects/:id/members` | Listar membros |
| POST | `/projects/:id/members` | Adicionar membro |
| DELETE | `/projects/:id/members/:memberId` | Remover membro |
| PATCH | `/projects/:id/members/:memberId` | Alterar role |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `ProjectCard` | Card de projeto na lista |
| `ProjectHeader` | Header colorido do projeto |
| `ProjectTabs` | Tabs de navegação interna |
| `MemberListItem` | Item de membro |
| `ColorPicker` | Seletor de cor |
| `WorkModeSelector` | Seletor Scrum/Kanban/Simples |
