# NCK IA Mobile

Aplicativo mobile da plataforma NCK IA, construido com React Native e Expo.

## Tech Stack

| Tecnologia | Versao |
|---|---|
| Expo SDK | 54 |
| React Native | 0.81.5 |
| React | 19.1.0 |
| TypeScript | 5.9 |
| Zustand | 5 |
| Zod | 4 |
| React Query | 5 |
| React Navigation | 6 |

## Pre-requisitos

- Node.js >= 18
- npm
- [EAS CLI](https://docs.expo.dev/eas/) (`npm install -g eas-cli`)
- Expo Go (para desenvolvimento) ou dev client

## Setup

```bash
cd mobile
npm install
npx expo start
```

## Scripts

| Comando | Descricao |
|---|---|
| `npm start` | Inicia o Metro bundler |
| `npm run android` | Inicia no Android |
| `npm run ios` | Inicia no iOS |
| `npm run web` | Inicia no navegador |
| `npm run lint` | Executa ESLint |
| `npm run format` | Verifica formatacao com Prettier |
| `npm run format:write` | Formata todos os arquivos |
| `npm run typecheck` | Verifica tipos com TypeScript |

## Estrutura do Projeto

```
mobile/
  src/
    components/    # Componentes reutilizaveis e UI
    contexts/      # React contexts
    hooks/         # Custom hooks
    navigation/    # Stacks e configuracao de navegacao
    providers/     # Providers (auth, query, etc.)
    screens/       # Telas organizadas por feature
    services/      # API clients e servicos
    stores/        # Zustand stores
    theme/         # Cores, tipografia, espacamento
    types/         # TypeScript types compartilhados
    utils/         # Funcoes utilitarias
```

## Build (EAS)

```bash
# Preview (APK interno)
eas build --profile preview --platform android

# Producao (AAB para Google Play)
eas build --profile production --platform android

# Development client
eas build --profile development --platform android
```

## Documentacao

Documentacao historica de planejamento e relatorios de cada fase do desenvolvimento esta disponivel em `docs/`.
