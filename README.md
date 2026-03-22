# Tasks — Fullstack

Aplicação de gerenciamento de tarefas com autenticação JWT, composta por uma API em FastAPI e uma interface em Next.js.

```
parte1/           lógica em JavaScript + respostas conceituais
parte2/api/       API REST (FastAPI + PostgreSQL)
parte2/front-end/ interface web (Next.js 15)
```

## Requisitos

- Docker e Compose V2 (para rodar tudo junto)
- Python 3.12+ e [`uv`](https://docs.astral.sh/uv/) (para rodar a API localmente)
- Node.js 18+ (para rodar o front-end localmente)

## Rodando com Docker

```bash
make up
```

Serviços disponíveis após o build:

| Serviço    | Endereço                   |
| ---------- | -------------------------- |
| Front-end  | http://localhost:3000      |
| API        | http://localhost:8000      |
| API docs   | http://localhost:8000/docs |
| PostgreSQL | localhost:5432             |

## Usuário de teste

| Campo  | Valor           |
| ------ | --------------- |
| E-mail | test@test.com   |
| Senha  | 123456          |

Para criar novos usuários:

```bash
docker exec -it fullstack_tasks_api create-user --email seu@email.com --password suasenha
```

## Rodando localmente (sem Docker)

### API

Requer PostgreSQL rodando. Suba só o banco via Docker se preferir:

```bash
docker compose up db -d
```

Em seguida:

```bash
make api-install   # cria venv com uv e instala dependências
make api-migrate   # aplica as migrations Alembic
make api-dev       # sobe em http://localhost:8000
```

### Front-end

```bash
make front-dev     # instala dependências e sobe em http://localhost:3000
```

### Parte 1

```bash
make parte1        # executa parte1/index.js
```

As respostas conceituais estão em `parte1/conceitos.md`.

## Testes

```bash
make test          # backend + frontend + parte 1
make test-api      # pytest (backend)
make test-front    # vitest (frontend)
```

Execute `make` ou `make help` para ver todos os comandos disponíveis.

## Decisões técnicas

- **JWT sem refresh token** — escopo intencional; o token expira em 60 minutos. Adicionar refresh token seria o próximo passo natural.
- **PATCH com campos opcionais na API** — `PATCH /tasks/{id}` aceita qualquer subconjunto de campos, permitindo atualização parcial sem reenviar o objeto completo.
- **Paginação e filtro por status na API** — implementados diretamente em `GET /tasks` via query params (`page`, `per_page`, `status`).
- **SQLite nos testes do backend** — os testes sobem um banco em memória, sem precisar de PostgreSQL rodando.
- **`expire_on_commit=False` na sessão SQLAlchemy** — elimina o `SELECT` extra após cada `commit`, já que os atributos do objeto são definidos pelo Python antes do commit e não precisam ser recarregados.
- **`refreshKey` no `useTasks`** — evita double fetch ao combinar `useEffect` reativo com operações imperativas; uma única fonte de re-fetch garante exatamente uma requisição por mutação.

## O que eu melhoraria com mais tempo

- **Refresh token + httpOnly cookie** — o token hoje fica em `localStorage`, vulnerável a XSS. Mover para cookie httpOnly e adicionar refresh token resolveriam os dois problemas juntos.
- **Edição completa da tarefa no front** — hoje só o status é editável inline. Título e descrição exigem excluir e recriar.
- **Rate limiting nos endpoints de autenticação** — `/auth/login` e `/auth/register` não têm proteção contra brute force.
- **CORS restrito** — `allow_origins=["*"]` funciona para desenvolvimento, mas em produção precisaria ser limitado às origens reais.
- **Filtro de status persistido na URL** — usar query param `?status=pendente` permitiria compartilhar links e respeitar navegação do browser (back/forward).
- **React Query ou SWR** — substituiria o fetch manual com `useEffect` por uma solução de server state com cache, revalidação e menos código.

## Sobre o uso de IA

- **[v0](https://v0.dev)** — usado como ponto de partida para o design do front-end: geração da estrutura visual inicial de componentes e layout.
- **[Claude Code](https://claude.ai/code)** — usado para revisão de código (code review da API e do front-end) e geração/atualização de documentação (READMEs).

O código foi escrito, avaliado e ajustado manualmente. As ferramentas aceleraram etapas específicas, sem substituir o julgamento técnico nas decisões de arquitetura e implementação.

## Pontos fortes e limitações

**Pontos fortes**
- Entrega completa dos requisitos obrigatórios e diferenciais.
- Backend usa SQLAlchemy 2.0 com `Mapped` types e Alembic para migrations — tooling moderno, não o padrão legado ainda comum em projetos FastAPI.
- Testes do backend com isolamento real — SQLite em memória, sem dependência de PostgreSQL rodando.
- Testes do frontend cobrem o cliente HTTP (`lib/api.ts`) e o componente `TaskForm`, incluindo estados de loading e reset do formulário.
- Hooks bem separados no front (`useAuth`, `useTasks`) — `page.tsx` orquestra sem lógica de negócio.
- UX cuidada em ações destrutivas: modal de confirmação antes de excluir, toast de feedback em todas as operações.
- Acessibilidade: `aria-labelledby` e focus trap no modal de confirmação, `aria-pressed` nos filtros de status, `aria-label` nos botões de ação.
- Estrutura simples e fácil de evoluir — sem over-engineering.

**Limitações**
- Token em `localStorage` — vulnerável a XSS; httpOnly cookie seria mais seguro.
- Edição de tarefa parcial — só status é editável inline; título e descrição não têm formulário de edição.
- CORS aberto (`allow_origins=["*"]`) — adequado para desenvolvimento, inviável em produção.
