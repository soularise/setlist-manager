from tests.conftest import FAKE_USER_ID


def test_get_profile(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = {
        "id": FAKE_USER_ID,
        "display_name": "Test User",
        "bio": None,
        "avatar_url": None,
        "updated_at": "2024-01-01T00:00:00",
    }
    resp = test_client.get("/api/profile")
    assert resp.status_code == 200
    assert resp.json()["display_name"] == "Test User"


def test_update_profile(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = [
        {
            "id": FAKE_USER_ID,
            "display_name": "Updated Name",
            "bio": "I play guitar",
            "avatar_url": None,
            "updated_at": "2024-01-02T00:00:00",
        }
    ]
    resp = test_client.put("/api/profile", json={"display_name": "Updated Name", "bio": "I play guitar"})
    assert resp.status_code == 200
    assert resp.json()["display_name"] == "Updated Name"


def test_profile_scoped_to_user(test_client, mock_client):
    """Profile update uses the auth user_id, not a caller-supplied id."""
    client_mock, builder = mock_client
    builder.execute.return_value.data = [{"id": FAKE_USER_ID, "display_name": "X", "bio": None, "avatar_url": None, "updated_at": None}]
    test_client.put("/api/profile", json={"display_name": "X"})
    # Ensure .eq("id", FAKE_USER_ID) was called — not some other id
    eq_calls = [str(call) for call in builder.eq.call_args_list]
    assert any(FAKE_USER_ID in c for c in eq_calls)
