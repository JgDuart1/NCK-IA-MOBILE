# Architecting Plan 01 - Transformação Web → Mobile

## Visão Geral

Este documento define a arquitetura completa para transformar o sistema NCK IA de uma aplicação web (Next.js + NestJS) para um aplicativo mobile nativo (Expo/React Native), mantendo o backend existente.

### Princípios Fundamentais

1. **Backend intacto** — A API REST existente será 100% reutilizada
2. **Execução paralela** — Múltiplos agentes trabalham simultaneamente
3. **Documentação como código** — Arquivos .md são a fonte da verdade
4. **Merge ordenado** — Número do plano = ordem do merge

---

## Estratégia de Execução Paralela

### O Desafio
Quando múltiplos agentes rodam simultaneamente, eles não podem depender do output um do outro durante a execução. Cada agente precisa ter contexto completo antes de iniciar.

### A Solução: Contratos + Dependências

```
┌─────────────────────────────────────────────────────────────┐
│                    contracts.md                              │
│         (Interfaces globais, convenções, estrutura)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ Plan 01 │          │ Plan 02 │          │ Plan 03 │
   │ PRD.md  │          │ PRD.md  │          │ PRD.md  │
   │ Spec.md │          │ Spec.md │          │ Spec.md │
   │ deps.md │          │ deps.md │          │ deps.md │
   └─────────┘          └─────────┘          └─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Agente Integrador│
                    │   (Merge Final)  │
                    └─────────────────┘
```

### Como Funciona

1. **Antes da execução**: Todos os agentes leem `contracts.md` + `dependencies.md` dos planos relacionados
2. **Durante a execução**: Cada agente trabalha isoladamente no seu escopo
3. **Após a execução**: Agente integrador faz merge na ordem definida pelos números

---

## Estrutura de Pastas

```
plans/
├── 00-overview.md                 # Mapa geral + índice de todos os planos
├── contracts.md                   # Interfaces globais, tipos, convenções
│
├── 01-estrutura-base/
│   ├── PRD.md                     # Contexto, raciocínio, decisões
│   ├── Spec.md                    # Instruções diretas para o agente
│   └── dependencies.md            # O que cria, o que espera
│
├── 02-auth/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 03-navigation/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 04-dashboard/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 05-projetos/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 06-tarefas-kanban/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 07-sprints/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 08-notas/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 09-calendario/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
├── 10-notificacoes/
│   ├── PRD.md
│   ├── Spec.md
│   └── dependencies.md
│
└── XX-merge-final/
    ├── PRD.md                     # Estratégia de integração
    └── Spec.md                    # Instruções para o agente integrador
```

---

## Convenções de Nomenclatura

### Pastas
- Formato: `NN-nome-do-modulo/` (ex: `01-estrutura-base/`)
- Número com 2 dígitos para ordenação correta (01, 02... 10, 11...)
- Nome em kebab-case, sem acentos

### Arquivos
- `PRD.md` — Product Requirements Document (contexto completo)
- `Spec.md` — Specification (instruções executáveis)
- `dependencies.md` — Mapa de dependências

### Branches (para agentes)
- Formato: `mobile/NN-nome-do-modulo` (ex: `mobile/01-estrutura-base`)
- Cada agente trabalha em sua branch
- Merge final na ordem dos números

---

## Anatomia dos Arquivos

### PRD.md (Product Requirements Document)

```markdown
# [Nome do Módulo] - PRD

## Contexto
Por que esse módulo existe. Qual problema resolve.

## Escopo
O que está incluído e o que NÃO está incluído.

## Funcionalidades
Lista detalhada do que deve ser implementado.

## Referência Web
Como funciona hoje na versão web (arquivos, componentes, fluxos).

## Decisões Técnicas
Escolhas de implementação e justificativas.

## Critérios de Sucesso
Como saber se está pronto.
```

### Spec.md (Specification)

```markdown
# [Nome do Módulo] - Spec

## Objetivo
Uma frase clara do que deve ser feito.

## Pré-requisitos
- Ler: contracts.md
- Ler: [lista de dependencies.md de planos relacionados]

## API Endpoints Utilizados
| Método | Endpoint | Request DTO | Response DTO | Descrição |
|--------|----------|-------------|--------------|-----------|
| GET | /api/v1/example | - | ExampleResponse | Descrição |
| POST | /api/v1/example | CreateExampleDto | ExampleResponse | Descrição |

## Modelos de Dados
```typescript
interface Example {
  id: string;
  name: string;
  // ...
}
```

## Estrutura de Arquivos a Criar
```
mobile/
└── src/
    └── [estrutura específica]
```

## Implementação

### Passo 1: [Nome]
[Instruções diretas e específicas]

### Passo 2: [Nome]
[Instruções diretas e específicas]

...

## Paridade UI/UX
Referência visual da versão web que deve ser mantida:
- [Lista de comportamentos que devem ser idênticos]
- [Adaptações específicas para mobile]

## Validação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3
- [ ] Testes manuais executados
- [ ] Sem erros de TypeScript
- [ ] Lint passou

## Não Fazer
Lista do que está fora do escopo deste plano.
```

### dependencies.md

```markdown
# [Nome do Módulo] - Dependencies

## Cria (Exports)
O que este módulo disponibiliza para outros:

| Item | Tipo | Caminho | Descrição |
|------|------|---------|-----------|
| useAuth | Hook | src/hooks/useAuth.ts | Hook de autenticação |
| Button | Component | src/components/Button.tsx | Botão padrão |

## Espera (Imports)
O que este módulo precisa de outros:

| Item | Vem de | Plano |
|------|--------|-------|
| api | contracts.md | - |
| theme | 01-estrutura-base | 01 |

## Dependências de Merge
Este plano deve ser mergeado APÓS: [lista de números]
```

---

## Fluxo de Trabalho

### Fase 1: Planejamento (Humano + IA)
1. Criar `00-overview.md` com mapa completo
2. Criar `contracts.md` com interfaces globais
3. Criar PRD.md para cada módulo
4. Criar Spec.md para cada módulo
5. Criar dependencies.md para cada módulo
6. Revisar dependências cruzadas

### Fase 2: Execução (Agentes em Paralelo)
1. Cada agente recebe seu Spec.md
2. Agente lê contracts.md + dependencies relacionados
3. Agente cria branch `mobile/NN-nome`
4. Agente implementa conforme Spec.md
5. Agente valida conforme critérios
6. Agente marca como pronto

### Fase 3: Integração (Agente Integrador)
1. Aguarda todos os agentes finalizarem
2. Lê XX-merge-final/Spec.md
3. Faz merge na ordem dos números (01 → 02 → 03...)
4. Resolve conflitos seguindo contracts.md
5. Executa validação global
6. Gera relatório final

---

## Gestão de Dependências Paralelas

### Problema
O plano 05 depende de componentes do plano 01 e 02. Como executar em paralelo?

### Solução: Contratos Antecipados

Antes de qualquer execução, definimos em `contracts.md`:

```typescript
// Estrutura de pastas obrigatória
mobile/
├── src/
│   ├── components/        # Componentes compartilhados
│   ├── hooks/             # Hooks globais
│   ├── services/          # API client, storage
│   ├── navigation/        # Navegação
│   ├── screens/           # Telas
│   ├── theme/             # Cores, tipografia
│   └── types/             # TypeScript types

// Interfaces obrigatórias
interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  // ...
}

interface AuthContext {
  user: User | null;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  // ...
}
```

Cada agente implementa SUA parte seguindo esses contratos. No merge, as peças se encaixam.

---

## Contracts.md - Definição Completa

O arquivo `contracts.md` deve conter definições concretas que TODOS os agentes devem seguir:

### 1. Estrutura de Pastas Obrigatória
```
mobile/
├── app.json
├── App.tsx
├── babel.config.js
├── package.json
├── tsconfig.json
└── src/
    ├── components/           # Componentes reutilizáveis
    │   ├── ui/              # Primitivos (Button, Input, Card...)
    │   └── shared/          # Compostos (Header, TaskCard...)
    ├── hooks/               # Hooks customizados
    ├── services/            # API client, storage, auth
    ├── navigation/          # Configuração de rotas
    ├── screens/             # Telas organizadas por módulo
    │   ├── auth/
    │   ├── dashboard/
    │   ├── projects/
    │   └── ...
    ├── store/               # Estado global (Zustand)
    ├── theme/               # Cores, tipografia, espaçamento
    ├── types/               # TypeScript types/interfaces
    └── utils/               # Funções utilitárias
```

### 2. Tipos Compartilhados (types/)
```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  tenant_id: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// types/project.ts
export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  work_mode: 'SCRUM' | 'KANBAN' | 'SIMPLE';
  color: string | null;
  created_at: string;
}

// types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  project_id: string;
  assignee_id: string | null;
  sprint_id: string | null;
}
```

### 3. API Client Interface
```typescript
// services/api.ts
export interface ApiClient {
  // Configuração
  setAuthToken(token: string): void;
  clearAuthToken(): void;
  
  // Métodos HTTP
  get<T>(url: string, params?: Record<string, any>): Promise<T>;
  post<T>(url: string, data?: any): Promise<T>;
  patch<T>(url: string, data?: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
  
  // Interceptors
  onUnauthorized(callback: () => void): void;
}
```

### 4. Auth Context Interface
```typescript
// services/auth.ts
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
}
```

### 5. Navigation Primitives
```typescript
// navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  MagicLink: { token: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Projects: undefined;
  Calendar: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type ProjectStackParamList = {
  ProjectList: undefined;
  ProjectDetail: { projectId: string };
  TaskDetail: { taskId: string };
  // ...
};
```

### 6. Theme Contract
```typescript
// theme/index.ts
export const colors = {
  primary: '#EF4444',      // Vermelho NCK
  background: '#0F172A',   // Azul escuro
  surface: '#1E293B',      // Azul médio
  text: '#F8FAFC',         // Branco
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
};
```

### 7. Componentes UI Base (Obrigatórios)
Cada agente pode usar estes componentes assumindo que existem:

| Componente | Props | Descrição |
|------------|-------|-----------|
| Button | variant, onPress, disabled, loading | Botão padrão |
| Input | label, value, onChangeText, error | Campo de texto |
| Card | children, onPress? | Container estilizado |
| Avatar | uri, size, fallback | Imagem de perfil |
| Badge | count, variant | Contador/indicador |
| Loader | size, color | Indicador de loading |
| EmptyState | title, description, action? | Estado vazio |

---

## Grafo de Dependências

```
                    ┌─────────────────┐
                    │ 01-estrutura    │
                    │     base        │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌─────────┐    ┌─────────┐    ┌─────────┐
        │ 02-auth │    │         │    │         │
        └────┬────┘    │         │    │         │
             │         │         │    │         │
             ▼         │         │    │         │
        ┌─────────┐    │         │    │         │
        │ 03-nav  │◄───┘         │    │         │
        └────┬────┘              │    │         │
             │                   │    │         │
    ┌────────┼────────┬──────────┘    │
    │        │        │               │
    ▼        ▼        ▼               ▼
┌───────┐┌───────┐┌───────┐     ┌──────────┐
│04-dash││05-proj││09-cal │     │10-notif  │
└───────┘└───┬───┘└───────┘     └──────────┘
             │
      ┌──────┼──────┐
      │      │      │
      ▼      ▼      ▼
  ┌──────┐┌──────┐┌──────┐
  │06-kan││07-spr││08-not│
  └──────┘└──────┘└──────┘
```

### Matriz de Dependências
| Plano | Depende de | Pode rodar após |
|-------|------------|-----------------|
| 01 | - | Imediato |
| 02 | 01 | 01 concluído |
| 03 | 01, 02 | 02 concluído |
| 04 | 01, 02, 03 | 03 concluído |
| 05 | 01, 02, 03 | 03 concluído |
| 06 | 01, 02, 03, 05 | 05 concluído |
| 07 | 01, 02, 03, 05 | 05 concluído |
| 08 | 01, 02, 03, 05 | 05 concluído |
| 09 | 01, 02, 03 | 03 concluído |
| 10 | 01, 02, 03 | 03 concluído |

### Execução Paralela Otimizada
```
Fase 1: [01]                    ← Estrutura base (obrigatório primeiro)
Fase 2: [02]                    ← Auth (depende de 01)
Fase 3: [03]                    ← Navigation (depende de 02)
Fase 4: [04, 05, 09, 10]        ← Paralelo (todos dependem de 03)
Fase 5: [06, 07, 08]            ← Paralelo (todos dependem de 05)
Fase 6: [XX-merge]              ← Integração final
```

---

## Validação e CI

### Checklist de Validação por Módulo
Cada agente deve validar ANTES de marcar como pronto:

```markdown
## Checklist de Validação

### Build
- [ ] `npx expo start` executa sem erros
- [ ] Sem erros de TypeScript (`npx tsc --noEmit`)
- [ ] Lint passa (`npx eslint src/`)

### Funcional
- [ ] Todas as telas renderizam corretamente
- [ ] Navegação funciona
- [ ] API calls funcionam
- [ ] Estados de loading aparecem
- [ ] Estados de erro são tratados

### Integração
- [ ] Imports de outros módulos usam caminhos de contracts.md
- [ ] Tipos compartilhados estão em src/types/
- [ ] Nenhum tipo duplicado foi criado
```

### Gate de Merge (Agente Integrador)
Antes de mergear cada branch:

1. **Pre-merge check**
   ```bash
   # Checkout da branch
   git checkout mobile/NN-modulo
   
   # Verificar build
   cd mobile && npm install && npx expo start --no-dev
   
   # Verificar tipos
   npx tsc --noEmit
   
   # Verificar lint
   npx eslint src/ --max-warnings 0
   ```

2. **Merge**
   ```bash
   git checkout main
   git merge mobile/NN-modulo --no-ff -m "Merge: módulo NN"
   ```

3. **Post-merge validation**
   ```bash
   # Testar build integrado
   cd mobile && npm install && npx expo start
   
   # Verificar se tudo ainda funciona
   ```

### Resolução de Conflitos - Precedência

| Situação | Ação |
|----------|------|
| Conflito em types/ | Usar versão mais completa (unir campos) |
| Conflito em components/ui/ | Usar versão do plano 01 |
| Conflito em theme/ | Usar versão do plano 01 |
| Conflito em services/api | Usar versão do plano 01 |
| Conflito em screens/ | Manter ambas (pastas diferentes) |
| Conflito em navigation | Unir rotas de ambos |

---

## Mapa Inicial dos Planos (Parte 1)

> **Nota**: Planos 11-15 estão documentados em `Architecting-Plan-02.md`

| # | Módulo | Descrição | Depende de | Complexidade |
|---|--------|-----------|------------|--------------|
| 01 | estrutura-base | Projeto Expo, tema, API client, providers, attachments service | - | Alta |
| 02 | auth | Login, logout, refresh token, magic-link, contexto | 01 | Média |
| 03 | navigation | Stack, tabs, rotas protegidas | 01, 02 | Média |
| 04 | dashboard | Tela inicial, resumos, widgets, feed de timeline | 01, 02, 03 | Média |
| 05 | projetos | Lista, criação, detalhes, membros | 01, 02, 03 | Média |
| 06 | tarefas-kanban | Kanban, drag-drop, CRUD tarefas, anexos | 01, 02, 03, 05 | Alta |
| 07 | sprints | Lista, criação, gestão de sprints | 01, 02, 03, 05 | Média |
| 08 | notas | Lista, criação, pastas, versões, anexos | 01, 02, 03, 05 | Média |
| 09 | calendario | Eventos, meeting requests, visualização | 01, 02, 03 | Alta |
| 10 | notificacoes | Lista, push, badges | 01, 02, 03 | Baixa |

**Continua em Architecting-Plan-02.md**: Planos 11-15 + XX-merge-final

---

## Papel do Agente Integrador

### Responsabilidades
1. Fazer merge de todas as branches na ordem correta
2. Resolver conflitos de código
3. Garantir consistência de imports/exports
4. Verificar se contracts.md foi seguido
5. Executar testes de integração
6. Gerar relatório de status

### Estratégia de Merge
```
main
  │
  ├── merge mobile/01-estrutura-base
  │
  ├── merge mobile/02-auth
  │
  ├── merge mobile/03-navigation
  │
  └── ... (na ordem dos números)
```

### Resolução de Conflitos
1. `contracts.md` é a fonte da verdade
2. Em caso de dúvida, usar a implementação do plano com número MENOR
3. Documentar decisões em `XX-merge-final/decisions.md`

---

## Configuração para Ralph-Loop

Cada Spec.md deve incluir no início:

```markdown
## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: mobile/NN-nome
- **Timeout**: [tempo estimado]
- **Arquivos de contexto**:
  - plans/contracts.md
  - plans/NN-nome/dependencies.md
  - [outros dependencies.md relevantes]
```

---

## Próximos Passos

1. [ ] Criar `plans/00-overview.md`
2. [ ] Criar `plans/contracts.md` com interfaces globais
3. [ ] Criar estrutura de pastas para todos os planos
4. [ ] Desenvolver PRD.md para plano 01 (estrutura-base)
5. [ ] Desenvolver Spec.md para plano 01
6. [ ] Iterar para os demais planos

---

## Documentos Relacionados

- **Architecting-Plan-02.md** — Planos adicionais (11-15), deployment mobile, requisitos Play Store

---

## Funcionalidades Transversais

As seguintes funcionalidades são compartilhadas entre múltiplos planos e devem ser consideradas durante a implementação:

| Funcionalidade | Planos que utilizam | Implementação |
|----------------|---------------------|---------------|
| **Attachments (Anexos)** | 06, 08 | Service em 01, UI em 06/08 |
| **Timeline (Histórico)** | 04 | Widget no dashboard |
| **Magic Link** | 02 | Fluxo alternativo de login |
| **Meeting Requests** | 09 | Solicitações de reunião |

### Detalhamento

#### Attachments Service (Plano 01)
- Upload de arquivos (imagem, PDF, etc.)
- Download de anexos
- Visualização inline (imagens)
- Integração com backend existente

#### Timeline Widget (Plano 04)
- Feed de atividades recentes do usuário
- Ações: criação, atualização, comentários
- Filtro por projeto ou global

#### Magic Link (Plano 02)
- Fluxo: email → link → autenticação automática
- Tela de verificação de token
- Fallback para login tradicional

#### Meeting Requests (Plano 09)
- Criar solicitação de reunião
- Aceitar/recusar convites
- Reagendar reuniões
- Integração com calendário

---

## Changelog

| Data | Versão | Descrição |
|------|--------|-----------|
| 2026-02-05 | 1.0 | Versão inicial da arquitetura |
| 2026-02-05 | 1.1 | Ajuste do mapa de planos, remoção do GitNCK, referência ao Plan-02 |
| 2026-02-05 | 1.2 | Adição de funcionalidades transversais: attachments, timeline, magic-link, meeting requests |
