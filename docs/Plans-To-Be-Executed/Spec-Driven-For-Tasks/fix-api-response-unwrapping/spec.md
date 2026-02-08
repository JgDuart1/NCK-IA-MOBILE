# Spec: Fix API Response Unwrapping

## Contexto Tecnico

O backend NCK retorna TODAS as respostas no formato envelope:

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... },       // opcional, presente em respostas paginadas
  "timestamp": "..."
}
```

Axios adiciona seu proprio `.data`, entao `response.data` = envelope, `response.data.data` = payload real.

A maioria dos modulos de API ja fazem `response.data.data` corretamente. Os 3 abaixo nao.

## Mudancas

### 1. `mobile/src/services/api/dashboard.api.ts` — linha 14

**Bug**: `getMetrics()` retorna envelope inteiro em vez do payload.

```diff
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/dashboard/metrics');
-   return response.data;
+   return response.data.data;
  },
```

### 2. `mobile/src/services/api/notifications.api.ts` — linhas 11, 12, 19

**Bug 2a**: URL errada em `getUnreadCount()` — usa hifen em vez de barra.

**Bug 2b**: Unwrap errado em `getUnreadCount()` — falta nivel `.data`.

**Bug 2c**: Metodo HTTP e URL errados em `markAllAsRead()`.

```diff
  async getUnreadCount(): Promise<number> {
-   const response = await apiClient.get('/notifications/unread-count');
-   return response.data.count;
+   const response = await apiClient.get('/notifications/unread/count');
+   return response.data.data.count;
  },

  async markAllAsRead(): Promise<void> {
-   await apiClient.post('/notifications/read-all');
+   await apiClient.patch('/notifications/mark-all-read');
  },
```

### 3. `mobile/src/services/api/projects.api.ts` — linha 27

**Bug**: `list()` retorna envelope inteiro. Precisa construir `PaginatedResponse<Project>` corretamente.

```diff
  async list(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get('/projects', { params: filters });
-   return response.data;
+   return { data: response.data.data, meta: response.data.meta };
  },
```

## Arquivos Verificados (sem mudancas necessarias)

- `auth.api.ts` — usa `response.data.data` corretamente
- `canvas.api.ts` — usa `response.data.data` corretamente
- `caverna.api.ts` — usa `response.data.data` corretamente
- `events.api.ts` — usa `response.data.data` corretamente
- `meeting-requests.api.ts` — usa `response.data.data` corretamente
- `note-folders.api.ts` — usa `response.data.data` corretamente
- `notes.api.ts` — usa `response.data.data` corretamente
- `sprints.api.ts` — usa `response.data.data` corretamente
- `tasks.api.ts` — usa `response.data.data` corretamente
- `users.api.ts` — usa `response.data.data` corretamente
- `interceptors.ts` — sem mudancas

## Validacao

```bash
cd mobile && npm run typecheck  # tsc --noEmit deve passar
cd mobile && npm run lint       # ESLint deve passar
```
