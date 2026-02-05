# Architecting Plan 02 - Planos Adicionais e Deployment

## Visão Geral

Este documento complementa o `Architecting-Plan-01.md` com os planos adicionais (11-15) identificados após análise completa do sistema, além do plano de deployment para publicação na Play Store.

### Referência

- **Documento base**: `Architecting-Plan-01.md` — Estratégia geral, templates, contracts, fluxo de trabalho
- **Este documento**: Planos 11-15, deployment mobile, requisitos da Play Store

---

## Planos Adicionais (11-15)

### Estrutura de Pastas Completa

```
plans/
├── 00-overview.md
├── contracts.md
│
├── 01-estrutura-base/          # Plan-01
├── 02-auth/
├── 03-navigation/
├── 04-dashboard/
├── 05-projetos/
├── 06-tarefas-kanban/
├── 07-sprints/
├── 08-notas/
├── 09-calendario/
├── 10-notificacoes/
│
├── 11-business-model-canvas/
├── 12-caverna-dragao/
├── 13-usuarios-perfil/
├── 14-configuracoes/
├── 15-deployment-mobile/
│
└── XX-merge-final/
```

---

## Mapa dos Planos Adicionais

| # | Módulo | Descrição | Depende de | Complexidade |
|---|--------|-----------|------------|--------------|
| 11 | business-model-canvas | Canvas de modelo de negócio, blocos, experimentos | 01, 02, 03, 05 | Alta |
| 12 | caverna-dragao | Sistema de reservas, tickets, check-in | 01, 02, 03 | Média |
| 13 | usuarios-perfil | Perfil, avatar, senha, convites de usuários | 01, 02, 03 | Baixa |
| 14 | configuracoes | Configurações do app, tenant, preferências | 01, 02, 03 | Baixa |
| 15 | deployment-mobile | Build, assets, publicação Play Store | Todos (01-14) | Alta |
| XX | merge-final | Integração de todas as branches | Todos | Alta |

---

## Detalhamento dos Planos

### Plano 11: Business Model Canvas

#### Contexto
O Business Model Canvas é uma ferramenta para visualizar e planejar modelos de negócio. Cada projeto pode ter um ou mais canvas associados.

#### Funcionalidades
- Visualização dos 9 blocos do canvas
- Edição inline de cada bloco
- Lista de assumptions (suposições)
- Lista de experiments (experimentos)
- Histórico de análises

#### API Endpoints
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/canvas | Listar canvas do projeto |
| GET | /api/v1/canvas/:id | Obter canvas específico |
| POST | /api/v1/canvas | Criar novo canvas |
| PATCH | /api/v1/canvas/:id | Atualizar canvas |
| POST | /api/v1/canvas/assist | Análise assistida (IA) |

#### Telas Mobile
- `CanvasListScreen` — Lista de canvas do projeto
- `CanvasDetailScreen` — Visualização do canvas com blocos
- `CanvasBlockEditScreen` — Edição de um bloco específico

#### Dependências
- Depende de: 01, 02, 03, 05 (precisa de projeto selecionado)
- Complexidade: Alta (layout complexo dos 9 blocos em mobile)

---

### Plano 12: Caverna do Dragão

#### Contexto
Sistema de reservas de espaço físico ("Caverna do Dragão"). Usuários têm tickets semanais e podem reservar períodos (manhã/tarde).

#### Funcionalidades
- Ver saldo de tickets
- Fazer reserva (data + período)
- Cancelar reserva (devolve ticket)
- Check-in no local
- Ver ocupação do dia
- Histórico de reservas

#### API Endpoints
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/caverna-dragao/settings | Configurações do sistema |
| GET | /api/v1/caverna-dragao/tickets/my | Meus tickets |
| POST | /api/v1/caverna-dragao/reservations | Criar reserva |
| GET | /api/v1/caverna-dragao/reservations/my | Minhas reservas |
| POST | /api/v1/caverna-dragao/reservations/:id/cancel | Cancelar reserva |
| POST | /api/v1/caverna-dragao/reservations/:id/checkin | Fazer check-in |
| GET | /api/v1/caverna-dragao/occupancy | Ver ocupação |

#### Telas Mobile
- `CavernaHomeScreen` — Saldo de tickets + próximas reservas
- `CavernaReservarScreen` — Calendário para selecionar data/período
- `CavernaMinhasReservasScreen` — Lista de reservas com ações

#### Dependências
- Depende de: 01, 02, 03
- Complexidade: Média

---

### Plano 13: Usuários e Perfil

#### Contexto
Tela de perfil do usuário logado, com edição de dados pessoais, avatar e gestão de convites.

#### Funcionalidades
- Visualizar dados do perfil
- Editar nome
- Alterar avatar (upload de imagem)
- Alterar senha
- Ver informações do tenant
- **Convidar novos usuários** (se tiver permissão)
- **Ver lista de convites pendentes**

#### API Endpoints
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/auth/me | Dados do usuário logado |
| PATCH | /api/v1/users/:id | Atualizar usuário |
| POST | /api/v1/users/change-password | Alterar senha |
| POST | /api/v1/users/invite | Enviar convite por email |
| GET | /api/v1/users/invites | Listar convites pendentes |
| DELETE | /api/v1/users/invites/:id | Cancelar convite |

#### Telas Mobile
- `ProfileScreen` — Visualização do perfil
- `EditProfileScreen` — Edição de dados
- `ChangePasswordScreen` — Formulário de alteração de senha
- `InviteUserScreen` — Formulário para convidar usuário (admin)
- `PendingInvitesScreen` — Lista de convites pendentes (admin)

#### Dependências
- Depende de: 01, 02, 03
- Complexidade: Baixa

---

### Plano 14: Configurações

#### Contexto
Tela de configurações gerais do aplicativo.

#### Funcionalidades
- Configurações do app (tema, notificações)
- Informações do tenant
- Logout
- Versão do app
- Links úteis (suporte, termos, privacidade)

#### Telas Mobile
- `SettingsScreen` — Lista de opções de configuração
- `AboutScreen` — Sobre o app, versão, links

#### Dependências
- Depende de: 01, 02, 03
- Complexidade: Baixa

---

### Plano 15: Deployment Mobile

#### Contexto
Configuração completa para build e publicação do app na Google Play Store.

#### Escopo
- Configuração do Expo EAS
- Assets obrigatórios (ícone, splash, screenshots)
- Configuração do app.json/app.config.js
- Política de privacidade
- Formulário Data Safety
- Build de produção
- Submissão para a loja

---

## Requisitos da Google Play Store

### Checklist de Assets Obrigatórios

| Asset | Especificação | Status |
|-------|---------------|--------|
| Ícone do app | 512x512 PNG, sem transparência | [ ] |
| Feature graphic | 1024x500 PNG/JPG | [ ] |
| Screenshots (phone) | Mínimo 2, máximo 8 | [ ] |
| Screenshots (tablet) | Opcional, mas recomendado | [ ] |
| Ícone adaptativo | Foreground + Background | [ ] |
| Splash screen | Configurado no app.json | [ ] |

### Configuração do app.json

```json
{
  "expo": {
    "name": "NCK IA",
    "slug": "nck-ia",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F172A"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nckia.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "package": "com.nckia.app",
      "versionCode": 1,
      "permissions": []
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### Configuração do eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### Requisitos Técnicos (2025)

| Requisito | Valor | Nota |
|-----------|-------|------|
| Target API Level | 35 (Android 15) | Obrigatório a partir de Ago/2025 |
| Formato | AAB (Android App Bundle) | APK não aceito para novos apps |
| Play App Signing | Ativado | Obrigatório |
| 64-bit support | Sim | Obrigatório |

### Política de Privacidade

**Obrigatória** se o app coleta qualquer dado do usuário.

Conteúdo mínimo:
- Quais dados são coletados
- Como os dados são usados
- Com quem os dados são compartilhados
- Como o usuário pode solicitar exclusão
- Informações de contato

**Hospedagem**: URL pública acessível (pode ser página no site principal)

### Formulário Data Safety

O Google exige declaração de:

| Categoria | O que declarar |
|-----------|----------------|
| Dados coletados | Email, nome, foto de perfil |
| Propósito | Funcionalidade do app, gerenciamento de conta |
| Compartilhamento | Não compartilhado com terceiros |
| Segurança | Dados criptografados em trânsito |
| Exclusão | Usuário pode solicitar exclusão |

### Processo de Build e Submissão

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login no Expo
eas login

# 3. Configurar projeto
eas build:configure

# 4. Build de preview (APK para testes)
eas build --platform android --profile preview

# 5. Build de produção (AAB)
eas build --platform android --profile production

# 6. Submeter para a Play Store
eas submit --platform android --profile production
```

### Requisito Especial: Contas Pessoais (após Nov 2023)

> **ATENÇÃO**: Se a conta do Google Play Console for do tipo **Pessoal** (não Organização), existe um requisito adicional obrigatório:

| Requisito | Detalhes |
|-----------|----------|
| **Closed Testing** | O app deve passar por teste fechado antes da publicação |
| **Número de testers** | Mínimo 12 testers reais |
| **Duração** | Os testers devem usar o app por pelo menos 14 dias |
| **Verificação de dispositivo** | Conta deve ser verificada via app Play Console em um Android |

**Recomendação**: Se possível, criar conta como **Organização** (requer CNPJ/D-U-N-S) para evitar esse requisito.

### Timeline Esperada

| Etapa | Tempo |
|-------|-------|
| Configurar assets | 1-2 horas |
| Configurar EAS | 30 min |
| Primeiro build | 15-30 min |
| Criar conta Play Console | 3 min + aprovação (até 2 dias) |
| **Closed testing (contas pessoais)** | **14 dias obrigatórios** |
| Submeter app | 30 min |
| Review do Google | 1-7 dias (geralmente 1-3) |
| **Total (conta organização)** | **3-10 dias** |
| **Total (conta pessoal)** | **17-24 dias** (inclui closed testing) |

---

## Grafo de Dependências Atualizado

```
                         ┌─────────────────┐
                         │ 01-estrutura    │
                         │     base        │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    02-auth      │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  03-navigation  │
                         └────────┬────────┘
                                  │
     ┌──────────┬─────────┬───────┼───────┬─────────┬──────────┐
     │          │         │       │       │         │          │
     ▼          ▼         ▼       ▼       ▼         ▼          ▼
┌────────┐┌────────┐┌────────┐┌──────┐┌──────┐┌────────┐┌────────┐
│04-dash ││05-proj ││09-cal  ││10-ntf││12-cav││13-perfl││14-cfg  │
└────────┘└───┬────┘└────────┘└──────┘└──────┘└────────┘└────────┘
              │                  
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
    ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│06-kan │ │07-spr │ │08-not │ │11-canv│
└───────┘ └───────┘ └───────┘ └───────┘
    │         │         │         │
    └─────────┴─────────┴─────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  15-deployment  │
         │ (aguarda 01-14) │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   XX-merge      │
         └─────────────────┘
```

**Legenda**:
- Fase 4 (paralelo): 04, 05, 09, 10, 12, 13, 14
- Fase 5 (paralelo, dependem de 05): 06, 07, 08, 11
- Fase 6 (sequencial): 15 (aguarda todos 01-14)
- Fase 7 (sequencial): XX-merge

### Matriz de Dependências Completa

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
| 11 | 01, 02, 03, 05 | 05 concluído |
| 12 | 01, 02, 03 | 03 concluído |
| 13 | 01, 02, 03 | 03 concluído |
| 14 | 01, 02, 03 | 03 concluído |
| 15 | 01-14 | Todos concluídos |
| XX | 01-15 | 15 concluído |

### Fases de Execução Paralela Otimizada

```
Fase 1: [01]                              ← Estrutura base (obrigatório primeiro)
Fase 2: [02]                              ← Auth (depende de 01)
Fase 3: [03]                              ← Navigation (depende de 02)
Fase 4: [04, 05, 09, 10, 12, 13, 14]      ← Paralelo (7 agentes)
Fase 5: [06, 07, 08, 11]                  ← Paralelo (4 agentes, dependem de 05)
Fase 6: [15]                              ← Deployment config (AGUARDA todas as fases 1-5)
Fase 7: [XX-merge]                        ← Integração final
```

> **Importante**: O Plano 15 (deployment) só pode iniciar após TODOS os planos 01-14 estarem concluídos, pois precisa do app completo para build e publicação.

**Total de agentes paralelos máximo**: 7 (na Fase 4)

---

## Plano XX: Merge Final

### Responsabilidades do Agente Integrador

1. Aguardar todos os planos (01-15) finalizarem
2. Fazer merge na ordem numérica
3. Resolver conflitos seguindo `contracts.md`
4. Executar validação completa:
   - Build sem erros
   - TypeScript sem erros
   - Lint sem warnings
   - Todas as telas navegáveis
5. Gerar relatório final
6. Preparar para submissão

### Ordem de Merge

```
1.  mobile/01-estrutura-base
2.  mobile/02-auth
3.  mobile/03-navigation
4.  mobile/04-dashboard
5.  mobile/05-projetos
6.  mobile/06-tarefas-kanban
7.  mobile/07-sprints
8.  mobile/08-notas
9.  mobile/09-calendario
10. mobile/10-notificacoes
11. mobile/11-business-model-canvas
12. mobile/12-caverna-dragao
13. mobile/13-usuarios-perfil
14. mobile/14-configuracoes
15. mobile/15-deployment-mobile
```

### Validação Pós-Merge

```bash
# Instalar dependências
cd mobile && npm install

# Verificar tipos
npx tsc --noEmit

# Verificar lint
npx eslint src/ --max-warnings 0

# Build de desenvolvimento
npx expo start

# Build de produção (preview)
eas build --platform android --profile preview
```

---

## Configuração do Backend para Mobile

### O que NÃO muda
- Backend continua no Coolify
- Mesma API REST
- Mesma autenticação JWT
- Mesmo banco de dados

### O que precisa configurar

#### 1. URL da API no app mobile

```typescript
// mobile/src/services/api.ts
const API_URL = __DEV__ 
  ? 'http://192.168.x.x:3000'  // IP local para desenvolvimento
  : 'https://seu-dominio.com.br';  // Produção (Coolify)
```

#### 2. CORS no backend (se necessário)

O backend já está configurado para aceitar origens via `CORS_ORIGINS`. Para mobile, as requisições vêm do próprio app (não de um domínio), então geralmente não há problemas de CORS.

#### 3. Variáveis de ambiente no app

```typescript
// mobile/app.config.js
export default {
  expo: {
    // ...
    extra: {
      apiUrl: process.env.API_URL || 'https://seu-dominio.com.br',
    },
  },
};
```

---

## Resumo Executivo

| Aspecto | Valor |
|---------|-------|
| Total de planos | 15 + merge final |
| Planos neste documento | 5 (11-15) |
| Máximo de agentes paralelos | 7 |
| Fases de execução | 7 |
| Tempo estimado (desenvolvimento) | 2-4 semanas |
| Tempo estimado (publicação) | 3-10 dias |

---

## Módulos Não Portados para Mobile

Os seguintes módulos do backend **não** terão interface mobile:

| Módulo | Razão |
|--------|-------|
| **github** (GitNCK) | Removido do escopo conforme solicitado |
| **tenants** | Gestão via painel admin web, não mobile |
| **permissions** | Gerenciado pelo backend, sem UI específica |
| **webhook-config** | Funcionalidade avançada para admin web |

> **Nota**: Estes módulos continuam funcionando no backend e podem ser acessados pelo frontend web existente.

---

## Changelog

| Data | Versão | Descrição |
|------|--------|-----------|
| 2026-02-05 | 1.0 | Versão inicial — Planos 11-15 e deployment |
| 2026-02-05 | 1.1 | Adição de convites ao Plano 13, documentação de módulos não portados |
