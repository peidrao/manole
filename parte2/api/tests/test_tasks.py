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


def create_user_and_token(email: str = "user@test.com", password: str = "123456"):
    client.post("/auth/register", json={"email": email, "password": password})
    login_resp = client.post("/auth/login", json={"email": email, "password": password})
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


def test_user_cannot_access_another_users_tasks():
    headers_a = create_user_and_token("a@test.com", "123456")
    headers_b = create_user_and_token("b@test.com", "123456")

    create_resp = client.post(
        "/tasks",
        headers=headers_a,
        json={"title": "Tarefa do usuário A", "description": "", "status": "pendente"},
    )
    task_id = create_resp.json()["id"]

    # usuário B não deve enxergar a tarefa de A na listagem
    list_resp = client.get("/tasks", headers=headers_b)
    assert list_resp.status_code == 200
    ids = [t["id"] for t in list_resp.json()["items"]]
    assert task_id not in ids

    # usuário B não deve conseguir acessar a tarefa de A diretamente
    get_resp = client.get(f"/tasks/{task_id}", headers=headers_b)
    assert get_resp.status_code == 404

    # usuário B não deve conseguir atualizar a tarefa de A
    put_resp = client.put(
        f"/tasks/{task_id}",
        headers=headers_b,
        json={"title": "Adulterada", "description": "", "status": "concluida"},
    )
    assert put_resp.status_code == 404

    # usuário B não deve conseguir deletar a tarefa de A
    del_resp = client.delete(f"/tasks/{task_id}", headers=headers_b)
    assert del_resp.status_code == 404
