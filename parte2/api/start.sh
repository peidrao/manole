#!/bin/sh
set -eu

wait_for_db() {
  echo "Waiting for database..."
  until pg_isready -h "${DB_HOST:-db}" -U "${DB_USER:-postgres}" -q; do
    sleep 2
  done
  echo "Database is ready."
}

run_server() {
  wait_for_db
  alembic upgrade head
  exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --log-level info
}

create_user() {
  wait_for_db
  alembic upgrade head
  exec python -m app.create_user "$@"
}

case "${1:-run-server}" in
  run-server)  shift || true; run_server "$@" ;;
  create-user) shift || true; create_user "$@" ;;
  *)           exec "$@" ;;
esac
