'use client';

import { useEffect, useState } from 'react';

import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { toMessage } from '@/lib/utils';
import { AddToast } from '@/components/Toast';
import { Task, TaskStatus } from '@/types/task';

const PER_PAGE = 10;

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
      .catch((err) => addToast(toMessage(err, 'Erro ao carregar tarefas'), 'error'))
      .finally(() => setLoading(false));
  }, [token, statusFilter, page, addToast]);

  async function fetchAndSync(targetPage: number) {
    const data = await getTasks(token, statusFilter || undefined, targetPage, PER_PAGE);
    setTasks(data.items);
    setTotal(data.total);
  }

  function handleFilterChange(filter: TaskStatus | '') {
    setStatusFilter(filter);
    setPage(1);
  }

  async function handleCreateTask(title: string, description: string, status: TaskStatus) {
    setLoading(true);
    try {
      await createTask(token, { title, description, status });
      setPage(1);
      await fetchAndSync(1);
      addToast('Tarefa criada com sucesso!', 'success');
    } catch (err) {
      addToast(toMessage(err, 'Erro ao criar tarefa'), 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    setLoading(true);
    try {
      await deleteTask(token, taskId);
      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      await fetchAndSync(nextPage);
      setPage(nextPage);
      addToast('Tarefa excluída.', 'info');
    } catch (err) {
      addToast(toMessage(err, 'Erro ao excluir tarefa'), 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangeStatus(task: Task, status: TaskStatus) {
    setLoading(true);
    try {
      const updated = await updateTask(token, task.id, { title: task.title, description: task.description, status });
      if (statusFilter && updated.status !== statusFilter) {
        await fetchAndSync(page);
      } else {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      addToast('Status atualizado!', 'success');
    } catch (err) {
      addToast(toMessage(err, 'Erro ao atualizar status'), 'error');
    } finally {
      setLoading(false);
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
