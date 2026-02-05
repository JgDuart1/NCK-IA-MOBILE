# Plano 13: Usuários e Perfil - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/13-usuarios-perfil`
- **Timeout**: 1.5 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── profile/
│       ├── ProfileScreen.tsx
│       ├── EditProfileScreen.tsx
│       ├── ChangePasswordScreen.tsx
│       ├── InviteUserScreen.tsx
│       ├── PendingInvitesScreen.tsx
│       └── index.ts
│
├── components/
│   └── profile/
│       ├── ProfileCard.tsx
│       ├── ProfileInfo.tsx
│       ├── AvatarPicker.tsx
│       ├── PasswordStrength.tsx
│       ├── RoleSelector.tsx
│       ├── InviteCard.tsx
│       ├── InviteStatusBadge.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── users.api.ts
│
└── hooks/
    ├── use-profile.ts
    └── use-invites.ts
```

---

## Implementações

### 1. Users API (src/services/api/users.api.ts)

```typescript
import { apiClient } from './client';
import { User } from '@/types';

interface UpdateProfileDto {
  name?: string;
}

interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}

interface InviteUserDto {
  email: string;
  role_type: string;
  project_ids?: string[];
}

interface Invite {
  id: string;
  email: string;
  role_type: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  created_at: string;
  expires_at: string;
}

export const usersApi = {
  async getMe(): Promise<User> {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await apiClient.patch('/users/me', data);
    return response.data.data;
  },

  async uploadAvatar(uri: string): Promise<User> {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'avatar.jpg';
    
    formData.append('avatar', {
      uri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    const response = await apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async removeAvatar(): Promise<User> {
    const response = await apiClient.delete('/users/me/avatar');
    return response.data.data;
  },

  async changePassword(data: ChangePasswordDto): Promise<void> {
    await apiClient.post('/users/change-password', data);
  },

  // Invites
  async invite(data: InviteUserDto): Promise<Invite> {
    const response = await apiClient.post('/users/invite', data);
    return response.data.data;
  },

  async getInvites(): Promise<Invite[]> {
    const response = await apiClient.get('/users/invites');
    return response.data.data;
  },

  async resendInvite(id: string): Promise<void> {
    await apiClient.post(`/users/invites/${id}/resend`);
  },

  async cancelInvite(id: string): Promise<void> {
    await apiClient.delete(`/users/invites/${id}`);
  },
};
```

### 2. useProfile Hook (src/hooks/use-profile.ts)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users.api';
import { useAuth } from './use-auth';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      refreshUser();
    },
  });
}

export function useUploadAvatar() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: () => {
      refreshUser();
    },
  });
}

export function useRemoveAvatar() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: usersApi.removeAvatar,
    onSuccess: () => {
      refreshUser();
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: usersApi.changePassword,
  });
}
```

### 3. AvatarPicker Component

```typescript
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui';
import { darkTheme, spacing } from '@/theme';

interface AvatarPickerProps {
  currentUri?: string | null;
  name: string;
  onPick: (uri: string) => void;
  onRemove: () => void;
}

export function AvatarPicker({ currentUri, name, onPick, onRemove }: AvatarPickerProps) {
  const showOptions = () => {
    Alert.alert('Alterar foto', 'Escolha uma opção', [
      {
        text: 'Tirar foto',
        onPress: takePhoto,
      },
      {
        text: 'Escolher da galeria',
        onPress: pickFromGallery,
      },
      ...(currentUri ? [{
        text: 'Remover foto',
        style: 'destructive' as const,
        onPress: onRemove,
      }] : []),
      {
        text: 'Cancelar',
        style: 'cancel' as const,
      },
    ]);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPick(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPick(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={showOptions}>
      <Avatar uri={currentUri} name={name} size={120} />
      <View style={styles.editBadge}>
        <Ionicons name="camera" size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: darkTheme.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: darkTheme.background,
  },
});
```

### 4. PasswordStrength Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { level: number; label: string; color: string } {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Fraca', color: '#EF4444' };
  if (score <= 2) return { level: 2, label: 'Razoável', color: '#F59E0B' };
  if (score <= 3) return { level: 3, label: 'Boa', color: '#3B82F6' };
  return { level: 4, label: 'Forte', color: '#10B981' };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              level <= strength.level && { backgroundColor: strength.color },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: strength.color }]}>
        {strength.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
  },
  bars: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: darkTheme.surfaceSecondary,
  },
  label: {
    ...typography.caption,
  },
});
```

### 5. ProfileScreen

```typescript
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { darkTheme, spacing, typography } from '@/theme';
import { formatDate } from '@/utils/format';

export function ProfileScreen({ navigation }: any) {
  const { user, tenant } = useAuth();

  if (!user) return null;

  const canInvite = ['SUPER_ADMIN', 'NUCLEO_NCK'].includes(user.role.type);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar uri={user.avatar_url} name={user.name} size={100} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user.role.name}</Text>
          </View>
        </View>

        <Card style={styles.info}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Workspace</Text>
            <Text style={styles.infoValue}>{tenant?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Membro desde</Text>
            <Text style={styles.infoValue}>{formatDate(user.created_at)}</Text>
          </View>
          {user.last_login_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Último acesso</Text>
              <Text style={styles.infoValue}>{formatDate(user.last_login_at)}</Text>
            </View>
          )}
        </Card>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={() => navigation.navigate('EditProfile')}
            leftIcon={<Ionicons name="person-outline" size={20} color={darkTheme.text} />}
            fullWidth
          >
            Editar Perfil
          </Button>

          <Button
            variant="outline"
            onPress={() => navigation.navigate('ChangePassword')}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={darkTheme.text} />}
            fullWidth
          >
            Alterar Senha
          </Button>

          {canInvite && (
            <>
              <Button
                variant="outline"
                onPress={() => navigation.navigate('InviteUser')}
                leftIcon={<Ionicons name="person-add-outline" size={20} color={darkTheme.text} />}
                fullWidth
              >
                Convidar Usuário
              </Button>

              <Button
                variant="outline"
                onPress={() => navigation.navigate('PendingInvites')}
                leftIcon={<Ionicons name="mail-outline" size={20} color={darkTheme.text} />}
                fullWidth
              >
                Convites Pendentes
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h2,
    color: darkTheme.text,
    marginTop: spacing.md,
  },
  email: {
    ...typography.body,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: darkTheme.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  info: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  infoValue: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  actions: {
    gap: spacing.md,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Perfil exibe corretamente
- [ ] Editar nome funciona
- [ ] Upload de avatar funciona
- [ ] Remover avatar funciona
- [ ] Alterar senha funciona
- [ ] Enviar convite funciona
- [ ] Lista de convites exibe

---

## Checklist de Entrega

- [ ] Todas as telas implementadas
- [ ] Edição de perfil funcionando
- [ ] Avatar funcionando
- [ ] Alteração de senha
- [ ] Sistema de convites
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
