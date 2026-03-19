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
    if (token) {
      load(statusFilter || undefined);
    } else {
      setTasks([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, statusFilter]);

  async function load(status?: TaskStatus) {
    try {
      setLoading(true);
      const data = await getTasks(token, status);
      setTasks(data.items);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao carregar tarefas', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(title: string, description: string, status: TaskStatus) {
    try {
      setLoading(true);
      await createTask(token, { title, description, status });
      await load(statusFilter || undefined);
      addToast('Tarefa criada com sucesso!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao criar tarefa', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTask(token, taskId);
      await load(statusFilter || undefined);
      addToast('Tarefa excluída.', 'info');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao excluir tarefa', 'error');
    }
  }

  async function handleChangeStatus(task: Task, status: TaskStatus) {
    try {
      await updateTask(token, task.id, { title: task.title, description: task.description, status });
      await load(statusFilter || undefined);
      addToast('Status atualizado!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao atualizar status', 'error');
    }
  }

  return {
    tasks,
    loading,
    statusFilter,
    setStatusFilter,
    handleCreateTask,
    handleDeleteTask,
    handleChangeStatus,
  };
}
