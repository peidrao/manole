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
- **Paginação e filtro por status na API** — implementados diretamente em `GET /tasks` via query params (`page`, `per_page`, `status`).
- **SQLite nos testes do backend** — os testes sobem um banco em memória, sem precisar de PostgreSQL rodando.
- **Cobertura de testes do front-end** — cobre o cliente HTTP (`lib/api.ts`); testes de componentes não foram incluídos no escopo.

## O que eu melhoraria com mais tempo

- **Refresh token + httpOnly cookie** — o token hoje fica em `localStorage`, vulnerável a XSS. Mover para cookie httpOnly e adicionar refresh token resolveriam os dois problemas juntos.
- **PATCH no lugar de PUT** — o endpoint `PUT /tasks/{id}` exige todos os campos; PATCH permitiria atualização parcial e viabilizaria a edição inline de título e descrição no front.
- **Edição completa da tarefa no front** — hoje só o status é editável. Título e descrição exigem excluir e recriar.
- **Rate limiting nos endpoints de autenticação** — `/auth/login` e `/auth/register` não têm proteção contra brute force.
- **CORS restrito** — `allow_origins=["*"]` funciona para desenvolvimento, mas em produção precisaria ser limitado às origens reais.
- **Filtro de status persistido na URL** — usar query param `?status=pendente` permitiria compartilhar links e respeitar navegação do browser (back/forward).
- **React Query ou SWR** — substituiria o fetch manual com `useEffect` por uma solução de server state com cache, revalidação e menos código.

## Pontos fortes e limitações

**Pontos fortes**
- Entrega completa dos requisitos obrigatórios e diferenciais.
- Backend usa SQLAlchemy 2.0 com `Mapped` types e Alembic para migrations — tooling moderno, não o padrão legado ainda comum em projetos FastAPI.
- Testes do backend com isolamento real — SQLite em memória, sem dependência de PostgreSQL rodando.
- Hooks bem separados no front (`useAuth`, `useTasks`) — page.tsx orquestra sem lógica de negócio.
- UX cuidada em ações destrutivas: modal de confirmação antes de excluir, toast de feedback em todas as operações.
- Estrutura simples e fácil de evoluir — sem over-engineering.

**Limitações**
- Token em `localStorage` — vulnerável a XSS; httpOnly cookie seria mais seguro.
- Sem testes de componentes no front-end — cobertura cobre apenas o cliente HTTP (`lib/api.ts`).
- Edição de tarefa parcial — só status é editável inline; título e descrição não têm formulário de edição.
- CORS aberto (`allow_origins=["*"]`) — adequado para desenvolvimento, inviável em produção.
