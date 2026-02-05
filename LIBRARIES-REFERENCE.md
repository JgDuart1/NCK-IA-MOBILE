# Referência de Bibliotecas - NCK IA Mobile

Este documento centraliza todas as bibliotecas recomendadas para evitar duplicação e garantir que agentes usem as ferramentas certas.

---

## Bibliotecas Core (Plano 01)

| Categoria | Biblioteca | Versão | Uso |
|-----------|------------|--------|-----|
| Framework | `expo` | ~52.x | SDK base |
| UI Runtime | `react-native` | ~0.74.x | Runtime |
| HTTP | `axios` | ^1.x | Cliente HTTP |
| Estado Servidor | `@tanstack/react-query` | ^5.x | Cache, fetching, mutations |
| Estado Global | `zustand` | ^4.x | Stores leves |
| Forms | `react-hook-form` | ^7.x | Gerenciamento de formulários |
| Validação | `zod` | ^3.x | Schema validation |
| Navegação | `@react-navigation/native` | ^6.x | Navegação |

---

## Bibliotecas por Funcionalidade

### Armazenamento
| Biblioteca | Uso |
|------------|-----|
| `expo-secure-store` | Tokens (encriptado) |
| `@react-native-async-storage/async-storage` | Dados não sensíveis |
| `expo-file-system` | Download/upload de arquivos |

### UI/UX
| Biblioteca | Uso |
|------------|-----|
| `react-native-safe-area-context` | SafeArea |
| `react-native-toast-message` | Toasts |
| `@expo/vector-icons` | Ionicons, MaterialIcons, etc |
| `expo-image` | Imagens otimizadas (lazy loading) |

### Gestos e Animações
| Biblioteca | Uso |
|------------|-----|
| `react-native-gesture-handler` | Gestos nativos |
| `react-native-reanimated` | Animações performáticas |

### Arquivos
| Biblioteca | Uso |
|------------|-----|
| `expo-image-picker` | Galeria e câmera |
| `expo-document-picker` | Documentos |
| `expo-camera` | Câmera direta |

### Notificações
| Biblioteca | Uso |
|------------|-----|
| `expo-notifications` | Push notifications |
| `expo-device` | Verificar se é dispositivo físico |

---

## NÃO USAR (Alternativas Piores)

| Evitar | Por quê | Usar ao invés |
|--------|---------|---------------|
| `redux` | Muito boilerplate | `zustand` |
| `axios` interceptors customizados | Já temos em `interceptors.ts` | Usar o existente |
| `moment.js` | Bundle grande | `date-fns` ou Intl nativo |
| `lodash` | Bundle grande | Utils nativas do ES2020+ |
| `styled-components` | Runtime overhead | `StyleSheet.create` nativo |
| `react-native-calendars` | Customização limitada | Componente próprio (Plano 09) |

---

## Bibliotecas por Plano

### Plano 06 - Kanban Drag & Drop
```bash
# Já inclusos no SDK Expo, apenas usar:
react-native-gesture-handler
react-native-reanimated

# Para drag & drop reativo:
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
```

### Plano 09 - Calendário
```typescript
// Usar hooks de date nativos + componente customizado
// NÃO instalar react-native-calendars (pesado, difícil customizar dark theme)
const getMonthDays = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};
```

### Plano 10 - Notificações
```bash
expo-notifications
expo-device
```

### Plano 11 - Canvas
```typescript
// Usar ScrollView horizontal com paginação
// FlatList é overkill para 3 "páginas"
<ScrollView horizontal pagingEnabled />
```

### Plano 13 - Perfil/Avatar
```bash
expo-image-picker  # Já incluso no Plano 01
expo-camera
```

---

## Utils Nativos (Não Instalar Bibliotecas)

### Formatação de Datas
```typescript
// Usar Intl nativo
const formatDate = (date: string) => 
  new Intl.DateTimeFormat('pt-BR').format(new Date(date));

const formatRelativeTime = (date: string) => {
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 7) return rtf.format(-days, 'day');
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};
```

### Debounce
```typescript
// Implementação simples - NÃO instalar lodash
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### UUID
```typescript
// Usar crypto.randomUUID() nativo
const id = crypto.randomUUID();
```

---

## Comandos de Instalação

```bash
# Core (Plano 01)
npx expo install expo-secure-store @react-native-async-storage/async-storage
npx expo install expo-image-picker expo-document-picker expo-file-system
npx expo install react-native-safe-area-context react-native-gesture-handler react-native-reanimated
npm install axios @tanstack/react-query zustand react-hook-form zod
npm install react-native-toast-message

# Navegação
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens

# Notificações (Plano 10)
npx expo install expo-notifications expo-device

# Camera (Plano 13)
npx expo install expo-camera
```

---

## Regra Geral

> **Antes de instalar qualquer biblioteca, verificar:**
> 1. Já está incluída no Expo SDK?
> 2. Pode ser feito com APIs nativas (Intl, crypto, etc)?
> 3. Já existe implementação similar em outro plano?
> 4. O bundle size justifica?

---

## Changelog

| Data | Alteração |
|------|-----------|
| 2026-02-05 | Documento inicial |
