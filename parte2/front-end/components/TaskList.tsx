'use client';

import { useState } from 'react';

import { ConfirmModal } from '@/components/ConfirmModal';
import { Task, TaskStatus } from '@/types/task';

type Props = {
  tasks: Task[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
  onChangeStatus: (task: Task, status: TaskStatus) => Promise<void>;
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Andamento' },
  { value: 'concluida', label: 'Concluída' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TaskList({ tasks, loading, onDelete, onChangeStatus }: Props) {
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleConfirmDelete() {
    if (!confirmTask) return;
    const id = confirmTask.id;
    setConfirmTask(null);
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="task-loading">
        <span>Carregando tarefas...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-empty">
        <div className="task-empty-icon">&#9744;</div>
        <p>Nenhuma tarefa encontrada.</p>
        <p style={{ marginTop: 4, fontSize: '0.8125rem' }}>Crie sua primeira tarefa acima.</p>
      </div>
    );
  }

  return (
    <>
      <div className="tasks-container">
        {tasks.map((task) => (
          <div key={task.id} className={`task-card ${task.status} ${deletingId === task.id ? 'task-card-deleting' : ''}`}>
            <div className={`task-card-indicator ${task.status}`} />

            <div className="task-card-body">
              <div className="task-card-top">
                <div className="task-card-title">{task.title}</div>
                <button
                  className="btn-delete"
                  onClick={() => setConfirmTask(task)}
                  title="Excluir tarefa"
                  disabled={deletingId === task.id}
                >
                  ×
                </button>
              </div>

              {task.description && (
                <div className="task-card-desc">{task.description}</div>
              )}

              <div className="task-card-footer">
                <span className="task-card-meta">{formatDate(task.created_at)}</span>
                <div className="status-picker" role="group" aria-label="Alterar status">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`status-pill ${opt.value} ${task.status === opt.value ? 'active' : ''}`}
                      onClick={() => task.status !== opt.value && onChangeStatus(task, opt.value)}
                      disabled={task.status === opt.value}
                      title={`Mudar para ${opt.label}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmTask && (
        <ConfirmModal
          taskTitle={confirmTask.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTask(null)}
        />
      )}
    </>
  );
}
