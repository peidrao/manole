# Tasks API

API REST para gerenciamento de tarefas com autenticação JWT. Construída com FastAPI, PostgreSQL e SQLAlchemy.

## Requisitos

- Python 3.12+
- PostgreSQL 16 (ou Docker)

## Rodando localmente

**1. Ambiente e dependências**

```bash
cd parte2/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

**2. Banco de dados**

Suba o PostgreSQL via Docker (recomendado):

```bash
docker compose up db -d
```

Ou aponte para um banco existente via variável de ambiente:

```bash
export DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/tasks_db'
```

**3. Migrations e servidor**

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`. A documentação interativa fica em `/docs`.

## Rodando com Docker (API + banco)

```bash
docker compose up --build
```

> Altere `JWT_SECRET` no `docker-compose.yml` antes de usar em produção.

## Usuário de teste

Criado durante o setup inicial via endpoint `/auth/register`:

| Campo  | Valor           |
| ------ | --------------- |
| E-mail | test@test.com   |
| Senha  | 123456          |

Para criar novos usuários via CLI:

```bash
docker exec -it tasks_api create-user --email seu@email.com --password suasenha
```

## Variáveis de ambiente

| Variável                      | Padrão                                                    | Descrição                        |
| ----------------------------- | --------------------------------------------------------- | -------------------------------- |
| `DATABASE_URL`                | `postgresql+psycopg://postgres:postgres@db:5432/tasks_db` | URL de conexão com o banco       |
| `JWT_SECRET`                  | `super-secret-change-me`                                  | Chave de assinatura dos tokens   |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60`                                                      | Validade do token de acesso      |

## Endpoints

| Método   | Rota              | Auth | Descrição                                     |
| -------- | ----------------- | ---- | --------------------------------------------- |
| `POST`   | `/auth/register`  | —    | Cadastro de usuário                           |
| `POST`   | `/auth/login`     | —    | Login, retorna JWT                            |
| `GET`    | `/tasks`          | ✓    | Lista tarefas (paginação + filtro por status) |
| `POST`   | `/tasks`          | ✓    | Cria tarefa                                   |
| `GET`    | `/tasks/{id}`     | ✓    | Detalhe de uma tarefa                         |
| `PATCH`  | `/tasks/{id}`     | ✓    | Atualiza tarefa (campos opcionais)            |
| `DELETE` | `/tasks/{id}`     | ✓    | Remove tarefa                                 |
| `GET`    | `/health`         | —    | Health check                                  |

Parâmetros de query em `GET /tasks`: `page`, `per_page`, `status` (`pendente` | `em_andamento` | `concluida`).

## Testes

```bash
pytest -q
```

Os testes usam SQLite em memória e não precisam do banco PostgreSQL.

## Migrations

```bash
# criar nova migration
alembic revision --autogenerate -m "descricao"

# aplicar
alembic upgrade head

# reverter uma migration
alembic downgrade -1
```
