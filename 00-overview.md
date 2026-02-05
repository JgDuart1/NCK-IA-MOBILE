# NCK IA Mobile - Plano de Execução

## Objetivo

Transformar a aplicação web NCK IA (NestJS + Next.js) em um aplicativo mobile nativo usando Expo/React Native, mantendo o backend existente no Coolify.

## Escopo

### Incluído
- App mobile para Android (Play Store)
- Todas as funcionalidades core do sistema web
- Autenticação JWT com refresh token
- Notificações push

### Excluído
- GitNCK (integração GitHub)
- Gestão de tenants (admin web)
- Configuração de webhooks (admin web)
- Gestão de permissões granulares (backend)

---

## Índice de Planos

| # | Plano | Descrição | Fase |
|---|-------|-----------|------|
| 01 | [estrutura-base](./01-estrutura-base/) | Projeto Expo, tema, API client, providers | 1 |
| 02 | [auth](./02-auth/) | Login, logout, refresh token, magic-link | 2 |
| 03 | [navigation](./03-navigation/) | Stack, tabs, rotas protegidas | 3 |
| 04 | [dashboard](./04-dashboard/) | Tela inicial, resumos, timeline | 4 |
| 05 | [projetos](./05-projetos/) | Lista, criação, detalhes, membros | 4 |
| 06 | [tarefas-kanban](./06-tarefas-kanban/) | Kanban, drag-drop, CRUD, anexos | 5 |
| 07 | [sprints](./07-sprints/) | Lista, criação, gestão | 5 |
| 08 | [notas](./08-notas/) | Lista, criação, pastas, versões, anexos | 5 |
| 09 | [calendario](./09-calendario/) | Eventos, meeting requests | 4 |
| 10 | [notificacoes](./10-notificacoes/) | Lista, push, badges | 4 |
| 11 | [business-model-canvas](./11-business-model-canvas/) | Canvas, blocos, experimentos | 5 |
| 12 | [caverna-dragao](./12-caverna-dragao/) | Reservas, tickets, check-in | 4 |
| 13 | [usuarios-perfil](./13-usuarios-perfil/) | Perfil, avatar, convites | 4 |
| 14 | [configuracoes](./14-configuracoes/) | Settings, about, logout | 4 |
| 15 | [deployment-mobile](./15-deployment-mobile/) | Build, assets, Play Store | 6 |

---

## Fases de Execução

```
Fase 1: [01]                              → 1 agente
Fase 2: [02]                              → 1 agente
Fase 3: [03]                              → 1 agente
Fase 4: [04, 05, 09, 10, 12, 13, 14]      → 7 agentes (paralelo)
Fase 5: [06, 07, 08, 11]                  → 4 agentes (paralelo)
Fase 6: [15]                              → 1 agente (após todos)
Fase 7: Merge Final                       → 1 agente
```

### Diagrama de Dependências

```
           ┌─────────┐
           │   01    │
           └────┬────┘
                │
           ┌────▼────┐
           │   02    │
           └────┬────┘
                │
           ┌────▼────┐
           │   03    │
           └────┬────┘
                │
    ┌───┬───┬───┼───┬───┬───┬───┐
    │   │   │   │   │   │   │   │
    ▼   ▼   ▼   ▼   ▼   ▼   ▼   │
   04  05  09  10  12  13  14   │
        │                       │
    ┌───┴───┬───────┬───────┐   │
    │       │       │       │   │
    ▼       ▼       ▼       ▼   │
   06      07      08      11   │
    │       │       │       │   │
    └───────┴───────┴───────┘   │
                │               │
           ┌────▼───────────────┘
           │
           ▼
         [15]
           │
           ▼
        MERGE
```

---

## Arquivos Globais

| Arquivo | Descrição |
|---------|-----------|
| [contracts.md](./contracts.md) | Interfaces, tipos e convenções globais |
| [LIBRARIES-REFERENCE.md](./LIBRARIES-REFERENCE.md) | Bibliotecas aprovadas (evita duplicação) |
| [MERGE-STRATEGY.md](./MERGE-STRATEGY.md) | Ordem e estratégia de merge das branches |
| [AGENT-CHECKLIST.md](./AGENT-CHECKLIST.md) | Checklist universal para todos os agentes |
| [REVIEW-10-PERSPECTIVES.md](./REVIEW-10-PERSPECTIVES.md) | Revisão profunda de otimização |
| [Architecting-Plan-01.md](./Architecting-Plan-01.md) | Arquitetura geral (planos 01-10) |
| [Architecting-Plan-02.md](./Architecting-Plan-02.md) | Arquitetura adicional (planos 11-15) |

### Documentos Específicos

| Arquivo | Descrição |
|---------|-----------|
| [06-tarefas-kanban/DRAG-DROP-IMPLEMENTATION.md](./06-tarefas-kanban/DRAG-DROP-IMPLEMENTATION.md) | Implementação de drag & drop para Kanban |

---

## Estrutura de Cada Plano

```
XX-nome-plano/
├── PRD.md           # Product Requirements Document
├── Spec.md          # Especificação técnica
└── dependencies.md  # O que provê e o que consome
```

### PRD.md (O QUE construir)
- Objetivo do módulo
- User stories
- Critérios de aceitação
- Casos de uso
- Mockups/wireframes (se aplicável)

### Spec.md (COMO construir)
- Arquitetura do módulo
- Estrutura de arquivos
- Componentes e telas
- Endpoints utilizados
- Estado/store
- Testes necessários

### dependencies.md (INTEGRAÇÃO)
- O que este plano provê (exports)
- O que este plano consome (imports)
- Contratos com outros planos

---

## Convenções

### Nomenclatura
- Pastas: `kebab-case`
- Componentes: `PascalCase`
- Arquivos TS/TSX: `kebab-case.tsx`
- Hooks: `use-nome.ts`
- Stores: `nome.store.ts`
- Services: `nome.service.ts`

### Branches
- Pattern: `mobile/XX-nome-plano`
- Exemplo: `mobile/01-estrutura-base`

### Commits
- Pattern: `[XX] descrição`
- Exemplo: `[01] setup expo project with theme`

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Expo SDK 52+ |
| UI | React Native + StyleSheet.create (nativo) |
| Navegação | React Navigation 6 |
| Estado | Zustand |
| HTTP | Axios + React Query |
| Forms | React Hook Form + Zod |
| Armazenamento | AsyncStorage + SecureStore |
| Notificações | Expo Notifications |

---

## Backend

- **URL**: Configurável via variável de ambiente
- **Autenticação**: JWT Bearer token
- **Refresh**: Endpoint `/auth/refresh`
- **Documentação**: Swagger em `/api/docs`

O backend permanece **inalterado** no Coolify. O app mobile apenas consome a API existente.

---

## Estratégia de Distribuição

### Fase 1: APK Download (Prioridade)
- APK hospedado na web para download direto
- Zero burocracia, distribuição imediata
- Usuário habilita "Fontes desconhecidas" para instalar

### Fase 2: Google Play Store (Futuro)
- Publicação oficial na loja
- Requer conta desenvolvedor ($25) e closed testing
- Timeline: 17-20 dias (pessoal) ou 3-6 dias (organização)

---

## Critérios de Sucesso

1. App funcional em Android
2. Todas as features core implementadas
3. Performance adequada (< 3s para carregar telas)
4. APK disponível para download na web
5. (Futuro) Publicação na Play Store aprovada
6. Sem regressões no backend/web

---

## Execução com Agentes CLI

Ver **[AGENT-EXECUTION-GUIDE.md](./AGENT-EXECUTION-GUIDE.md)** para prompts prontos.

- **1 branch por plano**: `mobile/XX-nome-plano`
- **1 prompt por agente**: Cada agente lê a documentação e executa
- **Fases 1-3**: Sequenciais (aguardar merge antes do próximo)
- **Fases 4-5**: Paralelas (múltiplos agentes simultaneamente)
- **Fase 6**: Após tudo integrado
