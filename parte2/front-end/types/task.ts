export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
};

export type TasksResponse = {
  page: number;
  per_page: number;
  total: number;
  items: Task[];
};
