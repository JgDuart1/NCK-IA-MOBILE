import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui';
import { ProfileCard } from '@/components/profile';
import { LoadingScreen } from '@/components/feedback';
import { useAuth } from '@/hooks/use-auth';
import { MoreScreenProps } from '@/navigation/types';
import { darkTheme, spacing } from '@/theme';

export function ProfileScreen({ navigation }: MoreScreenProps<'Profile'>) {
  const { user, tenant } = useAuth();

  if (!user) return <LoadingScreen />;

  const canInvite = ['SUPER_ADMIN', 'NUCLEO_NCK'].includes(user.role.type);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard user={user} tenant={tenant} />

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

          {canInvite ? (
            <>
              <Button
                variant="outline"
                onPress={() => navigation.navigate('InviteUser')}
                leftIcon={<Ionicons name="person-add-outline" size={20} color={darkTheme.text} />}
                fullWidth
              >
                Convidar Usuario
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
          ) : null}
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
  actions: {
    gap: spacing.md,
  },
});
