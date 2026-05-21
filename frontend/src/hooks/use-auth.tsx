'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '@/lib/api';
import type { AuthUser, AuthTokens } from '@chatflow/shared';

interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; organizationName: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth_tokens');
    const storedUser = localStorage.getItem('auth_user');
    if (stored && storedUser) {
      try {
        setTokens(JSON.parse(stored));
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{ user: AuthUser; tokens: AuthTokens }>('/auth/login', { email, password });
    setUser(response.user);
    setTokens(response.tokens);
    localStorage.setItem('auth_tokens', JSON.stringify(response.tokens));
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; organizationName: string }) => {
    const response = await api.post<{ user: AuthUser; tokens: AuthTokens }>('/auth/register', data);
    setUser(response.user);
    setTokens(response.tokens);
    localStorage.setItem('auth_tokens', JSON.stringify(response.tokens));
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, tokens, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
