import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///./test.db"
os.environ["JWT_SECRET"] = "test-secret"

from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app

client = TestClient(app)


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def create_user_and_token():
    register_payload = {"email": "user@test.com", "password": "123456"}
    client.post("/auth/register", json=register_payload)
    login_resp = client.post("/auth/login", json=register_payload)
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_auth_required_for_tasks_list():
    response = client.get("/tasks")
    assert response.status_code == 401


def test_create_and_get_task():
    headers = create_user_and_token()

    create_response = client.post(
        "/tasks",
        headers=headers,
        json={"title": "Tarefa 1", "description": "Descrição", "status": "pendente"},
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    get_response = client.get(f"/tasks/{task_id}", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "Tarefa 1"


def test_pagination_and_status_filter():
    headers = create_user_and_token()

    client.post(
        "/tasks", headers=headers, json={"title": "A", "description": "", "status": "pendente"}
    )
    client.post(
        "/tasks", headers=headers, json={"title": "B", "description": "", "status": "concluida"}
    )

    response = client.get("/tasks?status=concluida&page=1&per_page=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["status"] == "concluida"


def test_update_and_delete_task():
    headers = create_user_and_token()

    create_response = client.post(
        "/tasks",
        headers=headers,
        json={"title": "Inicial", "description": "x", "status": "pendente"},
    )
    task_id = create_response.json()["id"]

    update_response = client.put(
        f"/tasks/{task_id}",
        headers=headers,
        json={"title": "Atualizada", "description": "ok", "status": "em_andamento"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "em_andamento"

    delete_response = client.delete(f"/tasks/{task_id}", headers=headers)
    assert delete_response.status_code == 204

    get_response = client.get(f"/tasks/{task_id}", headers=headers)
    assert get_response.status_code == 404
