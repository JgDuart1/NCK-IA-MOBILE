# Plano 14: Configurações - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/14-configuracoes`
- **Timeout**: 1 hora
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de configurações do app: preferências, notificações, cache, informações do app e logout.

---

## User Stories

### US-01: Menu de Configurações
**Como** usuário  
**Quero** acessar configurações do app  
**Para** personalizar minha experiência

**Critérios de Aceitação:**
- [ ] Menu organizado por seções
- [ ] Ícones descritivos
- [ ] Navegação clara

### US-02: Configurar Notificações
**Como** usuário  
**Quero** configurar notificações  
**Para** controlar o que recebo

**Critérios de Aceitação:**
- [ ] Toggle para push notifications
- [ ] Configurar tipos de notificação
- [ ] Modo silencioso

### US-03: Gerenciar Cache
**Como** usuário  
**Quero** limpar cache do app  
**Para** liberar espaço

**Critérios de Aceitação:**
- [ ] Ver tamanho do cache
- [ ] Botão limpar cache
- [ ] Confirmação

### US-04: Ver Sobre o App
**Como** usuário  
**Quero** ver informações do app  
**Para** saber versão e contato

**Critérios de Aceitação:**
- [ ] Versão do app
- [ ] Links úteis (termos, privacidade)
- [ ] Contato de suporte

### US-05: Fazer Logout
**Como** usuário  
**Quero** fazer logout  
**Para** sair da minha conta

**Critérios de Aceitação:**
- [ ] Confirmação antes de sair
- [ ] Cache limpo
- [ ] Retorno para login

---

## Telas

### 1. SettingsScreen
- **Notificações**
  - Push notifications (toggle)
  - Som de notificação (toggle)
- **Armazenamento**
  - Tamanho do cache
  - Limpar cache
- **Conta**
  - Sobre o app
  - Termos de uso
  - Política de privacidade
- **Ações**
  - Sair da conta

### 2. AboutScreen
- Logo do app
- Nome e versão
- Build number
- Links:
  - Site oficial
  - Termos de uso
  - Política de privacidade
  - Contato/suporte

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `SettingsSection` | Seção de configurações |
| `SettingsItem` | Item de configuração |
| `SettingsToggle` | Toggle com label |
| `CacheInfo` | Info de cache |
| `AppInfo` | Informações do app |
| `LinkItem` | Link externo |
