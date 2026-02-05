import React, { createContext, ReactNode, useMemo } from 'react';
import { Theme, darkTheme } from '../theme/colors';
import { useThemeStore } from '../stores/theme.store';

interface ThemeContextValue {
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);

  const value = useMemo(() => ({ theme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
