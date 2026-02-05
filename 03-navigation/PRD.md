# Plano 03: Navegação - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/03-navigation`
- **Timeout**: 1.5 horas
- **Arquivos de contexto**:
  - `../contracts.md`
  - `../01-estrutura-base/dependencies.md`
  - `../02-auth/dependencies.md`
  - `./dependencies.md`

---

## Objetivo

Implementar a estrutura de navegação completa do app: rotas de autenticação, tabs principais, stacks internas e proteção de rotas autenticadas.

---

## User Stories

### US-01: Navegação por Tabs
**Como** usuário autenticado  
**Quero** navegar entre seções principais por tabs  
**Para** acessar rapidamente diferentes áreas do app

**Critérios de Aceitação:**
- [ ] Tab bar fixa na parte inferior
- [ ] 5 tabs: Dashboard, Projetos, Calendário, Notificações, Mais
- [ ] Ícones e labels em cada tab
- [ ] Tab ativa destacada
- [ ] Badge de notificações não lidas

### US-02: Rotas Protegidas
**Como** usuário não autenticado  
**Quero** ser redirecionado para login  
**Para** não acessar conteúdo protegido

**Critérios de Aceitação:**
- [ ] Usuário não logado vê telas de auth
- [ ] Usuário logado vê telas protegidas
- [ ] Transição suave entre estados
- [ ] Deep links respeitam autenticação

### US-03: Navegação em Stack
**Como** usuário  
**Quero** navegar para detalhes e voltar  
**Para** explorar o conteúdo hierarquicamente

**Critérios de Aceitação:**
- [ ] Botão voltar funcional
- [ ] Gestos de voltar (swipe)
- [ ] Headers com título da tela
- [ ] Transições animadas

### US-04: Navegação com Projeto Selecionado
**Como** usuário  
**Quero** que certas telas lembrem o projeto selecionado  
**Para** não precisar selecionar toda vez

**Critérios de Aceitação:**
- [ ] Contexto de projeto mantido
- [ ] Header mostra projeto atual quando relevante
- [ ] Seletor de projeto acessível

---

## Estrutura de Navegação

```
RootNavigator
├── AuthStack (não autenticado)
│   ├── Login
│   ├── MagicLinkEmail
│   ├── MagicLinkSent
│   └── MagicLinkVerify
│
└── MainStack (autenticado)
    └── MainTabs
        ├── DashboardTab
        │   └── DashboardStack
        │       ├── Dashboard
        │       └── [sub-telas]
        │
        ├── ProjectsTab
        │   └── ProjectsStack
        │       ├── ProjectsList
        │       ├── ProjectNew
        │       ├── ProjectDetail
        │       │   ├── Tasks
        │       │   ├── Sprints
        │       │   ├── Notes
        │       │   ├── Calendar
        │       │   ├── Members
        │       │   └── Settings
        │       └── [sub-telas por feature]
        │
        ├── CalendarTab
        │   └── CalendarStack
        │       ├── Calendar
        │       ├── EventDetail
        │       └── EventNew
        │
        ├── NotificationsTab
        │   └── NotificationsStack
        │       ├── NotificationsList
        │       └── NotificationDetail
        │
        └── MoreTab
            └── MoreStack
                ├── MoreMenu
                ├── Profile
                ├── Settings
                ├── CavernaDragao
                ├── Notes (global)
                ├── Canvas
                └── About
```

---

## Tabs Principais

| Tab | Ícone | Label | Stack |
|-----|-------|-------|-------|
| Dashboard | `home-outline` | Início | DashboardStack |
| Projetos | `folder-outline` | Projetos | ProjectsStack |
| Calendário | `calendar-outline` | Calendário | CalendarStack |
| Notificações | `notifications-outline` | Alertas | NotificationsStack |
| Mais | `menu-outline` | Mais | MoreStack |

---

## Telas do Menu "Mais"

| Item | Ícone | Destino |
|------|-------|---------|
| Meu Perfil | `person-outline` | ProfileScreen |
| Notas | `document-text-outline` | NotesListScreen (global) |
| Business Canvas | `grid-outline` | CanvasListScreen |
| Caverna do Dragão | `flame-outline` | CavernaHomeScreen |
| Configurações | `settings-outline` | SettingsScreen |
| Sobre | `information-circle-outline` | AboutScreen |

---

## Requisitos Não-Funcionais

| Requisito | Métrica |
|-----------|---------|
| Transição entre telas | < 300ms |
| Resposta a toque em tab | Imediata |
| Memória | Telas não visíveis descarregadas |

---

## Fora do Escopo

- Navegação por drawer (menu lateral)
- Navegação por gestos customizados
- Navegação offline

---

## Dependências de Pacotes

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| @react-navigation/native | ^6.x | Core navigation |
| @react-navigation/native-stack | ^6.x | Stack navigator |
| @react-navigation/bottom-tabs | ^6.x | Tab navigator |
| react-native-screens | ^3.x | Otimização de telas |
| react-native-gesture-handler | ^2.x | Gestos |
