import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  dob?: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  preferences?: string[];
  notifyEmail?: boolean;
  notifySms?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tdl_token');
    const savedUser = localStorage.getItem('tdl_user');
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error || 'Đăng nhập thất bại');
    }
    const data = await r.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('tdl_token', data.token);
    localStorage.setItem('tdl_user', JSON.stringify(data.user));
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const r = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error || 'Đăng ký thất bại');
    }
    const data = await r.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('tdl_token', data.token);
    localStorage.setItem('tdl_user', JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tdl_token');
    localStorage.removeItem('tdl_user');
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      logout();
      window.location.href = '/login';
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [logout]);


  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem('tdl_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
