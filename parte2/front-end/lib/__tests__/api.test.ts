import { createTask, deleteTask, getTasks, login, register, updateTask } from '@/lib/api';

describe('api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('faz login e retorna access token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ access_token: 'abc123', token_type: 'bearer' }),
      }),
    );

    const token = await login({ email: 'user@test.com', password: '123456' });

    expect(token).toBe('abc123');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('aplica header Authorization quando recebe token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ page: 1, per_page: 10, total: 0, items: [] }),
      }),
    );

    await getTasks('jwt-token');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/tasks?page=1&per_page=10',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer jwt-token' }),
      }),
    );
  });

  it('lança erro com detail da API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Credenciais inválidas' }),
      }),
    );

    await expect(login({ email: 'x', password: 'y' })).rejects.toThrow('Credenciais inválidas');
  });

  it('register retorna mensagem de sucesso', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'Usuário criado com sucesso' }),
      }),
    );

    const result = await register({ email: 'user@test.com', password: '123456' });
    expect(result.message).toBe('Usuário criado com sucesso');
  });

  it('createTask retorna a tarefa criada', async () => {
    const task = { id: 1, title: 'Nova tarefa', description: '', status: 'pendente', created_at: '2026-01-01T00:00:00Z' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => task }),
    );

    const result = await createTask('token', { title: 'Nova tarefa', description: '', status: 'pendente' });
    expect(result).toEqual(task);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/tasks',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('updateTask envia PATCH com apenas os campos fornecidos', async () => {
    const updated = { id: 1, title: 'A', description: '', status: 'concluida', created_at: '' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => updated }),
    );

    const result = await updateTask('token', 1, { status: 'concluida' });
    expect(result.status).toBe('concluida');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/tasks/1',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('deleteTask retorna undefined para resposta 204', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => ({}) }),
    );

    const result = await deleteTask('token', 1);
    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/tasks/1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
