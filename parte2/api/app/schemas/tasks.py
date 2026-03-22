from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from ..models import TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=1000)
    status: TaskStatus = TaskStatus.PENDING


class TaskPatch(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    status: TaskStatus | None = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: TaskStatus
    created_at: datetime
    updated_at: datetime | None


class TasksListResponse(BaseModel):
    page: int
    per_page: int
    total: int
    items: list[TaskResponse]
