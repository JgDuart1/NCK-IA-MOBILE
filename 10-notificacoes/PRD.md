# Plano 10: Notificações - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/10-notificacoes`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o sistema de notificações: listagem, marcação como lida, navegação para entidade relacionada e push notifications.

---

## User Stories

### US-01: Listar Notificações
**Como** usuário  
**Quero** ver minhas notificações  
**Para** acompanhar atividades relevantes

**Critérios de Aceitação:**
- [ ] Lista de notificações ordenada por data
- [ ] Indicador visual de não lida
- [ ] Agrupamento por data (Hoje, Ontem, Esta semana)
- [ ] Pull to refresh

### US-02: Marcar como Lida
**Como** usuário  
**Quero** marcar notificações como lidas  
**Para** organizar minha lista

**Critérios de Aceitação:**
- [ ] Marcar individual ao clicar
- [ ] Marcar todas como lidas
- [ ] Badge atualiza automaticamente

### US-03: Navegar para Entidade
**Como** usuário  
**Quero** clicar na notificação e ir para o item  
**Para** ver detalhes do que aconteceu

**Critérios de Aceitação:**
- [ ] Clique navega para tarefa, nota, evento, etc.
- [ ] Deep linking funciona

### US-04: Push Notifications
**Como** usuário  
**Quero** receber notificações push  
**Para** ser avisado mesmo com app fechado

**Critérios de Aceitação:**
- [ ] Permissão solicitada ao usuário
- [ ] Token registrado no backend
- [ ] Receber push quando app em background
- [ ] Clicar no push abre a tela relevante

### US-05: Badge Counter
**Como** usuário  
**Quero** ver contador de não lidas  
**Para** saber rapidamente se há novidades

**Critérios de Aceitação:**
- [ ] Badge na tab de notificações
- [ ] Atualizado em tempo real
- [ ] Zerado ao marcar todas como lidas

---

## Telas

### NotificationsListScreen
- Header com título e "Marcar todas como lidas"
- Lista de notificações agrupadas
- Cada item mostra:
  - Ícone do tipo
  - Título e mensagem
  - Tempo relativo
  - Indicador de não lida (bolinha)
- Empty state quando sem notificações

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notifications` | Listar notificações |
| GET | `/notifications/unread-count` | Contador de não lidas |
| PATCH | `/notifications/:id/read` | Marcar como lida |
| POST | `/notifications/read-all` | Marcar todas como lidas |
| POST | `/notifications/register-device` | Registrar token push |
| DELETE | `/notifications/unregister-device` | Remover token |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `NotificationItem` | Item da lista |
| `NotificationIcon` | Ícone baseado no tipo |
| `NotificationGroup` | Grupo por data |
| `UnreadBadge` | Indicador de não lida |

---

## Push Notifications

### Configuração Expo

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#6366F1"
        }
      ]
    ]
  }
}
```

### Fluxo

1. App inicia → solicitar permissão
2. Se permitido → obter Expo Push Token
3. Enviar token para backend → `POST /notifications/register-device`
4. Backend envia push via Expo Push Service
5. App recebe push → exibir notificação / navegar
