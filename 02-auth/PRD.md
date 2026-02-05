# Plano 02: Autenticação - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/02-auth`
- **Timeout**: 1.5 horas
- **Arquivos de contexto**:
  - `../contracts.md`
  - `../01-estrutura-base/dependencies.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o sistema de autenticação completo: login tradicional, login por magic link, logout, gerenciamento de sessão e contexto de usuário autenticado.

---

## User Stories

### US-01: Login Tradicional
**Como** usuário  
**Quero** fazer login com email e senha  
**Para** acessar o sistema

**Critérios de Aceitação:**
- [ ] Tela de login com campos email e senha
- [ ] Validação de campos obrigatórios
- [ ] Exibição de erros de autenticação
- [ ] Armazenamento seguro dos tokens
- [ ] Redirecionamento para Dashboard após sucesso

### US-02: Login por Magic Link
**Como** usuário  
**Quero** fazer login recebendo um link por email  
**Para** acessar sem lembrar minha senha

**Critérios de Aceitação:**
- [ ] Opção "Entrar com link mágico" na tela de login
- [ ] Tela para inserir email
- [ ] Feedback de email enviado
- [ ] Tela de verificação do token
- [ ] Deep link configurado para abrir o app

### US-03: Manter Sessão
**Como** usuário  
**Quero** permanecer logado ao reabrir o app  
**Para** não precisar fazer login toda vez

**Critérios de Aceitação:**
- [ ] Token verificado ao iniciar app
- [ ] Refresh automático se token expirado
- [ ] Logout automático se refresh falhar

### US-04: Logout
**Como** usuário  
**Quero** fazer logout do app  
**Para** sair da minha conta

**Critérios de Aceitação:**
- [ ] Botão de logout acessível
- [ ] Tokens removidos do dispositivo
- [ ] Redirecionamento para tela de login
- [ ] Estado limpo após logout

### US-05: Contexto de Usuário
**Como** desenvolvedor  
**Quero** acessar dados do usuário logado globalmente  
**Para** usar em qualquer tela do app

**Critérios de Aceitação:**
- [ ] AuthStore com dados do usuário
- [ ] AuthStore com dados do tenant
- [ ] Hook `useAuth()` para acesso fácil
- [ ] Atualização automática após login/logout

---

## Casos de Uso

### UC-01: Login com Sucesso
1. Usuário abre o app
2. Sistema exibe tela de login
3. Usuário insere email e senha
4. Usuário pressiona "Entrar"
5. Sistema valida credenciais
6. Sistema armazena tokens
7. Sistema redireciona para Dashboard

### UC-02: Login com Erro
1. Usuário insere credenciais inválidas
2. Sistema exibe mensagem "Email ou senha incorretos"
3. Campos permanecem preenchidos
4. Usuário pode tentar novamente

### UC-03: Magic Link Flow
1. Usuário pressiona "Entrar com link mágico"
2. Sistema exibe tela para inserir email
3. Usuário insere email e pressiona "Enviar"
4. Sistema exibe "Link enviado para seu email"
5. Usuário abre email e clica no link
6. App abre na tela de verificação
7. Sistema valida token e faz login automático

### UC-04: Sessão Expirada
1. Usuário tenta ação no app
2. Token de acesso expirado
3. Sistema tenta refresh automaticamente
4. Se sucesso: ação continua normalmente
5. Se falha: redirecionamento para login

---

## Telas

### Tela 1: Login (`LoginScreen`)
- Logo do app
- Campo email
- Campo senha (com toggle visibilidade)
- Botão "Entrar"
- Link "Esqueci minha senha" (futuro)
- Divider "ou"
- Botão "Entrar com link mágico"
- Indicador de loading durante autenticação

### Tela 2: Magic Link Email (`MagicLinkEmailScreen`)
- Título "Entrar sem senha"
- Descrição explicativa
- Campo email
- Botão "Enviar link"
- Link "Voltar para login"

### Tela 3: Magic Link Sent (`MagicLinkSentScreen`)
- Ícone de email
- Título "Verifique seu email"
- Descrição "Enviamos um link para {email}"
- Botão "Abrir app de email"
- Link "Reenviar link" (com cooldown)
- Link "Usar outra forma de login"

### Tela 4: Magic Link Verify (`MagicLinkVerifyScreen`)
- Acessada via deep link
- Loading enquanto verifica
- Sucesso: redireciona para Dashboard
- Erro: exibe mensagem com opção de tentar novamente

---

## Requisitos Não-Funcionais

| Requisito | Métrica |
|-----------|---------|
| Tempo de login | < 2 segundos (rede boa) |
| Segurança | Tokens em SecureStore |
| Acessibilidade | Labels em todos os campos |

---

## Fora do Escopo

- Recuperação de senha (fluxo web)
- Cadastro de novo usuário (fluxo web)
- Autenticação biométrica (futuro)
- Login social (Google, Apple)

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login tradicional |
| POST | `/auth/refresh` | Renovar token |
| POST | `/auth/logout` | Invalidar tokens |
| POST | `/auth/magic-link` | Solicitar magic link |
| POST | `/auth/magic-link/verify` | Verificar token do magic link |
| GET | `/auth/me` | Dados do usuário logado |
