# NCK IA API - Documentacao

> Gerado automaticamente a partir da spec OpenAPI v3.0.0
> Versao da API: 1.0

Sistema interno de gerenciamento de projetos da NCK IA

## Base URL

```
/api/v1
```

## Autenticacao

A API utiliza **JWT Bearer Token**. Inclua o header:

```
Authorization: Bearer <token>
```

Endpoints publicos sao marcados com `@Public()`.

## Sumario

- [Auth](#auth) - Autenticação e autorização
- [Users](#users) - Gerenciamento de usuários
- [Tenants](#tenants) - Gerenciamento de organizações
- [Permissions](#permissions) - Gerenciamento de permissões
- [Projects](#projects) - Gerenciamento de projetos
- [Tasks](#tasks) - Gerenciamento de tarefas
- [Sprints](#sprints) - Gerenciamento de sprints
- [Notes](#notes) - Gerenciamento de notas
- [Calendar](#calendar) - Agenda e eventos
- [Notifications](#notifications) - Notificações do sistema
- [Business Model Canvas](#business-model-canvas) - Canvas de modelo de negócio
- [Caverna Dragão](#caverna-drag-o) - Sistema de reservas da Caverna Dragão
- [Timeline](#timeline) - Histórico e auditoria
- [GitNck](#gitnck) - Integração com GitHub
- [Health](#health) - Status do sistema
- [App](#app)

---

## Auth

Autenticação e autorização

### `POST` `/auth/login`

Login com email e senha

**Autenticacao:** JWT Bearer

**Request Body:** `LoginDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Login realizado com sucesso |
| 401 | Credenciais inválidas |
| 429 | Too many requests |

---

### `POST` `/auth/register/invite`

Registrar usuário via convite

**Autenticacao:** JWT Bearer

**Request Body:** `RegisterInviteDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | usuário registrado com sucesso |
| 400 | Convite inválido ou expirado |

---

### `POST` `/auth/magic-link/request`

Solicitar magic link para login

**Autenticacao:** JWT Bearer

**Request Body:** `RequestMagicLinkDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Magic link enviado (se email existir) |
| 429 | Too many requests |

---

### `GET` `/auth/magic-link/validate`

Validar magic link e fazer login

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `token` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Login realizado com sucesso |
| 400 | Link inválido ou expirado |

---

### `POST` `/auth/refresh`

Renovar tokens de acesso

**Autenticacao:** JWT Bearer

**Request Body:** `RefreshTokenDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Tokens renovados com sucesso |
| 401 | Refresh token inválido |

---

### `POST` `/auth/logout`

Logout - revoga refresh tokens

**Autenticacao:** JWT Bearer

**Request Body:** `RefreshTokenDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Logout realizado com sucesso |

---

### `GET` `/auth/me`

Obter dados do usuário autenticado

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Dados do usuário |

---

## Users

Gerenciamento de usuários

### `POST` `/users`

Criar novo usuário

**Autenticacao:** JWT Bearer

**Request Body:** `CreateUserDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Usuário criado com sucesso |

---

### `GET` `/users`

Listar usuários

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `search` | string | Nao | Buscar por nome ou email |
| `status` | string (PENDING, ACTIVE, INACTIVE, BLOCKED) | Nao | Filtrar por status |
| `role_id` | string | Nao | Filtrar por role ID |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de usuários |

---

### `POST` `/users/invite`

Convidar usuário por email

**Autenticacao:** JWT Bearer

**Request Body:** `InviteUserDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Convite enviado com sucesso |

---

### `GET` `/users/{id}`

Obter usuário por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Dados do usuário |
| 404 | Usuário não encontrado |

---

### `PATCH` `/users/{id}`

Atualizar usuário

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateUserDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Usuário atualizado com sucesso |
| 404 | Usuário não encontrado |

---

### `DELETE` `/users/{id}`

Excluir usuário (soft delete)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Usuário excluído com sucesso |
| 404 | Usuário não encontrado |

---

### `POST` `/users/change-password`

Alterar senha do usuário autenticado

**Autenticacao:** JWT Bearer

**Request Body:** `ChangePasswordDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Senha alterada com sucesso |

---

## Tenants

Gerenciamento de organizações

### `GET` `/tenants/current`

Obter dados da organização atual

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Dados da organização |

---

### `PATCH` `/tenants/current`

Atualizar organização atual

**Autenticacao:** JWT Bearer

**Request Body:** `UpdateTenantDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Organização atualizada com sucesso |

---

### `GET` `/tenants/roles`

Listar roles disponíveis

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de roles |

---

## Permissions

Gerenciamento de permissões

### `GET` `/permissions/user/{userId}`

Listar permissões de um usuário

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `userId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Permissoes do usuario |

---

### `POST` `/permissions`

Atribuir permissão a um usuário

**Autenticacao:** JWT Bearer

**Request Body:** `AssignPermissionDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Permissao atribuida com sucesso |

---

### `DELETE` `/permissions`

Revogar permissão de um usuário

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `user_id` | string | Sim | - |
| `module` | string | Sim | - |
| `action` | string | Sim | - |
| `project_id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Permissao revogada com sucesso |

---

### `GET` `/permissions/modules`

Listar módulos disponíveis

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de modulos disponiveis |

---

### `GET` `/permissions/actions`

Listar ações disponíveis

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de acoes disponiveis |

---

## Projects

Gerenciamento de projetos

### `POST` `/projects`

Criar novo projeto

**Autenticacao:** JWT Bearer

**Request Body:** `CreateProjectDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Projeto criado com sucesso |
| 400 | Dados invalidos |

---

### `GET` `/projects`

Listar projetos

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `search` | string | Nao | Buscar por nome ou descrição |
| `status` | string (PLANNING, ACTIVE, PAUSED, COMPLETED, ARCHIVED) | Nao | - |
| `work_mode` | string (SCRUM, KANBAN, SIMPLE) | Nao | - |
| `my_projects` | boolean | Nao | Apenas projetos que sou membro |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de projetos |

---

### `GET` `/projects/my`

Listar meus projetos (onde sou membro)

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de meus projetos |

---

### `GET` `/projects/{id}`

Obter projeto por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Projeto encontrado |
| 404 | Projeto nao encontrado |

---

### `PATCH` `/projects/{id}`

Atualizar projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateProjectDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Projeto atualizado com sucesso |
| 404 | Projeto nao encontrado |

---

### `DELETE` `/projects/{id}`

Excluir projeto (apenas SUPER_ADMIN)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Projeto excluido com sucesso |
| 404 | Projeto nao encontrado |

---

### `GET` `/projects/{id}/members`

Listar membros do projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `search` | string | Nao | Buscar por nome ou email |
| `role` | string (OWNER, ADMIN, MEMBER, VIEWER) | Nao | Filtrar por papel |
| `page` | number | Nao | - |
| `limit` | number | Nao | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de membros |

---

### `POST` `/projects/{id}/members`

Adicionar membro ao projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `AddMemberDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Membro adicionado com sucesso |
| 400 | Dados invalidos |

---

### `PATCH` `/projects/{id}/members/{memberId}`

Alterar papel de membro no projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |
| `memberId` | string | Sim | - |

**Request Body:** `UpdateMemberRoleDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Papel atualizado com sucesso |

---

### `DELETE` `/projects/{id}/members/{memberId}`

Remover membro do projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |
| `memberId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Membro removido com sucesso |

---

## Tasks

Gerenciamento de tarefas

### `POST` `/tasks`

Criar nova tarefa

**Autenticacao:** JWT Bearer

**Request Body:** `CreateTaskDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Tarefa criada com sucesso |
| 400 | Dados invalidos |

---

### `GET` `/tasks`

Listar tarefas

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `projectId` | string | Nao | Filtrar por projeto (CUID) |
| `sprintId` | string | Nao | Filtrar por sprint (CUID) |
| `assigneeId` | string | Nao | Filtrar por responsavel (CUID) |
| `status` | string (BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED) | Nao | Filtrar por status |
| `priority` | string (LOW, MEDIUM, HIGH, URGENT) | Nao | Filtrar por prioridade |
| `search` | string | Nao | Busca textual |
| `overdue` | boolean | Nao | Apenas tarefas atrasadas |
| `unassigned` | boolean | Nao | Apenas tarefas sem responsavel |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de tarefas |

---

### `GET` `/tasks/kanban/{projectId}`

Obter quadro Kanban do projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `projectId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Quadro Kanban |

---

### `GET` `/tasks/stats/{projectId}`

Obter estatisticas de tarefas do projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `projectId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Estatisticas de tarefas |

---

### `GET` `/tasks/{id}`

Obter tarefa por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Tarefa encontrada |
| 404 | Tarefa nao encontrada |

---

### `PATCH` `/tasks/{id}`

Atualizar tarefa

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateTaskDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Tarefa atualizada com sucesso |
| 404 | Tarefa nao encontrada |

---

### `DELETE` `/tasks/{id}`

Excluir tarefa (soft delete)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Tarefa excluida com sucesso |
| 404 | Tarefa nao encontrada |

---

### `PATCH` `/tasks/{id}/position`

Atualizar posicao da tarefa

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateTaskPositionDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Posicao atualizada com sucesso |

---

## Sprints

Gerenciamento de sprints

### `POST` `/sprints`

Criar novo sprint

**Autenticacao:** JWT Bearer

**Request Body:** `CreateSprintDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Sprint criado com sucesso |
| 400 | Dados invalidos |

---

### `GET` `/sprints`

Listar sprints

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `projectId` | string | Nao | Filtrar por projeto (CUID) |
| `status` | string (PLANNING, PLANNED, ACTIVE, COMPLETED, CANCELLED) | Nao | Filtrar por status |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de sprints |

---

### `GET` `/sprints/active/{projectId}`

Obter sprint ativo do projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `projectId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sprint ativo |

---

### `GET` `/sprints/{id}`

Obter sprint por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sprint encontrado |
| 404 | Sprint nao encontrado |

---

### `PATCH` `/sprints/{id}`

Atualizar sprint

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateSprintDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sprint atualizado com sucesso |
| 404 | Sprint nao encontrado |

---

### `DELETE` `/sprints/{id}`

Excluir sprint (soft delete)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sprint excluido com sucesso |
| 404 | Sprint nao encontrado |

---

### `GET` `/sprints/{id}/stats`

Obter estatisticas do sprint

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Estatisticas do sprint |

---

### `POST` `/sprints/{id}/start`

Iniciar sprint

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sprint iniciado com sucesso |
| 400 | Sprint nao pode ser iniciado |

---

### `POST` `/sprints/{id}/complete`

Concluir sprint

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sprint concluido com sucesso |
| 400 | Sprint nao pode ser concluido |

---

## Notes

Gerenciamento de notas

### `POST` `/notes`

Criar nova nota

**Autenticacao:** JWT Bearer

**Request Body:** `CreateNoteDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Nota criada com sucesso |
| 400 | Dados invalidos |

---

### `GET` `/notes`

Listar notas

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `projectId` | string | Nao | Filtrar por projeto (CUID) |
| `folderId` | string | Nao | Filtrar por pasta (CUID) |
| `search` | string | Nao | Busca textual |
| `pinned` | boolean | Nao | Apenas notas fixadas |
| `rootOnly` | boolean | Nao | Apenas notas na raiz (sem pasta) |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de notas |

---

### `GET` `/notes/folders`

Listar pastas de notas

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de pastas |

---

### `POST` `/notes/folders`

Criar pasta de notas

**Autenticacao:** JWT Bearer

**Request Body:** `CreateNoteFolderDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Pasta criada com sucesso |

---

### `PATCH` `/notes/folders/{id}`

Atualizar pasta de notas

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateNoteFolderDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Pasta atualizada com sucesso |
| 404 | Pasta nao encontrada |

---

### `DELETE` `/notes/folders/{id}`

Excluir pasta de notas

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Pasta excluida com sucesso |
| 404 | Pasta nao encontrada |

---

### `GET` `/notes/{id}`

Obter nota por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Nota encontrada |
| 404 | Nota nao encontrada |

---

### `PATCH` `/notes/{id}`

Atualizar nota

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateNoteDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Nota atualizada com sucesso |
| 404 | Nota nao encontrada |

---

### `DELETE` `/notes/{id}`

Excluir nota (soft delete)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Nota excluida com sucesso |
| 404 | Nota nao encontrada |

---

### `PATCH` `/notes/{id}/pin`

Fixar/desafixar nota

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Status de fixacao atualizado |

---

### `PATCH` `/notes/{id}/move`

Mover nota para pasta

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `MoveNoteDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Nota movida com sucesso |

---

### `GET` `/notes/{id}/versions`

Listar versoes da nota

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de versoes |

---

### `GET` `/notes/{id}/versions/{versionId}`

Obter versao especifica da nota

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |
| `versionId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Versao encontrada |
| 404 | Versao nao encontrada |

---

### `POST` `/notes/{id}/versions/{versionId}/restore`

Restaurar versao da nota

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |
| `versionId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Versao restaurada com sucesso |
| 404 | Versao nao encontrada |

---

## Calendar

Agenda e eventos

### `POST` `/calendar/events`

Criar novo evento

**Autenticacao:** JWT Bearer

**Request Body:** `CreateEventDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Evento criado com sucesso |
| 400 | Dados invalidos |

---

### `GET` `/calendar/events`

Listar eventos

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `projectId` | string | Nao | Filtrar por projeto (CUID) |
| `type` | string (MEETING, DEADLINE, MILESTONE, REMINDER, DELIVERY, OTHER) | Nao | Filtrar por tipo |
| `startDate` | string | Nao | Data de inicio do periodo (ISO 8601) |
| `endDate` | string | Nao | Data de fim do periodo (ISO 8601) |
| `attendeeId` | string | Nao | Filtrar por participante (CUID) |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de eventos |

---

### `GET` `/calendar/view`

Obter visao do calendario

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `startDate` | string | Sim | - |
| `endDate` | string | Sim | - |
| `myEvents` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Visao do calendario |

---

### `GET` `/calendar/upcoming`

Obter proximos eventos

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `myEvents` | string | Sim | - |
| `limit` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de proximos eventos |

---

### `GET` `/calendar/events/{id}`

Obter evento por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Evento encontrado |
| 404 | Evento nao encontrado |

---

### `PATCH` `/calendar/events/{id}`

Atualizar evento

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateEventDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Evento atualizado com sucesso |
| 404 | Evento nao encontrado |

---

### `DELETE` `/calendar/events/{id}`

Excluir evento

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Evento excluido com sucesso |
| 404 | Evento nao encontrado |

---

### `POST` `/calendar/events/{id}/respond`

Responder a convite de evento

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `RespondEventDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Resposta registrada com sucesso |

---

### `POST` `/calendar/meeting-requests`

Criar solicitacao de reuniao

**Autenticacao:** JWT Bearer

**Request Body:** `CreateMeetingRequestDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Solicitacao criada com sucesso |

---

### `GET` `/calendar/meeting-requests`

Listar solicitacoes de reuniao

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `status` | string (PENDING, ACCEPTED, DECLINED, RESCHEDULED) | Nao | Filtrar por status |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de solicitacoes |

---

### `GET` `/calendar/meeting-requests/{id}`

Obter solicitacao de reuniao por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Solicitacao encontrada |
| 404 | Solicitacao nao encontrada |

---

### `POST` `/calendar/meeting-requests/{id}/accept`

Aceitar solicitacao de reuniao

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `MeetingRequestActionDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Solicitacao aceita com sucesso |

---

### `POST` `/calendar/meeting-requests/{id}/decline`

Recusar solicitacao de reuniao

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `MeetingRequestActionDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Solicitacao recusada com sucesso |

---

### `POST` `/calendar/meeting-requests/{id}/reschedule`

Reagendar solicitacao de reuniao

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `MeetingRequestRescheduleDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Solicitacao reagendada com sucesso |

---

## Notifications

Notificações do sistema

### `GET` `/notifications`

List user notifications

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `status` | string (UNREAD, READ, ARCHIVED) | Nao | Filtrar por status |
| `type` | string (TASK_CREATED, TASK_UPDATED, TASK_ASSIGNED, NOTE_CREATED, NOTE_UPDATED, SPRINT_CREATED, SPRINT_STARTED, SPRINT_COMPLETED, MEETING_REQUEST_CREATED, MEETING_REQUEST_ACCEPTED, MEETING_REQUEST_DECLINED, MEETING_REQUEST_RESCHEDULED) | Nao | Filtrar por tipo |
| `entityType` | string | Nao | Filtrar por tipo de entidade |
| `projectId` | string | Nao | Filtrar por projeto (CUID) |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de notificacoes |

---

### `GET` `/notifications/unread/count`

Get unread notifications count

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Contagem de nao lidas |

---

### `PATCH` `/notifications/mark-all-read`

Mark all notifications as read

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Todas as notificacoes marcadas como lidas |

---

### `PATCH` `/notifications/{id}/read`

Mark notification as read

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Notificacao marcada como lida |
| 404 | Notificacao nao encontrada |

---

### `DELETE` `/notifications/{id}`

Delete notification (soft delete)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Notificacao excluida com sucesso |
| 404 | Notificacao nao encontrada |

---

## Business Model Canvas

Canvas de modelo de negócio

### `POST` `/canvas`

Criar novo Business Model Canvas

**Autenticacao:** JWT Bearer

**Request Body:** `CreateBusinessModelCanvasDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Canvas criado com sucesso |
| 400 | Dados invalidos |

---

### `GET` `/canvas`

Listar canvas

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |
| `projectId` | string | Nao | Filtrar por projeto (CUID) |
| `search` | string | Nao | Busca textual |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de canvas |

---

### `GET` `/canvas/{id}`

Obter canvas por ID

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Canvas encontrado |
| 404 | Canvas nao encontrado |

---

### `PATCH` `/canvas/{id}`

Atualizar canvas

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Request Body:** `UpdateBusinessModelCanvasDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Canvas atualizado com sucesso |
| 404 | Canvas nao encontrado |

---

### `POST` `/canvas/assist`

Analisar Business Model Canvas com IA

**Autenticacao:** JWT Bearer

**Request Body:** `AnalyzeBusinessModelCanvasDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Analise gerada com sucesso |

---

## Caverna Dragão

Sistema de reservas da Caverna Dragão

### `GET` `/caverna-dragao/settings`

Obter configuracoes da Caverna Dragao

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Configuracoes encontradas |

---

### `PATCH` `/caverna-dragao/settings`

Atualizar configuracoes da Caverna Dragao

**Autenticacao:** JWT Bearer

**Request Body:** `UpdateSettingsDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Configuracoes atualizadas com sucesso |

---

### `GET` `/caverna-dragao/tickets/my`

Obter meus tickets semanais

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Tickets encontrados |

---

### `POST` `/caverna-dragao/tickets/reset`

Resetar tickets semanais de todos os usuarios

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Tickets resetados com sucesso |

---

### `POST` `/caverna-dragao/reservations`

Criar nova reserva

**Autenticacao:** JWT Bearer

**Request Body:** `CreateReservationDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Reserva criada com sucesso |
| 400 | Dados invalidos ou sem tickets disponiveis |

---

### `GET` `/caverna-dragao/reservations`

Listar reservas

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `startDate` | string | Nao | Data de inicio do periodo (ISO 8601) |
| `endDate` | string | Nao | Data de fim do periodo (ISO 8601) |
| `period` | string (MORNING, AFTERNOON) | Nao | Filtrar por periodo |
| `status` | string (CONFIRMED, CANCELLED, COMPLETED, NO_SHOW) | Nao | Filtrar por status |
| `userId` | string | Nao | Filtrar por usuario |
| `myReservations` | boolean | Nao | Apenas minhas reservas |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de reservas |

---

### `GET` `/caverna-dragao/reservations/my`

Obter minhas reservas

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Minhas reservas |

---

### `POST` `/caverna-dragao/reservations/{id}/cancel`

Cancelar reserva

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Reserva cancelada com sucesso |
| 404 | Reserva nao encontrada |

---

### `POST` `/caverna-dragao/reservations/{id}/checkin`

Fazer check-in na reserva

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Check-in realizado com sucesso |
| 400 | Check-in nao permitido |

---

### `GET` `/caverna-dragao/occupancy`

Obter ocupacao da semana

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `week` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Ocupacao da semana |

---

### `GET` `/caverna-dragao/history`

Obter historico de reservas

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `userId` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Historico de reservas |

---

## Timeline

Histórico e auditoria

### `GET` `/timeline`

Listar timeline global do tenant

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Timeline do tenant |

---

### `GET` `/timeline/project/{projectId}`

Listar timeline de um projeto

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `projectId` | string | Sim | - |


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `page` | number | Nao | Número da página |
| `limit` | number | Nao | Itens por página |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Timeline do projeto |

---

## GitNck

Integração com GitHub

### `POST` `/github/connect`

Connect GitHub account via App or PAT

**Autenticacao:** JWT Bearer

**Request Body:** `ConnectGithubDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Conta GitHub conectada com sucesso |

---

### `GET` `/github/installations`

List GitHub installations

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de instalacoes |

---

### `GET` `/github/repos`

List available GitHub repositories

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `accountId` | string | Nao | Filter by GitHub account id (CUID) |
| `refresh` | string | Nao | Bypass cache for this request |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de repositorios disponiveis |

---

### `POST` `/github/repos/link`

Link repository to a project (Super Admin)

**Autenticacao:** JWT Bearer

**Request Body:** `LinkGithubRepoDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Repositorio vinculado com sucesso |

---

### `DELETE` `/github/repos/{id}`

Unlink repository (Super Admin)

**Autenticacao:** JWT Bearer


**Path Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `id` | string | Sim | - |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Repositorio desvinculado com sucesso |

---

### `GET` `/github/repos/linked`

List linked repositories

**Autenticacao:** JWT Bearer


**Query Parameters:**

| Nome | Tipo | Obrigatorio | Descricao |
|------|------|-------------|----------|
| `projectId` | string | Nao | Filter by project id (CUID) |
| `refresh` | string | Nao | Refresh repository metadata |

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de repositorios vinculados |

---

### `GET` `/github/accounts`

List GitHub accounts (Super Admin)

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Lista de contas GitHub |

---

### `POST` `/github/accounts/link-agent`

Link GitHub account to agent (Super Admin)

**Autenticacao:** JWT Bearer

**Request Body:** `LinkGithubAccountAgentDto`

**Responses:**

| Status | Descricao |
|--------|----------|
| 201 | Conta vinculada ao agente com sucesso |

---

## Health

Status do sistema

### `GET` `/health`

Health check do sistema

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Sistema funcionando |

---

### `GET` `/health/live`

Liveness probe

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Aplicação está viva |

---

### `GET` `/health/ready`

Readiness probe

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | Aplicação está pronta |

---

## App

### `GET` `/`

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | - |

---

### `GET` `/info`

**Autenticacao:** JWT Bearer

**Responses:**

| Status | Descricao |
|--------|----------|
| 200 | - |

---

## Schemas

### LoginDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `email` | string | Email do usuário |
| `password` | string | Senha do usuário |

### RoleResponseDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `id` | string | - |
| `type` | string | - |
| `name` | string | - |
| `description` | object | - |
| `is_system` | boolean | - |

### TenantSummaryDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `id` | string | - |
| `name` | string | - |
| `slug` | string | - |
| `status` | string | - |

### PermissionSummaryDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `module` | string | - |
| `action` | string | - |
| `project_id` | object | - |

### UserResponseDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `id` | string | - |
| `email` | string | - |
| `name` | string | - |
| `avatar_url` | object | - |
| `role_id` | string | - |
| `role` | object | - |
| `tenant_id` | string | - |
| `tenant` | object | - |
| `status` | string | - |
| `permissions` | array | - |
| `last_login_at` | object | - |
| `created_at` | string | - |
| `updated_at` | string | - |

### AuthResponseDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `access_token` | string | - |
| `refresh_token` | string | - |
| `expires_in` | string | - |
| `user` | object | - |

### RegisterInviteDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `token` | string | Token do convite recebido por email |
| `name` | string | Nome completo do usuário |
| `password` | string | Senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número) |

### RequestMagicLinkDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `email` | string | Email do usuário |

### MagicLinkResponseDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `message` | string | - |

### RefreshTokenDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `refresh_token` | string | Refresh token para renovar o access token |

### LogoutResponseDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `message` | string | - |

### CreateUserDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `email` | string | Email do usuário |
| `name` | string | Nome completo do usuário |
| `role_id` | string | ID da role do usuário |
| `password` | string | Senha do usuário (opcional se usar magic link) |
| `avatar_url` | string | URL do avatar do usuário |
| `status` | string (PENDING, ACTIVE, INACTIVE, BLOCKED) | Status inicial do usuário |

### InviteUserDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `email` | string | Email do usuário a ser convidado |
| `role_id` | string | ID da role do usuário |

### UpdateUserDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `email` | string | Email do usuário |
| `name` | string | Nome completo do usuário |
| `role_id` | string | ID da role do usuário |
| `avatar_url` | string | URL do avatar do usuário |
| `status` | string (PENDING, ACTIVE, INACTIVE, BLOCKED) | Status inicial do usuário |

### ChangePasswordDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `current_password` | string | Senha atual |
| `new_password` | string | Nova senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número) |

### UpdateTenantDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome da organização |
| `slug` | string | Slug da organização (URL-friendly) |
| `logo_url` | string | URL do logo |
| `settings` | object | Configurações da organização (JSON) |
| `timezone` | string | Fuso horário |

### AssignPermissionDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `user_id` | string | ID do usuário |
| `module` | string | Módulo |
| `action` | string | Ação |
| `project_id` | string | ID do projeto (para permissão específica) |

### CreateProjectDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome do projeto |
| `slug` | string | Slug do projeto (gerado automaticamente se não informado) |
| `description` | string | Descrição do projeto |
| `status` | string (PLANNING, ACTIVE, PAUSED, COMPLETED, ARCHIVED) | Status do projeto |
| `work_mode` | string (SCRUM, KANBAN, SIMPLE) | Modo de trabalho |
| `color` | string | Cor de identificação (hex) |
| `start_date` | string | Data de início |
| `end_date` | string | Data de término prevista |

### UpdateProjectDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome do projeto |
| `slug` | string | Slug do projeto (gerado automaticamente se não informado) |
| `description` | string | Descrição do projeto |
| `status` | string (PLANNING, ACTIVE, PAUSED, COMPLETED, ARCHIVED) | Status do projeto |
| `work_mode` | string (SCRUM, KANBAN, SIMPLE) | Modo de trabalho |
| `color` | string | Cor de identificação (hex) |
| `start_date` | string | Data de início |
| `end_date` | string | Data de término prevista |

### AddMemberDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `userId` | string | ID do usuário |
| `role` | string (OWNER, ADMIN, MEMBER, VIEWER) | Papel no projeto |

### UpdateMemberRoleDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `role` | string (OWNER, ADMIN, MEMBER, VIEWER) | Novo papel no projeto |

### CreateTaskDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo da tarefa |
| `description` | string | Descricao da tarefa |
| `status` | string (BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED) | Status da tarefa |
| `priority` | string (LOW, MEDIUM, HIGH, URGENT) | Prioridade da tarefa |
| `projectId` | string | ID do projeto (CUID) |
| `sprintId` | string | ID do sprint (CUID) |
| `assigneeId` | string | ID do responsavel (CUID) |
| `estimatedHours` | number | Horas estimadas |
| `progress` | number | Progresso (0-100) |
| `dueDate` | string | Data de vencimento (ISO 8601) |

### UpdateTaskDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo da tarefa |
| `description` | string | Descricao da tarefa |
| `status` | string (BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED) | Status da tarefa |
| `priority` | string (LOW, MEDIUM, HIGH, URGENT) | Prioridade da tarefa |
| `sprintId` | string | ID do sprint (CUID) |
| `assigneeId` | string | ID do responsavel (CUID) |
| `estimatedHours` | number | Horas estimadas |
| `actualHours` | number | Horas realizadas |
| `progress` | number | Progresso (0-100) |
| `dueDate` | string | Data de vencimento (ISO 8601) |
| `completedAt` | string | Data de conclusao (ISO 8601) |

### UpdateTaskPositionDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `position` | number | Nova posicao da tarefa |

### CreateSprintDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome do sprint |
| `goal` | string | Objetivo do sprint |
| `projectId` | string | ID do projeto (CUID) |
| `startDate` | string | Data de inicio (ISO 8601) |
| `endDate` | string | Data de fim (ISO 8601) |
| `status` | string (PLANNING, PLANNED, ACTIVE, COMPLETED, CANCELLED) | Status do sprint |

### UpdateSprintDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome do sprint |
| `goal` | string | Objetivo do sprint |
| `startDate` | string | Data de inicio (ISO 8601) |
| `endDate` | string | Data de fim (ISO 8601) |
| `status` | string (PLANNING, PLANNED, ACTIVE, COMPLETED, CANCELLED) | Status do sprint |

### CreateNoteDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo da nota |
| `content` | string | Conteudo da nota |
| `projectId` | string | ID do projeto (CUID) |
| `folderId` | string | ID da pasta (CUID) |
| `projectIds` | array | IDs dos projetos associados |
| `isPinned` | boolean | Nota fixada |
| `isSnapshot` | boolean | Criar como snapshot |
| `visibility` | string (ALL_COMPANY, FILTERED, SPECIFIC_USERS) | Visibilidade da nota |
| `visibleToRoles` | array | Roles com acesso |
| `visibleToUserIds` | array | IDs de usuarios com acesso |
| `accentColor` | string | Cor de destaque (hex) |
| `highlightStyle` | string (DEFAULT, BOLD, CALLOUT, UNDERLINE) | Estilo de destaque |

### CreateNoteFolderDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome da pasta |
| `parentId` | string | ID da pasta pai (CUID) |
| `accentColor` | string | Cor de destaque (hex) |

### UpdateNoteFolderDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome da pasta |
| `parentId` | object | ID da pasta pai (CUID), null para raiz |
| `accentColor` | string | Cor de destaque (hex) |

### UpdateNoteDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo da nota |
| `content` | string | Conteudo da nota |
| `isPinned` | boolean | Nota fixada |
| `createSnapshot` | boolean | Criar snapshot ao atualizar |
| `visibility` | string (ALL_COMPANY, FILTERED, SPECIFIC_USERS) | Visibilidade da nota |
| `visibleToRoles` | array | Roles com acesso |
| `visibleToUserIds` | array | IDs de usuarios com acesso |
| `projectIds` | array | IDs dos projetos associados |
| `folderId` | string | ID da pasta (CUID) |
| `accentColor` | string | Cor de destaque (hex) |
| `highlightStyle` | string (DEFAULT, BOLD, CALLOUT, UNDERLINE) | Estilo de destaque |

### MoveNoteDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `folderId` | object | ID da pasta destino (CUID), null para raiz |

### AttendeeDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `userId` | string | ID do usuario participante (CUID) |
| `isRequired` | boolean | Participacao obrigatoria |

### CreateEventDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo do evento |
| `description` | string | Descricao do evento |
| `type` | string (MEETING, DEADLINE, MILESTONE, REMINDER, DELIVERY, OTHER) | Tipo do evento |
| `startTime` | string | Data/hora de inicio (ISO 8601) |
| `endTime` | string | Data/hora de fim (ISO 8601) |
| `allDay` | boolean | Evento de dia inteiro |
| `location` | string | Local do evento |
| `meetingLink` | string | Link da reuniao |
| `color` | string | Cor do evento |
| `projectId` | string | ID do projeto (CUID) |
| `attendees` | array | Lista de participantes |

### UpdateAttendeeDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `userId` | string | ID do usuario participante (CUID) |
| `isRequired` | boolean | Participacao obrigatoria |

### UpdateEventDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo do evento |
| `description` | string | Descricao do evento |
| `type` | string (MEETING, DEADLINE, MILESTONE, REMINDER, DELIVERY, OTHER) | Tipo do evento |
| `startTime` | string | Data/hora de inicio (ISO 8601) |
| `endTime` | string | Data/hora de fim (ISO 8601) |
| `allDay` | boolean | Evento de dia inteiro |
| `location` | string | Local do evento |
| `meetingLink` | string | Link da reuniao |
| `color` | string | Cor do evento |
| `projectId` | string | ID do projeto (CUID) |
| `attendees` | array | Lista de participantes |

### RespondEventDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `status` | string (PENDING, ACCEPTED, DECLINED, TENTATIVE) | Status da resposta |

### MeetingRecipientDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `userId` | string | ID do destinatario (CUID) |

### CreateMeetingRequestDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `title` | string | Titulo da solicitacao |
| `description` | string | Descricao da solicitacao |
| `startTime` | string | Data/hora de inicio (ISO 8601) |
| `endTime` | string | Data/hora de fim (ISO 8601) |
| `location` | string | Local da reuniao |
| `meetingLink` | string | Link da reuniao |
| `color` | string | Cor do evento |
| `projectId` | string | ID do projeto (CUID) |
| `recipients` | array | Lista de destinatarios |

### MeetingRequestActionDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `message` | string | Mensagem de resposta |

### MeetingRequestRescheduleDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `message` | string | Mensagem de resposta |
| `startTime` | string | Novo horario de inicio (ISO 8601) |
| `endTime` | string | Novo horario de fim (ISO 8601) |

### UpdateSettingsDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `max_capacity` | number | Capacidade maxima |
| `tickets_per_week` | number | Tickets por semana |
| `morning_start` | string | Inicio do turno da manha (HH:MM) |
| `morning_end` | string | Fim do turno da manha (HH:MM) |
| `afternoon_start` | string | Inicio do turno da tarde (HH:MM) |
| `afternoon_end` | string | Fim do turno da tarde (HH:MM) |

### CreateReservationDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `date` | string | Data da reserva (ISO 8601) |
| `period` | string (MORNING, AFTERNOON) | Periodo da reserva |

### CreateBusinessModelCanvasDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome do canvas |
| `description` | string | Descricao do canvas |
| `projectId` | string | ID do projeto (CUID) |
| `blocks` | object | Blocos do canvas |
| `assumptions` | object | Suposicoes do canvas |
| `experiments` | object | Experimentos do canvas |

### UpdateBusinessModelCanvasDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `name` | string | Nome do canvas |
| `description` | string | Descricao do canvas |
| `projectId` | string | ID do projeto (CUID) |
| `blocks` | object | Blocos do canvas |
| `assumptions` | object | Suposicoes do canvas |
| `experiments` | object | Experimentos do canvas |
| `lastAnalysis` | object | Ultima analise do canvas |

### AnalyzeBusinessModelCanvasDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `blocks` | object | Blocos do canvas para analise |
| `assumptions` | object | Suposicoes para analise |
| `context` | string | Contexto adicional para analise |

### ConnectGithubDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `authType` | string (APP, PAT) | - |
| `installationId` | string | GitHub App installation id |
| `patToken` | string | Personal access token (fallback) |
| `label` | string | Optional label to help identify the account |

### LinkGithubRepoDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `accountId` | string | GitHub account id (CUID) |
| `installationId` | string | GitHub installation record id (CUID) |
| `projectId` | string | Project id to link (CUID) |
| `githubId` | string | GitHub repository id |
| `name` | string | Repository name |
| `fullName` | string | Repository full name |
| `private` | boolean | Is private repository |
| `defaultBranch` | string | Default branch |
| `description` | string | Repository description |
| `htmlUrl` | string | Repository HTML URL |

### LinkGithubAccountAgentDto

| Campo | Tipo | Descricao |
|-------|------|----------|
| `githubAccountId` | string | GitHub account id (CUID) |
| `userId` | string | Agent user id (CUID) |

