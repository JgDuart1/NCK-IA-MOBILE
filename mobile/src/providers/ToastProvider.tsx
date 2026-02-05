import React, { ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}
