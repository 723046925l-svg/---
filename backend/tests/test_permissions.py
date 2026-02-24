from fastapi.testclient import TestClient
from app.main import app


def test_login_bad_credentials():
    client = TestClient(app)
    r = client.post('/api/auth/login', json={'username': 'x', 'password': 'y'})
    assert r.status_code == 401
