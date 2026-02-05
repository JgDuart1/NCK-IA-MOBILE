import { create } from 'zustand';
import { Tenant, User } from '@/types';
import { secureStorage } from '@/services/storage';
import { authApi } from '@/services/api/auth.api';
import { authEvents } from '@/services/api/auth-events';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithMagicLink: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => {
  authEvents.setUnauthorizedHandler(() => {
    set({ user: null, tenant: null, isAuthenticated: false });
  });

  return {
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,

    initialize: async () => {
      try {
        const token = await secureStorage.getAccessToken();
        if (token) {
          const { user, tenant } = await authApi.getMe();
          set({ user, tenant, isAuthenticated: true });
        }
      } catch {
        await secureStorage.clearTokens();
        set({ user: null, tenant: null, isAuthenticated: false });
      } finally {
        set({ isInitialized: true });
      }
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        const response = await authApi.login(email, password);
        await secureStorage.setTokens(response.access_token, response.refresh_token);
        set({
          user: response.user,
          tenant: response.tenant,
          isAuthenticated: true,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    loginWithMagicLink: async (token: string) => {
      set({ isLoading: true });
      try {
        const response = await authApi.verifyMagicLink(token);
        await secureStorage.setTokens(response.access_token, response.refresh_token);
        set({
          user: response.user,
          tenant: response.tenant,
          isAuthenticated: true,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await authApi.logout();
      } catch {
        // Ignore logout API errors
      } finally {
        await secureStorage.clearTokens();
        set({
          user: null,
          tenant: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },

    refreshUser: async () => {
      const { user, tenant } = await authApi.getMe();
      set({ user, tenant });
    },

    setUser: (user: User) => set({ user }),
  };
});
