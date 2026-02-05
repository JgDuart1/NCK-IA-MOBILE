import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    tenant: store.tenant,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    login: store.login,
    loginWithMagicLink: store.loginWithMagicLink,
    logout: store.logout,
    refreshUser: store.refreshUser,
  };
}
