"""add index on tasks.created_at

Revision ID: 0002_index_task_created_at
Revises: 0001_initial
Create Date: 2026-03-21 00:00:00.000000

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0002_index_task_created_at"
down_revision: str | Sequence[str] | None = "0001_initial"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_index(op.f("ix_tasks_created_at"), "tasks", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_tasks_created_at"), table_name="tasks")
