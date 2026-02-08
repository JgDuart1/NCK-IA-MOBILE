# Plano 15: Deployment Mobile - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/15-deployment`
- **Timeout**: 3 horas
- **Dependências**: **Todos** os planos 01-14 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Preparar o app para distribuição:
1. **Fase 1 (Prioridade)**: Distribuição via APK Download (Web)
2. **Fase 2 (Futuro)**: Publicação na Google Play Store

---

## Estratégia de Distribuição

### Fase 1: APK Download (Prioridade)

| Aspecto | Detalhes |
|---------|----------|
| Método | APK hospedado na web para download direto |
| Vantagens | Zero burocracia, distribuição imediata |
| Requisito usuário | Habilitar "Fontes desconhecidas" no Android |
| Hospedagem | Coolify, S3, Cloudflare R2, ou qualquer CDN |

### Fase 2: Google Play Store (Futuro)

| Aspecto | Detalhes |
|---------|----------|
| Método | Publicação oficial na loja |
| Vantagens | Atualizações automáticas, confiança do usuário |
| Requisitos | Conta desenvolvedor ($25), closed testing 14 dias |
| Timeline | 17-20 dias (pessoal) ou 3-6 dias (organização)

---

## Requisitos Play Store

### Conta de Desenvolvedor
- Conta Google Play Console ($25 taxa única)
- **Contas pessoais**: 14 dias de closed testing com 12+ testers
- **Contas organizacionais**: Podem publicar diretamente

### Assets Necessários

| Asset | Especificação |
|-------|---------------|
| Ícone do app | 512x512 PNG |
| Feature graphic | 1024x500 PNG |
| Screenshots | Mínimo 2, até 8 por tipo de dispositivo |
| Ícone adaptativo | Foreground + Background |
| Splash screen | PNG ou SVG |

### Informações da Listagem

| Campo | Descrição |
|-------|-----------|
| Nome do app | NCK IA |
| Descrição curta | Até 80 caracteres |
| Descrição completa | Até 4000 caracteres |
| Categoria | Business / Productivity |
| Política de privacidade | URL obrigatória |
| Contato | Email de suporte |

---

## Checklist de Preparação

### 1. Configuração do app.json

```json
{
  "expo": {
    "name": "NCK IA",
    "slug": "nck-ia-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F172A"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "package": "com.nckia.mobile",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#6366F1"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "O app precisa acessar suas fotos para anexos."
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "O app precisa acessar a câmera para tirar fotos."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 2. Configuração EAS Build

```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
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
        "serviceAccountKeyPath": "./path-to-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 3. Variáveis de Ambiente

```
# .env.production
EXPO_PUBLIC_API_URL=https://api.nckia.com.br/api/v1
```

---

## Fluxo de Build

### 1. Build de Desenvolvimento
```bash
eas build --platform android --profile development
```

### 2. Build de Preview (APK)
```bash
eas build --platform android --profile preview
```

### 3. Build de Produção (AAB)
```bash
eas build --platform android --profile production
```

### 4. Submissão
```bash
eas submit --platform android --profile production
```

---

## Testes Pré-Publicação

### Testes Funcionais
- [ ] Login/logout funcionando
- [ ] Todas as telas acessíveis
- [ ] Navegação correta
- [ ] Dados carregando corretamente
- [ ] Formulários validando
- [ ] Anexos funcionando
- [ ] Notificações chegando

### Testes de Performance
- [ ] Cold start < 3 segundos
- [ ] Transições suaves
- [ ] Sem travamentos
- [ ] Memória estável

### Testes de Compatibilidade
- [ ] Android 8+ (API 26)
- [ ] Diferentes tamanhos de tela
- [ ] Modo escuro
- [ ] Orientação retrato

---

## Descrição da Listagem

### Título
```
NCK IA - Gestão de Projetos
```

### Descrição Curta
```
Gerencie projetos, tarefas e sprints do seu time em qualquer lugar.
```

### Descrição Completa
```
NCK IA é a solução completa para gestão de projetos e tarefas da sua equipe.

PRINCIPAIS RECURSOS:

📋 GESTÃO DE PROJETOS
• Crie e organize projetos
• Acompanhe o progresso
• Gerencie membros da equipe

✅ TAREFAS E KANBAN
• Visualização em Kanban
• Arraste e solte tarefas
• Defina prioridades e responsáveis

🏃 SPRINTS
• Planejamento de sprints
• Acompanhamento de progresso
• Gestão ágil simplificada

📝 NOTAS
• Crie e organize notas
• Anexe arquivos
• Histórico de versões

📅 CALENDÁRIO
• Eventos e reuniões
• Lembretes
• Integração com projetos

🔔 NOTIFICAÇÕES
• Alertas em tempo real
• Push notifications
• Mantenha-se atualizado

💡 BUSINESS CANVAS
• Crie modelos de negócio
• Valide hipóteses
• Experimentos

Desenvolvido para times que valorizam produtividade e organização.
```

---

## Timeline Estimada

| Etapa | Duração |
|-------|---------|
| Preparação de assets | 1 dia |
| Build de produção | 30 min |
| Testes internos | 2 dias |
| Closed testing (pessoal) | 14 dias |
| Revisão Google | 1-3 dias |
| **Total (pessoal)** | **17-20 dias** |
| **Total (organização)** | **3-6 dias** |

---

## Pós-Publicação

### Monitoramento
- Crash reports via Sentry/Crashlytics
- Analytics de uso
- Reviews da Play Store

### Atualizações
- Usar EAS Update para hotfixes
- Incrementar versionCode a cada release
- Changelog em cada versão
