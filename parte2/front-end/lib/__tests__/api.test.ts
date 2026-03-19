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

  it('cobre operações de tasks e auth sem erro', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ message: 'ok' }) })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({ id: 1, title: 'A', description: '', status: 'pendente', created_at: '' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ id: 1, title: 'A', description: '', status: 'concluida', created_at: '' }),
        })
        .mockResolvedValueOnce({ ok: true, status: 204, json: async () => ({}) }),
    );

    await register({ email: 'user@test.com', password: '123456' });
    await createTask('token', { title: 'A', description: '', status: 'pendente' });
    await updateTask('token', 1, { title: 'A', description: '', status: 'concluida' });
    await deleteTask('token', 1);

    expect(fetch).toHaveBeenCalledTimes(4);
  });
});
