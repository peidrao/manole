from datetime import UTC, datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class TaskStatus(StrEnum):
    PENDING = "pendente"
    IN_PROGRESS = "em_andamento"
    COMPLETED = "concluida"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[TaskStatus] = mapped_column(
        SqlEnum(
            TaskStatus, name="task_status_enum", values_callable=lambda obj: [e.value for e in obj]
        ),
        default=TaskStatus.PENDING,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(UTC), nullable=False
    )
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
