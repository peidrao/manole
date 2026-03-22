# Tasks — Front-end

Interface web para gerenciamento de tarefas, construída com Next.js 15 e React 19. Consome a [Tasks API](../api).

## Requisitos

- Node.js 18+
- Tasks API rodando (ver `../api`)

## Rodando localmente

```bash
cd parte2/front-end
npm install
cp .env.example .env.local
npm run dev
```

A aplicação abre em `http://localhost:3000`.

## Rodando com Docker

```bash
docker compose up --build
```

A variável `NEXT_PUBLIC_API_URL` é embutida em tempo de build. Para apontar para uma API diferente:

```bash
docker compose build --build-arg NEXT_PUBLIC_API_URL=http://minha-api.com
```

## Usuário de teste

| Campo  | Valor           |
| ------ | --------------- |
| E-mail | test@test.com   |
| Senha  | 123456          |

## Variáveis de ambiente

| Variável               | Padrão                    | Descrição          |
| ---------------------- | ------------------------- | ------------------ |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000`   | URL da Tasks API   |

## Funcionalidades

- Cadastro e login com JWT (token persistido em `localStorage`)
- Criar, atualizar status parcialmente e excluir tarefas
- Filtro por status: pendente, em andamento, concluída
- Paginação da lista de tarefas
- Layout responsivo

## Testes

```bash
npm test
```

Testes unitários com Vitest cobrindo o cliente HTTP (`lib/api.ts`) e o componente `TaskForm`.