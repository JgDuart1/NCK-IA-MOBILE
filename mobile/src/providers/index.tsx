import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { ToastProvider } from './ToastProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}

export { ThemeProvider } from './ThemeProvider';
export { QueryProvider } from './QueryProvider';
export { ToastProvider } from './ToastProvider';
