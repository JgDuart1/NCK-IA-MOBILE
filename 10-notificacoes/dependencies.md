# Plano 10: Notificações - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/notifications/`)

| Export | Descrição |
|--------|-----------|
| `NotificationsListScreen` | Lista de notificações |

#### Components (`src/components/notifications/`)

| Export | Descrição |
|--------|-----------|
| `NotificationItem` | Item da lista |
| `NotificationIcon` | Ícone por tipo |
| `NotificationGroup` | Grupo por data |

#### Store (`src/stores/`)

| Export | Descrição |
|--------|-----------|
| `useNotificationStore` | Store de notificações |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useNotifications` | Lista de notificações |
| `useUnreadCount` | Contador de não lidas |
| `useMarkAsRead` | Mutation marcar como lida |
| `useMarkAllAsRead` | Mutation marcar todas |
| `usePushNotifications` | Setup de push |

#### Services (`src/services/push/`)

| Export | Descrição |
|--------|-----------|
| `pushService` | Serviço de push notifications |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Button` | Componentes UI |
| `EmptyState`, `LoadingScreen` | Feedback |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 03 (navigation)

| Import | Uso |
|--------|-----|
| Navigation types | Para navegação por push |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 03-navigation | `useNotificationStore` para badge |

---

## Contratos

### NotificationStore

```typescript
interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  clearUnread: () => void;
}

// Uso na MainTabs
const unreadCount = useNotificationStore((state) => state.unreadCount);

// Uso em NotificationsListScreen
const clearUnread = useNotificationStore((s) => s.clearUnread);
clearUnread(); // Após marcar todas como lidas
```

### NotificationIcon

```typescript
interface NotificationIconProps {
  type: NotificationType;
  size?: number;
}

// Mapeamento de tipos para ícones
const TYPE_ICONS: Record<NotificationType, { icon: string; color: string }> = {
  TASK_CREATED: { icon: 'checkbox', color: '#3B82F6' },
  TASK_UPDATED: { icon: 'create', color: '#F59E0B' },
  TASK_ASSIGNED: { icon: 'person-add', color: '#10B981' },
  NOTE_CREATED: { icon: 'document-text', color: '#8B5CF6' },
  // ...
};
```

### Push Notification Data

O backend deve enviar pushs com esta estrutura:

```typescript
interface PushNotificationData {
  title: string;
  body: string;
  data: {
    notification_id: string;
    entity_type: 'task' | 'note' | 'event' | 'meeting_request' | 'project';
    entity_id: string;
    project_id?: string;
  };
}
```

### Agrupamento por Data

```typescript
function groupNotificationsByDate(notifications: Notification[]) {
  // Retorna:
  // [
  //   { title: 'Hoje', data: [...] },
  //   { title: 'Ontem', data: [...] },
  //   { title: 'Esta semana', data: [...] },
  //   { title: 'Anteriores', data: [...] },
  // ]
}
```
