'use client';

import { FormEvent, useState } from 'react';

import { TaskStatus } from '@/types/task';

type Props = {
  onSubmit: (title: string, description: string, status: TaskStatus) => Promise<void>;
  loading: boolean;
};

export function TaskForm({ onSubmit, loading }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pendente');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(title, description, status);
    setTitle('');
    setDescription('');
    setStatus('pendente');
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <h2>Nova tarefa</h2>
        <p>Preencha os campos para adicionar uma nova tarefa</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="task-form">
          <div className="task-form-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="task-title" className="field-label">Título</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Revisar documento..."
                minLength={1}
                required
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="task-status" className="field-label">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="task-desc" className="field-label">Descrição</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da tarefa (opcional)"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="task-form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto', minWidth: 140 }}>
              {loading ? 'Salvando...' : '+ Adicionar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
