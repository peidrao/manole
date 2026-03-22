'use client';

import { useEffect, useState } from 'react';

import { login, register } from '@/lib/api';
import { toMessage } from '@/lib/utils';
import { AddToast } from '@/components/Toast';

const TOKEN_KEY = 'tasks-token';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function useAuth(addToast: AddToast) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;
    if (isTokenExpired(stored)) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      setToken(stored);
    }
  }, []);

  function persist(accessToken: string) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
  }

  async function handleLogin(email: string, password: string) {
    setLoading(true);
    setError('');
    try {
      persist(await login({ email, password }));
      addToast('Login realizado com sucesso!', 'success');
    } catch (err) {
      setError(toMessage(err, 'Erro ao fazer login'));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(email: string, password: string) {
    setLoading(true);
    setError('');
    try {
      await register({ email, password });
      persist(await login({ email, password }));
      addToast('Conta criada com sucesso! Bem-vindo.', 'success');
    } catch (err) {
      setError(toMessage(err, 'Erro ao registrar usuário'));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setError('');
  }

  return { token, isAuthenticated: !!token, error, loading, handleLogin, handleRegister, handleLogout };
}
