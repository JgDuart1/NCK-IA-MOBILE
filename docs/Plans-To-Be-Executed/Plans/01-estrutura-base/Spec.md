# Plano 01: Estrutura Base - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/01-estrutura-base`
- **Timeout**: 2 horas
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Pastas

```
mobile/
├── app.json
├── App.tsx
├── babel.config.js
├── tsconfig.json
├── package.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
│
├── assets/
│   ├── fonts/
│   ├── images/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
│
└── src/
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Avatar.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Toast.tsx
    │   │   └── index.ts
    │   │
    │   ├── feedback/
    │   │   ├── LoadingScreen.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── ErrorState.tsx
    │   │   └── index.ts
    │   │
    │   └── index.ts
    │
    ├── providers/
    │   ├── ThemeProvider.tsx
    │   ├── QueryProvider.tsx
    │   ├── ToastProvider.tsx
    │   └── index.tsx          # Combina todos os providers
    │
    ├── services/
    │   ├── api/
    │   │   ├── client.ts      # Axios instance
    │   │   ├── interceptors.ts
    │   │   └── index.ts
    │   │
    │   ├── storage/
    │   │   ├── async-storage.ts
    │   │   ├── secure-storage.ts
    │   │   └── index.ts
    │   │
    │   └── attachments/
    │       ├── attachment.service.ts
    │       └── index.ts
    │
    ├── stores/
    │   └── theme.store.ts
    │
    ├── theme/
    │   ├── colors.ts
    │   ├── spacing.ts
    │   ├── typography.ts
    │   └── index.ts
    │
    ├── hooks/
    │   ├── use-theme.ts
    │   └── index.ts
    │
    ├── types/
    │   └── index.ts           # Re-export dos tipos de contracts.md
    │
    └── utils/
        ├── format.ts
        └── index.ts
```

---

## Implementações

### 1. App.tsx (Entry Point)

```tsx
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Providers } from './src/providers';
import { LoadingScreen } from './src/components';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Carregar fontes, verificar auth, etc.
      await loadFonts();
      setIsReady(true);
    }
    prepare();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <StatusBar style="light" />
        {/* Navigation será adicionado no Plano 03 */}
      </Providers>
    </GestureHandlerRootView>
  );
}
```

### 2. Theme (src/theme/)

#### colors.ts
```typescript
export const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0F172A',
  },
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const darkTheme = {
  background: colors.neutral[950],
  surface: colors.neutral[900],
  surfaceSecondary: colors.neutral[800],
  text: colors.neutral[50],
  textSecondary: colors.neutral[400],
  textMuted: colors.neutral[500],
  border: colors.neutral[700],
  borderLight: colors.neutral[800],
  primary: colors.primary[500],
  primaryHover: colors.primary[600],
};

export type Theme = typeof darkTheme;
```

#### spacing.ts
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
```

#### typography.ts
```typescript
import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
};
```

### 3. API Client (src/services/api/)

#### client.ts
```typescript
import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);
```

#### interceptors.ts
```typescript
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '../storage';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(client: AxiosInstance) {
  // Request interceptor - add token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await secureStorage.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle 401 and refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await secureStorage.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await client.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          await secureStorage.setTokens(access_token, newRefreshToken);
          
          processQueue(null, access_token);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          await secureStorage.clearTokens();
          // Navegação para login será tratada pelo AuthStore
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
```

### 4. Storage Services (src/services/storage/)

#### secure-storage.ts
```typescript
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'nckia_access_token',
  REFRESH_TOKEN: 'nckia_refresh_token',
};

export const secureStorage = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
  },

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  },
};
```

#### async-storage.ts
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@nckia:';

export const asyncStorage = {
  async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(`${PREFIX}${key}`);
    return value ? JSON.parse(value) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(`${PREFIX}${key}`);
  },

  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((key) => key.startsWith(PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  },
};
```

### 5. Attachment Service (src/services/attachments/)

#### attachment.service.ts
```typescript
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { apiClient } from '../api';
import { Attachment } from '../../types';

interface UploadResult {
  success: boolean;
  attachment?: Attachment;
  error?: string;
}

export const attachmentService = {
  async pickImage(): Promise<ImagePicker.ImagePickerResult> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Permissão negada para acessar galeria');
    }

    return ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  },

  async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    return DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'text/*'],
      copyToCacheDirectory: true,
    });
  },

  async upload(
    uri: string,
    entityType: 'task' | 'note' | 'project',
    entityId: string
  ): Promise<UploadResult> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        return { success: false, error: 'Arquivo não encontrado' };
      }

      const formData = new FormData();
      const filename = uri.split('/').pop() || 'file';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `application/${match[1]}` : 'application/octet-stream';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);

      const response = await apiClient.post<{ data: Attachment }>('/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, attachment: response.data.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao fazer upload' };
    }
  },

  async download(attachment: Attachment): Promise<string> {
    const localUri = `${FileSystem.documentDirectory}${attachment.filename}`;
    
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      return localUri;
    }

    const downloadResult = await FileSystem.downloadAsync(attachment.url, localUri);
    return downloadResult.uri;
  },

  async delete(attachmentId: string): Promise<void> {
    await apiClient.delete(`/attachments/${attachmentId}`);
  },
};
```

### 6. Componentes UI

#### Button.tsx
```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : darkTheme.primary} />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyles}>{children}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: spacing.sm,
  },
  
  // Variants
  variant_primary: {
    backgroundColor: darkTheme.primary,
  },
  variant_secondary: {
    backgroundColor: darkTheme.surface,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: '#EF4444',
  },
  
  // Sizes
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  size_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  size_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Text
  text: {
    ...typography.button,
    color: '#fff',
  },
  text_primary: {
    color: '#fff',
  },
  text_secondary: {
    color: darkTheme.text,
  },
  text_outline: {
    color: darkTheme.text,
  },
  text_ghost: {
    color: darkTheme.primary,
  },
  text_danger: {
    color: '#fff',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
});
```

#### Input.tsx
```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecure = () => setIsSecure(!isSecure);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={20} color={darkTheme.textSecondary} />
        )}
        
        <TextInput
          style={styles.input}
          placeholderTextColor={darkTheme.textMuted}
          secureTextEntry={isSecure}
          {...props}
        />
        
        {secureTextEntry ? (
          <TouchableOpacity onPress={toggleSecure}>
            <Ionicons
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={darkTheme.textSecondary}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons name={rightIcon} size={20} color={darkTheme.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: darkTheme.text,
    paddingVertical: spacing.md,
  },
  error: {
    ...typography.caption,
    color: '#EF4444',
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
});
```

### 7. Providers (src/providers/)

#### index.tsx
```typescript
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toast />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

---

## Testes

### Testes Unitários
- [ ] Theme: cores e espaçamentos exportados corretamente
- [ ] Storage: salvar e recuperar dados
- [ ] API Client: headers corretos

### Testes de Integração
- [ ] Interceptor de refresh token
- [ ] Upload de arquivo

### Testes Manuais
- [ ] App abre sem erros
- [ ] Componentes renderizam corretamente
- [ ] Tema dark aplicado

---

## Checklist de Entrega

- [ ] Projeto Expo criado e configurado
- [ ] TypeScript sem erros
- [ ] ESLint sem warnings
- [ ] Estrutura de pastas conforme spec
- [ ] Todos os componentes UI implementados
- [ ] API Client com interceptors
- [ ] Storage services funcionando
- [ ] Attachment service implementado
- [ ] Providers configurados
- [ ] App compila e executa
