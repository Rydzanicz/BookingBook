import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

interface AuthCtx {
  user: any | null;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const persist = (data: any) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (username: string, password: string) => {
    const { data } = await apiLogin({ username, password });
    persist(data);
  };
  const register = async (username: string, email: string, password: string) => {
    await apiRegister({ username, email, password });
    await login(username, password);
  };
  const logout = async () => {
    await apiLogout();
    localStorage.clear();
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth musi być użyte w AuthProvider');
  return ctx;
};
