'use client';

import { FormEvent, useState } from 'react';

type Props = {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
};

export function AuthForm({ onLogin, onRegister, loading, error }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      await onLogin(form.email, form.password);
    } else {
      await onRegister(form.email, form.password);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header-logo">M</div>
          <h2>{tab === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}</h2>
          <p>
            {tab === 'login'
              ? 'Entre com suas credenciais para continuar.'
              : 'Preencha os dados para criar sua conta.'}
          </p>
        </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => setTab('register')}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="auth-email" className="field-label">E-mail</label>
              <input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="auth-password" className="field-label">Senha</label>
              <div className="input-wrap">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="mínimo 6 caracteres"
                  minLength={6}
                  required
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="auth-footer">
            {tab === 'login' ? (
              <>
                Não tem conta?{' '}
                <button type="button" className="link-btn" onClick={() => setTab('register')}>
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button type="button" className="link-btn" onClick={() => setTab('login')}>
                  Entrar
                </button>
              </>
            )}
          </p>
      </div>
    </div>
  );
}
