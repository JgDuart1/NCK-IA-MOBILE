# Plano 13: Usuários e Perfil - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/13-usuarios-perfil`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de perfil de usuário: visualização, edição de perfil, alteração de avatar e sistema de convites de usuários.

---

## User Stories

### US-01: Ver Meu Perfil
**Como** usuário  
**Quero** ver meu perfil  
**Para** conferir minhas informações

**Critérios de Aceitação:**
- [ ] Nome, email, avatar
- [ ] Role no sistema
- [ ] Data de entrada
- [ ] Botão editar

### US-02: Editar Perfil
**Como** usuário  
**Quero** editar meu perfil  
**Para** manter informações atualizadas

**Critérios de Aceitação:**
- [ ] Alterar nome
- [ ] Alterar avatar (upload ou tirar foto)
- [ ] Salvar alterações

### US-03: Alterar Senha
**Como** usuário  
**Quero** alterar minha senha  
**Para** manter minha conta segura

**Critérios de Aceitação:**
- [ ] Senha atual obrigatória
- [ ] Nova senha com confirmação
- [ ] Validação de força da senha
- [ ] Feedback de sucesso

### US-04: Convidar Usuário
**Como** admin  
**Quero** convidar novos usuários  
**Para** adicionar pessoas ao workspace

**Critérios de Aceitação:**
- [ ] Formulário com email
- [ ] Selecionar role do convidado
- [ ] Envio de convite por email
- [ ] Feedback de sucesso

### US-05: Ver Convites Pendentes
**Como** admin  
**Quero** ver convites pendentes  
**Para** gerenciar quem foi convidado

**Critérios de Aceitação:**
- [ ] Lista de convites enviados
- [ ] Status (pending, accepted, expired)
- [ ] Reenviar convite
- [ ] Cancelar convite

---

## Telas

### 1. ProfileScreen
- Avatar grande
- Nome e email
- Role
- Tenant/Workspace
- Membro desde
- Botões: Editar Perfil, Alterar Senha

### 2. EditProfileScreen
- Campo nome
- Seletor de avatar
  - Escolher da galeria
  - Tirar foto
  - Remover avatar
- Botão salvar

### 3. ChangePasswordScreen
- Campo senha atual
- Campo nova senha
- Campo confirmar nova senha
- Indicador de força
- Botão alterar

### 4. InviteUserScreen
- Campo email
- Seletor de role
- Seletor de projetos (opcional)
- Botão enviar convite

### 5. PendingInvitesScreen
- Lista de convites
- Status de cada um
- Ações por convite

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users/me` | Meu perfil |
| PATCH | `/users/me` | Atualizar perfil |
| POST | `/users/me/avatar` | Upload avatar |
| DELETE | `/users/me/avatar` | Remover avatar |
| POST | `/users/change-password` | Alterar senha |
| POST | `/users/invite` | Enviar convite |
| GET | `/users/invites` | Listar convites |
| POST | `/users/invites/:id/resend` | Reenviar |
| DELETE | `/users/invites/:id` | Cancelar |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `ProfileCard` | Card do perfil |
| `AvatarPicker` | Seletor de avatar |
| `PasswordStrength` | Indicador de força |
| `RoleSelector` | Seletor de role |
| `InviteCard` | Card de convite |
| `InviteStatusBadge` | Badge de status |
