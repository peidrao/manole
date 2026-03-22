'use client';

import { FormEvent, useState } from 'react';

import { TaskStatus } from '@/types/task';

type Props = {
  onSubmit: (title: string, description: string, status: TaskStatus) => Promise<void>;
  loading: boolean;
};

const INITIAL_FORM = { title: '', description: '', status: 'pendente' as TaskStatus };

export function TaskForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState(INITIAL_FORM);

  const set = <K extends keyof typeof INITIAL_FORM>(key: K, value: (typeof INITIAL_FORM)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    await onSubmit(title, form.description, form.status);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="card card--mb">
      <div className="card-header">
        <h2>Nova tarefa</h2>
        <p>Preencha os campos para adicionar uma nova tarefa</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="task-form">
          <div className="task-form-row">
            <div className="field">
              <label htmlFor="task-title" className="field-label">Título</label>
              <input
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Ex: Revisar documento..."
                minLength={1}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="task-status" className="field-label">Status</label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => set('status', e.target.value as TaskStatus)}
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="task-desc" className="field-label">Descrição</label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Descreva os detalhes da tarefa (opcional)"
              rows={3}
            />
          </div>

          <div className="task-form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : '+ Adicionar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
