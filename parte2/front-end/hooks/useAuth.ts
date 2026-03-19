'use client';

import { useEffect, useState } from 'react';

import { login, register } from '@/lib/api';
import { ToastType } from '@/components/Toast';

const TOKEN_KEY = 'tasks-token';

type AddToast = (message: string, type: ToastType) => void;

export function useAuth(addToast: AddToast) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);
      setError('');
      const accessToken = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
      addToast('Login realizado com sucesso!', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(email: string, password: string) {
    try {
      setLoading(true);
      setError('');
      await register({ email, password });
      const accessToken = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
      addToast('Conta criada com sucesso! Bem-vindo.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setError('');
  }

  return {
    token,
    isAuthenticated: !!token,
    error,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
