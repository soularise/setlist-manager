from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.config import Settings

FAKE_USER_ID = "user-123"
FAKE_TOKEN = "fake.jwt.token"

MOCK_SETTINGS = Settings(
    supabase_url="https://test.supabase.co",
    supabase_anon_key="anon-key",
    supabase_service_key="service-key",
    supabase_jwt_secret="test-secret",
    allowed_origin="http://localhost:5173",
)


def make_mock_client():
    """Returns a MagicMock that mimics the chained Supabase query builder."""
    client = MagicMock()
    builder = MagicMock()
    builder.select.return_value = builder
    builder.insert.return_value = builder
    builder.update.return_value = builder
    builder.delete.return_value = builder
    builder.eq.return_value = builder
    builder.order.return_value = builder
    builder.single.return_value = builder
    client.table.return_value = builder
    client.postgrest = MagicMock()
    return client, builder


@pytest.fixture
def mock_client():
    client, builder = make_mock_client()
    return client, builder


@pytest.fixture
def test_client(mock_client):
    from app.dependencies import AuthContext, get_auth
    from app.main import app

    client_mock, _ = mock_client

    def override_get_auth():
        return AuthContext(user_id=FAKE_USER_ID, token=FAKE_TOKEN, client=client_mock)

    app.dependency_overrides[get_auth] = override_get_auth
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
