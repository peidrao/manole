'use client';

import { useEffect, useRef, useState } from 'react';

import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { toMessage } from '@/lib/utils';
import { AddToast } from '@/components/Toast';
import { Task, TaskStatus } from '@/types/task';

const PER_PAGE = 10;

export function useTasks(token: string, addToast: AddToast) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // addToast é estável (useCallback sem deps) — não precisa estar no array de deps
  const addToastRef = useRef(addToast);
  addToastRef.current = addToast;

  const totalPages = Math.ceil(total / PER_PAGE);

  useEffect(() => {
    if (!token) { setTasks([]); return; }

    setLoading(true);
    getTasks(token, statusFilter || undefined, page, PER_PAGE)
      .then((data) => {
        setTasks(data.items);
        setTotal(data.total);
      })
      .catch((err) => addToastRef.current(toMessage(err, 'Erro ao carregar tarefas'), 'error'))
      .finally(() => setLoading(false));
  }, [token, statusFilter, page, refreshKey]);

  // Dispara exatamente um re-fetch: muda página se necessário, ou força refreshKey na mesma página
  function refresh(targetPage?: number) {
    const next = targetPage ?? page;
    if (next !== page) {
      setPage(next);
    } else {
      setRefreshKey((k) => k + 1);
    }
  }

  function handleFilterChange(filter: TaskStatus | '') {
    setStatusFilter(filter);
    setPage(1);
  }

  async function handleCreateTask(title: string, description: string, status: TaskStatus) {
    setIsCreating(true);
    try {
      await createTask(token, { title, description, status });
      refresh(1);
      addToast('Tarefa criada com sucesso!', 'success');
    } catch (err) {
      addToast(toMessage(err, 'Erro ao criar tarefa'), 'error');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTask(token, taskId);
      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      refresh(nextPage);
      addToast('Tarefa excluída.', 'info');
    } catch (err) {
      addToast(toMessage(err, 'Erro ao excluir tarefa'), 'error');
    }
  }

  async function handleChangeStatus(task: Task, status: TaskStatus) {
    try {
      const updated = await updateTask(token, task.id, { status });
      if (statusFilter && updated.status !== statusFilter) {
        refresh();
      } else {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      addToast('Status atualizado!', 'success');
    } catch (err) {
      addToast(toMessage(err, 'Erro ao atualizar status'), 'error');
    }
  }

  return {
    tasks,
    loading,
    isCreating,
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
