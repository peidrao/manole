# Teste Técnico Fullstack - Solução Completa

Projeto implementado em 3 blocos:

- `parte1/`: lógica e fundamentos (JavaScript + conceitos)
- `parte2/api/`: API FastAPI + PostgreSQL + JWT + testes + Docker
- `parte2/front-end/`: interface em Next.js consumindo a API

## Comandos rápidos (Makefile)

| Comando | Descrição |
|---|---|
| `make up` | Sobe todos os serviços com Docker (API + frontend + banco) |
| `make down` | Para e remove os containers |
| `make build` | Reconstrói as imagens Docker |
| `make logs` | Exibe os logs em tempo real |
| `make api-install` | Cria venv e instala dependências do backend |
| `make api-migrate` | Aplica as migrações Alembic |
| `make api-dev` | Sobe a API localmente (sem Docker) |
| `make front-install` | Instala dependências npm do frontend |
| `make front-dev` | Sobe o frontend localmente (sem Docker) |
| `make test` | Roda os testes do backend e do frontend |
| `make test-api` | Roda apenas os testes do backend |
| `make test-front` | Roda apenas os testes do frontend |
| `make parte1` | Executa o script de lógica (Node.js) |

> Execute `make` ou `make help` para ver todos os comandos disponíveis.

## Como rodar com Docker

```bash
make up
```

Serviços:
- API: `http://localhost:8000`
- Front-end: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Como rodar localmente (sem Docker)

### 1) Parte 1
```bash
make parte1
```

> As respostas conceituais (REST vs GraphQL, transações, autenticação vs autorização, cache) estão em `parte1/conceitos.md`.

### 2) API (FastAPI)
```bash
make api-install
make api-migrate
make api-dev
```

### 3) Front-end (Next.js)
```bash
make front-dev
```

## Testes

```bash
make test          # backend + frontend
make test-api      # apenas backend
make test-front    # apenas frontend
```

## Decisões técnicas

- API em FastAPI com SQLAlchemy para manter simplicidade e produtividade.
- JWT adicionado para proteger o CRUD de tarefas.
- Separação por camadas no backend (`routes`, `schemas` e `models`).
- Front-end em Next.js com TypeScript, componentes separados e hooks.
- Filtro por status e paginação implementados no endpoint `GET /tasks`.
- Testes unitários/funcionais de API com `pytest` + `TestClient`.

## O que eu melhoraria com mais tempo

- Refresh token + expiração mais robusta para JWT.
- Melhorias de UX no front (edição completa da tarefa, feedback visual mais rico).

## Pontos fortes e limitações

Pontos fortes:
- Entrega completa dos requisitos obrigatórios e diferenciais pedidos.
- Estrutura simples, fácil de entender e evoluir.
- Backend com autenticação e cobertura inicial de testes.

Limitações:
- Cobertura de testes do frontend ainda inicial (componentes e cliente HTTP).
- Segurança JWT mínima para contexto de teste técnico (sem refresh token).
