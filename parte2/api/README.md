# Parte 2 - API FastAPI

## Recursos implementados
- CRUD completo de tarefas
- Validação com Pydantic
- Persistência com SQLAlchemy
- JWT (registro/login)
- Paginação (`page`, `per_page`)
- Filtro por status (`status`)
- Testes automatizados com `pytest`
- Docker + PostgreSQL

## Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{id}`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`

## Rodar local
```bash
cd parte2/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/tasks_db'
alembic upgrade head
uvicorn app.main:app --reload
```

## Migrações com Alembic
```bash
cd parte2/api
alembic revision -m "descricao_da_migracao"
alembic upgrade head
alembic downgrade -1
```

## Rodar testes
```bash
cd parte2/api
pytest -q
```

## Rodar com Docker
```bash
cd parte2/api
docker compose up --build
```
