'use client';
// Proveedores globales de la aplicación
// Envuelve toda la app con Theme, Query, Auth, Language y Toast providers
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from '@/hooks/use-query';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/lib/i18n';
import { ToastProvider } from '@/components/ui/toast';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryProvider>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <ToastProvider />
          </LanguageProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
