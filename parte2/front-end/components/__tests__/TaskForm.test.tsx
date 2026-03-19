import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TaskForm } from '@/components/TaskForm';

describe('TaskForm', () => {
  it('submete os dados preenchidos e limpa o formulário', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onSubmit={onSubmit} loading={false} />);

    await userEvent.type(screen.getByLabelText('Título'), 'Estudar FastAPI');
    await userEvent.type(screen.getByLabelText('Descrição'), 'Criar endpoint de tarefas');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'em_andamento');

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(onSubmit).toHaveBeenCalledWith(
      'Estudar FastAPI',
      'Criar endpoint de tarefas',
      'em_andamento',
    );

    expect(screen.getByLabelText('Título')).toHaveValue('');
    expect(screen.getByLabelText('Descrição')).toHaveValue('');
    expect(screen.getByLabelText('Status')).toHaveValue('pendente');
  });

  it('mostra estado de loading no botão', () => {
    render(<TaskForm onSubmit={vi.fn().mockResolvedValue(undefined)} loading />);

    const button = screen.getByRole('button', { name: 'Salvando...' });
    expect(button).toBeDisabled();
  });
});
