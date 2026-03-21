.PHONY: help \
        up down logs build \
        api-install api-migrate api-dev \
        front-install front-dev \
        test test-api test-front \
        parte1

# ─── variáveis ──────────────────────────────────────────────
API_DIR   = parte2/api
FRONT_DIR = parte2/front-end

# ─── padrão: exibe ajuda ─────────────────────────────────────
help:
	@echo ""
	@echo "  Comandos disponíveis:"
	@echo ""
	@echo "  Docker"
	@echo "    make up          Sobe todos os serviços (API + frontend + banco)"
	@echo "    make down        Para e remove os containers"
	@echo "    make build       Reconstrói as imagens Docker"
	@echo "    make logs        Exibe os logs em tempo real"
	@echo ""
	@echo "  Backend (FastAPI)"
	@echo "    make api-install  Cria venv e instala dependências"
	@echo "    make api-migrate  Aplica migrações Alembic"
	@echo "    make api-dev      Sobe a API localmente (sem Docker)"
	@echo ""
	@echo "  Frontend (Next.js)"
	@echo "    make front-install  Instala dependências npm"
	@echo "    make front-dev      Sobe o frontend localmente (sem Docker)"
	@echo ""
	@echo "  Testes"
	@echo "    make test        Roda testes do backend e do frontend"
	@echo "    make test-api    Roda apenas os testes do backend"
	@echo "    make test-front  Roda apenas os testes do frontend"
	@echo ""
	@echo "  Parte 1"
	@echo "    make parte1      Executa o script de lógica (Node.js)"
	@echo ""

# ─── docker ──────────────────────────────────────────────────
up:
	docker compose up --build

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

# ─── backend ─────────────────────────────────────────────────
api-install:
	cd $(API_DIR) && uv sync

api-migrate:
	cd $(API_DIR) && . .venv/bin/activate && alembic upgrade head

api-dev:
	cd $(API_DIR) && . .venv/bin/activate && \
	DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/tasks_db' \
	JWT_SECRET='super-secret-change-me' \
	uvicorn app.main:app --reload

# ─── frontend ────────────────────────────────────────────────
front-install:
	cd $(FRONT_DIR) && npm install

front-dev: front-install
	cd $(FRONT_DIR) && cp -n .env.example .env.local 2>/dev/null || true && npm run dev

# ─── testes ──────────────────────────────────────────────────
test: test-api test-front

test-api:
	cd $(API_DIR) && . .venv/bin/activate && pytest -q

test-front:
	cd $(FRONT_DIR) && npm install && npm run test

# ─── parte 1 ─────────────────────────────────────────────────
parte1:
	node parte1/index.js
