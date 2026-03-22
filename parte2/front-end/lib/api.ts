import { Task, TaskStatus, TasksResponse } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = 10000;

type AuthBody = {
  email: string;
  password: string;
};

type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Tempo limite excedido ao conectar com a API');
    }
    throw new Error('Não foi possível conectar com a API');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let detail = 'Erro na requisição';
    try {
      const body = await response.json();
      if (body.detail) detail = body.detail;
    } catch {
      // resposta sem corpo JSON — usa mensagem genérica
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function register(body: AuthBody) {
  return request<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function login(body: AuthBody) {
  const data = await request<{ access_token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return data.access_token;
}

export function getTasks(token: string, status?: TaskStatus, page = 1, perPage = 10) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (status) {
    params.set('status', status);
  }

  return request<TasksResponse>(`/tasks?${params}`, {}, token);
}

export function createTask(token: string, body: TaskPayload) {
  return request<Task>('/tasks', { method: 'POST', body: JSON.stringify(body) }, token);
}

export function updateTask(token: string, taskId: number, body: TaskPayload) {
  return request<Task>(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(body) }, token);
}

export function deleteTask(token: string, taskId: number) {
  return request<void>(`/tasks/${taskId}`, { method: 'DELETE' }, token);
}
