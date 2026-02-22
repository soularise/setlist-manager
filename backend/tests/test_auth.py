from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from jose import jwt

from app.main import app

SECRET = "test-secret"


def make_token(payload: dict, secret: str = SECRET) -> str:
    return jwt.encode(payload, secret, algorithm="HS256")


@pytest.fixture
def client():
    from app.config import get_settings
    from tests.conftest import MOCK_SETTINGS

    app.dependency_overrides[get_settings] = lambda: MOCK_SETTINGS
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_valid_token_returns_200(client):
    token = make_token({"sub": "user-abc", "aud": "authenticated"})
    with patch("app.db.supabase.create_client") as mock_create:
        mock_client = mock_create.return_value
        mock_client.postgrest = mock_client
        mock_client.auth.return_value = mock_client
        mock_client.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = {
            "id": "user-abc"
        }
        resp = client.get("/api/profile", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code != 401


def test_invalid_token_returns_401(client):
    resp = client.get("/api/profile", headers={"Authorization": "Bearer not.a.real.token"})
    assert resp.status_code == 401


def test_expired_token_returns_401(client):
    import time

    token = make_token({"sub": "user-abc", "aud": "authenticated", "exp": int(time.time()) - 60})
    resp = client.get("/api/profile", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 401


def test_missing_token_returns_403(client):
    resp = client.get("/api/profile")
    assert resp.status_code == 403
