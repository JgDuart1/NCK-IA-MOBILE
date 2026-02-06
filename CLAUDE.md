# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NCK IA Mobile — React Native/Expo mobile app (SDK 54) for the NCK IA platform. TypeScript strict mode. Dark theme only. Portuguese (pt-BR) UI strings.

## Commands

All commands run from `mobile/`:

```bash
npm start                # Metro bundler
npm run android          # Start on Android
npm run ios              # Start on iOS
npm run lint             # ESLint
npm run format           # Prettier check
npm run format:write     # Prettier auto-fix
npm run typecheck        # tsc --noEmit
```

EAS builds:

```bash
eas build --profile preview --platform android      # Internal APK
eas build --profile production --platform android    # AAB for Google Play
eas build --profile development --platform android   # Dev client
```

## Architecture

### Path Alias

`@/` maps to `mobile/src/` (configured in tsconfig, babel module-resolver, and metro).

### Provider Hierarchy

```
GestureHandlerRootView → SafeAreaProvider → QueryProvider → ThemeProvider → ToastProvider → AuthProvider → RootNavigator
```

### Navigation

React Navigation 6 with auth-gated routing:
- **RootNavigator** — shows `AuthStack` or `MainTabs` based on `isAuthenticated` from auth store
- **MainTabs** — 5 bottom tabs: Dashboard, Projects, Calendar, Notifications, More
- Each tab has its own native stack navigator in `src/navigation/stacks/`
- Deep linking configured in `src/navigation/linking.ts` (scheme: `nckia://`, host: `*.nckia.com.br`)
- Navigation param types defined in `src/navigation/types.ts`

### State Management

- **Zustand** stores in `src/stores/` — auth, notification, project, theme
- **React Query** (`@tanstack/react-query`) for server state — 5min stale time, 30min cache, single retry
- Auth store is wrapped in `AuthProvider` context for initialization lifecycle

### API Layer

Axios-based client in `src/services/api/`:
- Base URL from `EXPO_PUBLIC_API_URL` env var (default: `http://localhost:3000/api/v1`)
- Request interceptor adds Bearer token from `expo-secure-store`
- Response interceptor handles 401 with automatic token refresh and request queue
- Each domain has its own API module (auth, projects, tasks, sprints, notes, events, canvas, caverna, etc.)

### Custom Hooks

`src/hooks/` — each hook wraps React Query calls for a domain (e.g., `use-projects.ts` exports `useProjects`, `useProject`, `useCreateProject` etc.). Mutations invalidate relevant query keys.

### Tokens & Auth Flow

- Tokens stored via `expo-secure-store` (keys: `nckia_access_token`, `nckia_refresh_token`)
- Auth init: check stored token → validate via `/auth/me` → route to auth or main
- Login methods: email/password, magic link

### Theme/Design System

`src/theme/` — colors (primary: indigo `#6366F1`), spacing scale, typography. Dark-only theme.

## Code Conventions

- Prettier: single quotes, trailing commas, 100 char width
- ESLint: expo + prettier configs
- Barrel exports via `index.ts` in each directory
- Screens receive `NativeStackScreenProps` typed navigation props
- Components use `StyleSheet.create()` for styles
- Form validation with `react-hook-form` + `zod` (resolver in `src/utils/zod-resolver.ts`)
- `reanimated/plugin` must be last in babel plugins list
