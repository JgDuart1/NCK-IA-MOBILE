# Plano 15: Deployment Mobile - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/15-deployment`
- **Timeout**: 3 horas
- **Dependências**: **Todos** os planos 01-14 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Fase 1: APK Download (Prioridade)

### Build do APK

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Build APK (profile preview gera .apk)
eas build --platform android --profile preview

# Após build, baixar APK do dashboard Expo
# Ou usar: eas build:list --platform android --status finished
```

### Hospedagem do APK

#### Opção A: Coolify (Recomendado)

```bash
# Estrutura no servidor
/var/www/downloads/
├── nck-ia-v1.0.0.apk
├── index.html           # Página de download
└── latest.json          # Metadata da versão atual
```

**Importante:**
- Hospede o APK via **HTTPS** para evitar alertas de segurança no Android
- No Android 8+, a permissão de "Fontes desconhecidas" é **por app** (usuário habilita no navegador/gerenciador de arquivos que está instalando)

**Página de Download (index.html):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download NCK IA</title>
  <style>
    body { font-family: system-ui; background: #0F172A; color: #F8FAFC; text-align: center; padding: 40px 20px; }
    .container { max-width: 400px; margin: 0 auto; }
    .logo { font-size: 48px; margin-bottom: 20px; }
    h1 { margin-bottom: 8px; }
    .version { color: #94A3B8; margin-bottom: 32px; }
    .download-btn { display: inline-block; background: #6366F1; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 18px; }
    .download-btn:hover { background: #4F46E5; }
    .instructions { margin-top: 32px; text-align: left; background: #1E293B; padding: 20px; border-radius: 12px; }
    .instructions h3 { margin-top: 0; }
    .instructions ol { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🚀</div>
    <h1>NCK IA</h1>
    <p class="version">Versão 1.0.0 • Android</p>
    <a href="./nck-ia-v1.0.0.apk" class="download-btn" id="downloadBtn">
      ⬇️ Baixar APK
    </a>
    <div class="instructions">
      <h3>Como instalar:</h3>
      <ol>
        <li>Baixe o arquivo APK</li>
        <li>Abra o arquivo baixado</li>
        <li>Se solicitado, permita instalação de "Fontes desconhecidas"</li>
        <li>Toque em "Instalar"</li>
        <li>Após instalação, abra o app</li>
      </ol>
    </div>
  </div>
  <script>
    fetch('./latest.json')
      .then(r => r.json())
      .then(data => {
        document.querySelector('.version').textContent = `Versão ${data.version} • Android`;
        document.getElementById('downloadBtn').href = `./${data.filename}`;
      })
      .catch(() => {});
  </script>
</body>
</html>
```

**Metadata (latest.json):**

```json
{
  "version": "1.0.0",
  "versionCode": 1,
  "filename": "nck-ia-v1.0.0.apk",
  "releaseDate": "2026-02-05",
  "changelog": "Versão inicial do app mobile",
  "minAndroidVersion": "8.0",
  "fileSize": "45MB"
}
```

#### Opção B: Cloudflare R2 / S3

```bash
# Upload via CLI
aws s3 cp ./nck-ia-v1.0.0.apk s3://nckia-downloads/android/

# URL pública
https://downloads.nckia.com.br/android/nck-ia-v1.0.0.apk
```

### Atualização de Versões

```bash
# 1. Incrementar versão no app.json
# version: "1.1.0", versionCode: 2

# 2. Build nova versão
eas build --platform android --profile preview

# 3. Renomear arquivo
mv build.apk nck-ia-v1.1.0.apk

# 4. Upload para hospedagem
scp nck-ia-v1.1.0.apk user@server:/var/www/downloads/

# 5. Atualizar latest.json
```

### Verificação de Atualizações (No App)

```typescript
// hooks/use-check-update.ts
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

const UPDATE_URL = 'https://download.nckia.com.br/latest.json';

export function useCheckUpdate() {
  useEffect(() => {
    checkForUpdate();
  }, []);
}

async function checkForUpdate() {
  try {
    const response = await fetch(UPDATE_URL);
    const latest = await response.json();
    const currentVersion = Constants.expoConfig?.version || '0.0.0';
    
    if (compareVersions(latest.version, currentVersion) > 0) {
      Alert.alert(
        'Atualização Disponível',
        `Versão ${latest.version} está disponível.\n\n${latest.changelog}`,
        [
          { text: 'Depois', style: 'cancel' },
          { text: 'Atualizar', onPress: () => Linking.openURL(UPDATE_URL.replace('latest.json', latest.filename)) }
        ]
      );
    }
  } catch (error) {
    // Silently fail - user can check manually
  }
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (partsA[i] > partsB[i]) return 1;
    if (partsA[i] < partsB[i]) return -1;
  }
  return 0;
}
```

---

## Fase 2: Google Play Store (Preparação)

> Deixar configurado mas executar apenas quando decidir publicar na loja.

---

## Estrutura de Assets

```
mobile/
├── assets/
│   ├── icon.png              # 1024x1024, será redimensionado
│   ├── adaptive-icon.png     # 1024x1024, foreground
│   ├── splash.png            # 1284x2778 (ou SVG)
│   ├── notification-icon.png # 96x96, monocromático
│   └── images/
│       └── logo.png
│
├── store-assets/             # Assets para Play Store
│   ├── icon-512.png          # 512x512
│   ├── feature-graphic.png   # 1024x500
│   ├── screenshots/
│   │   ├── phone/
│   │   │   ├── 01-dashboard.png
│   │   │   ├── 02-projects.png
│   │   │   ├── 03-kanban.png
│   │   │   ├── 04-calendar.png
│   │   │   └── 05-notes.png
│   │   └── tablet/
│   │       └── ...
│   └── descriptions/
│       ├── short.txt
│       └── full.txt
│
├── app.json
├── eas.json
├── .env.production
└── google-services.json      # Para push notifications
```

---

## Configurações

### 1. app.json Completo

```json
{
  "expo": {
    "name": "NCK IA",
    "slug": "nck-ia-mobile",
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
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "package": "com.nckia.mobile",
      "versionCode": 1,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.VIBRATE"
      ],
      "googleServicesFile": "./google-services.json",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.nckia.com.br",
              "pathPrefix": "/app"
            },
            {
              "scheme": "nckia"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#6366F1",
          "sounds": []
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Permitir acesso às fotos para anexar arquivos."
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Permitir acesso à câmera para tirar fotos."
        }
      ],
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ],
      "expo-secure-store",
      "expo-file-system"
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    },
    "owner": "nckia"
  }
}
```

### 2. eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.nckia.com.br/api/v1"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.nckia.com.br/api/v1"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 3. Variáveis de Ambiente

```bash
# .env.production
EXPO_PUBLIC_API_URL=https://api.nckia.com.br/api/v1
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

---

## Comandos de Build

### Desenvolvimento

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build de desenvolvimento (requer Expo Dev Client)
eas build --platform android --profile development
```

### Preview (APK para testers)

```bash
# Gera APK instalável diretamente
eas build --platform android --profile preview

# Download do APK após build
eas build:list --platform android --status finished
```

### Produção (AAB para Play Store)

```bash
# Gera Android App Bundle
eas build --platform android --profile production
```

### Submissão

```bash
# Submeter para Play Store (track internal)
eas submit --platform android --profile production

# Ou especificar o build
eas submit --platform android --id BUILD_ID
```

---

## Google Play Console Setup

### 1. Criar App
1. Acessar Google Play Console
2. "Create app"
3. Preencher nome, idioma, tipo (App), categoria

### 2. Configurar Listagem
- Título, descrições
- Ícone, screenshots
- Categoria e tags
- Contato e política de privacidade

### 3. Closed Testing (Contas Pessoais)
1. Criar track de internal testing
2. Adicionar 12+ testers (emails)
3. Enviar primeiro build
4. Testers devem aceitar convite e baixar app
5. Manter por 14 dias

### 4. Revisão de Conteúdo
- Preencher questionário de classificação
- Declarar permissões e uso de dados
- Política de privacidade

### 5. Publicação
- Após 14 dias de testing (pessoal) ou imediatamente (organização)
- Enviar para review de produção
- Aguardar aprovação (1-3 dias)

---

## Checklist de Pré-Submissão

### App
- [ ] Versão 1.0.0 configurada
- [ ] versionCode = 1
- [ ] Package name correto
- [ ] Ícones em todas as resoluções
- [ ] Splash screen configurada
- [ ] Deep links funcionando
- [ ] Push notifications configuradas
- [ ] Permissões mínimas necessárias

### Build
- [ ] Build de produção sem erros
- [ ] APK/AAB testado em dispositivo real
- [ ] Tamanho do app < 100MB
- [ ] ProGuard/R8 habilitado (via Expo)

### Play Store
- [ ] Todas as informações preenchidas
- [ ] Screenshots de qualidade
- [ ] Política de privacidade publicada
- [ ] Questionário de classificação completo
- [ ] Declaração de uso de dados

---

## Monitoramento Pós-Launch

### Sentry (Opcional)

```bash
# Instalar
npx expo install @sentry/react-native

# Configurar em App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: false,
});
```

### Analytics (Opcional)

```bash
# Firebase Analytics
npx expo install expo-firebase-analytics
```

---

## Atualizações OTA

Para atualizações rápidas sem passar pela Play Store:

```bash
# Configurar EAS Update
eas update:configure

# Publicar update
eas update --branch production --message "Fix: bug description"
```

**Limitações OTA:**
- Apenas código JS/TS e assets
- Não pode alterar código nativo
- Não pode alterar permissões

---

## Incremento de Versão

Para cada nova release:

```json
// app.json
{
  "version": "1.1.0",  // Semver
  "android": {
    "versionCode": 2   // Incrementar sempre
  }
}
```

---

## Testes Finais

### Smoke Tests
1. [ ] Instalar APK em dispositivo limpo
2. [ ] Fazer login
3. [ ] Navegar por todas as tabs
4. [ ] Criar uma tarefa
5. [ ] Receber notificação
6. [ ] Fazer logout

### Performance Tests
1. [ ] Medir cold start
2. [ ] Verificar uso de memória
3. [ ] Testar em dispositivo low-end

### Regression Tests
1. [ ] Testar todos os fluxos principais
2. [ ] Verificar deep links
3. [ ] Testar modo offline (graceful degradation)
