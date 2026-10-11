import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserLicense, AuthState, PlanType, PaymentOrder } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string; resetTokenForDemo?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshAuth: () => Promise<void>;
  createOrder: (planType: PlanType, paymentMethod?: string) => Promise<{ success: boolean; order?: any; error?: string }>;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'petcare360_auth_token_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [license, setLicense] = useState<UserLicense | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // Modal UI state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const refreshAuth = async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setUser(null);
      setLicense(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setLicense(data.license);
        setToken(savedToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setLicense(null);
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Falha ao iniciar sessão.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setLicense(data.license);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro de rede.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Falha ao criar conta.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setLicense(data.license);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro de rede.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setLicense(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return {
        success: true,
        message: data.message,
        resetTokenForDemo: data.resetTokenForDemo,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao enviar pedido.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createOrder = async (planType: PlanType, paymentMethod: string = 'mbway') => {
    if (!token) {
      openAuthModal('login');
      return { success: false, error: 'Por favor inicie sessão primeiro.' };
    }

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planType, paymentMethod }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao criar encomenda.' };
      }

      await refreshAuth();
      return { success: true, order: data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao comunicar com o servidor.' };
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && (user.role === 'admin' || user.email === 'jorgebartolo980@gmail.com'));
  const hasActiveAccess = Boolean(license && license.status === 'active');

  return (
    <AuthContext.Provider
      value={{
        user,
        license,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        hasActiveAccess,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshAuth,
        createOrder,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
