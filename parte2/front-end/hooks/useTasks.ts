'use client';

import { useEffect, useState } from 'react';

import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { ToastType } from '@/components/Toast';
import { Task, TaskStatus } from '@/types/task';

type AddToast = (message: string, type: ToastType) => void;

export function useTasks(token: string, addToast: AddToast) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');

  useEffect(() => {
    if (!token) { setTasks([]); return; }

    setLoading(true);
    getTasks(token, statusFilter || undefined)
      .then((data) => setTasks(data.items))
      .catch((err) => addToast(err instanceof Error ? err.message : 'Erro ao carregar tarefas', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, statusFilter]);

  async function handleCreateTask(title: string, description: string, status: TaskStatus) {
    try {
      const task = await createTask(token, { title, description, status });
      if (!statusFilter || task.status === statusFilter) {
        setTasks((prev) => [task, ...prev]);
      }
      addToast('Tarefa criada com sucesso!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao criar tarefa', 'error');
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTask(token, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      addToast('Tarefa excluída.', 'info');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao excluir tarefa', 'error');
    }
  }

  async function handleChangeStatus(task: Task, status: TaskStatus) {
    try {
      const updated = await updateTask(token, task.id, { title: task.title, description: task.description, status });
      setTasks((prev) =>
        statusFilter && updated.status !== statusFilter
          ? prev.filter((t) => t.id !== updated.id)
          : prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      addToast('Status atualizado!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao atualizar status', 'error');
    }
  }

  return { tasks, loading, statusFilter, setStatusFilter, handleCreateTask, handleDeleteTask, handleChangeStatus };
}
