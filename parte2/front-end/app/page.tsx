'use client';

import { useEffect, useMemo, useState } from 'react';

import { AuthForm } from '@/components/AuthForm';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { ToastList, useToast } from '@/components/Toast';
import { createTask, deleteTask, getTasks, login, register, updateTask } from '@/lib/api';
import { Task, TaskStatus } from '@/types/task';

const TOKEN_KEY = 'tasks-token';

const STATUS_FILTERS: { label: string; value: TaskStatus | '' }[] = [
  { label: 'Todos', value: '' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

export default function HomePage() {
  const [token, setToken] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const { toasts, addToast, removeToast } = useToast();

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (token) loadTasks(token, statusFilter || undefined);
  }, [token, statusFilter]);

  async function loadTasks(currentToken: string, status?: TaskStatus) {
    try {
      setLoading(true);
      const data = await getTasks(currentToken, status);
      setTasks(data.items);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao carregar tarefas', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);
      setAuthError('');
      const accessToken = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
      addToast('Login realizado com sucesso!', 'success');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(email: string, password: string) {
    try {
      setLoading(true);
      setAuthError('');
      await register({ email, password });
      const accessToken = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
      addToast('Conta criada com sucesso! Bem-vindo.', 'success');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(title: string, description: string, status: TaskStatus) {
    if (!token) return;
    try {
      setLoading(true);
      await createTask(token, { title, description, status });
      await loadTasks(token, statusFilter || undefined);
      addToast('Tarefa criada com sucesso!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao criar tarefa', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (!token) return;
    try {
      await deleteTask(token, taskId);
      await loadTasks(token, statusFilter || undefined);
      addToast('Tarefa excluída.', 'info');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao excluir tarefa', 'error');
    }
  }

  async function handleChangeStatus(task: Task, status: TaskStatus) {
    if (!token) return;
    try {
      await updateTask(token, task.id, {
        title: task.title,
        description: task.description,
        status,
      });
      await loadTasks(token, statusFilter || undefined);
      addToast('Status atualizado!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao atualizar status', 'error');
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setTasks([]);
    setAuthError('');
  }

  return (
    <>
      <ToastList toasts={toasts} onRemove={removeToast} />

      {!isAuthenticated ? (
        <AuthForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={loading}
          error={authError}
        />
      ) : (
        <div className="app-page">
          <header className="app-header">
            <div className="app-header-brand">
              <div className="app-header-logo">M</div>
              <h1>Minhas Tarefas</h1>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sair
            </button>
          </header>

          <main className="app-content">
            <TaskForm onSubmit={handleCreateTask} loading={loading} />

            <div className="card">
              <div className="card-header" style={{ paddingBottom: '14px' }}>
                <h2>Lista de tarefas</h2>
                <div className="filter-bar" style={{ marginTop: '12px', marginBottom: 0 }}>
                  {STATUS_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      className={`filter-pill ${statusFilter === f.value ? 'active' : ''}`}
                      onClick={() => setStatusFilter(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="divider" />
              <div className="card-body">
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  onDelete={handleDeleteTask}
                  onChangeStatus={handleChangeStatus}
                />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
