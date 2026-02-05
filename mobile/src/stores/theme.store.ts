import { create } from 'zustand';
import { Theme, darkTheme } from '../theme/colors';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: darkTheme,
  setTheme: (theme) => set({ theme }),
}));
