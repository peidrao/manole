'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { AuthForm } from '@/components/AuthForm';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { ToastList, useToast } from '@/components/Toast';
import { TaskStatus } from '@/types/task';

const STATUS_FILTERS: { label: string; value: TaskStatus | '' }[] = [
  { label: 'Todos', value: '' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

export default function HomePage() {
  const { toasts, addToast, removeToast } = useToast();
  const { token, isAuthenticated, error: authError, loading: authLoading, handleLogin, handleRegister, handleLogout } = useAuth(addToast);
  const { tasks, loading: tasksLoading, statusFilter, setStatusFilter, handleCreateTask, handleDeleteTask, handleChangeStatus } = useTasks(token, addToast);

  return (
    <>
      <ToastList toasts={toasts} onRemove={removeToast} />

      {!isAuthenticated ? (
        <AuthForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
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
            <TaskForm onSubmit={handleCreateTask} loading={tasksLoading} />

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
                  loading={tasksLoading}
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
