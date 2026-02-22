from tests.conftest import FAKE_USER_ID


def test_list_songs(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = [
        {"id": "s1", "title": "Song A", "artist": "Artist", "bpm": 120, "duration_seconds": 180, "created_at": "2024-01-01T00:00:00"}
    ]
    resp = test_client.get("/api/songs")
    assert resp.status_code == 200
    assert resp.json()[0]["title"] == "Song A"


def test_create_song(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = [
        {"id": "s2", "title": "New Song", "artist": None, "bpm": None, "duration_seconds": None, "created_at": "2024-01-01T00:00:00"}
    ]
    resp = test_client.post("/api/songs", json={"title": "New Song"})
    assert resp.status_code == 201
    assert resp.json()["title"] == "New Song"


def test_update_song(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = [
        {"id": "s1", "title": "Updated", "artist": None, "bpm": 130, "duration_seconds": None, "created_at": "2024-01-01T00:00:00"}
    ]
    resp = test_client.put("/api/songs/s1", json={"title": "Updated", "bpm": 130})
    assert resp.status_code == 200
    assert resp.json()["bpm"] == 130


def test_delete_song(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = []
    resp = test_client.delete("/api/songs/s1")
    assert resp.status_code == 204
