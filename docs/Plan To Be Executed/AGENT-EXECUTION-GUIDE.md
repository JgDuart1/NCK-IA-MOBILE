# Guia de Execução para Agentes CLI

Este documento contém os prompts prontos para executar cada um dos 15 planos usando agentes CLI no terminal.

---

## Estrutura de Execução

### 1 Branch por Plano
Cada plano será executado em uma branch separada:
```
mobile/01-estrutura-base
mobile/02-auth
mobile/03-navigation
...
mobile/15-deployment
```

### Execução Paralela com Git Worktree (OBRIGATÓRIO)
Para rodar agentes em paralelo sem conflito de branch, **cada agente deve trabalhar em um worktree dedicado**.  
Isso evita que um `git checkout` afete o terminal de outro agente.

**Regra de ouro:** nunca execute `git checkout` no repositório principal enquanto outros agentes estiverem trabalhando.  
O repositório principal serve apenas para criar/atualizar worktrees.

**Fluxo padrão (exemplo do Plano 04):**
```bash
# No repositório principal
git checkout main
git pull origin main
git worktree add ../NCK-IA-MOBILE-04-dashboard mobile/04-dashboard

# Trabalhar sempre dentro do worktree do plano
cd ../NCK-IA-MOBILE-04-dashboard
```

**Dica:** abra uma janela/terminal por worktree (VS Code ou PowerShell) e mantenha cada agente preso ao seu diretório.

### 1 Prompt por Agente
Você dará 1 prompt para cada agente. O agente lerá a documentação e executará o plano.

---

## Fases de Execução

```
┌────────────────────────────────────────────────────────────────┐
│ Fase 1: [01] Estrutura Base         → 1 agente (SEQUENCIAL)   │
│ Fase 2: [02] Auth                   → 1 agente (SEQUENCIAL)   │
│ Fase 3: [03] Navigation             → 1 agente (SEQUENCIAL)   │
├────────────────────────────────────────────────────────────────┤
│ Fase 4: [04,05,09,10,12,13,14]      → 7 agentes (PARALELO)    │
│ Fase 5: [06,07,08,11]               → 4 agentes (PARALELO)    │
├────────────────────────────────────────────────────────────────┤
│ Fase 6: [15] Deployment             → 1 agente (SEQUENCIAL)   │
│ Fase 7: Merge Final                 → 1 agente ou manual      │
└────────────────────────────────────────────────────────────────┘
```

**Importante:**
- Fases 1-3 são sequenciais - cada uma deve terminar antes da próxima começar
- Fases 4-5 podem ser executadas em paralelo (múltiplos agentes ao mesmo tempo)
- Fase 6 só começa após todas as anteriores estarem completas

---

## Prompts por Plano

### Plano 01 - Estrutura Base

```
Você é um agente especializado em React Native/Expo. Execute o Plano 01 do projeto NCK IA Mobile.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/01-estrutura-base/PRD.md
- docs/Plan To Be Executed/01-estrutura-base/Spec.md
- docs/Plan To Be Executed/01-estrutura-base/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/LIBRARIES-REFERENCE.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-01-estrutura-base mobile/01-estrutura-base`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-01-estrutura-base`
4. Crie o projeto Expo na pasta /mobile
5. Implemente exatamente o que está no Spec.md
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [01] descrição

## Entrega
- Projeto Expo funcional
- Tema dark configurado
- API client com interceptors
- Providers (QueryClient, Auth, etc)
- Tipos base de contracts.md
```

---

### Plano 02 - Auth

```
Você é um agente especializado em React Native/Expo. Execute o Plano 02 do projeto NCK IA Mobile.

## Pré-requisito
O Plano 01 deve estar completo e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/02-auth/PRD.md
- docs/Plan To Be Executed/02-auth/Spec.md
- docs/Plan To Be Executed/02-auth/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-02-auth mobile/02-auth`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-02-auth`
4. Implemente autenticação conforme Spec.md
5. Use SecureStore para tokens
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [02] descrição

## Entrega
- Telas de Login e MagicLink
- AuthContext e useAuth hook
- Interceptors com refresh token
- Logout funcional
```

---

### Plano 03 - Navigation

```
Você é um agente especializado em React Native/Expo. Execute o Plano 03 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01 e 02 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/03-navigation/PRD.md
- docs/Plan To Be Executed/03-navigation/Spec.md
- docs/Plan To Be Executed/03-navigation/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-03-navigation mobile/03-navigation`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-03-navigation`
4. Configure React Navigation conforme Spec.md
5. Crie PlaceholderScreen para telas ainda não implementadas
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [03] descrição

## Entrega
- RootNavigator com auth check
- BottomTabs configurado
- Todas as Stacks com PlaceholderScreens
- Tipagem completa de navegação
```

---

### Plano 04 - Dashboard

```
Você é um agente especializado em React Native/Expo. Execute o Plano 04 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/04-dashboard/PRD.md
- docs/Plan To Be Executed/04-dashboard/Spec.md
- docs/Plan To Be Executed/04-dashboard/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-04-dashboard mobile/04-dashboard`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-04-dashboard`
4. Implemente Dashboard conforme Spec.md
5. Substitua PlaceholderScreen pela tela real na HomeStack
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [04] descrição

## Entrega
- Tela Dashboard com stats
- Timeline de atividades
- Cards de resumo
- Quick actions
```

---

### Plano 05 - Projetos

```
Você é um agente especializado em React Native/Expo. Execute o Plano 05 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/05-projetos/PRD.md
- docs/Plan To Be Executed/05-projetos/Spec.md
- docs/Plan To Be Executed/05-projetos/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-05-projetos mobile/05-projetos`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-05-projetos`
4. Implemente módulo de Projetos conforme Spec.md
5. Substitua PlaceholderScreens na ProjectsStack
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [05] descrição

## Entrega
- Lista de projetos
- Detalhes do projeto
- Criar/editar projeto
- Gestão de membros
```

---

### Plano 06 - Tarefas Kanban

```
Você é um agente especializado em React Native/Expo. Execute o Plano 06 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-05 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/06-tarefas-kanban/PRD.md
- docs/Plan To Be Executed/06-tarefas-kanban/Spec.md
- docs/Plan To Be Executed/06-tarefas-kanban/dependencies.md
- docs/Plan To Be Executed/06-tarefas-kanban/DRAG-DROP-IMPLEMENTATION.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-06-tarefas-kanban mobile/06-tarefas-kanban`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-06-tarefas-kanban`
4. Implemente Kanban conforme Spec.md
5. Use DRAG-DROP-IMPLEMENTATION.md como guia
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [06] descrição

## Entrega
- Kanban com colunas de status
- Cards de tarefas arrastáveis (ou long-press)
- CRUD de tarefas
- Anexos
```

---

### Plano 07 - Sprints

```
Você é um agente especializado em React Native/Expo. Execute o Plano 07 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-05 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/07-sprints/PRD.md
- docs/Plan To Be Executed/07-sprints/Spec.md
- docs/Plan To Be Executed/07-sprints/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-07-sprints mobile/07-sprints`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-07-sprints`
4. Implemente módulo de Sprints conforme Spec.md
5. Siga o AGENT-CHECKLIST.md antes de finalizar
6. Commits com padrão: [07] descrição

## Entrega
- Lista de sprints
- Detalhes da sprint
- Criar/editar sprint
- Adicionar/remover tarefas
```

---

### Plano 08 - Notas

```
Você é um agente especializado em React Native/Expo. Execute o Plano 08 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-05 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/08-notas/PRD.md
- docs/Plan To Be Executed/08-notas/Spec.md
- docs/Plan To Be Executed/08-notas/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-08-notas mobile/08-notas`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-08-notas`
4. Implemente módulo de Notas conforme Spec.md
5. Siga o AGENT-CHECKLIST.md antes de finalizar
6. Commits com padrão: [08] descrição

## Entrega
- Lista de notas
- Editor de notas
- Pastas/categorias
- Histórico de versões
- Anexos
```

---

### Plano 09 - Calendário

```
Você é um agente especializado em React Native/Expo. Execute o Plano 09 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/09-calendario/PRD.md
- docs/Plan To Be Executed/09-calendario/Spec.md
- docs/Plan To Be Executed/09-calendario/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-09-calendario mobile/09-calendario`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-09-calendario`
4. Implemente Calendário conforme Spec.md
5. Use componente customizado (NÃO react-native-calendars)
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [09] descrição

## Entrega
- Visualização de calendário mensal
- Lista de eventos
- Criar/editar evento
- Meeting requests
```

---

### Plano 10 - Notificações

```
Você é um agente especializado em React Native/Expo. Execute o Plano 10 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/10-notificacoes/PRD.md
- docs/Plan To Be Executed/10-notificacoes/Spec.md
- docs/Plan To Be Executed/10-notificacoes/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-10-notificacoes mobile/10-notificacoes`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-10-notificacoes`
4. Implemente Notificações conforme Spec.md
5. Use expo-notifications para push
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [10] descrição

## Entrega
- Lista de notificações
- Push notifications configuradas
- Marcar como lida
- Badge no ícone do app
```

---

### Plano 11 - Business Model Canvas

```
Você é um agente especializado em React Native/Expo. Execute o Plano 11 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-05 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/11-business-model-canvas/PRD.md
- docs/Plan To Be Executed/11-business-model-canvas/Spec.md
- docs/Plan To Be Executed/11-business-model-canvas/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-11-business-model-canvas mobile/11-business-model-canvas`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-11-business-model-canvas`
4. Implemente Canvas conforme Spec.md
5. Use ScrollView horizontal paginado para os 9 blocos
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [11] descrição

## Entrega
- Lista de canvas
- Visualização dos 9 blocos
- Edição de blocos
- Experimentos
```

---

### Plano 12 - Caverna do Dragão

```
Você é um agente especializado em React Native/Expo. Execute o Plano 12 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/12-caverna-dragao/PRD.md
- docs/Plan To Be Executed/12-caverna-dragao/Spec.md
- docs/Plan To Be Executed/12-caverna-dragao/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-12-caverna-dragao mobile/12-caverna-dragao`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-12-caverna-dragao`
4. Implemente Caverna do Dragão conforme Spec.md
5. Siga o AGENT-CHECKLIST.md antes de finalizar
6. Commits com padrão: [12] descrição

## Entrega
- Sistema de reservas
- Lista de tickets
- Check-in
- Detalhes da reserva
```

---

### Plano 13 - Usuários e Perfil

```
Você é um agente especializado em React Native/Expo. Execute o Plano 13 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/13-usuarios-perfil/PRD.md
- docs/Plan To Be Executed/13-usuarios-perfil/Spec.md
- docs/Plan To Be Executed/13-usuarios-perfil/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-13-usuarios-perfil mobile/13-usuarios-perfil`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-13-usuarios-perfil`
4. Implemente Perfil conforme Spec.md
5. Use expo-image-picker para avatar
6. Siga o AGENT-CHECKLIST.md antes de finalizar
7. Commits com padrão: [13] descrição

## Entrega
- Tela de perfil
- Edição de dados
- Upload de avatar
- Alterar senha
```

---

### Plano 14 - Configurações

```
Você é um agente especializado em React Native/Expo. Execute o Plano 14 do projeto NCK IA Mobile.

## Pré-requisito
Os Planos 01-03 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/14-configuracoes/PRD.md
- docs/Plan To Be Executed/14-configuracoes/Spec.md
- docs/Plan To Be Executed/14-configuracoes/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-14-configuracoes mobile/14-configuracoes`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-14-configuracoes`
4. Implemente Configurações conforme Spec.md
5. Siga o AGENT-CHECKLIST.md antes de finalizar
6. Commits com padrão: [14] descrição

## Entrega
- Tela de configurações
- Toggle de notificações
- Sobre o app
- Logout
```

---

### Plano 15 - Deployment

```
Você é um agente especializado em React Native/Expo. Execute o Plano 15 do projeto NCK IA Mobile.

## Pré-requisito
TODOS os Planos 01-14 devem estar completos e merged na main.

## Documentação
Leia os seguintes arquivos antes de começar:
- docs/Plan To Be Executed/15-deployment-mobile/PRD.md
- docs/Plan To Be Executed/15-deployment-mobile/Spec.md
- docs/Plan To Be Executed/15-deployment-mobile/dependencies.md
- docs/Plan To Be Executed/contracts.md
- docs/Plan To Be Executed/AGENT-CHECKLIST.md

## Instruções
1. No repositório principal: `git checkout main && git pull origin main`
2. Crie o worktree: `git worktree add ../NCK-IA-MOBILE-15-deployment mobile/15-deployment`
3. Entre no worktree: `cd ../NCK-IA-MOBILE-15-deployment`
4. Configure assets e builds conforme Spec.md
5. PRIORIDADE: Configurar APK Download (Fase 1)
6. OPCIONAL: Preparar Google Play Store (Fase 2)
7. Siga o AGENT-CHECKLIST.md antes de finalizar
8. Commits com padrão: [15] descrição

## Entrega
- Assets criados (ícones, splash)
- app.json configurado
- eas.json configurado
- Build APK funcional
- Página de download HTML
- (Opcional) Preparação Play Store
```

---

## Merge Final

Após todos os planos estarem completos, siga o `MERGE-STRATEGY.md` para integrar todas as branches.

```bash
# Ordem de merge
main ← mobile/01-estrutura-base
main ← mobile/02-auth
main ← mobile/03-navigation
main ← mobile/04-dashboard
main ← mobile/05-projetos
...
main ← mobile/15-deployment
```

---

## Dicas

1. **Sempre fazer `git pull origin main` antes de criar o worktree**
2. **Cada agente deve ler toda a documentação antes de começar**
3. **Usar AGENT-CHECKLIST.md como verificação final**
4. **Seguir LIBRARIES-REFERENCE.md para evitar instalar bibliotecas erradas**
5. **Commits pequenos e frequentes**
6. **Testar no emulador antes de finalizar**
