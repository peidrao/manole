"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-19 00:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001_initial"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TASK_STATUS_ENUM = ("pendente", "em_andamento", "concluida")


def upgrade() -> None:
    # DO block garante idempotência: cria o tipo somente se ainda não existir
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status_enum') THEN
                CREATE TYPE task_status_enum AS ENUM ('pendente', 'em_andamento', 'concluida');
            END IF;
        END
        $$
        """
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        # create_type=False evita que SQLAlchemy emita CREATE TYPE novamente
        sa.Column(
            "status",
            postgresql.ENUM(*TASK_STATUS_ENUM, name="task_status_enum", create_type=False),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tasks_owner_id"), "tasks", ["owner_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_tasks_owner_id"), table_name="tasks")
    op.drop_table("tasks")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS task_status_enum")
