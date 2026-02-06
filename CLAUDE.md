# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NCK IA Mobile — React Native/Expo mobile app (SDK 54, New Architecture enabled) for the NCK IA platform. TypeScript strict mode. Dark theme only. Portuguese (pt-BR) UI strings. Package: `com.nckia.mobile`.

Key versions: React Native 0.81.5, React 19.1, Zustand 5, Zod 4, React Query 5, React Navigation 6.

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

QueryProvider: 5min stale time, 30min GC time, 1 retry, `refetchOnWindowFocus: false`.

### Navigation

React Navigation 6 with auth-gated routing:
- **RootNavigator** — shows `AuthStack` or `MainTabs` based on `isAuthenticated` from auth store. Waits for `isInitialized` before rendering.
- **AuthStack** — Login + magic link flow (4 screens)
- **MainTabs** — 5 bottom tabs: Dashboard, Projects, Calendar, Notifications, More
- Each tab has its own native stack navigator in `src/navigation/stacks/`
- **ProjectsStack is the main hub** — contains 17 screens (projects, tasks, sprints, notes, canvas)
- **MoreStack** — 13 screens (profile, settings, notes, canvas list, caverna)
- Deep linking: scheme `nckia://`, host `*.nckia.com.br`
- Navigation param types in `src/navigation/types.ts` — screen props exported as typed helpers (`ProjectsScreenProps<T>`, etc.)

### State Management

- **Zustand** stores in `src/stores/` — auth, notification, project, theme
- **React Query** for server state
- Auth store is wrapped in `AuthProvider` context (re-exported from `src/contexts/auth-context.tsx`) for initialization lifecycle

### API Layer

Axios-based client in `src/services/api/`:
- Base URL from `EXPO_PUBLIC_API_URL` env var (default: `http://localhost:3000/api/v1`)
- Request interceptor adds Bearer token from `expo-secure-store`
- Response interceptor handles 401 with **token refresh queue** — prevents concurrent refresh calls when multiple requests 401 simultaneously; queues pending requests and retries all after refresh
- **Auth event bus** (`auth-events.ts`): pub/sub pattern that decouples API layer from Zustand store. On refresh failure, API layer fires `notifyUnauthorized()` → auth store subscribes and auto-logs out
- 14 domain API modules (auth, projects, tasks, sprints, notes, events, canvas, caverna, notifications, etc.)

### Custom Hooks

`src/hooks/` — each hook wraps React Query calls for a domain.

**Query key conventions**:
- Lists: `['tasks', projectId, filters]`
- Details: `['tasks', 'detail', id]`
- Nested: `['projects', projectId, 'members']`

**Mutation pattern**: `onSuccess` invalidates relevant query keys.

**Optimistic updates** used for task status changes — `onMutate` snapshots + updates cache, `onError` rolls back, `onSettled` refetches.

### Tokens & Auth Flow

- Tokens stored via `expo-secure-store` (keys: `nckia_access_token`, `nckia_refresh_token`)
- Auth init: check stored token → validate via `/auth/me` → set `isInitialized` → route to auth or main
- Login methods: email/password, magic link

### Data Model

- `BaseEntity`: id, created_at, updated_at, deleted_at (soft deletes)
- `TenantEntity`: extends BaseEntity + tenant_id (multi-tenancy, managed by backend)
- Task statuses: BACKLOG → TODO → IN_PROGRESS → IN_REVIEW → DONE → CANCELLED
- Project work modes: SCRUM, KANBAN, SIMPLE
- User roles: SUPER_ADMIN, ADMIN, MANAGER, MEMBER, VIEWER, INVESTIDOR
- Shared types defined in `src/types/index.ts`

### Theme/Design System

`src/theme/` — dark-only theme enforced via `app.json` (`userInterfaceStyle: "dark"`).
- Colors: primary indigo `#6366F1`, background `#0F172A`
- Spacing scale: xs(4), sm(8), md(16), lg(24), xl(32), xxl(48)
- Typography: h1-h4, body/bodyMedium/bodySmall, caption, button

## Code Conventions

- Prettier: single quotes, trailing commas (all), 100 char width
- ESLint: expo + prettier configs
- Barrel exports via `index.ts` in each directory
- Screens receive `NativeStackScreenProps` typed navigation props
- Components use `StyleSheet.create()` for styles
- Form validation with `react-hook-form` + `zod` (resolver in `src/utils/zod-resolver.ts`)
- `reanimated/plugin` must be last in babel plugins list
- Components in `src/components/ui/` are base components (Button, Input, Card, Avatar, Badge, Modal, Toast, Skeleton); domain components live in their own folders (calendar/, canvas/, dashboard/, etc.)
