'use client';

import { useEffect, useState } from 'react';

import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { ToastType } from '@/components/Toast';
import { Task, TaskStatus } from '@/types/task';

const PER_PAGE = 10;

type AddToast = (message: string, type: ToastType) => void;

export function useTasks(token: string, addToast: AddToast) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / PER_PAGE);

  useEffect(() => {
    if (!token) { setTasks([]); return; }

    setLoading(true);
    getTasks(token, statusFilter || undefined, page, PER_PAGE)
      .then((data) => {
        setTasks(data.items);
        setTotal(data.total);
      })
      .catch((err) => addToast(err instanceof Error ? err.message : 'Erro ao carregar tarefas', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, statusFilter, page]);

  function handleFilterChange(filter: TaskStatus | '') {
    setStatusFilter(filter);
    setPage(1);
  }

  async function handleCreateTask(title: string, description: string, status: TaskStatus) {
    try {
      await createTask(token, { title, description, status });
      setPage(1);
      const data = await getTasks(token, statusFilter || undefined, 1, PER_PAGE);
      setTasks(data.items);
      setTotal(data.total);
      addToast('Tarefa criada com sucesso!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao criar tarefa', 'error');
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTask(token, taskId);
      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      const data = await getTasks(token, statusFilter || undefined, nextPage, PER_PAGE);
      setTasks(data.items);
      setTotal(data.total);
      setPage(nextPage);
      addToast('Tarefa excluída.', 'info');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao excluir tarefa', 'error');
    }
  }

  async function handleChangeStatus(task: Task, status: TaskStatus) {
    try {
      const updated = await updateTask(token, task.id, { title: task.title, description: task.description, status });
      if (statusFilter && updated.status !== statusFilter) {
        const data = await getTasks(token, statusFilter || undefined, page, PER_PAGE);
        setTasks(data.items);
        setTotal(data.total);
      } else {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      addToast('Status atualizado!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao atualizar status', 'error');
    }
  }

  return {
    tasks,
    loading,
    statusFilter,
    setStatusFilter: handleFilterChange,
    page,
    setPage,
    total,
    totalPages,
    handleCreateTask,
    handleDeleteTask,
    handleChangeStatus,
  };
}
